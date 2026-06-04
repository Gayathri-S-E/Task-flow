import axios from "axios";

export interface APIResponse<T = any> {
  success: boolean;
  message: string | null;
  data: T;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 and extract response data
api.interceptors.response.use(
  (res) => {
    // Return the APIResponse body directly (contains success, message, data)
    return res.data;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
