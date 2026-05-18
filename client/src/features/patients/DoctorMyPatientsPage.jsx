import { useState, useEffect } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import SearchFilter from "@/components/common/SearchFilter";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import AddPatientModal from "./AddPatientModal";

export function DoctorMyPatientsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useState({ query: "", filters: {} });
  const [showAddModal, setShowAddModal] = useState(false);

  const filters = [
    {
      key: "gender",
      label: "Gender",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
    },
  ];

  const fetchPatients = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchParams.query || undefined,
        ...searchParams.filters,
      };

      const response = await api.get("/patients", { params });
      setPatients(response.data.data.patients);
      setPagination(response.data.data.pagination);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(1);
  }, [searchParams]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this patient?"))
      return;

    try {
      await api.delete(`/patients/${id}`);
      fetchPatients(1);
    } catch (error) {
    }
  };

  const handlePatientAdded = () => {
    setShowAddModal(false);
    fetchPatients(1);
  };

  const columns = [
    { key: "patientId", label: "Patient ID" },
    {
      key: "user",
      label: "Name",
      render: (value) => value?.name || "N/A",
    },
    {
      key: "user",
      label: "Email",
      render: (value) => value?.email || "N/A",
    },
    { key: "gender", label: "Gender" },
    { key: "bloodGroup", label: "Blood Group" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/patients/${row._id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Eye size={16} />
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
        <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      <SearchFilter
        onSearch={setSearchParams}
        placeholder="Search your patients..."
        filters={filters}
      />

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : patients.length === 0 ? (
        <EmptyState
          title="No Patients Found"
          description="You don't have any patients yet. Add your first patient to get started."
          action={{ label: "Add Patient" }}
        />
      ) : (
        <>
          <DataTable columns={columns} data={patients} />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {patients.length} of {pagination.total} patients
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchPatients(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchPatients(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handlePatientAdded}
      />
    </div>
  );
}

export default DoctorMyPatientsPage;
