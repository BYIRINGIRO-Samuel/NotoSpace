import { RequestHandler } from "express";
import { Types } from "mongoose";
import _ from "lodash";
import Role from "../models/roles.model.js";

import { IRequest } from "../middlewares/protectedRoute.middleware.js";
import Notification, { INotification } from "../models/notification.model.js";
import User from "../models/users.model.js";
import { HttpError } from "../utils/error.class.js";
import Class from "../models/classes.model.js";

const getNofitications: RequestHandler = async (req: IRequest, res, next) => {
  const userId = req.user?._id;
  const username = req.user?.name;
  try {
    const notifications = await Notification.find({
      createdFor: userId,
      seenBy: { $nin: [userId] },
    })
      .populate("createdBy", "name")
      .populate("createdFor", "name");
    if (!notifications || notifications.length === 0) {
      res
        .status(404)
        .json({ message: `No notifications found for you, ${username}` });
      return;
    }

    res.status(200).json({
      message: `Notifications fetched successfully for ${username}`,
      notifications,
    });
  } catch (error) {
    console.log("Error in getNofitications:", error);
    next(error);
  }
};

const markAsSeen: RequestHandler = async (req: IRequest, res, next) => {
  const userId = req.user?._id;
  const username = req.user?.name;
  const notificationId = req.params.id;
  try {
    if (!notificationId || !Types.ObjectId.isValid(notificationId))
      throw new Error("Invalid or empty notification id");
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error("Notification not found");

    if (
      !notification.createdFor.some(
        (id) => id.toString() === userId?.toString(),
      )
    )
      throw new Error("You are not authorized to see this notification");

    const verifySeenNotification = await Notification.findById(notificationId);
    if (!verifySeenNotification) throw new Error("Notification not found");
    if (
      verifySeenNotification!.seenBy?.some(
        (id) => id.toString() == userId!.toString(),
      )
    )
      throw new HttpError(400, "You have already seen this notification");

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { $push: { seenBy: userId } },
      { new: true },
    )
      .populate("createdBy", "name")
      .populate("createdFor", "name")
      .populate("seenBy", "name");

    res.status(200).json({
      message: `Notification marked as seen by ${username}, after reading the notification, it will be removed from your notifications`,
      notification: updatedNotification,
    });
  } catch (error) {
    console.log("Error in markAsSeen", error);
    next(error);
  }
};

const createNotification: RequestHandler = async (req: IRequest, res, next) => {
  const user = req.user;
  try {
    const notifier = await User.findById(user?._id)
      .populate("school", "name _id")
      .populate("role", "type _id");
    if (!notifier)
      throw new Error("You are not authorized to create notification");

    let notification;
    if ((notifier.role as any).type == "student") {
      const { title, message, teachername } = req.body;
      if (!title || !message || !teachername)
        throw new Error("All fields are required");
      const notificationType = "student-question";

      const teacherOfStudent = await User.findOne({ name: teachername })
        .populate("role", "type _id")
        .populate("school", "name _id");
      if (notifier._id.toString() == teacherOfStudent?._id.toString())
        throw new HttpError(400, "You are not allowed to notify yourself");
      if (!teacherOfStudent)
        throw new HttpError(400, `Teacher ${teachername} not found`);
      if ((teacherOfStudent.role as any).type != "teacher")
        throw new HttpError(400, "Student is allowed to notify teachers only");
      if (
        (notifier.school as any).name != (teacherOfStudent.school as any).name
      )
        throw new HttpError(400, "You are not allowed to notify this teacher");
      if (
        !teacherOfStudent.classes.some(
          (cls) => cls.classname.toString() == notifier.classname.toString(),
        )
      )
        throw new HttpError(400, "You are not allowed to notify this teacher");

      notification = new Notification({
        createdBy: notifier._id,
        title,
        message,
        type: notificationType,
        createdFor: [teacherOfStudent._id],
      });
    } else if ((notifier.role as any).type === "teacher") {
      const { title, message, classname } = req.body;
      if (!title || !message || !classname)
        throw new Error("All fields are required");

      const notificationType = "teacher-announcement";
      const createdBy = user!._id;

      const classExists = await Class.findOne({ name: classname })
        .populate("school", "_id name")
        .populate("teachers", "_id name")
        .populate("students", "_id name");

      if (!classExists) throw new Error("Class not found");

      console.log(notifier, classExists);
      if (
        (notifier.school as any)._id.toString() !==
        (classExists.school as any)._id.toString()
      )
        throw new HttpError(
          400,
          "You are not allowed to create notification for this class (different school)",
        );

      const isAssignedTeacher = classExists.teachers.some(
        (teacher) => teacher._id.toString() === createdBy.toString(),
      );
      if (!isAssignedTeacher)
        throw new HttpError(
          400,
          "You are not allowed to create notification for this class (not assigned)",
        );

      const createdFor = [
        ...new Set(
          classExists.students.map((student) => student._id.toString()),
        ),
      ];
      if (createdFor.length === 0)
        throw new HttpError(400, "No students to notify in this class");

      const notification = new Notification({
        createdBy,
        title,
        message,
        createdFor,
        type: notificationType,
      });

      await notification.save();
      res.status(201).json({
        message: `Notification sent to class "${classname}" successfully.`,
        notification,
      });
    } else {
      throw new Error("You are not authorized to create notification");
    }

    await notification!.save();

    const formattedNotificaton = await Notification.findById(notification!._id)
      .populate("createdBy", "name")
      .populate("createdFor", "name");
    res.status(201).json({
      message: `Notification created successfully by ${notifier.name}`,
      notification,
    });
  } catch (error) {
    console.log("Error in createNotification", error);
    next(error);
  }
};

export { getNofitications, markAsSeen, createNotification };
