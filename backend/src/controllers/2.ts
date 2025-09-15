import { NextFunction, RequestHandler, Response } from "express";
import Joi from "joi";
import _ from "lodash";
import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import User from "../models/users.model.js";
import Notification from "../models/notification.model.js";
import School from "../models/school.model.js";
import Class from "../models/classes.model.js";
import { HttpError } from "../utils/error.class.js";
import Course from "../models/courses.model.js";
export const approveAccount: RequestHandler = async (req: IRequest, res, next) => {
  let admin = req.user;
  const approveSchema = Joi.object({
    username: Joi.string().required(),
    action: Joi.string().valid("approve", "reject").required(),
  });
  try {
    const { error } = approveSchema.validate(req.body);
    if (error) throw new Error(error.message);

    admin = await User.findById(admin!._id);
    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id name")
      .lean();
    if (!adminSchool || !admin) throw new HttpError(404, "Admin not found");

    const { username, action } = req.body;
    const school = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id name")
      .lean();
    if (!school) throw new HttpError(404, "School not found");

    const user = await User.findOne({ name: username, school: school._id });
    if (!user) throw new Error("User not found");

    if (user.status === "active") throw new Error("User already approved");

    if (String(user.role) == String(admin!.role))
      throw new Error("You are not authorized to approve this account");

    if (String(user.school) !== String(adminSchool!._id))
      throw new Error("You are not authorized to approve this account");

    let decision: "approved" | "rejected";
    const status = action === "approve" ? "active" : "rejected";
    decision = action === "approve" ? "approved" : "rejected";

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { status },
      { new: true },
    );
    if (!updatedUser) throw new Error("Failed to update user status");

    const newNotification = await Notification.create({
      title: `Account ${decision}`,
      message: `Your account has been ${decision} by ${admin!.name} from ${adminSchool!.name}`,
      type: "approval",
      createdBy: admin!._id,
      createdFor: [user._id],
    });

    const formattedNotification = await Notification.findById(
      newNotification._id,
    )
      .populate("createdBy", "name -_id")
      .populate("createdFor", "name -_id");

    res.status(200).json({
      message: `Account ${decision}`,
      user: _.pick(updatedUser.toObject(), [
        "name",
        "email",
        "status",
        "school",
        "updatedAt",
      ]),
      notification: formattedNotification,
    });
  } catch (error) {
    console.log("Error in approveAccount admin controller: ", error);
    next(error);
  }
};

export const updateClass: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const { classId } = req.params;

    const updateClassSchema = Joi.object({
      name: Joi.string().optional().trim(),
      grade: Joi.string().optional(),
      section: Joi.string().optional().allow(""),
      capacity: Joi.number().integer().min(1).optional(),
      description: Joi.string().optional().allow(""),
    });

    const { error } = updateClassSchema.validate(req.body);
    if (error) throw new Error(error.message);

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const updatedClass = await Class.findOneAndUpdate(
      { _id: classId, school: adminSchool._id },
      { ...req.body, updatedBy: admin!._id },
      { new: true, runValidators: true }
    );

    if (!updatedClass) throw new HttpError(404, "Class not found");

    res.status(200).json({
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.log("Error in updateClass admin controller: ", error);
    next(error);
  }
};

// Delete Class
export const deleteClass: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const { classId } = req.params;

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const classToDelete = await Class.findOne({
      _id: classId,
      school: adminSchool._id,
    });
    if (!classToDelete) throw new HttpError(404, "Class not found");

    // Check if class has students or teacher assigned
    if (classToDelete.students && classToDelete.students.length > 0) {
      throw new Error("Cannot delete class with assigned students. Move students first.");
    }
    if (classToDelete.teachers && classToDelete.teachers.length > 0) {
      throw new Error("Cannot delete class with assigned teacher. Remove teacher first.");
    }

    await Class.findByIdAndDelete(classId);

    res.status(200).json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteClass admin controller: ", error);
    next(error);
  }
};

// Create Student
export const createStudent: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const createStudentSchema = Joi.object({
      name: Joi.string().required().trim(),
      email: Joi.string().email().required(),
      phone: Joi.string().optional(),
      grade: Joi.string().required(),
      rollNumber: Joi.string().required(),
      dateOfBirth: Joi.date().optional(),
      parentName: Joi.string().optional(),
      parentPhone: Joi.string().optional(),
      address: Joi.string().optional(),
      password: Joi.string().min(6).required(),
    });

    const { error } = createStudentSchema.validate(req.body);
    if (error) throw new Error(error.message);

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const { name, email, phone, grade, rollNumber, dateOfBirth, parentName, parentPhone, address, password } = req.body;

    // Check if student already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User with this email already exists");

    const existingRollNumber = await User.findOne({ 
      rollNumber, 
      school: adminSchool._id,
      role: "student" 
    });
    if (existingRollNumber) throw new Error("Roll number already exists");

    const newStudent = await User.create({
      name,
      email,
      phone,
      password, // Make sure to hash this in your User model pre-save hook
      role: "student",
      school: adminSchool._id,
      grade,
      rollNumber,
      dateOfBirth,
      parentName,
      parentPhone,
      address,
      status: "active",
      createdBy: admin!._id,
    });

    // Send notification
    await Notification.create({
      title: "Student Account Created",
      message: `Your student account has been created by ${admin!.name}`,
      type: "account",
      createdBy: admin!._id,
      createdFor: [newStudent._id],
    });

    res.status(201).json({
      message: "Student created successfully",
      student: _.pick(newStudent.toObject(), [
        "_id",
        "name",
        "email",
        "phone",
        "grade",
        "rollNumber",
        "dateOfBirth",
        "parentName",
        "parentPhone",
        "status",
      ]),
    });
  } catch (error) {
    console.log("Error in createStudent admin controller: ", error);
    next(error);
  }
};

// Get All Students
export const getStudents: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const { grade, classId } = req.query;

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    let filter: any = {
      school: adminSchool._id,
      role: "student",
    };

    if (grade) filter.grade = grade;
    if (classId) filter.class = classId;

    const students = await User.find(filter)
      .select("-password")
      .populate("class", "name grade section")
      .sort({ grade: 1, rollNumber: 1 });

    res.status(200).json({
      message: "Students retrieved successfully",
      students,
      total: students.length,
    });
  } catch (error) {
    console.log("Error in getStudents admin controller: ", error);
    next(error);
  }
};

// Get Single Student
export const getStudent: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const { studentId } = req.params;

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const student = await User.findOne({
      _id: studentId,
      school: adminSchool._id,
      role: "student",
    })
      .select("-password")
      .populate("class", "name grade section teacher");

    if (!student) throw new HttpError(404, "Student not found");

    res.status(200).json({
      message: "Student retrieved successfully",
      student,
    });
  } catch (error) {
    console.log("Error in getStudent admin controller: ", error);
    next(error);
  }
};

// Update Student
export const updateStudent: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const { studentId } = req.params;

    const updateStudentSchema = Joi.object({
      name: Joi.string().optional().trim(),
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
      grade: Joi.string().optional(),
      rollNumber: Joi.string().optional(),
      dateOfBirth: Joi.date().optional(),
      parentName: Joi.string().optional(),
      parentPhone: Joi.string().optional(),
      address: Joi.string().optional(),
      status: Joi.string().valid("active", "inactive").optional(),
    });

    const { error } = updateStudentSchema.validate(req.body);
    if (error) throw new Error(error.message);

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    // Check roll number uniqueness if being updated
    if (req.body.rollNumber) {
      const existingRollNumber = await User.findOne({
        rollNumber: req.body.rollNumber,
        school: adminSchool._id,
        role: "student",
        _id: { $ne: studentId },
      });
      if (existingRollNumber) throw new Error("Roll number already exists");
    }

    const updatedStudent = await User.findOneAndUpdate(
      { _id: studentId, school: adminSchool._id, role: "student" },
      { ...req.body, updatedBy: admin!._id },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStudent) throw new HttpError(404, "Student not found");

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.log("Error in updateStudent admin controller: ", error);
    next(error);
  }
};

// Delete Student
export const deleteStudent: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const { studentId } = req.params;

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const deletedStudent = await User.findOneAndDelete({
      _id: studentId,
      school: adminSchool._id,
      role: "student",
    });

    if (!deletedStudent) throw new HttpError(404, "Student not found");

    // Remove student from any assigned class
    await Class.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteStudent admin controller: ", error);
    next(error);
  }
};

export const assignStudentToClass: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const assignSchema = Joi.object({
      studentId: Joi.string().required(),
      classId: Joi.string().required(),
    });

    const { error } = assignSchema.validate(req.body);
    if (error) throw new Error(error.message);

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const { studentId, classId } = req.body;

    // Verify student exists and belongs to school
    const student = await User.findOne({
      _id: studentId,
      school: adminSchool._id,
      role: "student",
      status: "active",
    });
    if (!student) throw new HttpError(404, "Student not found");

    // Verify class exists and belongs to school
    const classData = await Class.findOne({
      _id: classId,
      school: adminSchool._id,
    });
    if (!classData) throw new HttpError(404, "Class not found");


    // Remove student from previous class if assigned
    await Class.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );

    // Assign student to new class
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId }, updatedBy: admin!._id },
      { new: true }
    ).populate("students", "name rollNumber");

    // Update student's class reference
    await User.findByIdAndUpdate(studentId, { class: classId });

    // Send notification
    await Notification.create({
      title: "Class Assignment",
      message: `You have been assigned to class ${updatedClass!.name} - ${updatedClass!.academicLevel}`,
      type: "assignment",
      createdBy: admin!._id,
      createdFor: [studentId],
    });

    res.status(200).json({
      message: "Student assigned to class successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.log("Error in assignStudentToClass admin controller: ", error);
    next(error);
  }
};

// Move Student Between Classes
export const moveStudentToClass: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const moveSchema = Joi.object({
      studentId: Joi.string().required(),
      fromClassId: Joi.string().required(),
      toClassId: Joi.string().required(),
    });

    const { error } = moveSchema.validate(req.body);
    if (error) throw new Error(error.message);

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const { studentId, fromClassId, toClassId } = req.body;

    // Verify all entities exist
    const student = await User.findOne({
      _id: studentId,
      school: adminSchool._id,
      role: "student",
    });
    if (!student) throw new HttpError(404, "Student not found");

    const fromClass = await Class.findOne({
      _id: fromClassId,
      school: adminSchool._id,
      students: studentId,
    });
    if (!fromClass) throw new HttpError(404, "Source class not found or student not assigned");

    const toClass = await Class.findOne({
      _id: toClassId,
      school: adminSchool._id,
    });
    if (!toClass) throw new HttpError(404, "Destination class not found");


    // Remove student from source class
    await Class.findByIdAndUpdate(fromClassId, {
      $pull: { students: studentId },
      updatedBy: admin!._id
    });

    // Add student to destination class
    await Class.findByIdAndUpdate(toClassId, {
      $addToSet: { students: studentId },
      updatedBy: admin!._id
    });

    // Update student's class reference
    await User.findByIdAndUpdate(studentId, { class: toClassId });

    // Send notification
    await Notification.create({
      title: "Class Transfer",
      message: `You have been moved from ${fromClass.name} to ${toClass.name}`,
      type: "transfer",
      createdBy: admin!._id,
      createdFor: [studentId],
    });

    res.status(200).json({
      message: "Student moved successfully",
      fromClass: fromClass.name,
      toClass: toClass.name,
    });
  } catch (error) {
    console.log("Error in moveStudentToClass admin controller: ", error);
    next(error);
  }
};


export const adminGetUsers = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req?.query?.page as string) || 1;
    const limit = parseInt(req?.query?.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { default: User } = await import('../models/users.model.js');
    const [users, totalUsers] = await Promise.all([
      User.find()
        .select('-password -__v -resetPasswordToken -resetPasswordExpires -publicId')
        .populate([
          { path: 'role', select: 'name permissions' },
          { path: 'school', select: 'name location' },
          { path: 'classname', select: 'name grade' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments()
    ]);
    
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Remove Student from Class
export const removeStudentFromClass: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const removeSchema = Joi.object({
      studentId: Joi.string().required(),
      classId: Joi.string().required(),
    });

    const { error } = removeSchema.validate(req.body);
    if (error) throw new Error(error.message);

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const { studentId, classId } = req.body;

    // Verify student and class
    const student = await User.findOne({
      _id: studentId,
      school: adminSchool._id,
      role: "student",
    });
    if (!student) throw new HttpError(404, "Student not found");

    const classData = await Class.findOne({
      _id: classId,
      school: adminSchool._id,
      students: studentId,
    });
    if (!classData) throw new HttpError(404, "Class not found or student not assigned");

    // Remove student from class
    await Class.findByIdAndUpdate(classId, {
      $pull: { students: studentId },
      updatedBy: admin!._id
    });

    // Remove class reference from student
    await User.findByIdAndUpdate(studentId, { $unset: { class: 1 } });

    // Send notification
    await Notification.create({
      title: "Class Removal",
      message: `You have been removed from class ${classData.name}`,
      type: "removal",
      createdBy: admin!._id,
      createdFor: [studentId],
    });

    res.status(200).json({
      message: "Student removed from class successfully",
    });
  } catch (error) {
    console.log("Error in removeStudentFromClass admin controller: ", error);
    next(error);
  }
};

// Bulk Assign Students to Class
export const bulkAssignStudentsToClass: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const bulkAssignSchema = Joi.object({
      studentIds: Joi.array().items(Joi.string()).required(),
      classId: Joi.string().required(),
    });

    const { error } = bulkAssignSchema.validate(req.body);
    if (error) throw new Error(error.message);

    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const { studentIds, classId } = req.body;

    // Verify class exists
    const classData = await Class.findOne({
      _id: classId,
      school: adminSchool._id,
    });
    if (!classData) throw new HttpError(404, "Class not found");


    // Verify all students exist and belong to school
    const students = await User.find({
      _id: { $in: studentIds },
      school: adminSchool._id,
      role: "student",
      status: "active",
    });

    if (students.length !== studentIds.length) {
      throw new Error("Some students not found or inactive");
    }

    // Remove students from their current classes
    await Class.updateMany(
      { students: { $in: studentIds } },
      { $pull: { students: { $in: studentIds } } }
    );

    // Add students to new class
    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: { $each: studentIds } },
      updatedBy: admin!._id
    });

    // Update students' class references
    await User.updateMany(
      { _id: { $in: studentIds } },
      { class: classId }
    );

    // Send notifications
    await Notification.create({
      title: "Class Assignment",
      message: `You have been assigned to class ${classData.name} - ${classData.academicLevel}`,
      type: "assignment",
      createdBy: admin!._id,
      createdFor: studentIds,
    });

    res.status(200).json({
      message: `${studentIds.length} students assigned to class successfully`,
      assignedCount: studentIds.length,
    });
  } catch (error) {
    console.log("Error in bulkAssignStudentsToClass admin controller: ", error);
    next(error);
  }
};

// Get Dashboard Statistics
export const getDashboardStats: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const admin = req.user;
    const adminSchool = await School.findOne({ schoolAdmin: admin!._id })
      .select("_id")
      .lean();
    if (!adminSchool) throw new HttpError(404, "Admin school not found");

    const [
      totalClasses,
      totalTeachers,
      totalStudents,
      activeTeachers,
      activeStudents,
      classesWithTeachers,
      pendingApprovals
    ] = await Promise.all([
      Class.countDocuments({ school: adminSchool._id }),
      User.countDocuments({ school: adminSchool._id, role: "teacher" }),
      User.countDocuments({ school: adminSchool._id, role: "student" }),
      User.countDocuments({ school: adminSchool._id, role: "teacher", status: "active" }),
      User.countDocuments({ school: adminSchool._id, role: "student", status: "active" }),
      Class.countDocuments({ school: adminSchool._id, teacher: { $exists: true } }),
      User.countDocuments({ school: adminSchool._id, status: "pending" })
    ]);

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      stats: {
        classes: {
          total: totalClasses,
          withTeachers: classesWithTeachers,
          withoutTeachers: totalClasses - classesWithTeachers,
        },
        teachers: {
          total: totalTeachers,
          active: activeTeachers,
          inactive: totalTeachers - activeTeachers,
        },
        students: {
          total: totalStudents,
          active: activeStudents,
          inactive: totalStudents - activeStudents,
        },
        pendingApprovals,
      },
    });
  } catch (error) {
    console.log("Error in getDashboardStats admin controller: ", error);
    next(error);
  }
};
export const usersList = (role: "student" | "teacher"): RequestHandler => {
  return async (req: IRequest, res, next) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new HttpError(400, "Unauthorized to get this resource");

      const school = await School.findOne({ schoolAdmin: userId });
      if (!school) throw new HttpError(400, "School not found");

      const schoolUsers = await User.find({ school: school._id }).populate("role", "type");
      const filteredUsers = schoolUsers.filter(user => (user.role as any).type === role);

      res.status(200).json({
        message: `${role}s fetched successfully`,
        users: filteredUsers,
      });
    } catch (error) {
      console.error("Error in usersList controller:", error);
      next(error);
    }
  };
};

export const coursesList: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new HttpError(400, "Unauthorized to get this resource");

    const school = await School.findOne({ schoolAdmin: userId });
    if (!school) throw new HttpError(400, "School not found");

    const classItems = await Class.find({ school: school._id }).select("_id");
    const classIds = classItems.map(cls => cls._id);
    
    const courses = await Course.find({ classid: { $in: classIds } })
      .populate({
        path: "classid",
        select: "name academicLevel -_id"
      })
    res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Error in coursesList controller:", error);
    next(error);
  }
};

export const classesList: RequestHandler = async (req: IRequest, res, next) => {
  const userId = req.user?._id
  try {
    if(!userId)
      throw new HttpError(400, "Unauthorized to get this resource");
    
    const school = await School.findOne({ schoolAdmin: userId});
    if(!school)
      throw new HttpError(400, "School not found");
    
    const classItems = await Class.find({ school: school._id })
      .populate("classes", "name _id");
    
    res.status(200).json({
      message: "Classes fetched successfully",
      classes: classItems
    })
  } catch (error) {
    console.log("Error in teachersList controller: ", error);
    next(error);
  }
}

