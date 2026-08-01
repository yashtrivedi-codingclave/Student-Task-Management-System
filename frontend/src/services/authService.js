import axiosInstance from "../api/axiosInstance";

/**
 * Auth service.
 * Keeps all authentication-related API calls in one place so the
 * components and context stay clean.
 */

// Register a new student.
const register = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", formData);
  return data;
};

// Log in an existing student.
const login = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};

// Get the currently logged-in student's profile (protected route).
const getProfile = async () => {
  const { data } = await axiosInstance.get("/auth/profile");
  return data;
};

export default { register, login, getProfile };
