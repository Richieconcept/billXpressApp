const express = require("express");
const { getProfile, updateProfile, deleteAccount, getUserWithVirtualAccounts } = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/profile", authenticate, getProfile);  // ✅ Now returns wallet & virtual accounts

router.put("/profile", authenticate, updateProfile);
router.delete("/profile", authenticate, deleteAccount);

// ✅ Fetch user profile with virtual accounts & transactions
router.get("/profile/:userId", authenticate, getUserWithVirtualAccounts);


module.exports = router;
