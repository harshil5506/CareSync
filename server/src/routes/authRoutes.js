import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyAuth } from "../middleware/auth.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/me", verifyAuth, getMe);
router.put("/profile", verifyAuth, updateProfile);
router.put("/change-password", verifyAuth, changePassword);
router.post("/logout", verifyAuth, logout);

export default router;
