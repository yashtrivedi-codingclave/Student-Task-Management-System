/**
 * Format a date into a readable string like "10 August 2026".
 */
export const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Format a date into the "YYYY-MM-DD" value that <input type="date"> expects.
 */
export const toInputDate = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return date.toISOString().split("T")[0];
};

/**
 * Return true if a task is overdue:
 * the due date is before today AND the task is not completed.
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
};
