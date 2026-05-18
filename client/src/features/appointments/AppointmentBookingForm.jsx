import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { format } from "date-fns";

export function AppointmentBookingForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    type: "consultation",
    reason: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.date]);

  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients?limit=100");
      setPatients(response.data.data.patients);
    } catch (error) {
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctors?limit=100");
      setDoctors(response.data.data.doctors);
    } catch (error) {
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get(
        `/doctors/availability/${formData.doctorId}/${formData.date}`,
      );
      setAvailableSlots(response.data.data.slots || []);
    } catch (error) {
      setAvailableSlots([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "doctorId" || name === "date" ? { timeSlot: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/appointments", formData);
      navigate("/appointments");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Book Appointment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-card rounded-lg shadow-md p-6 space-y-6"
      >
        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Patient *
          </label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.user?.name} ({patient.patientId})
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Doctor *
          </label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.user?.name} ({doctor.specialization})
              </option>
            ))}
          </select>
        </div>

        {/* Appointment Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={format(new Date(), "yyyy-MM-dd")}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Time Slot *
          </label>
          {formData.doctorId && formData.date ? (
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Time</option>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))
              ) : (
                <option disabled>No slots available</option>
              )}
            </select>
          ) : (
            <input
              type="text"
              disabled
              placeholder="Select doctor and date first"
              className="w-full px-4 py-2 border border-input rounded-lg bg-muted cursor-not-allowed"
            />
          )}
        </div>

        {/* Appointment Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Appointment Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="consultation">Consultation</option>
            <option value="checkup">Checkup</option>
            <option value="follow-up">Follow-up</option>
            <option value="procedure">Procedure</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Reason for Visit *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Describe reason for appointment"
            required
            rows="3"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/appointments")}
            className="flex-1 px-6 py-2 border border-input rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentBookingForm;
