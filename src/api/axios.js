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

// ================= HELPER: GET STORED USER =================
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("servdial_user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage");
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

    // Optional: Add request id for debugging production logs
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
      console.error("Network error:", error.message);
      alert("Network error. Please check your internet connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ================= 401 UNAUTHORIZED =================
    if (status === 401) {
      const user = getStoredUser();

      if (user) {
        console.warn("Session expired. Redirecting to login...");
        localStorage.removeItem("servdial_user");
        window.location.href = "/login";
      }
    }

    // ================= 403 FORBIDDEN =================
    if (status === 403) {
      console.warn("Access denied:", data?.message);
    }

    // ================= 404 NOT FOUND =================
    if (status === 404) {
      console.warn("API route not found:", error.config?.url);
    }

    // ================= SERVER ERROR =================
    if (status >= 500) {
      console.error("Server error:", data?.message || "Internal server error");
    }

    return Promise.reject(error);
  }
);

export default API;