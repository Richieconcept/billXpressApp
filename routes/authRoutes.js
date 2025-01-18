const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController"); // Import controllers
const { sendVerificationEmail, verifyEmailToken} = require("../controllers/verifyEmailController")
const { loginUser } = require("../controllers/loginController");


// Route for user registration
router.post("/register", registerUser);

// Route for email verification using a token
router.post("/verify", verifyEmailToken);

// Route for User login
router.post("/login", loginUser);

module.exports = router;
