import { sendResponse } from "../utils/apiResponse.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { generateId } from "../utils/generateId.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createAppointment = asyncHandler(async (req, res) => {
  const { patientId, doctorId, date, timeSlot, type, reason } = req.body;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date,
    timeSlot,
    status: { $nin: ["cancelled", "completed"] },
  });

  if (existingAppointment) {
    throw new AppError("Time slot already booked", 400);
  }

  const appointmentOnDate = await Appointment.countDocuments({
    doctor: doctorId,
    date,
    status: { $nin: ["cancelled", "completed"] },
  });

  const appointmentId = generateId("appointment");
  const appointment = await Appointment.create({
    appointmentId,
    patient: patientId,
    doctor: doctorId,
    date,
    timeSlot,
    type,
    reason,
    status: "pending",
    queueNumber: appointmentOnDate + 1,
  });

  await appointment.populate("patient", "-password");
  await appointment.populate("doctor", "-password");

  sendResponse(res, 201, appointment, "Appointment created successfully");
});

export const getAppointments = asyncHandler(async (req, res) => {
  const {
    search,
    status,
    doctorId,
    patientId,
    date,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  // If patient user, only show their own appointments
  if (req.user.role === "patient") {
    const patientProfile = await Patient.findOne({ user: req.user._id });
    if (patientProfile) {
      query.patient = patientProfile._id;
    }
  }

  if (search) {
    const patients = await Patient.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
      ],
    });
    query.patient = { $in: patients.map((p) => p._id) };
  }

  if (status) query.status = status;
  if (doctorId) query.doctor = doctorId;
  if (patientId) query.patient = patientId;
  if (date) query.date = date;

  const skip = (page - 1) * limit;
  const appointments = await Appointment.find(query)
    .populate("patient", "name patientId gender bloodGroup user")
    .populate("doctor", "specialization user fee")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name email phone",
      },
    })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ date: -1, timeSlot: 1 });

  const total = await Appointment.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Appointments retrieved successfully",
  );
});

export const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id)
    .populate("patient", "name patientId gender bloodGroup")
    .populate("doctor", "specialization user")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name email phone",
      },
    });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  sendResponse(res, 200, appointment, "Appointment retrieved successfully");
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "in-progress",
    "completed",
    "cancelled",
    "no-show",
  ];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid appointment status", 400);
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status, notes },
    { new: true },
  )
    .populate("patient", "name patientId")
    .populate("doctor", "specialization user");

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  sendResponse(
    res,
    200,
    appointment,
    "Appointment status updated successfully",
  );
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status: "cancelled", notes: reason },
    { new: true },
  );

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  sendResponse(res, 200, appointment, "Appointment cancelled successfully");
});

export const getAppointmentsByPatientId = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const appointments = await Appointment.find({ patient: patientId })
    .populate("doctor", "specialization user")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name phone",
      },
    })
    .sort({ date: -1 });

  sendResponse(
    res,
    200,
    appointments,
    "Patient appointments retrieved successfully",
  );
});

export const getAppointmentsByDoctorId = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  const query = { doctor: doctorId };
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const appointments = await Appointment.find(query)
    .populate("patient", "name patientId gender bloodGroup")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ date: -1, timeSlot: 1 });

  const total = await Appointment.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Doctor appointments retrieved successfully",
  );
});

export const getTodayAppointments = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await Appointment.find({
    date: { $gte: today, $lt: tomorrow },
    status: { $in: ["scheduled", "in-progress"] },
  })
    .populate("patient", "name patientId gender")
    .populate("doctor", "specialization user")
    .populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .sort({ timeSlot: 1 });

  sendResponse(
    res,
    200,
    appointments,
    "Today appointments retrieved successfully",
  );
});
