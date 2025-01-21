const verifyResetToken = async (req, res) => {
    try {
      const { token, email } = req.query;
  
      // Find the user with the matching token and email
      const user = await User.findOne({
        email,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
  
      res.status(200).json({ message: "Token is valid." });
    } catch (error) {
      console.error("Error verifying reset token:", error);
      res.status(500).json({ message: "An error occurred while verifying the reset token." });
    }
  };
  
  module.exports = { verifyResetToken };
  