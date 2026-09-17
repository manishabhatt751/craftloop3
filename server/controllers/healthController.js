const mongoose = require("mongoose");

/**
 * Health check controller
 * @route   GET /api/health
 * @desc    Check API and MongoDB connection status
 */
const getHealthStatus = async (req, res) => {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  const dbState = stateMap[mongoose.connection.readyState] || "unknown";

  res.json({
    status: "ok",
    app: "CraftLoop Backend API",
    version: "1.0.0",
    database: `mongodb (${dbState})`,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};

