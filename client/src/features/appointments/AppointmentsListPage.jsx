import { useState, useEffect } from "react";
import { Plus, Calendar, Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import SearchFilter from "@/components/common/SearchFilter";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import { format } from "date-fns";

export function AppointmentsListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useState({ query: "", filters: {} });

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "In Progress", value: "in-progress" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "No Show", value: "no-show" },
      ],
    },
  ];

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchParams.query || undefined,
        ...searchParams.filters,
      };

      const response = await api.get("/appointments", { params });
      console.log("API Response:", response.data);

      // Handle both response formats
      const data = response.data.data || response.data;
      setAppointments(data.appointments || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(1);
  }, [searchParams]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      await api.put(`/appointments/${id}/cancel`, {
        reason: "Cancelled by user",
      });
      fetchAppointments(1);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      "in-progress": "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-sm font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  const columns = [
    {
      key: "appointmentId",
      label: "Appointment ID",
    },
    {
      key: "patient",
      label: "Patient",
      render: (value) => value?.name || "N/A",
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (value) => value?.user?.name || "N/A",
    },
    {
      key: "date",
      label: "Date",
      render: (value) => value ? format(new Date(value), "MMM dd, yyyy") : "N/A",
    },
    {
      key: "timeSlot",
      label: "Time",
      render: (value) => value ? `${value.start} - ${value.end}` : "N/A"
    },
    {
      key: "status",
      label: "Status",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "queueNumber",
      label: "Queue #",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/appointments/${row._id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Eye size={16} />
          </button>
          {row.status === "pending" && (
            <button
              onClick={() => handleCancel(row._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          {user?.role === "patient" ? "My Appointments" : "Appointments"}
        </h1>
        {user?.role !== "patient" && (
          <button
            onClick={() => navigate("/appointments/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus size={20} />
            Book Appointment
          </button>
        )}
      </div>

      <SearchFilter
        onSearch={setSearchParams}
        placeholder="Search appointments..."
        filters={filters}
      />

      {loading ? (
        <div className="text-center py-12">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description={
            user?.role === "patient"
              ? "You don't have any appointments yet. Book your first appointment to get started."
              : "There are no appointments yet. Book an appointment to get started."
          }
          action={{ label: "Book Appointment" }}
        />
      ) : (
        <>
          <DataTable columns={columns} data={appointments} />
          {pagination.total > 10 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                Showing {appointments.length} of {pagination.total} appointments
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchAppointments(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchAppointments(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AppointmentsListPage;
