const User = require("../models/user");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const handleForgotPasswordRequest = async (req, res) => {
  const { email } = req.body;

  // Validate the email
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Check if user exists with the provided email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No user found with this email." });
  }

  // Generate a reset token (can be a random string or a crypto-based token)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Set the token and expiration time (e.g., 15 minutes)
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Save the updated user with the reset token and expiration
  await user.save();

  // Send the reset token via email (this will include a link for the user to click)
  try {
    await sendVerificationEmail(user, resetToken, "reset password");
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Error sending password reset email." });
  }
};

module.exports = { handleForgotPasswordRequest };
