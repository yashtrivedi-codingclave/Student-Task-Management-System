import { useState } from "react";
import { toInputDate } from "../utils/formatDate";

/**
 * A reusable form used for both adding and editing a task.
 *
 * Props:
 * - initialData: existing task values (used on the Edit page)
 * - onSubmit: called with the validated form values
 * - submitting: disables the submit button while saving
 * - submitLabel: text on the submit button
 */
const TaskForm = ({
  initialData = {},
  onSubmit,
  submitting = false,
  submitLabel = "Save Task",
}) => {
  // Controlled form state. We fall back to sensible defaults for a new task.
  const [values, setValues] = useState({
    title: initialData.title || "",
    subject: initialData.subject || "",
    description: initialData.description || "",
    priority: initialData.priority || "Medium",
    status: initialData.status || "Pending",
    dueDate: initialData.dueDate ? toInputDate(initialData.dueDate) : "",
  });

  // Holds validation error messages for each field.
  const [errors, setErrors] = useState({});

  // Today's date in YYYY-MM-DD, used to block past due dates.
  const today = new Date().toISOString().split("T")[0];

  // Update a single field when the user types.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Check all validation rules and return an errors object.
  const validate = () => {
    const newErrors = {};

    if (!values.title.trim()) newErrors.title = "Title is required";
    if (!values.subject.trim()) newErrors.subject = "Subject is required";
    if (!values.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (values.dueDate < today) {
      newErrors.dueDate = "Due date cannot be earlier than today";
    }
    if (values.description.length > 500) {
      newErrors.description = "Description should not exceed 500 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    // Only submit if there are no validation errors.
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  // Reset the form back to its initial values.
  const handleReset = () => {
    setValues({
      title: initialData.title || "",
      subject: initialData.subject || "",
      description: initialData.description || "",
      priority: initialData.priority || "Medium",
      status: initialData.status || "Pending",
      dueDate: initialData.dueDate ? toInputDate(initialData.dueDate) : "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="form-label">Task Title *</label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Complete React Assignment"
          className="form-input"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="form-label">Subject *</label>
        <input
          type="text"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          placeholder="e.g. React.js"
          className="form-input"
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={4}
          placeholder="Optional details about the task"
          className="form-input resize-none"
        />
        <div className="mt-1 flex justify-between">
          {errors.description ? (
            <p className="text-xs text-red-600">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-slate-400">
            {values.description.length}/500
          </p>
        </div>
      </div>

      {/* Priority + Status (side by side on larger screens) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label">Priority</label>
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="form-label">Status</label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="form-label">Due Date *</label>
        <input
          type="date"
          name="dueDate"
          value={values.dueDate}
          min={today}
          onChange={handleChange}
          className="form-input"
        />
        {errors.dueDate && (
          <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={submitting}
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
