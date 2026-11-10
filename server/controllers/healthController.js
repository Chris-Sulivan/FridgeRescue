// FridgeRescue - Health Controller
// Handles requests to check whether the API is running

const getHealthStatus = (req, res) => {
    res.status(200).json({
        success: true,
        message: "FridgeRescue API is running successfully!",
        status: "OK"
    });
};

// Export the controller function
module.exports = {
    getHealthStatus
};