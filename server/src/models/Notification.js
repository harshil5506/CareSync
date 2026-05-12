import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "appointment",
        "prescription",
        "bill",
        "alert",
        "info",
        "reminder",
      ],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: String,
    data: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

// Indexes
notificationSchema.index({ user: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
