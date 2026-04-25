import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD FROM STORAGE (CORRECT STRUCTURE)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("servdial_user");

      if (saved) {
        const parsed = JSON.parse(saved);

        // ✅ FIX: ensure structure consistency
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
        } else {
          localStorage.removeItem("servdial_user");
        }
      }
    } catch {
      localStorage.removeItem("servdial_user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOGIN =================
  const login = async (credentials) => {
    try {
      const { data } = await API.post("/auth/login", credentials);

      console.log("LOGIN RESPONSE:", data);

      const token = data?.token;
      const userData = data?.user;

      if (!token || !userData) {
        return {
          success: false,
          message: "Invalid login response",
        };
      }

      // ✅ STANDARD STRUCTURE
      const payload = {
        token,
        user: userData,
      };

      localStorage.setItem(
        "servdial_user",
        JSON.stringify(payload)
      );

      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("servdial_user");
    setUser(null);
  };

  // ================= REGISTER =================
  const register = async (formData) => {
    try {
      const { data } = await API.post("/auth/register", formData);

      const token = data?.token;
      const userData = data?.user;

      const payload = {
        token,
        user: userData,
      };

      localStorage.setItem(
        "servdial_user",
        JSON.stringify(payload)
      );

      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);