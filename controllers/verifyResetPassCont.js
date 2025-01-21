const User = require("../models/user");

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body; // Only token is required

    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }

    // Find the user by token and ensure it's not expired
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    res.status(200).json({ message: "Reset token is valid." });
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(500).json({ message: "An error occurred while verifying the reset token." });
  }
};

module.exports = { verifyResetToken };
