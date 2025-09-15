import { Types } from "mongoose";
import Question from "../models/questions.model.js";
import Quiz from "../models/quizzes.model.js";
import { HttpError } from "./error.class.js";

interface IInsertQuestion {
  _id: Types.ObjectId|string;
  publicId: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  answer: string;
  quizId: string;
  marks: number;
}

interface IInsertQuiz {
  type: string;
  title: string;
  description: string;
  questions: IInsertQuestion[];
  createdBy: Types.ObjectId;
  totalMarks: number;
  course: Types.ObjectId;
  class: Types.ObjectId;
  submissionDate: Date;
}

const insertQuiz = async (quiz: IInsertQuiz) => {
  try {
    let questions: Types.ObjectId[] = [], totalMarks: number = 0;
    const createdQuiz = new Quiz({
      type: quiz.type,
      title: quiz.title,
      description: quiz.description,
      createdBy: quiz.createdBy,
      totalMarks: 0,
      questions: [],
      course: quiz.course,
      class: quiz.class,
      submissionDate: quiz.submissionDate
    });
    await createdQuiz.save();

    if(quiz.questions.length > 0){
      for (let question of quiz.questions) {
        const createdQuestion = new Question({
          type: question.type,
          question: question.question,
          options: question.options,
          answer: question.answer,
          marks: question.marks,
          quizId: createdQuiz._id
        });
      
        await createdQuestion.save();
        questions.push(createdQuestion._id as Types.ObjectId);
        totalMarks += createdQuestion.marks;
      }      
    }

    createdQuiz.questions = questions;
    createdQuiz.totalMarks = totalMarks;
    await createdQuiz.save();

    return createdQuiz;
  } catch (error) {
    throw new HttpError(500, `${error}`);
  }
}

export { insertQuiz };