import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Pill,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Users, label: "Patients", path: "/patients" },
      { icon: Users, label: "Doctors", path: "/doctors" },
      { icon: Calendar, label: "Appointments", path: "/appointments" },
      { icon: Pill, label: "Prescriptions", path: "/prescriptions" },
      { icon: CreditCard, label: "Billing", path: "/billing" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
    doctor: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Calendar, label: "My Appointments", path: "/appointments" },
      { icon: Users, label: "My Patients", path: "/patients" },
      { icon: Pill, label: "Prescriptions", path: "/prescriptions" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
    receptionist: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Calendar, label: "Appointments", path: "/appointments" },
      { icon: Users, label: "Patients", path: "/patients" },
      { icon: CreditCard, label: "Billing", path: "/billing" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
    patient: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Calendar, label: "My Appointments", path: "/appointments" },
      { icon: Pill, label: "My Prescriptions", path: "/prescriptions" },
      { icon: CreditCard, label: "Bills", path: "/billing" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  };

  const items = menuItems[user?.role] || menuItems.patient;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-primary text-primary-foreground rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-card shadow-lg transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">CareSync</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Patient Management
          </p>
        </div>

        <nav className="mt-8 px-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 p-4 bg-muted rounded-lg">
          <p className="text-xs font-semibold text-foreground mb-1">Role</p>
          <p className="text-sm text-primary font-bold capitalize">
            {user?.role}
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
