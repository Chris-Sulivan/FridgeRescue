// FridgeRescue - Express Application

const express = require("express");

// Import routes
const healthRoutes = require("./routes/healthRoutes");

// Create Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Welcome endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to FridgeRescue API!"
    });
});

// Register health routes
app.use("/api/health", healthRoutes);

// Export application
module.exports = app;