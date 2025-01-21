const User = require("../models/user");

const validateToken = (purpose) => {
  return async (req, res, next) => {
    // Extract token from the query (for email verification link)
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }

    try {
      // Find the user with the matching token
      const user = await User.findOne({ verificationToken: token });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }

      // Check specific purposes if needed (optional)
      if (purpose === "resetPassword" && !user.resetPasswordToken) {
        return res.status(400).json({ message: "Invalid token for password reset." });
      }

      if (purpose === "emailVerification" && user.isVerified) {
        return res.status(400).json({ message: "Email is already verified." });
      }

      // Attach the user to the request object
      req.user = user;
      next(); // Pass control to the next middleware/route handler
    } catch (error) {
      console.error("Error validating token:", error);
      res.status(500).json({ message: "Server error." });
    }
  };
};

module.exports = validateToken;
