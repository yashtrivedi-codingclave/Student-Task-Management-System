import axiosInstance from "../api/axiosInstance";

/**
 * Task service.
 * All task-related API calls live here.
 */

// Get all tasks. "filters" is an object like { status, priority, search, sort }.
const getTasks = async (filters = {}) => {
  const { data } = await axiosInstance.get("/tasks", { params: filters });
  return data;
};

// Get a single task by id.
const getTaskById = async (id) => {
  const { data } = await axiosInstance.get(`/tasks/${id}`);
  return data;
};

// Create a new task.
const createTask = async (taskData) => {
  const { data } = await axiosInstance.post("/tasks", taskData);
  return data;
};

// Update an existing task.
const updateTask = async (id, taskData) => {
  const { data } = await axiosInstance.put(`/tasks/${id}`, taskData);
  return data;
};

// Delete a task.
const deleteTask = async (id) => {
  const { data } = await axiosInstance.delete(`/tasks/${id}`);
  return data;
};

// Update only the status of a task.
const updateTaskStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(`/tasks/${id}/status`, { status });
  return data;
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
