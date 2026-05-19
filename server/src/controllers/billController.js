import { sendResponse } from "../utils/apiResponse.js";
import Bill from "../models/Bill.js";
import { generateId } from "../utils/generateId.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createBill = asyncHandler(async (req, res) => {
  const {
    patient,
    appointment,
    items,
    subtotal,
    tax = 0,
    discount = 0,
    totalAmount,
    dueDate,
    paymentMethod,
  } = req.body;

  const billId = generateId("bill");
  const bill = await Bill.create({
    billId,
    patient,
    appointment,
    items,
    subtotal,
    tax,
    discount,
    totalAmount,
    dueDate,
    paymentMethod,
  });

  await bill.populate([
    { path: "patient", select: "patientId user" },
    { path: "appointment" },
  ]);

  sendResponse(res, 201, bill, "Bill created successfully");
});

export const getBills = asyncHandler(async (req, res) => {
  const { search, patient, status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    query.$or = [{ billId: { $regex: search, $options: "i" } }];
  }
  if (patient) query.patient = patient;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const bills = await Bill.find(query)
    .populate([
      { path: "patient", select: "patientId user" },
      { path: "appointment" },
    ])
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Bill.countDocuments(query);

  sendResponse(
    res,
    200,
    {
      bills,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Bills retrieved successfully",
  );
});

export const getBillById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await Bill.findById(id).populate([
    { path: "patient", select: "patientId user" },
    { path: "appointment" },
  ]);

  if (!bill) {
    throw new AppError("Bill not found", 404);
  }

  sendResponse(res, 200, bill, "Bill retrieved successfully");
});

export const updateBill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    items,
    subtotal,
    tax,
    discount,
    totalAmount,
    paidAmount,
    status,
    paymentMethod,
    dueDate,
    paymentDate,
  } = req.body;

  const bill = await Bill.findByIdAndUpdate(
    id,
    {
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      paidAmount,
      status,
      paymentMethod,
      dueDate,
      paymentDate,
    },
    { new: true },
  ).populate([
    { path: "patient", select: "patientId user" },
    { path: "appointment" },
  ]);

  if (!bill) {
    throw new AppError("Bill not found", 404);
  }

  sendResponse(res, 200, bill, "Bill updated successfully");
});

export const deleteBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await Bill.findByIdAndDelete(id);
  if (!bill) {
    throw new AppError("Bill not found", 404);
  }

  sendResponse(res, 200, {}, "Bill deleted successfully");
});

export const getBillsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const bills = await Bill.find({ patient: patientId })
    .populate([
      { path: "patient", select: "patientId user" },
      { path: "appointment" },
    ])
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Bill.countDocuments({ patient: patientId });

  sendResponse(
    res,
    200,
    {
      bills,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    },
    "Bills retrieved successfully",
  );
});

export const recordPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paidAmount, paymentMethod, paymentDate } = req.body;

  const bill = await Bill.findById(id);
  if (!bill) {
    throw new AppError("Bill not found", 404);
  }

  const newPaidAmount = (bill.paidAmount || 0) + paidAmount;
  let status = "pending";

  if (newPaidAmount >= bill.totalAmount) {
    status = "paid";
  } else if (newPaidAmount > 0) {
    status = "partial";
  }

  const updatedBill = await Bill.findByIdAndUpdate(
    id,
    {
      paidAmount: newPaidAmount,
      status,
      paymentMethod,
      paymentDate: paymentDate || new Date(),
    },
    { new: true },
  ).populate([
    { path: "patient", select: "patientId user" },
    { path: "appointment" },
  ]);

  sendResponse(res, 200, updatedBill, "Payment recorded successfully");
});

export const getBillStats = asyncHandler(async (req, res) => {
  const stats = await Bill.aggregate([
    {
      $facet: {
        totalRevenue: [
          { $match: { status: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ],
        pendingBills: [{ $match: { status: "pending" } }, { $count: "count" }],
        partialBills: [{ $match: { status: "partial" } }, { $count: "count" }],
        overdueBills: [{ $match: { status: "overdue" } }, { $count: "count" }],
      },
    },
  ]);

  sendResponse(res, 200, stats[0], "Bill statistics retrieved successfully");
});
