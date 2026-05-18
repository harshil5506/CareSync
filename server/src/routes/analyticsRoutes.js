import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  getDashboardStats,
  getAppointmentTrend,
  getDepartmentDistribution,
  getRecentAppointments,
  getRevenueAnalytics,
  getDoctorPerformance,
} from "../controllers/analyticsController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyAuth);

router.get("/stats", getDashboardStats);
router.get("/appointments/trend", getAppointmentTrend);
router.get("/departments/distribution", getDepartmentDistribution);
router.get("/appointments/recent", getRecentAppointments);
router.get("/revenue", getRevenueAnalytics);
router.get("/doctors/performance", getDoctorPerformance);

export default router;
