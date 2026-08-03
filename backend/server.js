// Load environment variables from .env as early as possible.
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to the MongoDB database.
connectDB();

const app = express();

// --- Global middleware ---

// Allow local + deployed frontends. CLIENT_URL may be a single URL or
// a comma-separated list (set on Render to your Vercel URL).
const allowedOrigins = [
  "http://localhost:5173",
  "https://student-task-management-system-sigma.vercel.app",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = same-origin / tools like Postman / curl.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// Parse incoming JSON request bodies.
app.use(express.json());

// --- Routes ---

// Simple health-check route to confirm the API is running.
app.get("/", (req, res) => {
  res.json({ success: true, message: "Student Task Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// --- Error handling (must be placed after the routes) ---
app.use(notFound);
app.use(errorHandler);

// --- Start the server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
