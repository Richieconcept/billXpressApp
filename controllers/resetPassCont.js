const bcrypt = require("bcrypt");
const User = require("../models/user");

// Handle the reset password link
const handleResetPasswordLink = async (req, res) => {
  const { token } = req.params;

  // Find the user by the reset token and ensure it's not expired
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token." });
  }

  res.status(200).json({ message: "Token is valid. You can now reset your password." });
};

// Reset the password once the new one is provided
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Check for required fields
  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  // Find the user by the reset token and check if it's valid
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token." });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear the reset token and expiration
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Save the updated user
  await user.save();

  res.status(200).json({ message: "Password reset successfully." });
};

module.exports = { handleResetPasswordLink, resetPassword };
