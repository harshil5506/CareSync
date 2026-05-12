import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

export function TopNavbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search:", searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-white dark:bg-card shadow-md z-20 border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-3 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, doctors..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-lg transition"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-foreground" />
            ) : (
              <Moon size={20} className="text-foreground" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {user?.name}
              </span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                >
                  <User size={16} />
                  Profile Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition border-t border-border"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;
