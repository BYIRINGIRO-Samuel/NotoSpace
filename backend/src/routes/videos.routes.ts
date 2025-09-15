import express from "express";
import { protectedRoute, protectedTeacherRoute } from "../middlewares/protectedRoute.middleware.js";
import { createVideo, videosOfClass, videosOfTeacher, deleteVideo } from "../controllers/video.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Teacher routes
router.post("/create", protectedRoute, protectedTeacherRoute, upload.single('file'), createVideo);
router.get("/teacher", protectedRoute, protectedTeacherRoute, videosOfTeacher);
router.delete("/:id", protectedRoute, protectedTeacherRoute, deleteVideo);

// Student routes
router.get("/class", protectedRoute, videosOfClass);

export default router; 