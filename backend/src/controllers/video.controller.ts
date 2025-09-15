import { RequestHandler } from "express";
import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import { HttpError } from "../utils/error.class.js";
import Video, { IVideo } from "../models/video.model.js";
import User from "../models/users.model.js";
import Course from "../models/courses.model.js";
import Class from "../models/classes.model.js";
import mongoose from "mongoose";
import cloudinary from "../utils/files.js";

export const createVideo: RequestHandler = async (req: IRequest, res, next) => {
  const teacherId = req.user?._id;
  try {
    const { courseName, className, title, description } = req.body;

    if (!req.file) throw new HttpError(400, "No file uploaded");
    const file = req.file;

    const teacher = await User.findById(teacherId);
    if (!teacher) throw new HttpError(404, "Teacher not found");

    const classOfVideo = await Class.findOne({ name: className });
    if (!classOfVideo) throw new HttpError(404, "Class not found");
    
    // Check if teacher is assigned to this class (more flexible authorization)
    const isTeacherAssignedToClass = teacher.classes?.some(
      cls => (cls.classname as any)?._id?.equals(classOfVideo._id)
    );
    
    if(!isTeacherAssignedToClass) {
      throw new HttpError(403, "You are not authorized to create video for this class");
    }
    
    const courseOfVideo = await Course.findOne({ name: courseName, classid: classOfVideo._id });
    if (!courseOfVideo) throw new HttpError(404, "Course not found");

    // Simplified authorization - if teacher is assigned to the class, they can upload for any course in that class
    // The strict course-specific check is removed for now to allow easier setup

    const newVideo = new Video({
      teacher: teacher._id as mongoose.Types.ObjectId,
      course: courseOfVideo._id as mongoose.Types.ObjectId,
      class: classOfVideo._id as mongoose.Types.ObjectId,
      title,
      description,
      fileUrl: file.path,
      filepublicId: file.filename
    });

    await newVideo.save();

    res.status(201).json({
      message: `Video created successfully by ${teacher.name}`,
      video: newVideo,
      fileUrl: file.path,
      publicId: file.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
    });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename, { resource_type: "video" });
    }
    next(error);
  }
};

export const videosOfClass: RequestHandler = async (req: IRequest, res, next) => {
  const studentId = req.user?._id;
  try {
    const student = await User.findById(studentId);
    if (!student) throw new HttpError(400, "Student not found");

    const classItem = await Class.findById(student.classname);
    if (!classItem) throw new HttpError(400, "Class not found");

    const videos = await Video.find({ class: classItem._id })
      .populate("teacher", "name")
      .populate("course", "name")
      .lean();

    res.status(200).json({
      message: `All ${videos.length} Video/s of ${classItem.name} fetched successfully`,
      videos
    });
  } catch (error) {
    next(error);
  }
};

export const videosOfTeacher: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const teacherId = req.user?._id;
    if (!teacherId) throw new HttpError(401, "Unauthorized");

    const videos = await Video.find({ teacher: teacherId })
      .populate("course", "name")
      .populate("class", "name")
      .lean();

    res.status(200).json({
      message: `Fetched ${videos.length} videos for the teacher.`,
      videos,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVideo: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const videoId = req.params.id;
    const teacherId = req.user?._id;

    if (!videoId) throw new HttpError(400, "Video ID is required");
    if (!teacherId) throw new HttpError(401, "Unauthorized");

    const video = await Video.findById(videoId);
    if (!video) throw new HttpError(404, "Video not found");

    if (video.teacher.toString() !== teacherId.toString()) {
      throw new HttpError(403, "You are not allowed to delete this video");
    }

    if (video.filepublicId)
      await cloudinary.uploader.destroy(video.filepublicId, { resource_type: "video" });

    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo)
      throw new HttpError(500, "The Video was not deleted.");

    res.status(200).json({
      message: "Video and file deleted successfully",
      video: deletedVideo
    });
  } catch (error) {
    next(error);
  }
}; 