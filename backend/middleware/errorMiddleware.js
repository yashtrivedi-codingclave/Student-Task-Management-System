/**
 * "Not Found" middleware.
 * Runs when no route matched the request.
 */
const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized error handler.
 * Any error passed to next(error) or thrown in an async route ends up here,
 * so we send one consistent JSON error response.
 */
const errorHandler = (err, req, res, next) => {
  // If a route set a status code, use it. Otherwise default to 500 (server error).
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server Error";

  // Handle an invalid MongoDB ObjectId (for example a bad task id in the URL).
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Handle a Mongoose duplicate key error (for example a duplicate email).
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show the technical stack trace while developing, never in production.
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
