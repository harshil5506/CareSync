import { sendResponse } from "../utils/apiResponse.js";
import Hospital from "../models/Hospital.js";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import { generateId } from "../utils/generateId.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createHospital = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    description,
  } = req.body;

  const hospital = await Hospital.create({
    name,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    description,
  });

  sendResponse(res, 201, hospital, "Hospital created successfully");
});

export const getHospitals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const hospitals = await Hospital.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Hospital.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      hospitals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Hospitals retrieved successfully",
  );
});

export const getHospitalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await Hospital.findById(id).populate("departments");

  if (!hospital) {
    throw new AppError("Hospital not found", 404);
  }

  sendResponse(res, 200, hospital, "Hospital retrieved successfully");
});

export const getHospitalHierarchy = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({ status: "active" }).populate({
    path: "departments",
    populate: {
      path: "doctors",
      select: "specialization user",
      populate: {
        path: "user",
        select: "name email phone",
      },
    },
  });

  const hierarchyData = hospitals.map((hospital) => ({
    _id: hospital._id,
    name: hospital.name,
    email: hospital.email,
    phone: hospital.phone,
    address: hospital.address,
    city: hospital.city,
    state: hospital.state,
    country: hospital.country,
    totalDepartments: hospital.departments.length,
    totalDoctors: hospital.departments.reduce(
      (sum, dept) => sum + dept.doctors.length,
      0,
    ),
    departments: hospital.departments.map((dept) => ({
      _id: dept._id,
      name: dept.name,
      description: dept.description,
      totalDoctors: dept.doctors.length,
      doctors: dept.doctors,
    })),
  }));

  sendResponse(
    res,
    200,
    { hierarchyData },
    "Hospital hierarchy retrieved successfully",
  );
});

export const getHospitalStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await Hospital.findById(id).populate("departments");
  if (!hospital) {
    throw new AppError("Hospital not found", 404);
  }

  // Get all doctors in this hospital
  const doctors = await Doctor.find({
    department: { $in: hospital.departments },
  }).populate("user");

  // Get all appointments for doctors in this hospital
  const appointments = await Appointment.find({
    doctor: { $in: doctors.map((d) => d._id) },
  })
    .populate("doctor")
    .populate("patient");

  // Calculate stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed",
  ).length;
  const completionRate =
    totalAppointments > 0
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;

  // Calculate revenue (assuming fee from doctor profile)
  let totalRevenue = 0;
  const departmentStats = [];
  const doctorStats = [];

  for (const dept of hospital.departments) {
    const deptDoctors = doctors.filter(
      (d) => d.department.toString() === dept._id.toString(),
    );
    const deptAppointments = appointments.filter((a) =>
      deptDoctors.some((d) => d._id.toString() === a.doctor._id.toString()),
    );

    const deptRevenue = deptAppointments
      .filter((a) => a.status === "completed")
      .reduce((sum, a) => {
        const doctor = deptDoctors.find(
          (d) => d._id.toString() === a.doctor._id.toString(),
        );
        return sum + (doctor?.fee || 0);
      }, 0);

    totalRevenue += deptRevenue;

    departmentStats.push({
      _id: dept._id,
      name: dept.name,
      doctorCount: deptDoctors.length,
      appointmentCount: deptAppointments.length,
      totalRevenue: deptRevenue,
    });
  }

  // Doctor stats
  for (const doctor of doctors) {
    const docAppointments = appointments.filter(
      (a) => a.doctor._id.toString() === doctor._id.toString(),
    );
    const docRevenue = docAppointments
      .filter((a) => a.status === "completed")
      .reduce((sum) => sum + (doctor.fee || 0), 0);

    if (docRevenue > 0) {
      doctorStats.push({
        _id: doctor._id,
        doctorName: doctor.user?.name || "Unknown",
        appointmentCount: docAppointments.length,
        completedCount: docAppointments.filter(
          (a) => a.status === "completed",
        ).length,
        totalRevenue: docRevenue,
      });
    }
  }

  // Sort doctor stats by revenue
  doctorStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

  sendResponse(
    res,
    200,
    {
      totalAppointments,
      completedAppointments,
      completionRate,
      totalDoctors: doctors.length,
      departmentCount: hospital.departments.length,
      totalRevenue,
      departmentStats,
      doctorStats,
    },
    "Hospital statistics retrieved successfully",
  );
});

export const updateHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const hospital = await Hospital.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!hospital) {
    throw new AppError("Hospital not found", 404);
  }

  sendResponse(res, 200, hospital, "Hospital updated successfully");
});

export const deleteHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await Hospital.findByIdAndDelete(id);

  if (!hospital) {
    throw new AppError("Hospital not found", 404);
  }

  // Delete all departments associated with this hospital
  await Department.deleteMany({ hospital: id });

  sendResponse(res, 200, hospital, "Hospital deleted successfully");
});
