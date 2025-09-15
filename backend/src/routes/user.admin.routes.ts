import express from "express";
import {
  approveAccount,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  assignStudentToClass,
  moveStudentToClass,
  removeStudentFromClass,
  bulkAssignStudentsToClass,
  getDashboardStats,
  adminGetUsers,
  classesList,
  coursesList,
  usersList,
} from "../controllers/users.admin.controller.js";
import { protectedRoute, protectedAdminRoute } from "../middlewares/protectedRoute.middleware.js";

const router = express.Router();

// Account approval
router.post("/approve-account", protectedRoute, protectedAdminRoute, approveAccount);

// Student CRUD
router.get("/students", protectedRoute, protectedAdminRoute, getStudents);
router.get("/students/:studentId", protectedRoute, protectedAdminRoute, getStudent);
router.put("/students/:studentId", protectedRoute, protectedAdminRoute, updateStudent);
router.delete("/students/:studentId", protectedRoute, protectedAdminRoute, deleteStudent);

// Assignment operations
router.post("/assign-student", protectedRoute, protectedAdminRoute, assignStudentToClass);
router.post("/move-student", protectedRoute, protectedAdminRoute, moveStudentToClass);
router.post("/remove-student", protectedRoute, protectedAdminRoute, removeStudentFromClass);

// Bulk operations
router.post("/bulk-assign-students", protectedRoute, protectedAdminRoute, bulkAssignStudentsToClass);

// Dashboard stats
router.get("/dashboard-stats", protectedRoute, protectedAdminRoute, getDashboardStats);
router.get("/users", protectedRoute, protectedAdminRoute, adminGetUsers);

// Admin list routes
router.get("/admins/list/students", protectedRoute, protectedAdminRoute, usersList("student"));
router.get("/admins/list/teachers", protectedRoute, protectedAdminRoute, usersList("teacher"));
router.get("/admins/list/classes", protectedRoute, protectedAdminRoute, classesList);
router.get("/admins/list/courses", protectedRoute, protectedAdminRoute, coursesList);

export default router;
