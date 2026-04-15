import { Schema, Types, model } from "mongoose";

interface IQuiz extends Document {
  type: string;
  title: string;
  description: string;
  questions: Types.ObjectId[];
  createdBy: Types.ObjectId;
  totalMarks: number;
  course: Types.ObjectId;
  class: Types.ObjectId;
  submittedBy: Types.ObjectId[];
  submissionDate: Date;
}

const quizSchema = new Schema({
  type: {
    type: String,
    enum: ["quiz", "assignment", "exercise"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: Types.ObjectId,
    ref: "Course",
  },
  class: {
    type: Types.ObjectId,
    ref: "Class",
  },
  questions: [
    {
      type: Types.ObjectId,
      ref: "Question",
    }
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User", 
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  submittedBy: {
    type: [Types.ObjectId],
    default: [],
    ref: "User"
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

const Quiz = model<IQuiz>("Quiz", quizSchema);
export default Quiz;

