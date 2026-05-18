import { useState, useEffect } from "react";
import { Calendar, Eye, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import SearchFilter from "@/components/common/SearchFilter";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import { format } from "date-fns";

export function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useState({ query: "", filters: {} });
  const [doctorId, setDoctorId] = useState(null);

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Scheduled", value: "scheduled" },
        { label: "In Progress", value: "in-progress" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "No Show", value: "no-show" },
      ],
    },
  ];

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await api.get("/doctors/user/profile");
        setDoctorId(response.data.data._id);
      } catch (error) {
      }
    };
    fetchDoctorProfile();
  }, []);

  const fetchAppointments = async (page = 1) => {
    if (!doctorId) return;

    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchParams.query || undefined,
        ...searchParams.filters,
      };

      const response = await api.get(`/appointments/doctor/${doctorId}`, {
        params,
      });
      setAppointments(response.data.data.appointments);
      setPagination(response.data.data.pagination);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchAppointments(1);
    }
  }, [searchParams, doctorId]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: newStatus,
      });
      fetchAppointments(pagination.page || 1);
    } catch (error) {
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-sm font-medium ${styles[status]}`}
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
      key: "date",
      label: "Date",
      render: (value) => format(new Date(value), "MMM dd, yyyy"),
    },
    { key: "timeSlot", label: "Time" },
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
          {row.status === "scheduled" && (
            <button
              onClick={() => handleStatusChange(row._id, "in-progress")}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Start Appointment"
            >
              <Clock size={16} />
            </button>
          )}
          {row.status === "in-progress" && (
            <button
              onClick={() => handleStatusChange(row._id, "completed")}
              className="p-2 text-green-600 hover:bg-green-50 rounded"
              title="Mark as Completed"
            >
              <CheckCircle size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Appointments
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your scheduled appointments
          </p>
        </div>
      </div>

      <SearchFilter
        onSearch={setSearchParams}
        placeholder="Search appointments by patient..."
        filters={filters}
      />

      {loading ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto mb-4 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No Appointments"
          description="You don't have any appointments scheduled at the moment."
          action={{ label: "View Dashboard" }}
        />
      ) : (
        <>
          <DataTable columns={columns} data={appointments} />
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
        </>
      )}
    </div>
  );
}

export default DoctorAppointmentsPage;
