import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import Appointment from "../models/Appointment.js";
import { generateId } from "../utils/generateId.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});

    console.log("📦 Creating departments...");
    const departments = await Department.create([
      {
        name: "General Medicine",
        description: "General medical services and consultations",
      },
      {
        name: "Cardiology",
        description: "Heart and cardiovascular disease treatment",
      },
      {
        name: "Pediatrics",
        description: "Child healthcare and pediatric services",
      },
      {
        name: "Orthopedics",
        description: "Bone, joint and muscle treatment",
      },
      {
        name: "Dentistry",
        description: "Dental care and treatment",
      },
    ]);

    console.log("👨‍⚕️ Creating admin users...");
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@caresync.com",
      password: adminPassword,
      role: "admin",
      phone: "9876543210",
    });

    console.log("👨‍⚕️ Creating doctors...");
    const doctorPassword = await bcrypt.hash("Doctor@123", 10);
    const doctorUsers = await User.create([
      {
        name: "Dr. Rajesh Kumar",
        email: "doctor1@caresync.com",
        password: doctorPassword,
        role: "doctor",
        phone: "9876543211",
      },
      {
        name: "Dr. Priya Singh",
        email: "doctor2@caresync.com",
        password: doctorPassword,
        role: "doctor",
        phone: "9876543212",
      },
      {
        name: "Dr. Amit Patel",
        email: "doctor3@caresync.com",
        password: doctorPassword,
        role: "doctor",
        phone: "9876543213",
      },
      {
        name: "Dr. Ananya Desai",
        email: "doctor4@caresync.com",
        password: doctorPassword,
        role: "doctor",
        phone: "9876543214",
      },
    ]);

    console.log("🏥 Creating doctor profiles...");
    const doctors = await Doctor.create([
      {
        user: doctorUsers[0]._id,
        specialization: "General Physician",
        department: departments[0]._id,
        experience: 10,
        fee: 500,
        qualification: "MBBS, MD",
      },
      {
        user: doctorUsers[1]._id,
        specialization: "Cardiologist",
        department: departments[1]._id,
        experience: 8,
        fee: 800,
        qualification: "MBBS, MD (Cardiology)",
      },
      {
        user: doctorUsers[2]._id,
        specialization: "Pediatrician",
        department: departments[2]._id,
        experience: 6,
        fee: 600,
        qualification: "MBBS, MD (Pediatrics)",
      },
      {
        user: doctorUsers[3]._id,
        specialization: "Orthopedic Surgeon",
        department: departments[3]._id,
        experience: 12,
        fee: 1000,
        qualification: "MBBS, MS (Orthopedics)",
      },
    ]);

    console.log("👥 Creating patient users...");
    const patientPassword = await bcrypt.hash("Patient@123", 10);
    const patientUsers = await User.create(
      Array.from({ length: 20 }, (_, i) => ({
        name: `Patient ${i + 1}`,
        email: `patient${i + 1}@caresync.com`,
        password: patientPassword,
        role: "patient",
        phone: `987654${String(i + 1).padStart(4, "0")}`,
      })),
    );

    console.log("🏥 Creating patient profiles...");
    const patients = await Patient.create(
      patientUsers.map((user, i) => ({
        patientId: generateId("patient"),
        user: user._id,
        dateOfBirth: new Date("1990-01-01"),
        gender: i % 2 === 0 ? "male" : "female",
        bloodGroup: ["A+", "B+", "O+", "AB+"][i % 4],
        address: {
          street: `${i + 1} Main Street`,
          city: "Mumbai",
          state: "Maharashtra",
          zip: "400001",
        },
        emergencyContact: {
          name: `Emergency Contact ${i + 1}`,
          relation: "Family",
          phone: `999999${String(i + 1).padStart(4, "0")}`,
        },
        allergies: ["Penicillin"],
        chronicDiseases: ["Hypertension"],
      })),
    );

    console.log("📅 Creating appointments...");
    const appointments = await Appointment.create(
      Array.from({ length: 15 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + (i % 7));

        return {
          appointmentId: generateId("appointment"),
          patient: patients[i]._id,
          doctor: doctors[i % doctors.length]._id,
          date,
          timeSlot: {
            start: `${10 + (i % 8)}:00`,
            end: `${10 + (i % 8)}:30`,
          },
          type: ["consultation", "follow-up", "routine"][i % 3],
          status: ["pending", "confirmed", "completed"][i % 3],
          reason: "General checkup",
        };
      }),
    );

    console.log("✅ Database seeded successfully!");
    console.log(`

🎯 Created:
- 1 Admin
- 4 Doctors
- 20 Patients
- 5 Departments
- 15 Appointments

📧 Test Credentials:
- Admin: admin@caresync.com / Admin@123
- Doctor: doctor1@caresync.com / Doctor@123
- Patient: patient1@caresync.com / Patient@123
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
