import express from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorByUserId,
  getDoctorAvailability,
} from "../controllers/doctorController.js";
import { verifyAuth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, authorize(["admin"]), createDoctor);
router.get("/", verifyAuth, getDoctors);
router.get("/user/profile", verifyAuth, getDoctorByUserId);
router.get("/availability/:id/:date", verifyAuth, getDoctorAvailability);
router.get("/:id", verifyAuth, getDoctorById);
router.put("/:id", verifyAuth, authorize(["admin", "doctor"]), updateDoctor);
router.delete("/:id", verifyAuth, authorize(["admin"]), deleteDoctor);

export default router;
