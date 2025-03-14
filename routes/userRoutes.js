// routes/userRoutes.js
const express = require("express");
const { getProfile, updateProfile, deleteAccount, getUserWithVirtualAccounts } = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// Get user profile (Protected)
router.get("/profile", authenticate, getProfile);

// Update user profile (Protected)
router.put("/profile", authenticate, updateProfile);

// Delete user account (Protected)
router.delete("/profile", authenticate, deleteAccount);

module.exports = router;
