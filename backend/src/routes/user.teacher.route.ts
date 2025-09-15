import { Router } from "express";
import { onBoardingTeacher, saveTeacherOnboarding, getStudentsInTeacherSchool, getTeacherClasses, getAvailableClassesForOnboarding } from "../controllers/users.teacher.controller.js";
import { protectedRoute, protectedTeacherRoute } from "../middlewares/protectedRoute.middleware.js";
import { classesList } from '../controllers/users.admin.controller.js';

const router = Router();

router.post("/onboarding", protectedRoute, protectedTeacherRoute, onBoardingTeacher);
router.post("/save-onboarding", protectedRoute, protectedTeacherRoute, saveTeacherOnboarding);
router.get('/list/students-in-school', protectedRoute, protectedTeacherRoute, getStudentsInTeacherSchool);
router.get('/list/classes', protectedRoute, protectedTeacherRoute, getTeacherClasses);
router.get('/list/available-classes', protectedRoute, protectedTeacherRoute, getAvailableClassesForOnboarding);

export default router;
