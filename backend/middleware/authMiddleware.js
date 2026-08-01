const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication middleware.
 * Checks for a valid JWT token in the Authorization header.
 * If the token is valid, it attaches the logged-in user to req.user.
 * If the token is missing or invalid, it returns a 401 Unauthorized response.
 */
const protect = async (req, res, next) => {
  let token;

  // Tokens are sent as: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token part after the word "Bearer".
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by id and attach it to the request (without the password).
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      return next();
    } catch (error) {
      // This handles both invalid and expired tokens.
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed or expired",
      });
    }
  }

  // No token was provided at all.
  return res.status(401).json({
    success: false,
    message: "Not authorized, no token provided",
  });
};

module.exports = { protect };
