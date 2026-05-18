import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentDoctors,
} from "../controllers/departmentController.js";
import { verifyAuth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAuth, authorize(["admin"]), createDepartment);
router.get("/", verifyAuth, getDepartments);
router.get("/:id", verifyAuth, getDepartmentById);
router.get("/:id/doctors", verifyAuth, getDepartmentDoctors);
router.put("/:id", verifyAuth, authorize(["admin"]), updateDepartment);
router.delete("/:id", verifyAuth, authorize(["admin"]), deleteDepartment);

export default router;
