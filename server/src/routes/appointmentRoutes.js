import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  getTodayAppointments,
} from "../controllers/appointmentController.js";
import { verifyAuth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  verifyAuth,
  authorize(["admin", "receptionist", "patient"]),
  createAppointment,
);
router.get("/", verifyAuth, getAppointments);
router.get("/today/list", verifyAuth, getTodayAppointments);
router.get("/patient/:patientId", verifyAuth, getAppointmentsByPatientId);
router.get("/doctor/:doctorId", verifyAuth, getAppointmentsByDoctorId);
router.get("/:id", verifyAuth, getAppointmentById);
router.put(
  "/:id/status",
  verifyAuth,
  authorize(["admin", "doctor"]),
  updateAppointmentStatus,
);
router.put(
  "/:id/cancel",
  verifyAuth,
  authorize(["admin", "receptionist", "patient"]),
  cancelAppointment,
);

export default router;
