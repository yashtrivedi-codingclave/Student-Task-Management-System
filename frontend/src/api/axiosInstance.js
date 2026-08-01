import axios from "axios";

/**
 * A single reusable Axios instance for the whole app.
 * The base URL comes from the frontend .env file (VITE_API_URL).
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor.
 * Runs before every request and automatically attaches the JWT token
 * (if the user is logged in) to the Authorization header.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor.
 * If the server ever returns 401 (unauthorized / expired token),
 * we clear the stored login data and send the user back to the login page.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Avoid redirect loops if we are already on an auth page.
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
