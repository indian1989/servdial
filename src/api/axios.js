// frontend/src/api/axios.js
import axios from "axios";

// ================= BASE API INSTANCE =================
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://servdial-backend.onrender.com/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= HELPER =================
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("servdial_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("servdial_user");
    return null;
  }
};

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
  (config) => {
    const user = getStoredUser();

    if (user?.token) {
  config.headers.Authorization = `Bearer ${user.token}`;
}

    config.headers["x-request-id"] = Date.now();

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      alert("Network error. Check your connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401) {
      const user = getStoredUser();
      if (user) {
        localStorage.removeItem("servdial_user");
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.warn("Access denied:", data?.message);
    }

    if (status === 404) {
      console.warn("API not found:", error.config?.url);
    }

    if (status >= 500) {
      console.error("Server error:", data?.message);
    }

    return Promise.reject(error);
  }
);

export default API;