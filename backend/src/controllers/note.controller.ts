import { RequestHandler } from "express";
import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import { createNoteSchema } from "../utils/joi-validators.js";
import { HttpError } from "../utils/error.class.js";
import Note, { INote } from "../models/note.model.js";
import User from "../models/users.model.js";
import Course from "../models/courses.model.js";
import Class from "../models/classes.model.js";
import mongoose from "mongoose";
import cloudinary from "../utils/files.js";
import Role from "../models/roles.model.js";

export const createNote: RequestHandler = async (req: IRequest, res, next) => {
  const teacherId = req.user?._id;
  try{
    const { error } = createNoteSchema.validate(req.body);
    if(error) throw new HttpError(400, error.message);
    const { courseName, className, title } = req.body;


    if(!req.file) throw new HttpError(400, "No file uploaded");  
    const file = req.file;

    const teacher = await User.findById(teacherId);
    if(!teacher) throw new HttpError(404, "Teacher not found");

    
    const classOfNote = await Class.findOne({ name: className});
    if(!classOfNote) throw new HttpError(404, "Class not found");
    
    // Check if teacher is assigned to this class (more flexible authorization)
    const isTeacherAssignedToClass = teacher.classes?.some(
      cls => (cls.classname as any)?._id?.equals(classOfNote._id)
    );
    
    if(!isTeacherAssignedToClass) {
      throw new HttpError(403, "You are not authorized to create note for this class");
    }
    
    const courseOfNote = await Course.findOne({ name: courseName, classid: classOfNote._id });
    if(!courseOfNote) throw new HttpError(404, "Course not found");

    // Simplified authorization - if teacher is assigned to the class, they can upload for any course in that class
    // The strict course-specific check is removed for now to allow easier setup
    
    const newNote = new Note({
      teacher: teacher._id as mongoose.Types.ObjectId,
      course: courseOfNote._id as mongoose.Types.ObjectId,
      class: classOfNote._id as mongoose.Types.ObjectId,
      title,
      fileUrl: file.path,
      filepublicId: file.filename
    })

    await newNote.save();

    res.status(201).json({
      message: `Note created successfully by ${teacher.name}`,
      note: newNote,
      fileUrl: file.path,
      publicId: file.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
    });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename, { resource_type: "raw" });
    }
    next(error)
  }
}

export const notesOfClass: RequestHandler = async (req: IRequest, res, next) => {
  const studentId = req.user?._id;
  try {
    const student = await User.findById(studentId);
    if(!student) throw new HttpError(400, "Student not found");

    const classItem = await Class.findById(student.classname);
    if(!classItem) throw new HttpError(400, "Class not found");

    const teacherRole = await Role.findOne({ type: "teacher" });
    if(!teacherRole) throw new HttpError(400, "Role not found");
    const teachersOfClass = await User.find({ "classes.classname": classItem._id, role: teacherRole._id }).select("_id").lean();
    
    const notesArrays = await Promise.all(
      teachersOfClass.map((teacher) =>
        Note.find({ teacher: teacher._id }).lean()
      )
    );

    const notes = notesArrays.flat();

    res.status(200).json({
      message: `All ${notes.length} Note/s of ${classItem.name} fetched successfully`,
      notes
    })
  } catch (error) {
    next(error);
  }
}

export const notesOfTeacher: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const teacherId = req.user?._id;
    if (!teacherId) throw new HttpError(401, "Unauthorized");

    const notes = await Note.find({ teacher: teacherId }).lean();

    res.status(200).json({
      message: `Fetched ${notes.length} notes for the teacher.`,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const noteId = req.params.id;
    const teacherId = req.user?._id;

    if (!noteId) throw new HttpError(400, "Note ID is required");
    if (!teacherId) throw new HttpError(401, "Unauthorized");

    const note = await Note.findById(noteId);
    if (!note) throw new HttpError(404, "Note not found");

    if (note.teacher.toString() !== teacherId.toString()) {
      throw new HttpError(403, "You are not allowed to delete this note");
    }

    if (note.filepublicId) 
      await cloudinary.uploader.destroy(note.filepublicId, { resource_type: "raw" });

    const deletedNote = await Note.findByIdAndDelete(noteId);
    if(!deleteNote)
      throw new HttpError(500, "The Note was not deleted.")

    res.status(200).json({ 
      message: "Note and file deleted successfully",
      note: deletedNote 
    });
  } catch (error) {
    next(error);
  }
};

export const serveNote: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user?._id;

    if (!noteId) throw new HttpError(400, "Note ID is required");
    if (!userId) throw new HttpError(401, "Unauthorized");

    const note = await Note.findById(noteId)
      .populate("teacher", "name")
      .populate("course", "name")
      .populate("class", "name");

    if (!note) throw new HttpError(404, "Note not found");

    // Check if user is authorized to view this note
    // Teachers can view their own notes, students can view notes from their class
    const user = await User.findById(userId);
    if (!user) throw new HttpError(404, "User not found");

    const teacherRole = await Role.findOne({ type: "teacher" });
    const studentRole = await Role.findOne({ type: "student" });

    let isAuthorized = false;

    if (user.role.toString() === teacherRole?._id.toString()) {
      // Teacher can view their own notes
      isAuthorized = note.teacher.toString() === userId.toString();
    } else if (user.role.toString() === studentRole?._id.toString()) {
      // Student can view notes from their class
      isAuthorized = user.classname?.toString() === note.class.toString();
    }

    if (!isAuthorized) {
      throw new HttpError(403, "You are not authorized to view this note");
    }

    // Redirect to the Cloudinary URL
    res.redirect(note.fileUrl);
  } catch (error) {
    next(error);
  }
};
