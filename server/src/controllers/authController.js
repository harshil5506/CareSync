import { asyncHandler } from "../middleware/errorHandler.js";
import { sendResponse } from "../utils/apiResponse.js";
import AuthService from "../services/authService.js";
import User from "../models/User.js";

export const register = asyncHandler(async (req, res) => {
  const userData = await AuthService.register(req.body);

  sendResponse(res, 201, userData, "User registered successfully");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  // Set refresh token in httpOnly cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, 200, result, "Login successful");
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  sendResponse(res, 200, {}, "Logout successful");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  sendResponse(res, 200, user, "Profile retrieved");
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "phone", "avatar"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field]) {
      updateData[field] = req.body[field];
    }
  });

  const user = await AuthService.updateProfile(req.user._id, updateData);

  sendResponse(res, 200, user, "Profile updated successfully");
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await AuthService.changePassword(req.user._id, oldPassword, newPassword);

  sendResponse(res, 200, {}, "Password changed successfully");
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await AuthService.forgotPassword(email);

  sendResponse(res, 200, result, "Password reset email sent");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const result = await AuthService.resetPassword(token, newPassword);

  sendResponse(res, 200, result, "Password reset successful");
});
