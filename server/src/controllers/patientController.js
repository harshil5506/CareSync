import { sendResponse } from "../utils/apiResponse.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { generateId } from "../utils/generateId.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createPatient = asyncHandler(async (req, res) => {
  const {
    userId,
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
    allergies,
    chronicDiseases,
  } = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if patient already exists for this user
  const existingPatient = await Patient.findOne({ user: userId });
  if (existingPatient) {
    throw new AppError("Patient profile already exists for this user", 400);
  }

  const patientId = generateId("patient");
  const patient = await Patient.create({
    patientId,
    user: userId,
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
    allergies,
    chronicDiseases,
  });

  await patient.populate("user", "name email phone avatar");
  sendResponse(res, 201, patient, "Patient created successfully");
});

export const getPatients = asyncHandler(async (req, res) => {
  const { search, gender, bloodGroup, page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
    query.user = { $in: users.map((u) => u._id) };
  }
  if (gender) query.gender = gender;
  if (bloodGroup) query.bloodGroup = bloodGroup;

  const skip = (page - 1) * limit;
  const patients = await Patient.find(query)
    .populate("user", "name email phone avatar")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Patient.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Patients retrieved successfully",
  );
});

export const getPatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id).populate(
    "user",
    "name email phone avatar",
  );
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  sendResponse(res, 200, patient, "Patient retrieved successfully");
});

export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
    allergies,
    chronicDiseases,
  } = req.body;

  const patient = await Patient.findByIdAndUpdate(
    id,
    {
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      chronicDiseases,
    },
    { new: true },
  ).populate("user", "name email phone avatar");

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  sendResponse(res, 200, patient, "Patient updated successfully");
});

export const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  sendResponse(res, 200, {}, "Patient deleted successfully");
});

export const getPatientByUserId = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const patient = await Patient.findOne({ user: userId }).populate(
    "user",
    "name email phone avatar",
  );
  if (!patient) {
    throw new AppError("Patient profile not found", 404);
  }

  sendResponse(res, 200, patient, "Patient profile retrieved successfully");
});
