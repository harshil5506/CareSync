import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import { BarChart3, Calendar, Users } from 'lucide-react';
import StatsCard from '@/components/common/StatsCard';

function DashboardContent() {
  const { user } = useAuth();

  // Sample dashboard content
  const stats = [
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Here's your dashboard overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">Coming in Phase 5: Core Features</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
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
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Patient Management</h2>
                <p className="text-muted-foreground mt-2">Coming in Phase 5</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Appointments</h2>
                <p className="text-muted-foreground mt-2">Coming in Phase 5</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Prescriptions</h2>
                <p className="text-muted-foreground mt-2">Coming in Phase 6</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Billing</h2>
                <p className="text-muted-foreground mt-2">Coming in Phase 6</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Doctor Management</h2>
                <p className="text-muted-foreground mt-2">Coming in Phase 5</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
                <p className="text-muted-foreground mt-2">Coming in Phase 7</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                <p className="text-muted-foreground mt-2">Coming in Phase 8</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-center" />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
