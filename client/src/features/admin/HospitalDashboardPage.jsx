import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Stethoscope,
} from "lucide-react";
import api from "@/services/api";

export function HospitalDashboardPage() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      fetchHospitalStats(selectedHospital._id);
    }
  }, [selectedHospital]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get("/hospitals");
      setHospitals(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedHospital(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchHospitalStats = async (hospitalId) => {
    try {
      setLoading(true);
      const response = await api.get(`/hospitals/${hospitalId}/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching hospital stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedHospital) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No hospitals found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Hospital Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          View hospital statistics and revenue
        </p>
      </div>

      {/* Hospital Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Hospital
        </label>
        <select
          value={selectedHospital?._id || ""}
          onChange={(e) => {
            const hospital = hospitals.find((h) => h._id === e.target.value);
            setSelectedHospital(hospital);
          }}
          className="w-full px-4 py-2 border border-border rounded-lg bg-white dark:bg-card text-foreground"
        >
          {hospitals.map((hospital) => (
            <option key={hospital._id} value={hospital._id}>
              {hospital.name} - {hospital.city}
            </option>
          ))}
        </select>
      </div>

      {/* Hospital Info Card */}
      <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 mb-6 border border-border">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedHospital.name}
            </h2>
            <p className="text-muted-foreground">
              {selectedHospital.address}, {selectedHospital.city},{" "}
              {selectedHospital.state}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              📞 {selectedHospital.phone} | 📧 {selectedHospital.email}
            </p>
          </div>
          <Building2 size={40} className="text-blue-600" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading statistics...</div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Appointments */}
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Appointments
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stats.totalAppointments}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </div>
                <Calendar size={40} className="text-blue-600 opacity-20" />
              </div>
            </div>

            {/* Completed Appointments */}
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {stats.completedAppointments}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.completionRate}% completion rate
                  </p>
                </div>
                <TrendingUp size={40} className="text-green-600 opacity-20" />
              </div>
            </div>

            {/* Total Doctors */}
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Doctors</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {stats.totalDoctors}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.departmentCount} departments
                  </p>
                </div>
                <Stethoscope size={40} className="text-purple-600 opacity-20" />
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    ₹{stats.totalRevenue?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {stats.totalAppointments} appointments
                  </p>
                </div>
                <DollarSign size={40} className="text-orange-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Department Stats */}
          {stats.departmentStats && stats.departmentStats.length > 0 && (
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Revenue by Department
              </h3>
              <div className="space-y-3">
                {stats.departmentStats.map((dept) => (
                  <div
                    key={dept._id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.doctorCount} doctors • {dept.appointmentCount}{" "}
                        appointments
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        ₹{dept.totalRevenue?.toLocaleString() || 0}
                      </p>
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-orange-600"
                          style={{
                            width: `${
                              (dept.totalRevenue / stats.totalRevenue) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Performance */}
          {stats.doctorStats && stats.doctorStats.length > 0 && (
            <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Top Doctors by Revenue
              </h3>
              <div className="space-y-3">
                {stats.doctorStats.slice(0, 5).map((doctor, idx) => (
                  <div
                    key={doctor._id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {idx + 1}. {doctor.doctorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.appointmentCount} appointments
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ₹{doctor.totalRevenue?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No statistics available
        </div>
      )}
    </div>
  );
}

export default HospitalDashboardPage;
