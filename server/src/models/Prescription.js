import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: String,
      unique: true,
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    diagnosis: String,
    medicines: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      },
    ],
    instructions: String,
    followUpDate: Date,
    vitals: {
      bp: String,
      pulse: String,
      temperature: String,
      weight: String,
      height: String,
    },
    status: {
      type: String,
      enum: ["active", "completed", "discontinued"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Indexes
prescriptionSchema.index({ prescriptionId: 1 });
prescriptionSchema.index({ patient: 1 });
prescriptionSchema.index({ doctor: 1 });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
