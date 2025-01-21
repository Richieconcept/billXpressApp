const express = require("express");
const router = express.Router();
const {requestPasswordReset} = require("../controllers/requestPassResetCont")
const {verifyResetToken} = require("../controllers/verifyResetPassCont")
const {resetPassword} = require("../controllers/resetPassCont")
const validateRegistrationInput = require("../middlewares/validateInput");


// Request reset token
router.post("/forgot-password", requestPasswordReset);

// Verify reset token
router.post("/verify-reset-token", verifyResetToken);

// Reset password
router.post("/reset-password", resetPassword);

module.exports = router;
