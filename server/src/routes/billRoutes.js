import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  getBillsByPatient,
  recordPayment,
  getBillStats,
} from "../controllers/billController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyAuth);

// CRUD operations
router.post("/", createBill);
router.get("/", getBills);

// Special endpoints (must come before /:id)
router.get("/stats", getBillStats);
router.get("/patient/:patientId", getBillsByPatient);

// ID-based operations
router.get("/:id", getBillById);
router.put("/:id", updateBill);
router.delete("/:id", deleteBill);
router.post("/:id/payment", recordPayment);

export default router;
