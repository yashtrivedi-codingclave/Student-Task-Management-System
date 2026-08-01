import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiEye, FiCheckCircle } from "react-icons/fi";
import { formatDate, isOverdue } from "../utils/formatDate";

/**
 * Reusable colour classes for the status and priority badges.
 */
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
 * A single task card.
 *
 * Props:
 * - task: the task object
 * - onDelete: called with the task when the delete button is clicked
 * - onComplete: called with the task when "Mark as completed" is clicked
 */
const TaskCard = ({ task, onDelete, onComplete }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Top row: title + badges */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{task.title}</h3>
        <div className="flex flex-shrink-0 flex-wrap justify-end gap-1">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}
          >
            {task.status}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
          {overdue && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
              Overdue
            </span>
          )}
        </div>
      </div>

      {/* Subject */}
      <p className="mb-1 text-sm font-medium text-indigo-600">{task.subject}</p>

      {/* Short description */}
      {task.description && (
        <p className="mb-3 line-clamp-2 text-sm text-slate-500">
          {task.description}
        </p>
      )}

      {/* Dates */}
      <div className="mb-4 mt-auto space-y-1 text-xs text-slate-400">
        <p>
          Due:{" "}
          <span className={overdue ? "font-medium text-red-600" : "text-slate-600"}>
            {formatDate(task.dueDate)}
          </span>
        </p>
        <p>Created: {formatDate(task.createdAt)}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        <Link
          to={`/tasks/${task._id}`}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          <FiEye size={14} /> View
        </Link>
        <Link
          to={`/tasks/${task._id}/edit`}
          className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
        >
          <FiEdit2 size={14} /> Edit
        </Link>
        {task.status !== "Completed" && (
          <button
            onClick={() => onComplete(task)}
            className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
          >
            <FiCheckCircle size={14} /> Complete
          </button>
        )}
        <button
          onClick={() => onDelete(task)}
          className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
        >
          <FiTrash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
