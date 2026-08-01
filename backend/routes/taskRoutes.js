const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// Wrapper that forwards async errors to the centralized error handler.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Validation rules used when creating or updating a task.
const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("dueDate").notEmpty().withMessage("Due date is required"),
];

// All task routes are protected: the user must be logged in.
// Applying "protect" here means every route below requires a valid token.
router.use(protect);

router
  .route("/")
  .get(asyncHandler(getTasks))
  .post(taskValidation, asyncHandler(createTask));

router
  .route("/:id")
  .get(asyncHandler(getTaskById))
  .put(taskValidation, asyncHandler(updateTask))
  .delete(asyncHandler(deleteTask));

router.patch("/:id/status", asyncHandler(updateTaskStatus));

module.exports = router;
