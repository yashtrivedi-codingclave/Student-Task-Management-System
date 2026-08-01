const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

/**
 * Small helper so we do not have to write try/catch in every controller.
 * It catches any error from an async function and passes it to the error handler.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Validation rules for registration.
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Validation rules for login.
const loginValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidation, asyncHandler(registerUser));
router.post("/login", loginValidation, asyncHandler(loginUser));
router.get("/profile", protect, asyncHandler(getProfile));

module.exports = router;
