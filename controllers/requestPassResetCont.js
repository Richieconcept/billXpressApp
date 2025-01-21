const crypto = require("crypto");
const User = require("../models/user");
const sendVerificationEmail = require("../utils/sendVerificationEmail"); // Assumes you have an email utility function

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token expiry (15 minutes)
    const tokenExpiry = Date.now() + 15 * 60 * 1000;

    // Save the token and expiry to the user's record
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = tokenExpiry;
    await user.save();

    // Create the password reset link
    const resetLink = `http://frontend-url.com/reset-password?token=${resetToken}&email=${email}`;

    // Send the reset link via email
    await sendVerificationEmail(email, resetLink);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "An error occurred while requesting password reset." });
  }
};

module.exports = { requestPasswordReset };
