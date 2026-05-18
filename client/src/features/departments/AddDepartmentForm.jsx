import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export function AddDepartmentForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/departments", formData);
      navigate("/departments");
    } catch (error) {
      console.error("Error creating department:", error);
      alert(error.response?.data?.message || "Error creating department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Add New Department
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-card rounded-lg shadow-md p-6 space-y-6"
      >
        {/* Department Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Department Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Cardiology"
            required
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter department description"
            rows="4"
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Department Head ID */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Department Head ID (Optional)
          </label>
          <input
            type="text"
            name="headId"
            value={formData.headId}
            onChange={handleChange}
            placeholder="Enter head user ID"
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
            {loading ? "Creating..." : "Create Department"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/departments")}
            className="flex-1 px-6 py-2 border border-input rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDepartmentForm;
