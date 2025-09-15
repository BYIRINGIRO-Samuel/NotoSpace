import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { config } from "./config/default.js";
import connectDB from "./utils/db.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import rolesRoutes from "./routes/roles.routes.js";
import usersRoutes from "./routes/users.routes.js";
import schoolsRoutes from "./routes/schools.routes.js";
import classesRoutes from "./routes/classes.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import videosRoutes from "./routes/videos.routes.js";
import userTeacherRoutes from "./routes/user.teacher.route.js";
import { decodeJWTMiddleware } from "./middlewares/protectedRoute.middleware.js";
import {
  cleanupAllSeenNotifications,
  clearExpiredResetTokens,
} from "./jobs/cleanupFunction.js";
const app = express();

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//logs
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory))
  fs.mkdirSync(logDirectory, { recursive: true });
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" },
);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(decodeJWTMiddleware);

//routes
app.use("/api/roles", rolesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/schools", schoolsRoutes);
app.use("api/classes", classesRoutes);
app.use("api/courses", coursesRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/users/teachers", userTeacherRoutes);

//last middlewares
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    console.log("Database connected");

    app.listen(config.port, () => {
      console.log(`Server is running at http://localhost:${config.port}`);
    });

    cron.schedule(`*/${config.tokenDuration} * * * *`, async () => {
      console.log(
        `Running scheduled cleanup of expired reset tokens in ${config.tokenDuration} minutes... done at ${new Date().toISOString()}`,
      );
      clearExpiredResetTokens();
      cleanupAllSeenNotifications();
    });
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
}

start();
