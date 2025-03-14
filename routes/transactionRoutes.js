const express = require("express");
const { createTransaction } = require("../controllers/transactionController");

const router = express.Router();

router.post("/create", createTransaction); // Route for creating a transaction

module.exports = router;
