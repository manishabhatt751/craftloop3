const { getRecommendations } = require("../services/aiRecommendationService");

/**
 * @route   POST /api/ai/chat
 * @desc    Process user chat message and return smart CraftLoop recommendations
 * @access  Private (JWT Protected)
 */
const handleAIChat = async (req, res) => {
  try {
    // 1. Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in to use CraftLoop AI.",
      });
    }

    // 2. Validate payload structure
    if (!req.body || typeof req.body.message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid request format. 'message' string is required.",
      });
    }

    const cleanMessage = req.body.message.trim();

    // 3. Validate non-empty message
    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    // 4. Validate message length limit
    if (cleanMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message exceeds maximum allowed length (2000 characters).",
      });
    }

    // 5. Generate structured recommendations from real MongoDB data
    const recommendationResult = await getRecommendations(cleanMessage, req.user);

    return res.status(200).json(recommendationResult);
  } catch (err) {
    console.error("CraftLoop AI chat error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your AI recommendation request.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = {
  handleAIChat,
};
