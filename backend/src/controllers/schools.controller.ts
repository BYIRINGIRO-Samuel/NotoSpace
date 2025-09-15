import { RequestHandler } from "express";
import Joi from "joi";
import { HttpError } from "../utils/error.class.js";
import { insertingSchool } from "../utils/school.service.js";
import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import mongoose from "mongoose";
import School from "../models/school.model.js";
import Class from "../models/classes.model.js";
import User from "../models/users.model.js";


// Custom validation for profile picture
const validateProfilePicture = (value: string) => {
  if (!value) return true; // Allow empty values
  if (value.startsWith('http://') || value.startsWith('https://')) return true;
  if (value.startsWith('data:image/')) return true;
  return false;
};

// Common validation schema for profilePicture
const profilePictureSchema = Joi.string()
  .custom(validateProfilePicture, 'profile-picture-validation')
  .allow("")
  .optional();

export const createSchool: RequestHandler = async (
  req: IRequest,
  res,
  next,
) => {
  const schoolValidationSchema = Joi.object({
    name: Joi.string().required(),
    classes: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          courses: Joi.array().items(Joi.string().required()).required(),
          academicLevel: Joi.string()
            .valid("primary", "secondary", "college", "university", "technical")
            .required(),
        }),
      )
      .required(),
    email: Joi.string().email().required(),
    profilePicture: profilePictureSchema,
  });
  try {
    console.log('Received profilePicture:', req.body.profilePicture);
    const { error } = schoolValidationSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return next(new HttpError(400, error.details[0].message));
    }

    const { name, classes, email, profilePicture } = req.body;
    const { _id } = req.user!;

    const newSchool = await insertingSchool({
      name,
      classes,
      email,
      profilePicture,
      schoolAdmin: new mongoose.Types.ObjectId(_id),
    });
    // Update the admin user's school field after onboarding
    await User.findByIdAndUpdate(_id, { school: newSchool._id });
    res.status(201).json(newSchool);
  } catch (error) {
    console.error('Error in createSchool:', error);
    next(error);
  }
};

// Get School Statistics
export const getSchoolStats: RequestHandler = async (
  req: IRequest,
  res,
  next,
) => {
  try {
    const { schoolId } = req.params;

    const school = await School.findById(schoolId).populate("classes");
    if (!school) {
      throw new HttpError(404, "School not found");
    }

    // Get detailed stats
    const classes = await Class.find({ school: schoolId }).populate("courses");

    const academicLevelBreakdown = classes.reduce((acc: any, classItem) => {
      const level = classItem.academicLevel;
      if (!acc[level]) {
        acc[level] = { classes: 0, courses: 0 };
      }
      acc[level].classes += 1;
      acc[level].courses += classItem.courses.length;
      return acc;
    }, {});

    const totalClasses = classes.length;
    const totalCourses = classes.reduce(
      (total, classItem) => total + classItem.courses.length,
      0,
    );

    const stats = {
      schoolName: school.name,
      totalClasses,
      totalCourses,
      averageCoursesPerClass:
        totalClasses > 0
          ? Math.round((totalCourses / totalClasses) * 100) / 100
          : 0,
      academicLevelBreakdown,
      classesDetails: classes.map((classItem) => ({
        id: classItem._id,
        name: classItem.name,
        academicLevel: classItem.academicLevel,
        courseCount: classItem.courses.length,
        courses: classItem.courses.map((course: any) => ({
          id: course._id,
          name: course.name,
          code: course.code,
        })),
      })),
    };

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

// Get School Details with Stats
export const getSchool: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const { schoolId } = req.params;

    const school = await School.findById(schoolId)
      .populate({
        path: "classes",
        populate: { path: "courses" },
      })
      .populate("schoolAdmin", "name email");

    if (!school) {
      throw new HttpError(404, "School not found");
    }

    // Calculate stats
    const totalClasses = school.classes.length;
    const totalCourses = school.classes.reduce(
      (total: number, classItem: any) => {
        return total + (classItem.courses ? classItem.courses.length : 0);
      },
      0,
    );

    const schoolWithStats = {
      ...school.toObject(),
      stats: {
        totalClasses,
        totalCourses,
        classesBreakdown: school.classes.map((classItem: any) => ({
          classId: classItem._id,
          className: classItem.name,
          academicLevel: classItem.academicLevel,
          courseCount: classItem.courses ? classItem.courses.length : 0,
        })),
      },
    };

    res.status(200).json(schoolWithStats);
  } catch (error) {
    next(error);
  }
};

// Update School Basic Info
export const updateSchool: RequestHandler = async (
  req: IRequest,
  res,
  next,
) => {
  const updateSchoolSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    profilePicture: profilePictureSchema,
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
