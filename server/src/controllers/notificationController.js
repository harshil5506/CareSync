import { sendResponse } from "../utils/apiResponse.js";
import Notification from "../models/Notification.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createNotification = asyncHandler(async (req, res) => {
  const { userId, type, title, message, data } = req.body;

  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    data,
  });

  sendResponse(res, 201, notification, "Notification created successfully");
});

export const getNotifications = asyncHandler(async (req, res) => {
  const { userId, page = 1, limit = 10, read } = req.query;

  const query = {};
  if (userId) query.userId = userId;
  if (read !== undefined) query.read = read === "true";

  const skip = (page - 1) * limit;
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Notifications retrieved successfully",
  );
});

export const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  sendResponse(res, 200, notification, "Notification retrieved successfully");
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true, readAt: new Date() },
    { new: true },
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  sendResponse(res, 200, notification, "Notification marked as read");
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  await Notification.updateMany(
    { userId, read: false },
    { read: true, readAt: new Date() },
  );

  sendResponse(res, 200, {}, "All notifications marked as read");
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  sendResponse(res, 200, {}, "Notification deleted successfully");
});

export const getUserUnreadCount = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const unreadCount = await Notification.countDocuments({
    userId,
    read: false,
  });

  sendResponse(
    res,
    200,
    { unreadCount },
    "Unread count retrieved successfully",
  );
});
