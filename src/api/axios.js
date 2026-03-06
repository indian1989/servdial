import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://servdial-backend.onrender.com",
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("servdial_user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;