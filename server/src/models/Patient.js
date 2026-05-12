import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
    allergies: [String],
    chronicDiseases: [String],
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        notes: String,
      },
    ],
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: Date,
      },
    ],
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
  },
  { timestamps: true },
);

// Indexes
patientSchema.index({ patientId: 1 });
patientSchema.index({ user: 1 });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
