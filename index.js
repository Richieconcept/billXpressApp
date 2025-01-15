// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());


// Use the authentication routes
app.use("/api/v1", authRoutes); 



// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI,)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));


// Main server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
