// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app's local server
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Allow cookies to be sent with requests
}));

// Use the authentication routes
app.use("/api/v1", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Simple route to confirm API is working
app.get("/", (req, res) => {
  res.send("API is working and the server is running!");
});

// Main server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
