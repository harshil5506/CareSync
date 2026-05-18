import { sendResponse } from "../utils/apiResponse.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createDoctor = asyncHandler(async (req, res) => {
  const {
    userId,
    specialization,
    qualification,
    experience,
    departmentId,
    fee,
    bio,
    certifications,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existingDoctor = await Doctor.findOne({ user: userId });
  if (existingDoctor) {
    throw new AppError("Doctor profile already exists for this user", 400);
  }

  if (departmentId) {
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new AppError("Department not found", 404);
    }
  }

  const doctor = await Doctor.create({
    user: userId,
    specialization,
    qualification,
    experience,
    department: departmentId,
    fee,
    bio,
    certifications,
  });

  await doctor.populate("user", "name email phone avatar");
  await doctor.populate("department", "name");

  sendResponse(res, 201, doctor, "Doctor created successfully");
});

export const getDoctors = asyncHandler(async (req, res) => {
  const {
    search,
    specialization,
    department,
    page = 1,
    limit = 10,
  } = req.query;

  const query = { status: "active" };

  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
    query.user = { $in: users.map((u) => u._id) };
  }

  if (specialization) query.specialization = specialization;
  if (department) query.department = department;

  const skip = (page - 1) * limit;
  const doctors = await Doctor.find(query)
    .populate("user", "name email phone avatar")
    .populate("department", "name")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Doctor.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      doctors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Doctors retrieved successfully",
  );
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await Doctor.findById(id)
    .populate("user", "name email phone avatar")
    .populate("department", "name");

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  sendResponse(res, 200, doctor, "Doctor retrieved successfully");
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    specialization,
    qualification,
    experience,
    departmentId,
    fee,
    bio,
    certifications,
    status,
  } = req.body;

  const doctor = await Doctor.findByIdAndUpdate(
    id,
    {
      specialization,
      qualification,
      experience,
      department: departmentId,
      fee,
      bio,
      certifications,
      status,
    },
    { new: true },
  )
    .populate("user", "name email phone avatar")
    .populate("department", "name");

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  sendResponse(res, 200, doctor, "Doctor updated successfully");
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  sendResponse(res, 200, {}, "Doctor deleted successfully");
});

export const getDoctorByUserId = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const doctor = await Doctor.findOne({ user: userId })
    .populate("user", "name email phone avatar")
    .populate("department", "name");

  if (!doctor) {
    throw new AppError("Doctor profile not found", 404);
  }

  sendResponse(res, 200, doctor, "Doctor profile retrieved successfully");
});

export const getDoctorAvailability = asyncHandler(async (req, res) => {
  const { id, date } = req.params;

  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
  const availability = doctor.availability.find((a) => a.day === dayOfWeek);

  if (!availability || !availability.isAvailable) {
    return sendResponse(
      res,
      200,
      { slots: [] },
      "Doctor not available on this day",
    );
  }

  const slots = [];
  const [startHour, startMin] = availability.startTime.split(":").map(Number);
  const [endHour, endMin] = availability.endTime.split(":").map(Number);
  const slotDuration = 30;

  let current = new Date();
  current.setHours(startHour, startMin, 0);
  const end = new Date();
  end.setHours(endHour, endMin, 0);

  while (current < end) {
    slots.push(
      current.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
    current.setMinutes(current.getMinutes() + slotDuration);
  }

  sendResponse(
    res,
    200,
    { slots },
    "Doctor availability retrieved successfully",
  );
});
