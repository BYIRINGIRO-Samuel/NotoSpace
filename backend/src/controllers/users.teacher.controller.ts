import { RequestHandler } from "express";
import Joi from "joi";
import _ from "lodash";
import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import User from "../models/users.model.js";
import School from "../models/school.model.js";
import Class from "../models/classes.model.js";
import mongoose from "mongoose";
import { HttpError } from "../utils/error.class.js";
import { IRequest as IRequestUtils } from '../utils/interfaces.js';
import { Response, NextFunction } from 'express';
import Role from "../models/roles.model.js";

export const onBoardingTeacher: RequestHandler = async (req: IRequest, res, next) => {
  interface IClassInput { className: string, courseNames: string[] }
  const tchrId = req.user?._id;
  const tchrOnBoardingValidationSchema = Joi.object({
    classes: Joi.array()
      .items(
        Joi.object({
          className: Joi.string().required(),
          courseNames: Joi.array().items(Joi.string().required()).required(),
        }).required()
      )
      .required(),
  });

  try {
    const { error } = tchrOnBoardingValidationSchema.validate(req.body);
    if (error) throw new HttpError(400, error.message);

    const { classes } = req.body;

    const teacher = await User.findById(tchrId).populate("school", "name").populate("role", "type");

    if (!teacher) throw new HttpError(404, "Teacher not found");
    if ((teacher.role as any).type !== "teacher")
      throw new HttpError(403, "You are not authorized to access this resource");
    
    if(teacher.classes.length > 0) throw new HttpError(400, `${teacher.name}, you have already onboarded to classes`);

    const school = await School.findById((teacher.school as any)._id)
      .populate("schoolAdmin", "name")
      .populate("classes", "name");
    if (!school) throw new HttpError(404, "School registered with this account is not found");

    const teacherClassCourseAssignments: { classname: mongoose.Types.ObjectId; course: mongoose.Types.ObjectId }[] = [];

    for (const cls of classes as IClassInput[]) {
      const classExists = await Class.findOne({ name: cls.className }).populate("courses", "name _id");
      if (!classExists) throw new HttpError(404, `Class "${cls.className}" not found`);

      for (const courseName of cls.courseNames) {
        const matchedCourse = (classExists.courses as any[]).find((course) => course.name === courseName);
        if (!matchedCourse) 
          throw new HttpError(404, `Course "${courseName}" not found in class "${cls.className}"`);

        teacherClassCourseAssignments.push({
          classname: classExists._id as mongoose.Types.ObjectId,
          course: matchedCourse._id,
        });
      }
    }

    // Optional: Add checks for duplicate class-course assignments here if needed
    // For example, checking if a teacher is assigned to the same course in the same class multiple times.

    teacher.classes = teacherClassCourseAssignments as any; // Assign the correctly structured array

    await teacher.save();

    for (const cls of teacherClassCourseAssignments) {
      const updatedClass = await Class.findByIdAndUpdate(
        cls.classname,
        { $addToSet: { teachers: teacher._id } },
        { new: true }
      );
      await updatedClass!.save();
    }

    res.status(200).json({
      message: "Teacher onboarded successfully",
      teacher: _.omit(teacher, ['password', '']),
    });
  } catch (error) {
    console.error("Error in onBoardingTeacher controller:", error);
    next(error);
  }
};

export const saveTeacherOnboarding = async (
  req: IRequestUtils,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { classId, courseIds } = req.body;
    if (!userId || !classId || !Array.isArray(courseIds)) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    await User.findByIdAndUpdate(userId, {
      $set: {
        'classes': [{ classname: classId, course: courseIds }]
      }
    });
    res.status(200).json({ message: 'Onboarding data saved successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all students in the teacher's school
export const getStudentsInTeacherSchool: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const teacherId = req.user?._id;
    const teacher = await User.findById(teacherId);
    if (!teacher) throw new HttpError(404, "Teacher not found");
    if (!teacher.school) throw new HttpError(404, "Teacher is not assigned to a school");

    // Find the ObjectId for the 'student' role
    const studentRole = await Role.findOne({ type: "student" });
    if (!studentRole) throw new HttpError(404, "Student role not found");

    // Find all students in the same school
    const students = await User.find({
      school: teacher.school,
      role: studentRole._id
    }).populate("classname", "name");

    res.status(200).json({
      message: "Students fetched successfully",
      students,
    });
  } catch (error) {
    next(error);
  }
};

// Get teacher's assigned classes with courses
export const getTeacherClasses: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const teacherId = req.user?._id;
    const teacher = await User.findById(teacherId).populate({
      path: 'classes.classname',
      populate: {
        path: 'courses',
        select: 'name _id'
      }
    });

    if (!teacher) throw new HttpError(404, "Teacher not found");

    // Extract classes from teacher's assignments
    const assignedClasses = teacher.classes?.map((assignment: any) => ({
      _id: assignment.classname._id,
      name: assignment.classname.name,
      courses: assignment.classname.courses || []
    })) || [];

    res.status(200).json({
      message: "Teacher's assigned classes fetched successfully",
      classes: assignedClasses,
    });
  } catch (error) {
    next(error);
  }
};

// Get all available classes for teacher onboarding
export const getAvailableClassesForOnboarding: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const teacherId = req.user?._id;
    const teacher = await User.findById(teacherId);
    
    if (!teacher) throw new HttpError(404, "Teacher not found");
    if (!teacher.school) throw new HttpError(404, "Teacher is not assigned to a school");

    // Get all classes in the teacher's school
    const availableClasses = await Class.find({ school: teacher.school })
      .populate("courses", "name _id");

    res.status(200).json({
      message: "Available classes for onboarding fetched successfully",
      classes: availableClasses,
    });
  } catch (error) {
    next(error);
  }
};
