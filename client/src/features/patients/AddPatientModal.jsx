import { useState } from "react";
import { X } from "lucide-react";
import api from "@/services/api";

export function AddPatientModal({ isOpen, onClose, onSuccess }) {
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
      setFormData({
        userId: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        address: "",
        emergencyContact: "",
        allergies: "",
        chronicDiseases: "",
      });
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating patient");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-border bg-white dark:bg-card">
          <h2 className="text-2xl font-bold text-foreground">
            Add New Patient
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User ID */}
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
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
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
                placeholder="Phone number"
                required
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
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
              rows="2"
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
              placeholder="List any allergies"
              rows="1"
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
              placeholder="List any chronic diseases"
              rows="1"
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Creating..." : "Create Patient"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatientModal;
