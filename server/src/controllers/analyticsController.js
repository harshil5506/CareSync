import { sendResponse } from "../utils/apiResponse.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Bill from "../models/Bill.js";
import Department from "../models/Department.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalPatients = await Patient.countDocuments();
  const totalDoctors = await Doctor.countDocuments();
  const totalAppointments = await Appointment.countDocuments();
  const totalDepartments = await Department.countDocuments();

  const revenue = await Bill.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  const pendingBills = await Bill.countDocuments({ status: "pending" });
  const completedAppointments = await Appointment.countDocuments({
    status: "completed",
  });

  sendResponse(
    res,
    200,
    {
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalDepartments,
      revenue: revenue[0]?.total || 0,
      pendingBills,
      completedAppointments,
    },
    "Dashboard stats retrieved successfully",
  );
});

export const getAppointmentTrend = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const trend = await Appointment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  sendResponse(
    res,
    200,
    trend,
    "Appointment trend retrieved successfully",
  );
});

export const getDepartmentDistribution = asyncHandler(async (req, res) => {
  const distribution = await Appointment.aggregate([
    {
      $group: {
        _id: "$doctor",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    {
      $unwind: "$doctor",
    },
    {
      $group: {
        _id: "$doctor.department",
        count: { $sum: "$count" },
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "_id",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: "$department",
    },
    {
      $project: {
        name: "$department.name",
        value: "$count",
        _id: 0,
      },
    },
  ]);

  sendResponse(
    res,
    200,
    distribution,
    "Department distribution retrieved successfully",
  );
});

export const getRecentAppointments = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const appointments = await Appointment.find()
    .populate("patient", "patientId user")
    .populate("doctor", "user specialization")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  sendResponse(
    res,
    200,
    appointments,
    "Recent appointments retrieved successfully",
  );
});

export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - parseInt(months));

  const revenue = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: "paid",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        total: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const byStatus = await Bill.aggregate([
    {
      $group: {
        _id: "$status",
        total: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  sendResponse(
    res,
    200,
    { monthly: revenue, byStatus },
    "Revenue analytics retrieved successfully",
  );
});

export const getDoctorPerformance = asyncHandler(async (req, res) => {
  const performance = await Appointment.aggregate([
    {
      $group: {
        _id: "$doctor",
        totalAppointments: { $sum: 1 },
        completedAppointments: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        avgRating: { $avg: "$rating" },
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    {
      $unwind: "$doctor",
    },
    {
      $project: {
        doctorName: "$doctor.user.name",
        specialization: "$doctor.specialization",
        totalAppointments: 1,
        completedAppointments: 1,
        completionRate: {
          $multiply: [
            { $divide: ["$completedAppointments", "$totalAppointments"] },
            100,
          ],
        },
        avgRating: { $ifNull: ["$avgRating", 0] },
        _id: 0,
      },
    },
    { $sort: { totalAppointments: -1 } },
  ]);

  sendResponse(
    res,
    200,
    performance,
    "Doctor performance retrieved successfully",
  );
});
