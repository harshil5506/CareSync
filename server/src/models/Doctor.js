import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    qualification: String,
    experience: {
      type: Number,
      default: 0,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    fee: {
      type: Number,
      default: 500,
    },
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: String,
        endTime: String,
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "onLeave"],
      default: "active",
    },
    bio: String,
    certifications: [String],
  },
  { timestamps: true },
);

// Indexes
doctorSchema.index({ user: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ department: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
