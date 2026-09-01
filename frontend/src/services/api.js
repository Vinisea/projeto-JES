import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
} );

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jes_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jes_token");
      localStorage.removeItem("jes_usuario");
    }

    return Promise.reject(error);
  },
);

export default api;