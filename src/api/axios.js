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
    } catch (err) {
      console.error("Invalid user data in localStorage");
      localStorage.removeItem("servdial_user");
    }

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
      console.warn("Session expired. Redirecting to login...");

      localStorage.removeItem("servdial_user");

      window.location.href = "/login";
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