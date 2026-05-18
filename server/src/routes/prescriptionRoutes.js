import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
} from "../controllers/prescriptionController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyAuth);

// CRUD operations
router.post("/", createPrescription);
router.get("/", getPrescriptions);

// Special endpoints (must come before /:id)
router.get("/patient/:patientId", getPrescriptionsByPatient);
router.get("/doctor/:doctorId", getPrescriptionsByDoctor);

// ID-based operations
router.get("/:id", getPrescriptionById);
router.put("/:id", updatePrescription);
router.delete("/:id", deletePrescription);

export default router;
