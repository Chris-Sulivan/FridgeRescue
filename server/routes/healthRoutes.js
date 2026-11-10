// FridgeRescue - Health Routes

const express = require("express");

// Import the controller
const { getHealthStatus } = require("../controllers/healthController");

// Create Express router
const router = express.Router();

// Define health endpoint
router.get("/", getHealthStatus);

// Export router
module.exports = router;