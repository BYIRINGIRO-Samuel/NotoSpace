import { Router } from "express";
import { createNote, deleteNote, notesOfClass, notesOfTeacher, serveNote } from "../controllers/note.controller.js";
import { protectedRoute, protectedStudentRoute, protectedTeacherRoute } from "../middlewares/protectedRoute.middleware.js";
import upload from "../middlewares/upload.middleware.js";
const router = Router();

router.get("/class", protectedRoute, protectedStudentRoute, notesOfClass);
router.get("/teacher", protectedRoute, protectedTeacherRoute, notesOfTeacher);
router.get("/serve/:id", protectedRoute, serveNote);
router.post("/create", protectedRoute, protectedTeacherRoute, upload.single('file'), createNote);
router.delete("/notes/:noteId", protectedRoute, protectedTeacherRoute, deleteNote)

export default router;