const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController"); // Import controllers
const { sendVerificationEmail } = require("../controllers/verifyEmailController")
const { loginUser } = require("../controllers/loginController");


// Route for user registration
router.post("/register", registerUser);

// Route for email verification using a token
router.get("/verify/:token", sendVerificationEmail); // Verify user email with the token

// Route for User login
router.post("/login", loginUser);

module.exports = router;
