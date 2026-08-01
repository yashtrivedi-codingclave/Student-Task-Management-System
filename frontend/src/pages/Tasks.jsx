import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

import taskService from "../services/taskService";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";

/**
 * All Tasks page.
 * Lists the user's tasks with search, filters and sorting.
 */
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("");

  // State for the delete confirmation modal.
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load tasks from the server. Called on mount and whenever filters change.
  const loadTasks = async () => {
    try {
      setLoading(true);
      // Only send filters that actually have a value.
      const filters = {};
      if (search) filters.search = search;
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (sort) filters.sort = sort;

      const res = await taskService.getTasks(filters);
      setTasks(res.data);
    } catch (error) {
      toast.error("Unable to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever a filter value changes.
  // A small delay could be added for search, but we keep it simple here.
  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, priority, sort]);

  // Clear all filters back to their default (empty) values.
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setSort("");
  };

  // Mark a task as completed using the status endpoint.
  const handleComplete = async (task) => {
    try {
      await taskService.updateTaskStatus(task._id, "Completed");
      toast.success("Task marked as completed");
      loadTasks();
    } catch (error) {
      toast.error("Could not update the task. Please try again.");
    }
  };

  // Confirm and delete a task.
  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      await taskService.deleteTask(taskToDelete._id);
      toast.success("Task deleted");
      setTaskToDelete(null);
      loadTasks();
    } catch (error) {
      toast.error("Could not delete the task. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Tasks</h1>
          <p className="text-sm text-slate-500">
            Search, filter and manage all of your tasks.
          </p>
        </div>
        <Link to="/tasks/add" className="btn-primary w-fit">
          <FiPlus /> Add New Task
        </Link>
      </div>

      {/* Filters bar */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="form-input pl-9"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-input"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority filter */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-input"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-input"
          >
            <option value="">Newest First</option>
            <option value="dueDate">Due Date (Earliest)</option>
            <option value="-dueDate">Due Date (Latest)</option>
          </select>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <Loader text="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          message="No tasks found. Create your first task to get started."
          actionText="Add Task"
          actionTo="/tasks/add"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={setTaskToDelete}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Tasks;
