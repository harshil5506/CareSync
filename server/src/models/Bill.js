import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    billId: {
      type: String,
      unique: true,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: Number,
    paidAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "insurance", "online", "pending"],
    },
    dueDate: Date,
    paymentDate: Date,
  },
  { timestamps: true },
);

// Indexes
billSchema.index({ billId: 1 });
billSchema.index({ patient: 1 });
billSchema.index({ status: 1 });

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
