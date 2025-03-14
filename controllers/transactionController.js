const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
  try {
    const { amount, type, description, userId } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const transaction = new Transaction({
      amount,
      type,
      description,
      user: userId, // Ensure it's an ObjectId
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction saved successfully", transaction });
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createTransaction };
