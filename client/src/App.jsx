import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import PatientsListPage from '@/features/patients/PatientsListPage';
import AddPatientForm from '@/features/patients/AddPatientForm';
import DoctorMyPatientsPage from '@/features/patients/DoctorMyPatientsPage';
import DoctorsListPage from '@/features/doctors/DoctorsListPage';
import AddDoctorForm from '@/features/doctors/AddDoctorForm';
import AppointmentsListPage from '@/features/appointments/AppointmentsListPage';
import DoctorAppointmentsPage from '@/features/appointments/DoctorAppointmentsPage';
import AppointmentBookingForm from '@/features/appointments/AppointmentBookingForm';
import PrescriptionsPage from '@/features/prescriptions/PrescriptionsPage';
import BillingPage from '@/features/billing/BillingPage';
import AnalyticsPage from '@/features/analytics/AnalyticsPage';
import SettingsPage from '@/features/settings/SettingsPage';
import OrganizationHierarchyPage from '@/features/admin/OrganizationHierarchyPage';
import HospitalDashboardPage from '@/features/admin/HospitalDashboardPage';
import DepartmentsListPage from '@/features/departments/DepartmentsListPage';
import AddDepartmentForm from '@/features/departments/AddDepartmentForm';
import LandingPage from '@/pages/LandingPage';
import { BarChart3, Calendar, Users } from 'lucide-react';
import StatsCard from '@/components/common/StatsCard';

function DashboardContent() {
  const { user } = useAuth();

  // Admin stats
  const adminStats = [
    {
      icon: Users,
      label: 'Total Patients',
      value: '1,250',
      trend: '12% increase',
      trendPositive: true,
    },
    {
      icon: Calendar,
      label: 'Appointments Today',
      value: '24',
      trend: '5% from yesterday',
      trendPositive: true,
    },
    {
      icon: BarChart3,
      label: 'Revenue',
      value: '₹45,230',
      trend: '8% increase',
      trendPositive: true,
    },
  ];

  // Patient stats
  const patientStats = [
    {
      icon: Calendar,
      label: 'My Appointments',
      value: '5',
      trend: 'Upcoming',
      trendPositive: true,
    },
  ];

  // Doctor stats
  const doctorStats = [
    {
      icon: Users,
      label: 'My Patients',
      value: '42',
      trend: '8 new this week',
      trendPositive: true,
    },
    {
      icon: Calendar,
      label: 'Today Appointments',
      value: '7',
      trend: 'Next 3 hours',
      trendPositive: true,
    },
  ];

  // Select stats based on role
  let stats = [];
  if (user?.role === 'admin') {
    stats = adminStats;
  } else if (user?.role === 'patient') {
    stats = patientStats;
  } else if (user?.role === 'doctor') {
    stats = doctorStats;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">
          {user?.role === 'admin' && "Here's your admin dashboard overview"}
          {user?.role === 'patient' && "Here's your personal health dashboard"}
          {user?.role === 'doctor' && "Here's your clinic dashboard"}
          {user?.role === 'receptionist' && "Here's your reception dashboard"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Welcome to CareSync</h2>
        <p className="text-muted-foreground">
          {user?.role === 'admin' && 'Manage your hospital, departments, doctors, and appointments from here.'}
          {user?.role === 'patient' && 'Book appointments, view your medical records, and manage your health.'}
          {user?.role === 'doctor' && 'Manage your appointments, prescriptions, and patient records.'}
          {user?.role === 'receptionist' && 'Manage appointments and patient check-ins.'}
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardContent />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Other protected pages - will add content in Phase 5 */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PatientsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/new"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AddPatientForm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AppointmentsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-appointments"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DashboardLayout>
              <DoctorAppointmentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AppointmentBookingForm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PrescriptionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-patients"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DashboardLayout>
              <DoctorMyPatientsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BillingPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <DoctorsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors/new"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AddDoctorForm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <DepartmentsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/organization-hierarchy"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <OrganizationHierarchyPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <HospitalDashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments/new"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AddDepartmentForm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
