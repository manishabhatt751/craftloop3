const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../controllers/healthController");

// Health check endpoint
router.get("/health", getHealthStatus);

// Root API information
router.get("/", (req, res) => {
  res.json({
    message: "CraftLoop API is live",
    version: "v1",
    endpoints: {
      health: "/api/health"
    }
  });
});

module.exports = router;
