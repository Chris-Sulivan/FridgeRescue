// Import the Express application
const app = require("./app");

// Define the server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`FridgeRescue server running on port ${PORT}`);
});