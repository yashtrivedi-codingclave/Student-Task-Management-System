const jwt = require("jsonwebtoken");

/**
 * Create a signed JWT token for a given user id.
 * The token is signed with our secret and expires after the time set in .env.
 * We only store the user id inside the token payload.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
