import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Calendar, PieChart } from "lucide-react";
import api from "@/services/api";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { toast } from "sonner";

export function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, appointmentsRes] = await Promise.all([
        api.get("/analytics/stats"),
        api.get("/analytics/appointments/recent", { params: { limit: 5 } }),
      ]);

      setStats(statsRes.data);
      setRecentAppointments(appointmentsRes.data);
    } catch (error) {
      toast.error("Failed to load analytics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      icon: Users,
      label: "Total Patients",
      value: stats?.totalPatients || 0,
      trend: "+12%",
    },
    {
      icon: Calendar,
      label: "Total Appointments",
      value: stats?.totalAppointments || 0,
      trend: "+8%",
    },
    {
      icon: TrendingUp,
      label: "Revenue",
      value: `₹${(stats?.revenue || 0).toLocaleString("en-IN")}`,
      trend: "+15%",
    },
    {
      icon: BarChart3,
      label: "Pending Bills",
      value: stats?.pendingBills || 0,
      trend: "Action needed",
    },
  ];

  if (loading) {
    return <LoadingSkeleton count={8} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          View comprehensive insights and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-card rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <Icon className="text-primary" size={24} />
                <span className="text-green-600 text-sm font-medium">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Appointments Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2">
              <span className="text-muted-foreground">Total Appointments</span>
              <span className="font-bold">{stats?.totalAppointments || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-bold">{stats?.completedAppointments || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-muted-foreground">Departments</span>
              <span className="font-bold">{stats?.totalDepartments || 0}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-muted-foreground">Doctors</span>
              <span className="font-bold">{stats?.totalDoctors || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Billing Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2">
              <span className="text-muted-foreground">Total Revenue</span>
              <span className="font-bold text-green-600">
                ₹{(stats?.revenue || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-muted-foreground">Pending Bills</span>
              <span className="font-bold text-yellow-600">
                {stats?.pendingBills || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-muted-foreground">Total Patients</span>
              <span className="font-bold">{stats?.totalPatients || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Recent Appointments
        </h2>
        <div className="space-y-3">
          {recentAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No appointments found
            </p>
          ) : (
            recentAppointments.map((apt, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border border-border rounded hover:bg-muted transition"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {apt.patient?.user?.name || "Patient"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {apt.doctor?.user?.name} • {apt.doctor?.specialization}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    apt.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : apt.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
