const mongoose = require("mongoose");

/**
 * Connect to MongoDB using the connection string stored in the .env file.
 * We keep the URL in an environment variable so we never hardcode secrets.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process with a failure code if we cannot connect to the database.
    process.exit(1);
  }
};

module.exports = connectDB;
