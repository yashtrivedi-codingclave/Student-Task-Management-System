const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * Small helper that turns express-validator errors into a single response.
 * Returns true if there was an error (and already sent the response).
 */
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // send the first error message
    });
    return true;
  }
  return false;
};

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  // 1. Check validation results from the route validators.
  if (handleValidationErrors(req, res)) return;

  const { name, email, password } = req.body;

  // 2. Check if a user with this email already exists.
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    });
  }

  // 3. Create the user. The password is hashed automatically in the model.
  const user = await User.create({ name, email, password });

  // 4. Send back a token and basic user info (never the password).
  return res.status(201).json({
    success: true,
    message: "Registration successful",
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

/**
 * @desc    Log in a student
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { email, password } = req.body;

  // Find the user by email.
  const user = await User.findOne({ email });

  // Check the user exists AND the password matches.
  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  }

  // Use a generic message so we do not reveal which part was wrong.
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
};

/**
 * @desc    Get the currently logged-in student's profile
 * @route   GET /api/auth/profile
 * @access  Private (protected)
 */
const getProfile = async (req, res) => {
  // req.user was attached by the auth middleware.
  const user = req.user;

  return res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

module.exports = { registerUser, loginUser, getProfile };
