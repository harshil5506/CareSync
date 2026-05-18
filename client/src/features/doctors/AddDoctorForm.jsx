import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export function AddDoctorForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    specialization: "",
    qualification: "",
    experience: "",
    departmentId: "",
    fee: "",
    bio: "",
    certifications: "",
  });

  const specializations = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "General Medicine",
    "Surgery",
    "Pediatrics",
    "Dermatology",
    "Psychiatry",
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments?limit=100");
      setDepartments(response.data.data.departments);
    } catch (error) {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/doctors", formData);
      navigate("/doctors");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Add New Doctor
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-card rounded-lg shadow-md p-6 space-y-6"
      >
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
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Specialization *
          </label>
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Qualification *
          </label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="e.g., MBBS, MD"
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Experience (Years) *
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Enter years of experience"
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Department *
          </label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fee */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Consultation Fee (₹) *
          </label>
          <input
            type="number"
            name="fee"
            value={formData.fee}
            onChange={handleChange}
            placeholder="Enter consultation fee"
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Enter doctor bio/description"
            rows="3"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Certifications
          </label>
          <textarea
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            placeholder="List certifications (comma separated)"
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
            {loading ? "Creating..." : "Create Doctor"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="flex-1 px-6 py-2 border border-input rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDoctorForm;
