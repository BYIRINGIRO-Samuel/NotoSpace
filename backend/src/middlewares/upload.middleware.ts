import multer from "multer";
import { storage } from "../utils/files.js";

const upload = multer({ storage });
export default upload;