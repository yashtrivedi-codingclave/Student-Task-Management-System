import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

import taskService from "../services/taskService";
import TaskForm from "../components/TaskForm";

/**
 * Add Task page.
 * Renders the reusable TaskForm and sends new task data to the server.
 */
const AddTask = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await taskService.createTask(values);
      toast.success("Task created successfully");
      navigate("/tasks");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Could not create the task. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        to="/tasks"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
      >
        <FiArrowLeft /> Back to tasks
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Add New Task</h1>
        <TaskForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Create Task"
        />
      </div>
    </div>
  );
};

export default AddTask;
