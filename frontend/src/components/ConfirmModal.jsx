import { FiAlertTriangle } from "react-icons/fi";

/**
 * A reusable confirmation modal.
 * Used before dangerous actions such as deleting a task.
 *
 * Props:
 * - isOpen: whether the modal is visible
 * - title, message: text to show
 * - confirmText, cancelText: button labels
 * - onConfirm, onCancel: click handlers
 * - loading: disables the confirm button while an action is running
 */
const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete Task",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    // Dark overlay that covers the whole screen.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
            <FiAlertTriangle size={22} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>

        <p className="mb-6 text-sm text-slate-600">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
