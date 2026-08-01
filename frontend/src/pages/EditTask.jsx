import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

import taskService from "../services/taskService";
import TaskForm from "../components/TaskForm";
import Loader from "../components/Loader";

/**
 * Edit Task page.
 * Loads the existing task, fills the form, and saves the changes.
 */
const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load the task to edit when the page opens.
  useEffect(() => {
    const loadTask = async () => {
      try {
        const res = await taskService.getTaskById(id);
        setTask(res.data);
      } catch (error) {
        toast.error("Task not found.");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await taskService.updateTask(id, values);
      toast.success("Task updated successfully");
      navigate(`/tasks/${id}`);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Could not update the task. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading task..." />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        to={`/tasks/${id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
      >
        <FiArrowLeft /> Back to task
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Edit Task</h1>
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Update Task"
        />
      </div>
    </div>
  );
};

export default EditTask;
