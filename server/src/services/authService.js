import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import { AppError } from "../middleware/errorHandler.js";

export class AuthService {
  static async register(data) {
    const { name, email, password, role, phone } = data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists with this email", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",
      phone,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static async login(email, password) {
    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
      refreshToken,
    };
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    // In production, send email with reset link
    // For now, return token for testing
    return {
      message: "Password reset email sent",
      resetToken, // Remove in production
    };
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return { message: "Password reset successfully" };
  }

  static async updateProfile(userId, data) {
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  static async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password changed successfully" };
  }
}

export default AuthService;
