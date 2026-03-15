import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("servdial_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Invalid user data in localStorage");
      localStorage.removeItem("servdial_user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login via backend
  const login = async (credentials) => {
  try {
    const { data } = await API.post("/auth/login", credentials);

    const userData = { ...data.user, token: data.token };

    localStorage.setItem("servdial_user", JSON.stringify(userData));
    setUser(userData);

    return { success: true, user: userData };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

  // Logout
  const logout = () => {
    localStorage.removeItem("servdial_user");
    setUser(null);
  };

  // Register via backend
  const register = async (formData) => {
    try {
      const { data } = await API.post("/auth/register", formData);
      const userData = { ...data.user, token: data.token };
      localStorage.setItem("servdial_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
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

// ✅ Add this for named import useAuth
export const useAuth = () => useContext(AuthContext);