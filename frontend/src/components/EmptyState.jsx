import { FiInbox } from "react-icons/fi";
import { Link } from "react-router-dom";

/**
 * Shown when there is no data to display (for example, no tasks yet).
 * Optionally shows an action button.
 */
const EmptyState = ({
  message = "No tasks found. Create your first task to get started.",
  actionText,
  actionTo,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
        <FiInbox size={30} />
      </div>
      <p className="max-w-xs text-slate-500">{message}</p>
      {actionText && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
