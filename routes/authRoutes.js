const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController"); // Import controllers
const { verifyEmail } = require("../controllers/verifyEmailController")

// Route for user registration
router.post("/register", registerUser);

// Route for email verification using a token
router.get("/verify/:token", verifyEmail); // Verify user email with the token

module.exports = router;
