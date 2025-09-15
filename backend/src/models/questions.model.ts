import { Schema, Types, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IQuestion extends Document {
  _id: Types.ObjectId | string;
  type: "multiple-choice" | "true-false" | "open-ended" | "fill-in-the-blank" | "match-the-following";
  publicId: string;
  question: string;
  options: string[]|null;
  answer: string;
  quizId: string;
  marks: number;
}

const questionSchema = new Schema<IQuestion>({
  publicId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false'],
    required: true,
  },
  options: {
    type: [String], 
    default: [],
  },
  answer: {
    type: Schema.Types.Mixed,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

questionSchema.pre('save', async function(next) {
  if(this.type !== 'multiple-choice')
    this.options = null;
  next()
})

const Question = model<IQuestion>("Question", questionSchema);
export default Question;
