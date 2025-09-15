import { Router } from "express";
import { protectedRoute, protectedStudentRoute, protectedTeacherRoute } from "../middlewares/protectedRoute.middleware.js";
import { createQuiz, doQuiz, getArchiveQuizzes, getPendingQuizzes, getQuiz, studentsProgressById } from "../controllers/quizzes.controller.js";

const router = Router();

//teacher routes
router.post("/", protectedRoute, protectedTeacherRoute, createQuiz);

//student routes
router.get("/get-quizzes/pending", protectedRoute, protectedStudentRoute, getPendingQuizzes);
router.get("/get-quizzes/archive", protectedRoute, protectedStudentRoute, getArchiveQuizzes);
router.get("/get-quizzes/:quizId", protectedRoute, protectedStudentRoute, getQuiz);
router.post("/do/:quizId", protectedRoute, protectedStudentRoute, doQuiz);

//tracking progress of quiz
router.get("/progress/students/:quizId", protectedRoute, protectedTeacherRoute, studentsProgressById);

export default router;
