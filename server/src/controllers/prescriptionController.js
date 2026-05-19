import { sendResponse } from "../utils/apiResponse.js";
import Prescription from "../models/Prescription.js";
import { generateId } from "../utils/generateId.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createPrescription = asyncHandler(async (req, res) => {
  const {
    appointment,
    patient,
    doctor,
    diagnosis,
    medicines,
    instructions,
    followUpDate,
    vitals,
  } = req.body;

  const prescriptionId = generateId("prescription");
  const prescription = await Prescription.create({
    prescriptionId,
    appointment,
    patient,
    doctor,
    diagnosis,
    medicines,
    instructions,
    followUpDate,
    vitals,
  });

  await prescription.populate([
    { path: "patient", select: "patientId user" },
    { path: "doctor", select: "doctorId user" },
    { path: "appointment" },
  ]);

  sendResponse(res, 201, prescription, "Prescription created successfully");
});

export const getPrescriptions = asyncHandler(async (req, res) => {
  const { search, patient, doctor, status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { diagnosis: { $regex: search, $options: "i" } },
      { prescriptionId: { $regex: search, $options: "i" } },
    ];
  }
  if (patient) query.patient = patient;
  if (doctor) query.doctor = doctor;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const prescriptions = await Prescription.find(query)
    .populate([
      { path: "patient", select: "patientId user" },
      { path: "doctor", select: "doctorId user" },
      { path: "appointment" },
    ])
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Prescription.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      prescriptions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Prescriptions retrieved successfully",
  );
});

export const getPrescriptionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const prescription = await Prescription.findById(id).populate([
    { path: "patient", select: "patientId user" },
    { path: "doctor", select: "doctorId user" },
    { path: "appointment" },
  ]);

  if (!prescription) {
    throw new AppError("Prescription not found", 404);
  }

  sendResponse(res, 200, prescription, "Prescription retrieved successfully");
});

export const updatePrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { diagnosis, medicines, instructions, followUpDate, vitals, status } =
    req.body;

  const prescription = await Prescription.findByIdAndUpdate(
    id,
    {
      diagnosis,
      medicines,
      instructions,
      followUpDate,
      vitals,
      status,
    },
    { new: true },
  ).populate([
    { path: "patient", select: "patientId user" },
    { path: "doctor", select: "doctorId user" },
    { path: "appointment" },
  ]);

  if (!prescription) {
    throw new AppError("Prescription not found", 404);
  }

  sendResponse(res, 200, prescription, "Prescription updated successfully");
});

export const deletePrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const prescription = await Prescription.findByIdAndDelete(id);
  if (!prescription) {
    throw new AppError("Prescription not found", 404);
  }

  sendResponse(res, 200, {}, "Prescription deleted successfully");
});

export const getPrescriptionsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const prescriptions = await Prescription.find({ patient: patientId })
    .populate([
      { path: "patient", select: "patientId user" },
      { path: "doctor", select: "doctorId user" },
      { path: "appointment" },
    ])
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Prescription.countDocuments({ patient: patientId });

  sendResponse(
    res,
    200,
    {
      prescriptions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Prescriptions retrieved successfully",
  );
});

export const getPrescriptionsByDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const prescriptions = await Prescription.find({ doctor: doctorId })
    .populate([
      { path: "patient", select: "patientId user" },
      { path: "doctor", select: "doctorId user" },
      { path: "appointment" },
    ])
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Prescription.countDocuments({ doctor: doctorId });

  sendResponse(
    res,
    200,
    {
      prescriptions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Prescriptions retrieved successfully",
  );
});
