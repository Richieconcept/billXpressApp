const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController"); // Import controllers
const { loginUser } = require("../controllers/loginController");
const validateRegistrationInput = require("../middlewares/validateInput");
const { verifyEmail } = require("../controllers/verifyEmailController");
const authenticate = require("../middlewares/authenticate");
const { resendVerificationToken } = require("../controllers/resendTokenController");




// Route for user registration
router.post("/register", validateRegistrationInput, registerUser);

// Route for email verification using a token
router.post("/verify-email", verifyEmail);

// Route for User login
router.post("/login", loginUser);

// Resend Verification Token Route
router.post("/resend-token", authenticate, resendVerificationToken);

module.exports = router;
