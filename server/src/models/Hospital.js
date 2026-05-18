import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Hospital email is required"],
    },
    phone: {
      type: String,
      required: [true, "Hospital phone is required"],
    },
    address: {
      type: String,
      required: [true, "Hospital address is required"],
    },
    city: String,
    state: String,
    zipCode: String,
    country: String,
    description: String,
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    totalDoctors: {
      type: Number,
      default: 0,
    },
    totalDepartments: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Indexes
hospitalSchema.index({ name: 1 });
hospitalSchema.index({ status: 1 });
hospitalSchema.index({ city: 1 });

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
