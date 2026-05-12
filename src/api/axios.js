import axios from "axios";

// ================= BASE API INSTANCE =================
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.servdial.com/api",

  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
  },
});

// ================= GET STORED USER =================
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

    // ✅ AUTH TOKEN
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // ✅ REQUEST ID
    config.headers["x-request-id"] = crypto.randomUUID();

    // ✅ REMOVE EMPTY PARAMS
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        const value = config.params[key];

        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          delete config.params[key];
        }
      });
    }

    // ✅ DEV LOGS ONLY
    if (import.meta.env.DEV) {
      console.log(
        "🌍 API:",
        (config.baseURL || "") + config.url
      );
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    // ================= NETWORK ERROR =================
    if (!error.response) {
      console.error("🌐 Network error");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ================= AUTH =================
    if (status === 401) {
      const user = getStoredUser();

      if (user) {
        localStorage.removeItem("servdial_user");

        // ✅ avoid redirect loop
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    // ================= FORBIDDEN =================
    if (status === 403) {
      console.warn("⛔ Access denied:", data?.message);
    }

    // ================= NOT FOUND =================
    if (status === 404) {
      console.warn(
        "❌ API 404:",
        (error.config?.baseURL || "") + error.config?.url
      );
    }

    // ================= SERVER ERROR =================
    if (status >= 500) {
      console.error(
        "🔥 Server error:",
        data?.message || "Internal server error"
      );
    }

    return Promise.reject(error);
  }
);

export default API;