import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import SearchFilter from "@/components/common/SearchFilter";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";

export function DoctorsListPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useState({ query: "", filters: {} });

  const filters = [
    {
      key: "specialization",
      label: "Specialization",
      options: [
        { label: "Cardiology", value: "Cardiology" },
        { label: "Neurology", value: "Neurology" },
        { label: "Orthopedics", value: "Orthopedics" },
        { label: "General Medicine", value: "General Medicine" },
        { label: "Surgery", value: "Surgery" },
      ],
    },
  ];

  const fetchDoctors = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchParams.query || undefined,
        ...searchParams.filters,
      };

      const response = await api.get("/doctors", { params });
      setDoctors(response.data.data.doctors);
      setPagination(response.data.data.pagination);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(1);
  }, [searchParams]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await api.delete(`/doctors/${id}`);
      fetchDoctors(1);
    } catch (error) {
    }
  };

  const columns = [
    {
      key: "user",
      label: "Name",
      render: (value) => value?.name || "N/A",
    },
    { key: "specialization", label: "Specialization" },
    {
      key: "department",
      label: "Department",
      render: (value) => value?.name || "N/A",
    },
    { key: "experience", label: "Experience (Years)" },
    {
      key: "fee",
      label: "Fee",
      render: (value) => `₹${value || 0}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/doctors/${row._id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => navigate(`/doctors/${row._id}/edit`)}
            className="p-2 text-green-600 hover:bg-green-50 rounded"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Doctors</h1>
        <button
          onClick={() => navigate("/doctors/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus size={20} />
          Add Doctor
        </button>
      </div>

      <SearchFilter
        onSearch={setSearchParams}
        placeholder="Search doctors..."
        filters={filters}
      />

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No Doctors Found"
          description="There are no doctors yet. Create your first doctor to get started."
          action={{ label: "Add Doctor" }}
        />
      ) : (
        <>
          <DataTable columns={columns} data={doctors} />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {doctors.length} of {pagination.total} doctors
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchDoctors(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchDoctors(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DoctorsListPage;
