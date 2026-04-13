import { RequestHandler } from "express";
import User, { IUser } from "../models/users.model.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import _ from "lodash";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { HttpError } from "../utils/error.class.js";
import generateTokenAndCookie from "../utils/generateTokenAndCookie.js";
import Role, { IRole } from "../models/roles.model.js";
import { config } from "../config/default.js";
import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import School, { ISchool } from "../models/school.model.js";
import Class from "../models/classes.model.js";
import { IClass } from "../models/classes.model.js";
import BlackListedToken from "../models/blackListedToken.model.js";
import sendEmail, { IEmailOptions } from "../utils/email.js";
import { INotification } from "../models/notification.model.js";
import Notification from "../models/notification.model.js";
import { generateMessage } from "../utils/message.js";
import nodemailer from "nodemailer";
import { generateRandomToken, hashToken } from "../utils/generateRandom.js";

const courseValidationSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
});

const classValidationSchema = Joi.object({
  name: Joi.string().required(),
  courses: Joi.array().items(courseValidationSchema).required(),
  academicLevel: Joi.string()
    .valid("primary", "secondary", "college", "university", "technical")
    .required(),
});

export const createUser: RequestHandler = async (req, res, next) => {
  const userValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required().valid("admin", "teacher", "student"),
    profilePicture: Joi.string()
      .uri({
        allowRelative: false,
        scheme: ["http", "https", "data:image/jpeg", "data:image/png", "data:image/jpg"],
        allowQuerySquareBrackets: false,
      })
      .allow("")
      .optional(),
    school: Joi.string().when("role", {
      is: Joi.string().valid("teacher", "student"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    classname: Joi.string().when("role", {
      is: "student",
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  });

  try {
    //teacher needs: name, email, password, role, profilePicture, school
    //student needs: name, email, password, role, profilePicture, school, classname
    //admin needs: name, email, password, role, profilePicture
    const { error } = userValidationSchema.validate(req.body);
    
    
    
    if (error) return next(new HttpError(400, error.details[0].message));
    let {
      role,
      password,
      classes,
      name,
      email,
      profilePicture,
      school,
      classname,
    }: IUser = req.body;
    
    //checking the strong password
    if(!/[a-z]/.test(password)) throw new HttpError(400, "password must include at least a lowercase letter");
    if(!/[A-Z]/.test(password)) throw new HttpError(400, "password must include at least an uppercase letter");
    if(! /\d/.test(password)) throw new HttpError(400, "password must include at least a number");
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw new HttpError(400, "password must include atleast a special character");

    let roleId: mongoose.Types.ObjectId | string;
    let status: string = "pending";
    let schoolExists: ISchool | null = null;

    if (mongoose.Types.ObjectId.isValid(role)) {
      roleId = new mongoose.Types.ObjectId(role);
      const roleExists: IRole | null = await Role.findById(roleId);
      if (!roleExists) throw new HttpError(400, "Role not found");
    } else {
      const userRole: IRole | null = await Role.findOne({ type: role });
      if (!userRole) throw new HttpError(400, "Role not found");
      roleId = userRole._id;
      status = userRole.type === "admin" ? "active" : "pending";
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new HttpError(400, "Email already exists ");

    if (role === "student") {
      schoolExists = await School.findOne({ name: school });
      if (!schoolExists) throw new HttpError(404, "School not found");
      const classExists: IClass | null = await Class.findOne({
        name: classname,
      });
      if (!classExists) throw new HttpError(404, "Class not found");

      if (
        !schoolExists.classes.includes(
          classExists._id as mongoose.Types.ObjectId,
        )
      )
        throw new HttpError(404, "Class not found in school");

      classname = classExists._id as mongoose.Types.ObjectId;
    }

    if (role === "teacher") {
      schoolExists = await School.findOne({ name: school });
      if (!schoolExists) throw new HttpError(404, "School not found");
    }

    async function hashPassword(password: string) {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    }

    password = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password,
      role: roleId,
      profilePicture,
      status,
      school: schoolExists?._id,
      classname: role === "student" ? classname : undefined,
      classes: role === "teacher" ? classes : undefined,
    });

    const token = generateTokenAndCookie(newUser.publicId, req, res);

    //notify the school admin that a new account has been created and needs approval
    if (role === "teacher") {
      // Find the school admin
      const schoolAdminId = schoolExists!.schoolAdmin;
      await Notification.create({
        title: "New Teacher Approval Required",
        message: `A new teacher (${name}) has signed up and needs approval.`,
        type: "approval",
        createdBy: newUser._id,
        createdFor: [schoolAdminId],
      });
    }
    if (role === "student") {
      // Find the school admin
      const schoolAdminId = schoolExists!.schoolAdmin;
      await Notification.create({
        title: "New Student Signup",
        message: `A new student (${name}) has signed up and is awaiting processing.`,
        type: "approval",
        createdBy: newUser._id,
        createdFor: [schoolAdminId],
      });
    }

    await newUser.save();
    // Populate role and school before sending the response
    const savedUser = await User.findById(newUser._id)
      .populate('role', 'type')
      .populate('school', 'name _id') 
      .populate('classname', 'name _id'); 

    res.status(201).json({
      message: "User created successfully",
      user: {
        ..._.omit(savedUser!.toObject(), ["password", "__v", "createdAt", "updatedAt"]),
        role: savedUser!.role,
        school: savedUser!.school, // Ensure populated school is included
        classname: savedUser!.classname, // Ensure populated classname is included
      },
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    next(error);
  }
};

export const logout: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) throw new HttpError(400, "No user was logged in");

    try {
      const decodedToken = jwt.verify(
        token,
        config.jwtSecret,
      ) as jwt.JwtPayload;
      if (!decodedToken.exp)
        throw new HttpError(400, "Invalid token: missing expiration");

      if (decodedToken.exp < Date.now() / 1000)
        throw new HttpError(400, "Token expired");

      const expiresAt = new Date(decodedToken.exp * 1000);

      if (expiresAt > new Date()) {
        const blackListedToken = new BlackListedToken({ token, expiresAt });
        await blackListedToken.save();
      }
    } catch (err) {
      next(err);
    }

    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    res.clearCookie("jwt");
    const namePart = req.user?.name ? `${req.user.name}, you` : "You";
    res.status(200).json({
      message: `${namePart} have logged out successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const userValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { email, password }: IUser = req.body;
  try {
    const { error } = userValidationSchema.validate({ email, password });
    if (error) return next(new HttpError(400, error.details[0].message));

    const user = await User.findOne({ email }).populate("role", "type _id");
    if (!user) throw new HttpError(400, "Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new HttpError(400, "Invalid email or password");

    const token = generateTokenAndCookie(user.publicId, req, res);
    const loggedInUser = await User.findById(user._id)
      .populate('role', 'type _id')
      .populate('school', 'name _id')
      .populate('classname', 'name _id');

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        ..._.omit(loggedInUser!.toObject(), [
          "password",
          "__v",
          "createdAt",
          "updatedAt",
        ]),
        role: loggedInUser!.role,
        school: loggedInUser!.school,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile: RequestHandler = async (req: IRequest, res, next) => {
  try {
    if (!req.user?._id) throw new HttpError(401, "Unauthorized");

    const user = await User.findById(req.user._id);
    if (!user) throw new HttpError(400, "User not found");

    res.status(200).json({
      message: "Profile fetched successfully",
      user: _.omit(user, ["password", "__v", "createdAt", "updatedAt"]),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (
  req: IRequest,
  res,
  next,
) => {
  const userValidationSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    profilePicture: Joi.string()
      .uri({
        allowRelative: false,
        scheme: ["http", "https", "data:image/jpeg", "data:image/png", "data:image/jpg"],
        allowQuerySquareBrackets: false,
      })
      .allow("")
      .optional(),
  });

  let { name, email, profilePicture }: IUser = req.body;
  try {
    const { error } = userValidationSchema.validate({
      name,
      email,
      profilePicture,
    });
    if (error) return next(new HttpError(400, error.details[0].message));

    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      { name, email, profilePicture },
      { new: true },
    ).populate('role', 'type')
     .populate('school', 'name _id')
     .populate('classname', 'name _id');

    if (!updatedUser) throw new HttpError(400, "User not found");

    updatedUser.updatedAt = new Date();
    await updatedUser.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ..._.omit(updatedUser.toObject(), [
          "password",
          "__v",
          "createdAt",
          "updatedAt",
        ]),
        role: updatedUser.role,
        school: updatedUser.school,
        classname: updatedUser.classname,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  const userValidationSchema = Joi.object({
    email: Joi.string().email().required(),
  });

  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) return next(new HttpError(400, error.details[0].message));

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new HttpError(400, "User not found");

    // Genete a new token
    const resetToken = user.generateResetToken();
    await user.save();

    if (!user.resetPasswordToken)
      throw new HttpError(
        400,
        "Failed to generate reset token, please try again later",
      );

    const message = generateMessage(resetToken);

    const emailOptions: IEmailOptions = {
      email: user.email,
      subject: "Password Reset Request",
      message: message,
    };

    try {
      await sendEmail(emailOptions);
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });
      console.error("Error in forgotPassword (email send):", error);
      return next(
        new HttpError(
          500,
          "There was an error sending the email, please try again later",
        ),
      );
    }

    // Include the resetToken in the success response
    res.status(200).json({
      message: "Reset token generated successfully. Please check your email.",
      email: user.email,
      token: resetToken,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    next(error);
  }
};

export const verifyOtp: RequestHandler = async (req, res, next) => {
  const verificationValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    token: Joi.string().optional(),
  });

  try {
    const { error } = verificationValidationSchema.validate(req.body);
    if (error) return next(new HttpError(400, error.details[0].message));

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Even if user not found, return a generic error for security reasons
      return next(new HttpError(400, "Invalid verification code"));
    }

    // Hash the provided OTP to compare with the stored hashed token
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Check if the hashed token matches and is not expired
    if (!user.resetPasswordToken || hashedOtp !== user.resetPasswordToken || user.resetPasswordExpires!.getTime() < Date.now()) {
       // Clear the token if it's invalid or expired
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });
      return next(new HttpError(400, "Invalid or expired verification code"));
    }

    // If verification is successful, we can send a success response.
    // The frontend will then navigate to the NewPassword screen.
    res.status(200).json({
      message: "OTP verified successfully.",
      email: user.email, // Optionally return email for the next step
    });

  } catch (error) {
    console.error("Error in verifyOtp:", error);
    next(error);
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  const userValidationSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  try {
    let { password, token, confirmPassword } = req.body;
    const { error } = userValidationSchema.validate({
      token,
      password,
      confirmPassword,
    });
    if (error) return next(new HttpError(400, error.details[0].message));

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      throw new HttpError(400, "Invalid or expired password reset token");

    password = await bcrypt.hash(password, 10);
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully, you can now login with your new password",
      ..._.pick(user.toObject(), ["email"]),
      token: token,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
};

export const updateSchool: RequestHandler = async (
  req: IRequest,
  res,
  next,
) => {
  const updateSchoolSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    profilePicture: Joi.string()
      .uri({
        allowRelative: false,
        scheme: ["http", "https", "data:image/"],
        allowQuerySquareBrackets: true,
      })
      .allow("")
      .optional(),
  });

  try {
    const { schoolId } = req.params;
    const { error } = updateSchoolSchema.validate(req.body);
    if (error) return next(new HttpError(400, error.details[0].message));

    const updatedSchool = await School.findByIdAndUpdate(
      schoolId,
      { $set: req.body },
      { new: true, runValidators: true },
    ).populate({
      path: "classes",
      populate: { path: "courses" },
    });

    res.status(200).json(updatedSchool);
  } catch (error) {
    next(error);
  }
};
