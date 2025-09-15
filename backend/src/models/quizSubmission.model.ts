import mongoose, { Types } from "mongoose";

export interface IQuizSubmission {
  _id?: Types.ObjectId;
  student: Types.ObjectId;
  quiz: Types.ObjectId;
  submittedAt?: Date;
  totalMarks: number;
  marksObtained: number;
  percentage?: number;
  correctQuestions: {
    questionId: Types.ObjectId;
    answer: string;
  }[];
  wrongQuestions: {
    questionId: Types.ObjectId;
    answer: string;
    correctAnswer: string;
  }[];
}

const quizSubmissionSchema = new mongoose.Schema<IQuizSubmission>({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  submittedAt: { type: Date, default: Date.now },
  totalMarks: { type: Number, required: true },
  marksObtained: { type: Number, required: true },
  percentage: { type: Number },
  correctQuestions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answer: String
    }
  ],
  wrongQuestions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answer: String,
      correctAnswer: String
    }
  ]
});

const QuizSubmission = mongoose.model<IQuizSubmission>("Submission", quizSubmissionSchema)
export default QuizSubmission