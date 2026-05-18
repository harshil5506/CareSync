import express from "express";
import {
  createHospital,
  getHospitals,
  getHospitalById,
  getHospitalHierarchy,
  getHospitalStats,
  updateHospital,
  deleteHospital,
} from "../controllers/hospitalController.js";
import { verifyAuth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, authorize(["admin"]), createHospital);
router.get("/", verifyAuth, getHospitals);
router.get("/hierarchy/all", verifyAuth, getHospitalHierarchy);
router.get("/:id/stats", verifyAuth, getHospitalStats);
router.get("/:id", verifyAuth, getHospitalById);
router.put("/:id", verifyAuth, authorize(["admin"]), updateHospital);
router.delete("/:id", verifyAuth, authorize(["admin"]), deleteHospital);

export default router;
