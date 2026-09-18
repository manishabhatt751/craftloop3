const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getMyConversations,
  markMessagesAsRead,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// All messaging endpoints are protected by JWT
router.post("/", protect, sendMessage);
router.get("/conversations", protect, getMyConversations);
router.get("/conversation/:userId", protect, getConversation);
router.put("/conversation/:userId/read", protect, markMessagesAsRead);
router.delete("/:id", protect, deleteMessage);

module.exports = router;
