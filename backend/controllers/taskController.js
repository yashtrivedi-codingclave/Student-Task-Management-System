const { validationResult } = require("express-validator");
const Task = require("../models/Task");

/**
 * Helper: send the first validation error, if any.
 */
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
    return true;
  }
  return false;
};

/**
 * @desc    Create a new task for the logged-in student
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { title, description, subject, status, priority, dueDate } = req.body;

  // The task owner is always the logged-in user (taken from the token).
  const task = await Task.create({
    title,
    description,
    subject,
    status,
    priority,
    dueDate,
    user: req.user.id,
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
};

/**
 * @desc    Get all tasks that belong to the logged-in student
 * @route   GET /api/tasks
 * @access  Private
 * Supports optional query params: status, priority, search, sort
 */
const getTasks = async (req, res) => {
  const { status, priority, search, sort } = req.query;

  // Base filter: only return tasks owned by this user.
  const filter = { user: req.user.id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // Search inside the title, subject or description (case-insensitive).
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Decide how to sort. Default: newest first.
  let sortOption = { createdAt: -1 };
  if (sort === "dueDate") sortOption = { dueDate: 1 };
  if (sort === "-dueDate") sortOption = { dueDate: -1 };

  const tasks = await Task.find(filter).sort(sortOption);

  return res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

/**
 * @desc    Get a single task owned by the logged-in student
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res) => {
  // Find by BOTH the task id and the owner id so a user cannot read another's task.
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: task,
  });
};

/**
 * @desc    Update a task owned by the logged-in student
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const { title, description, subject, status, priority, dueDate } = req.body;

  // Only update fields that were actually sent.
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (subject !== undefined) task.subject = subject;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  const updatedTask = await task.save();

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
};

/**
 * @desc    Delete a task owned by the logged-in student
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
};

/**
 * @desc    Update only the status of a task
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  // Make sure the status is one of the allowed values.
  const allowedStatuses = ["Pending", "In Progress", "Completed"];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid status",
    });
  }

  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  task.status = status;
  const updatedTask = await task.save();

  return res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    data: updatedTask,
  });
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
