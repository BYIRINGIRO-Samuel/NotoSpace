import { HttpError } from "../utils/error.class.js";
import User from "../models/users.model.js";
import Notification from "../models/notification.model.js"; 
import mongoose from "mongoose";

export async function clearExpiredResetTokens() {
  try {
    const result = await User.updateMany(
      { resetPasswordExpires: { $lt: new Date() } },
      {
        $set: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      },
    );
    console.log(
      `Expired tokens cleared (set to null) in ${result.modifiedCount} users.`,
    );
  } catch (err) {
    console.error("Error clearing expired reset tokens: ", err);
  }
}

export async function cleanupAllSeenNotifications() {
  try {
    let deletedCount = 0;
    const notifications = await Notification.find();

    for (const notif of notifications) {
      if (!notif.seenBy || notif.seenBy.length === 0) continue;
      const createdForSet = new Set(
        notif.createdFor.map((id) => id.toString()),
      );
      const seenBySet = new Set(notif.seenBy.map((id) => id.toString()));

      const allSeen = [...createdForSet].every((userId) =>
        seenBySet.has(userId),
      );

      if (allSeen) {
        await Notification.deleteOne({
          _id: notif._id as mongoose.Types.ObjectId,
        });
        console.log(
          `Deleted notification ${notif._id} because all users have seen it.`,
        );
        deletedCount++;
      }
    }

    console.log(`${deletedCount} notifications cleaned up`);
  } catch (error) {
    console.log("Error in cleanupAllSeenNotifications: ", error);
  }
}
