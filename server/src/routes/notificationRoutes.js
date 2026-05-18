import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUserUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(verifyAuth);

router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/unread/:userId", getUserUnreadCount);
router.get("/:id", getNotificationById);
router.put("/:id/read", markAsRead);
router.put("/mark-all-read", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
