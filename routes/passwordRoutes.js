const express = require("express");
const { handleResetPasswordLink, resetPassword } = require("../controllers/resetPassCont");
const { handleForgotPasswordRequest } = require("../controllers/handleForgottenPass");


const router = express.Router();

// Route for forgotten password
router.post("/forgot-password", handleForgotPasswordRequest);

// Route to handle the reset password link
router.get("/reset-password/:token", handleResetPasswordLink);

// Route to reset the password
router.post("/reset-password", resetPassword);

module.exports = router;
