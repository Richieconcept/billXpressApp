// routes/protectedRoute.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");

// A protected route that requires authentication
router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({
    message: "Access granted to protected route!",
    user: req.user, // The decoded JWT user data
  });
});

module.exports = router;
 