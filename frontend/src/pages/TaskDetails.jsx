import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

import taskService from "../services/taskService";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";
import { formatDate, isOverdue } from "../utils/formatDate";

// Badge colours reused from the task card.
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};
const priorityColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-red-100 text-red-700",
};

/**
 * Task Details page.
 * Shows all information about a single task and allows edit / delete.
 */
const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await taskService.deleteTask(id);
      toast.success("Task deleted");
      navigate("/tasks");
    } catch (error) {
      toast.error("Could not delete the task. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading task..." />;
  if (!task) return null;

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        to="/tasks"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
      >
        <FiArrowLeft /> Back to tasks
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Title + badges */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800">{task.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[task.status]}`}
            >
              {task.status}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColors[task.priority]}`}
            >
              {task.priority} Priority
            </span>
            {overdue && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Subject */}
        <p className="mb-4 font-medium text-indigo-600">{task.subject}</p>

        {/* Description */}
        <div className="mb-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-500">
            Description
          </h2>
          <p className="whitespace-pre-line text-slate-700">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <Detail label="Due Date" value={formatDate(task.dueDate)} />
          <Detail label="Status" value={task.status} />
          <Detail label="Created On" value={formatDate(task.createdAt)} />
          <Detail label="Last Updated" value={formatDate(task.updatedAt)} />
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <Link
            to={`/tasks/${task._id}/edit`}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <FiEdit2 size={16} /> Edit
          </Link>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <FiTrash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  );
};

// A tiny helper component for a labelled detail row.
const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="text-slate-700">{value}</p>
  </div>
);

export default TaskDetails;
