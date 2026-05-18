import { sendResponse } from "../utils/apiResponse.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, headId } = req.body;

  const existingDepartment = await Department.findOne({ name });
  if (existingDepartment) {
    throw new AppError("Department already exists", 400);
  }

  if (headId) {
    const head = await User.findById(headId);
    if (!head) {
      throw new AppError("Department head not found", 404);
    }
  }

  const department = await Department.create({
    name,
    description,
    head: headId,
    status: "active",
  });

  await department.populate("head", "name email phone");

  sendResponse(res, 201, department, "Department created successfully");
});

export const getDepartments = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const departments = await Department.find(query)
    .populate("head", "name email phone")
    .populate("doctors")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Department.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      departments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Departments retrieved successfully",
  );
});

export const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findById(id)
    .populate("head", "name email phone")
    .populate("doctors");

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  sendResponse(res, 200, department, "Department retrieved successfully");
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, headId, status } = req.body;

  if (name) {
    const existingDepartment = await Department.findOne({
      name,
      _id: { $ne: id },
    });
    if (existingDepartment) {
      throw new AppError("Department name already exists", 400);
    }
  }

  const department = await Department.findByIdAndUpdate(
    id,
    {
      name,
      description,
      head: headId,
      status,
    },
    { new: true },
  )
    .populate("head", "name email phone")
    .populate("doctors");

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  sendResponse(res, 200, department, "Department updated successfully");
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findByIdAndDelete(id);
  if (!department) {
    throw new AppError("Department not found", 404);
  }

  sendResponse(res, 200, {}, "Department deleted successfully");
});

export const getDepartmentDoctors = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findById(id).populate("doctors");

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  sendResponse(
    res,
    200,
    department.doctors,
    "Department doctors retrieved successfully",
  );
});
