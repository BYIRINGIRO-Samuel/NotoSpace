import express from "express";
import {
  createUser,
  forgotPassword,
  getProfile,
  resetPassword,
  login,
  logout,
  updateProfile,
  verifyOtp,
} from "../controllers/users.controller.js";
import {
  protectedAdminRoute,
  protectedRoute,
  unProtectedRoutes,
} from "../middlewares/protectedRoute.middleware.js";
import { approveAccount, classesList, coursesList, usersList, getDashboardStats } from "../controllers/users.admin.controller.js";
const routes = express.Router();

routes.post("/create", unProtectedRoutes, createUser);
routes.post("/login", unProtectedRoutes, login);
routes.post("/logout", protectedRoute, logout);
routes.get("/profile", protectedRoute, getProfile);
routes.put("/profile", protectedRoute, updateProfile);

routes.post("/forgot-password", unProtectedRoutes, forgotPassword);
routes.post("/verify-otp", unProtectedRoutes, verifyOtp);
routes.post("/reset-password", unProtectedRoutes, resetPassword);

//admin routes
routes.post("/admin/approve-account", protectedRoute, approveAccount);
routes.get("/admins/approve-account", protectedRoute, protectedAdminRoute, approveAccount);
routes.get("/admins/list/students", protectedRoute, protectedAdminRoute, usersList("student"));
routes.get("/admins/list/teachers", protectedRoute, protectedAdminRoute, usersList("teacher"));
routes.get("/admins/list/classes", protectedRoute, protectedAdminRoute, classesList);
routes.get("/admins/list/courses", protectedRoute, protectedAdminRoute, coursesList);
routes.get("/admins/dashboard-stats", protectedRoute, protectedAdminRoute, getDashboardStats);

export default routes;
