import mongoose from "mongoose";

export interface IVideo {
  teacher: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  fileUrl: string;
  filepublicId: string;
  duration?: number;
  thumbnail?: string;
  views?: number;
}

const videoSchema = new mongoose.Schema<IVideo>(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filepublicId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model<IVideo>("Video", videoSchema);
export default Video; 