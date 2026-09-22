const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

// Create ticket (authenticated or anonymous with email/name)
router.post("/", optionalAuth, supportController.createTicket);

// Logged-in ticket retrieval
router.get("/", protect, supportController.getMyTickets);
router.get("/:id", protect, supportController.getTicketById);

module.exports = router;
