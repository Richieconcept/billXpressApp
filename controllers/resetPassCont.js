const bcrypt = require("bcrypt");
const User = require("../models/user");

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Find the user by email and token
    const user = await User.findOne({
      email,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token and expiry
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "An error occurred while resetting the password." });
  }
};

module.exports = { resetPassword };
