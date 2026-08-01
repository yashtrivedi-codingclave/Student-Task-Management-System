const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User schema.
 * A user is a student who owns their own tasks.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    // Automatically add createdAt and updatedAt fields.
    timestamps: true,
  }
);

/**
 * Mongoose "pre save" hook.
 * Runs automatically before a user document is saved.
 * We hash the password only if it was created or changed.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method to compare a plain text password with the hashed one.
 * Used during login.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
