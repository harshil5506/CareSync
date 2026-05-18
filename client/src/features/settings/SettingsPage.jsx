import { useState } from "react";
import { Save, Moon, Sun, Bell, Lock, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import api from "@/services/api";
import { toast } from "sonner";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    prescriptionUpdates: true,
    billingAlerts: true,
  });

  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.put("/auth/profile", {
        name: formData.fullName,
        phone: formData.phone,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match!");
      return;
    }

    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);
      await api.post("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast.success("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-card rounded-lg shadow-md p-4 space-y-2 sticky top-20">
            <a
              href="#profile"
              className="block px-4 py-2 rounded hover:bg-muted text-foreground font-medium"
            >
              Profile Settings
            </a>
            <a
              href="#password"
              className="block px-4 py-2 rounded hover:bg-muted text-muted-foreground"
            >
              Change Password
            </a>
            <a
              href="#notifications"
              className="block px-4 py-2 rounded hover:bg-muted text-muted-foreground"
            >
              Notifications
            </a>
            <a
              href="#appearance"
              className="block px-4 py-2 rounded hover:bg-muted text-muted-foreground"
            >
              Appearance
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div
            id="profile"
            className="bg-white dark:bg-card rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-input rounded-lg bg-muted opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div
            id="password"
            className="bg-white dark:bg-card rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Lock size={20} />
              Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <Lock size={18} />
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div
            id="notifications"
            className="bg-white dark:bg-card rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notification Preferences
            </h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-foreground">
                    {key === "emailNotifications" && "Email Notifications"}
                    {key === "appointmentReminders" && "Appointment Reminders"}
                    {key === "prescriptionUpdates" && "Prescription Updates"}
                    {key === "billingAlerts" && "Billing Alerts"}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Note: Notification preferences are stored locally for now. Full implementation coming in Phase 8.
            </p>
          </div>

          {/* Appearance */}
          <div
            id="appearance"
            className="bg-white dark:bg-card rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Appearance
            </h2>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-foreground font-medium">
                  {theme === "light" ? "Light Mode" : "Dark Mode"}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Toggle
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="bg-white dark:bg-card rounded-lg shadow-md p-6 border-2 border-red-200 dark:border-red-800">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <LogOut size={20} />
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Logging out will end your session and require you to login again.
            </p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
