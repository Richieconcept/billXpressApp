// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController"); // Import controller

// Route for user registration
router.post("/register", registerUser); // post to the index

module.exports = router;
