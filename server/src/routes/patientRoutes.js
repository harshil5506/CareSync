import express from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientByUserId,
} from "../controllers/patientController.js";
import { verifyAuth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  verifyAuth,
  authorize(["admin", "receptionist"]),
  createPatient,
);
router.get("/", verifyAuth, getPatients);
router.get("/user/profile", verifyAuth, getPatientByUserId);
router.get("/:id", verifyAuth, getPatientById);
router.put(
  "/:id",
  verifyAuth,
  authorize(["admin", "receptionist", "patient"]),
  updatePatient,
);
router.delete(
  "/:id",
  verifyAuth,
  authorize(["admin", "receptionist"]),
  deletePatient,
);

export default router;
