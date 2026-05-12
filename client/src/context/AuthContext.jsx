import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("authToken");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const register = async (
    name,
    email,
    password,
    role = "patient",
    phone = "",
  ) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        phone,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token: authToken } = response.data.data;

      setUser(userData);
      setToken(authToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", authToken);

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put("/auth/profile", data);
      const updatedUser = response.data.data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
