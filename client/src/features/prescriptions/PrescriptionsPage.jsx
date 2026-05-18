import { useState, useEffect } from "react";
import { Plus, Search, Download, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { toast } from "sonner";

export function PrescriptionsPage() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPrescriptions = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await api.get("/prescriptions", { params });
      setPrescriptions(response.data.prescriptions);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPrescriptions(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        await api.delete(`/prescriptions/${id}`);
        toast.success("Prescription deleted successfully");
        fetchPrescriptions();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete prescription");
      }
    }
  };

  const columns = [
    {
      header: "Prescription ID",
      accessor: "prescriptionId",
    },
    {
      header: "Diagnosis",
      accessor: "diagnosis",
    },
    {
      header: "Patient",
      accessor: (row) => row.patient?.user?.name || "N/A",
    },
    {
      header: "Doctor",
      accessor: (row) => row.doctor?.user?.name || "N/A",
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : row.status === "completed"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/prescriptions/${row._id}`)}
            className="text-blue-600 hover:text-blue-800"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground mt-1">
            View and manage prescriptions
          </p>
        </div>
        <button
          onClick={() => navigate("/prescriptions/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus size={20} />
          New Prescription
        </button>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg">
            <Search size={20} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by diagnosis or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
          </div>
        </form>

        {loading ? (
          <LoadingSkeleton count={5} />
        ) : prescriptions.length === 0 ? (
          <EmptyState
            title="No prescriptions found"
            description="Start by creating a new prescription"
            icon="💊"
          />
        ) : (
          <>
            <DataTable columns={columns} data={prescriptions} />
            {pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => fetchPrescriptions(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-input rounded hover:bg-muted disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => fetchPrescriptions(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-input rounded hover:bg-muted disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PrescriptionsPage;
