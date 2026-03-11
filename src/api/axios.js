import axios from "axios";

// ================= BASE API INSTANCE =================
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://servdial-backend.onrender.com/api",
    timeout: 60000, // 60 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem("servdial_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error("Invalid user data in localStorage");
      localStorage.removeItem("servdial_user");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network Error
    if (!error.response) {
      console.error("Network error:", error.message);
      alert("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Unauthorized (token expired / invalid)
    if (status === 401) {
      console.warn("Session expired. Logging out.");

      localStorage.removeItem("servdial_user");

      window.location.href = "/login";
    }

    // Forbidden
    if (status === 403) {
      console.warn("Access denied:", data?.message);
    }

    // Server Error
    if (status >= 500) {
      console.error("Server error:", data?.message);
    }

    return Promise.reject(error);
  }
);

export default API;