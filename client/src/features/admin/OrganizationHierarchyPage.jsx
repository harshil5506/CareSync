import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Building2,
  Stethoscope,
  Users,
  Plus,
} from "lucide-react";
import api from "@/services/api";

export function OrganizationHierarchyPage() {
  const [hospitals, setHospitals] = useState([]);
  const [expandedHospitals, setExpandedHospitals] = useState({});
  const [expandedDepts, setExpandedDepts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      const response = await api.get("/hospitals/hierarchy/all");
      setHospitals(response.data.data.hierarchyData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const toggleHospital = (hospitalId) => {
    setExpandedHospitals((prev) => ({
      ...prev,
      [hospitalId]: !prev[hospitalId],
    }));
  };

  const toggleDepartment = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">
          Loading organization structure...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Organization Hierarchy
        </h1>
        <p className="text-muted-foreground mt-1">
          View hospitals, departments, and doctors structure
        </p>
      </div>

      {hospitals.length === 0 ? (
        <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 text-center">
          <Building2 size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No hospitals found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div
              key={hospital._id}
              className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden"
            >
              {/* Hospital Header */}
              <button
                onClick={() => toggleHospital(hospital._id)}
                className="w-full p-4 flex items-center gap-3 hover:bg-muted transition text-left"
              >
                {expandedHospitals[hospital._id] ? (
                  <ChevronDown size={20} className="text-primary" />
                ) : (
                  <ChevronRight size={20} className="text-muted-foreground" />
                )}
                <Building2 size={20} className="text-blue-600" />
                <div className="flex-1">
                  <h2 className="font-bold text-foreground">{hospital.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {hospital.city}, {hospital.state} • {hospital.phone}
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {hospital.totalDepartments} Dept
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {hospital.totalDoctors} Doctors
                  </span>
                </div>
              </button>

              {/* Hospital Content */}
              {expandedHospitals[hospital._id] && (
                <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                  {hospital.departments.length === 0 ? (
                    <p className="text-muted-foreground text-sm ml-8">
                      No departments
                    </p>
                  ) : (
                    hospital.departments.map((department) => (
                      <div
                        key={department._id}
                        className="ml-8 bg-white dark:bg-card rounded border border-border"
                      >
                        {/* Department Header */}
                        <button
                          onClick={() => toggleDepartment(department._id)}
                          className="w-full p-3 flex items-center gap-3 hover:bg-muted transition text-left"
                        >
                          {expandedDepts[department._id] ? (
                            <ChevronDown size={18} className="text-primary" />
                          ) : (
                            <ChevronRight
                              size={18}
                              className="text-muted-foreground"
                            />
                          )}
                          <Users size={18} className="text-purple-600" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {department.name}
                            </h3>
                            {department.description && (
                              <p className="text-xs text-muted-foreground">
                                {department.description}
                              </p>
                            )}
                          </div>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {department.totalDoctors} Doctors
                          </span>
                        </button>

                        {/* Department Content (Doctors) */}
                        {expandedDepts[department._id] && (
                          <div className="border-t border-border p-3 bg-muted/50 space-y-2">
                            {department.doctors.length === 0 ? (
                              <p className="text-muted-foreground text-sm ml-6">
                                No doctors assigned
                              </p>
                            ) : (
                              department.doctors.map((doctor) => (
                                <div
                                  key={doctor._id}
                                  className="ml-6 p-3 bg-white dark:bg-card rounded border border-border/50 flex items-start gap-3"
                                >
                                  <Stethoscope
                                    size={18}
                                    className="text-green-600 mt-0.5"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-foreground">
                                      {doctor.user?.name || "N/A"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {doctor.specialization}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {doctor.user?.email} •{" "}
                                      {doctor.user?.phone}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          ℹ️ <strong>Hierarchy View:</strong> Admin can manage the complete
          organization structure from hospitals down to individual doctors with
          their specializations.
        </p>
      </div>
    </div>
  );
}

export default OrganizationHierarchyPage;
