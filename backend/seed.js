/**
 * Seed script — creates a demo user and sample tasks.
 * Run: npm run seed (from the backend folder)
 */
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Task = require("./models/Task");

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "123456";

const sampleTasks = [
  {
    title: "Complete Math Assignment",
    description: "Solve exercises 1–15 from Chapter 4 (Calculus).",
    subject: "Mathematics",
    status: "Pending",
    priority: "High",
    dueDate: daysFromNow(3),
  },
  {
    title: "Read Physics Chapter 5",
    description: "Notes on Newton's laws of motion.",
    subject: "Physics",
    status: "In Progress",
    priority: "Medium",
    dueDate: daysFromNow(5),
  },
  {
    title: "Submit Chemistry Lab Report",
    description: "Write up the titration experiment results.",
    subject: "Chemistry",
    status: "Pending",
    priority: "High",
    dueDate: daysFromNow(2),
  },
  {
    title: "Prepare History Presentation",
    description: "Slides on the Industrial Revolution.",
    subject: "History",
    status: "In Progress",
    priority: "Medium",
    dueDate: daysFromNow(7),
  },
  {
    title: "English Essay Draft",
    description: "First draft of the essay on modern literature.",
    subject: "English",
    status: "Completed",
    priority: "Low",
    dueDate: daysFromNow(-2),
  },
  {
    title: "CS Project Milestone",
    description: "Finish the API integration module for the group project.",
    subject: "Computer Science",
    status: "Pending",
    priority: "High",
    dueDate: daysFromNow(10),
  },
];

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function seed() {
  try {
    await connectDB();

    // Remove previous demo user + their tasks so re-running is safe.
    const existing = await User.findOne({ email: DEMO_EMAIL });
    if (existing) {
      await Task.deleteMany({ user: existing._id });
      await User.deleteOne({ _id: existing._id });
      console.log("Cleared previous demo user and tasks.");
    }

    const user = await User.create({
      name: "Demo Student",
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    const tasks = sampleTasks.map((t) => ({ ...t, user: user._id }));
    await Task.insertMany(tasks);

    console.log("\nSeed completed successfully!");
    console.log("--------------------------------");
    console.log("Demo login credentials:");
    console.log(`  Email:    ${DEMO_EMAIL}`);
    console.log(`  Password: ${DEMO_PASSWORD}`);
    console.log(`  Tasks:    ${tasks.length} sample tasks created`);
    console.log("--------------------------------\n");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
