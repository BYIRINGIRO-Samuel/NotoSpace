import { NextFunction, RequestHandler, Response } from "express";
import Joi from "joi";
import _ from "lodash";
import Quiz from "../models/quizzes.model.js";
import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import { HttpError } from "../utils/error.class.js";
import { insertQuiz } from "../utils/quizzes.service.js";
import mongoose, { Types } from "mongoose";
import User, { IUser } from "../models/users.model.js";
import Class from "../models/classes.model.js";
import Course from "../models/courses.model.js";
import Notification from "../models/notification.model.js";
import { doQuizValidationSchema, quizValidationSchema } from "../utils/joi-validators.js";
import Question from "../models/questions.model.js";
import QuizSubmission from "../models/quizSubmission.model.js";

export const createQuiz: RequestHandler = async (req: IRequest, res, next) => {
  const { title, description, questions, type, course, className, submissionDate } = req.body;
  const userId = req.user?._id;
  try {
    const { error } = quizValidationSchema.validate({ title, description, type, questions, course, className, submissionDate });
    if(error)
      throw new HttpError(400, error.details[0].message);

    const teacher = await User.findById(userId);
    if(!teacher)
      throw new HttpError(404, "Teacher not found");

    const classItem = await Class.findOne({name: className});
    if(!classItem)
      throw new HttpError(404, `Class ${className} not found`);

    const courseItem = await Course.findOne({name: course, classid: classItem._id});
    if(!courseItem)
      throw new HttpError(404, `Course ${course} not found`);
    
    if(!classItem.teachers.includes(teacher._id as Types.ObjectId))
      throw new HttpError(403, "You are not authorized to create quiz in this class");

    if(!classItem.courses.includes(courseItem._id as Types.ObjectId))
      throw new HttpError(403, "You are not authorized to create quiz in this course");

    const quizData = { 
      title, 
      description, 
      type, 
      questions,
      createdBy: userId as Types.ObjectId,
      totalMarks: 0,
      course: courseItem._id as Types.ObjectId,
      class: classItem._id as Types.ObjectId,
      submissionDate: submissionDate
    }
    
    const createdFor = classItem.students.map(student => student as Types.ObjectId);

    let message: string = "";
    if(type === "assignment"){
      message = `A new assignment has been created by ${teacher.name} for ${courseItem.name} in ${classItem.name} to be submitted on ${submissionDate}`;
    }else if(type === "quiz"){
      message = `A new quiz has been created by ${teacher.name} for ${courseItem.name} in ${classItem.name}`;
    }else if(type === "exercise"){
      message = `A new exercise has been created by ${teacher.name} for ${courseItem.name} in ${classItem.name}`;
    }

    const newQuiz = await insertQuiz(quizData);

    const notification = new Notification({
      createdBy: userId as Types.ObjectId,
      title: `New ${type} Created`,
      message: message,
      createdFor: createdFor,
      type: "assignment",
      quizId: newQuiz._id as Types.ObjectId
    });

    await notification.save();

    const quiz = await Quiz.findById(newQuiz._id)
      .populate('createdBy', 'name')
      .populate('course', 'name')
      .populate('class', 'name')
      .populate('questions');

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
      notification: notification.toObject()
    });
  } catch (error) {
    console.log("error in createQuiz", error);
    next(error);
  }
}

export const getPendingQuizzes: RequestHandler = async (req: IRequest, res, next) => {
  const userId = req.user?._id;
  try {
    if (!req.user || !req.user._id) 
      throw new HttpError(401, "Unauthorized: User not authenticated");

    const student = await User.findById(userId);
    if(!student)
      throw new HttpError(404, "Student not found");

    const classForStudent = await Class.findById(student?.classname);
    if(!classForStudent)
      throw new HttpError(404, "Class not found");

    if(
      !classForStudent.students.some(studentId => studentId.toString() === student!._id.toString())
    ) throw new HttpError(403, "You are not authorized to access this class or perform this action.");

    const pendingQuizzes = await Quiz.find({
      class: classForStudent._id,
      $or: [
        { submissionDate: { $gt : new Date() } },
        { submissionDate: null },
        { submissionDate: { $exists: false } }
      ]
    })
      .populate('createdBy', 'name')
      .populate('submittedBy', 'name')
      .populate('course', 'name')
      .populate('class', 'name')
      .populate('questions');

    res.status(200).json({
      message: "Pending quizzes fetched successfully",
      quizzes: pendingQuizzes
    });
  } catch (error) {
    console.log("error in getPendingQuizzes", error);
    next(error);
  }
}

export const getQuiz: RequestHandler = async (req: IRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { quizId } = req.params;
  try {
    let quizToGet = await Quiz.findById(quizId)
      .populate('createdBy', 'name')
      .populate('submittedBy', 'name')
      .populate('course', 'name')
      .populate('class', 'name')
      .populate('questions', '-answer');

    if(!quizToGet)
      throw new HttpError(404, "Quiz not found");

    const student = await User.findById(userId);
    if(!student)
      throw new HttpError(404, "Student not found");
    
    if((quizToGet.class as any)._id.toString() !== student.classname!.toString())
      throw new HttpError(403, "You are not authorized to access this quiz, to view this quiz you need to visit the archive section");

    if(quizToGet.submittedBy.some(student => student._id.toString() === (userId as Types.ObjectId).toString()))
      throw new HttpError(403, "You have already submitted this quiz, to view your submission you need to visit the archive section");

    if(quizToGet.submissionDate && new Date(quizToGet.submissionDate) < new Date())
      throw new HttpError(403, "Quiz submission date has passed, to view the quiz you need to visit the archive section");

    res.status(200).json({
      message: "Quiz fetched successfully",
      quiz: quizToGet
    });
  }catch(error){
    console.log("error in getQuiz", error);
    next(error);
  }
}

export const getArchiveQuizzes: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new HttpError(401, "Unauthorized: User not authenticated");

    const student = await User.findById(userId);
    if (!student) throw new HttpError(404, "Student not found");

    const archiveQuizzes = await Quiz.find({
      $or: [
        { submittedBy: student._id },
        { submissionDate: { $lte: new Date() } },
        { submissionDate: { $exists: false } },
        { submissionDate: null }
      ]
    })
      .populate('createdBy', 'name')
      .populate('submittedBy', 'name')
      .populate('course', 'name')
      .populate('class', 'name')
      .populate('questions');

    res.status(200).json({
      message: "Archived quizzes fetched successfully",
      quizzes: archiveQuizzes,
    });

  } catch (error) {
    console.error("Error in getArchiveQuizzes:", error);
    next(error);
  }
};

export const doQuiz: RequestHandler = async (req: IRequest, res, next) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user?._id;

    if (!studentId) throw new HttpError(401, "Unauthorized: User not authenticated");

    const student = await User.findById(studentId);
    if (!student) throw new HttpError(404, "Student not found");

    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new HttpError(404, "Quiz not found");

    // Prevent duplicate submission
    // if (quiz.submittedBy.includes(studentId as Types.ObjectId))
    //  throw new HttpError(400, "You have already submitted this quiz");

    // Validate body
    const { error } = doQuizValidationSchema.validate(req.body);
    if (error) throw new HttpError(400, error.details[0].message);

    const { questions } = req.body;

    const quizQuestions = await Question.find({ _id: { $in: quiz.questions } });
    if (quizQuestions.length !== questions.length) {
      throw new HttpError(400, "Invalid number of questions submitted");
    }

    const questionMap = new Map(quizQuestions.map(q => [q._id.toString(), q]));

    let marksGot = 0;
    const correctQuestions: any[] = [];
    const wrongQuestions: any[] = [];

    for (const submission of questions) {
      const quizQuestion = questionMap.get(submission.questionId);
      if (!quizQuestion) {
        throw new HttpError(400, `Invalid question ID: ${submission.questionId}`);
      }

      const correctAnswer = quizQuestion.answer.toString().toLowerCase();
      const submittedAnswer = submission.answer.toString().toLowerCase();

      if (correctAnswer === submittedAnswer) {
        marksGot += quizQuestion.marks;
        correctQuestions.push(submission);
      } else {
        wrongQuestions.push({
          ...submission,
          correctAnswer: quizQuestion.answer
        });
      }
    }

    // Mark quiz as submitted and save submission
    await Quiz.findByIdAndUpdate(quizId, { $push: { submittedBy: studentId } });
    await QuizSubmission.create({
      student: studentId,
      quiz: quizId,
      totalMarks: quiz.totalMarks,
      marksObtained: marksGot,
      percentage: Number(((marksGot / quiz.totalMarks) * 100).toFixed(2)),
      correctQuestions,
      wrongQuestions
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      marksgot: `${marksGot}/${quiz.totalMarks}`,
      percentage: ((marksGot / quiz.totalMarks) * 100).toFixed(2) + '%',
      correctQuestions,
      wrongQuestions
    });

  } catch (error) {
    console.error("Error submitting quiz:", error);
    next(error);
  }
};

//progress of quiz By quiz id
export const studentsProgressById: RequestHandler = async (req: IRequest, res, next) => {
  const teacherId = req.user?._id
  const quizId = req.params.quizId
  try {
    if(!quizId || !mongoose.Types.ObjectId.isValid(quizId)) 
      throw new HttpError(400, "Invalid or empty id");

    let quiz = await Quiz.findById(quizId)
    .populate("questions")
    .populate({
        path: "submittedBy",
        select: "id name email phone profilePicture school classname",
        populate: { 
          path: "classname", 
          select: "_id name academicLevel", 
          populate: { path: "school", select: "name"}
        }
    })
    .populate("course", "name")
    .populate(
      {
        path: "class",
        select: "students",
        populate: {
          path: "students",
          select: "name"
        }
      }
    )
    .lean();
    if(!quiz)throw new HttpError(400, "Quiz not found");

    if(quiz.createdBy.toString() !== teacherId?.toString()) 
      throw new HttpError(403, "Not allowed to view progress of this quiz");

    const studentsWithSubmission = await Promise.all(
      (quiz.class as any).students.map(async (student: any) => {
        const submission = await QuizSubmission.findOne({
          student: student._id,
          quiz: quizId,
        }).lean();
    
        return { ...student, submission };
      })
    );
    
    (quiz.class as any).students = studentsWithSubmission;

    const totalProgress = (quiz.class as any).students.map((student: any) => student.submission.percentage);
    const averageProgress = totalProgress.reduce((sum: number, progress: number) => sum + progress, 0) / totalProgress.length;

    const mostSuccessfulStudent = (quiz.class as any).students.reduce((max: any, student: any) => {
      return student.submission.percentage > max.submission.percentage ? student : max;
    }, (quiz.class as any).students[0]);

    const mostFailedStudent = (quiz.class as any).students.reduce((min: any, student: any) => {
      return student.submission.percentage < min.submission.percentage ? student : min;
    }, (quiz.class as any).students[0]);

    const wrongCounts: Record<string, { count: number; students: any[] }> = {};
    const correctCounts: Record<string, { count: number; students: any[] }> = {};

    (quiz.class as any).students.forEach((student: any) => {
      const submission = student.submission;
      if (!submission) return;

      for (const qid of submission.wrongQuestions || []) {
        if (!wrongCounts[qid]) wrongCounts[qid] = { count: 0, students: [] };
        wrongCounts[qid].count++;
        wrongCounts[qid].students.push(student);
      }

      for (const qid of submission.correctQuestions || []) {
        if (!correctCounts[qid]) correctCounts[qid] = { count: 0, students: [] };
        correctCounts[qid].count++;
        correctCounts[qid].students.push(student);
      }
    });

    const mostWrongQuestionId = Object.entries(wrongCounts).sort((a, b) => b[1].count - a[1].count)[0]?.[0];
    const mostCorrectQuestionId = Object.entries(correctCounts).sort((a, b) => b[1].count - a[1].count)[0]?.[0];

    const mostWrongQuestion = quiz.questions.find((q: any) => q._id.toString() === mostWrongQuestionId);
    const mostCorrectQuestion = quiz.questions.find((q: any) => q._id.toString() === mostCorrectQuestionId);

    const studentsWhoFailedMostWrong = wrongCounts[mostWrongQuestionId]?.students || [];
    const studentsWhoSucceededMostCorrect = correctCounts[mostCorrectQuestionId]?.students || [];

    res.status(200).json({
      message: `Progress of quiz ${quizId} fetched successfully`,
      quiz,
      totalProgress,
      averageProgress,
      mostSuccessfulStudent: _.pick(mostSuccessfulStudent, ["name", "_id"]),
      mostFailedStudent: _.pick(mostFailedStudent, ["name", "_id"]),
      mostWrongQuestion: {
        question: mostWrongQuestion,
        wrongCount: wrongCounts[mostWrongQuestionId]?.count || 0,
        students: studentsWhoFailedMostWrong.map((s) => _.pick(s, ["name", "_id"])),
      },
      mostCorrectQuestion: {
        question: mostCorrectQuestion,
        correctCount: correctCounts[mostCorrectQuestionId]?.count || 0,
        students: studentsWhoSucceededMostCorrect.map((s) => _.pick(s, ["name", "_id"])),
      }
    });    
    
  } catch (error) {
    next(error);
  }
}

