import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export function AddPatientForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
    allergies: "",
    chronicDiseases: "",
  });

  const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/patients", formData);
      navigate("/patients");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Add New Patient
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-card rounded-lg shadow-md p-6 space-y-6"
      >
        {/* User ID Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            User ID *
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="Enter user ID"
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Blood Group *
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address"
            required
            rows="3"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Emergency Contact *
          </label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Enter emergency contact number"
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Allergies
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="List any allergies (comma separated)"
            rows="2"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Chronic Diseases */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Chronic Diseases
          </label>
          <textarea
            name="chronicDiseases"
            value={formData.chronicDiseases}
            onChange={handleChange}
            placeholder="List any chronic diseases (comma separated)"
            rows="2"
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
            {loading ? "Creating..." : "Create Patient"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="flex-1 px-6 py-2 border border-input rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPatientForm;
