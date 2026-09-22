const express = require("express");
const router = express.Router();
const { handleAIChat } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// AI chat & recommendation assistant endpoint
router.post("/chat", protect, handleAIChat);

module.exports = router;
