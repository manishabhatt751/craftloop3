const express = require("express");
const router = express.Router();
const {
  getPracticesByCourse,
  getPracticesByLesson,
  getPracticeById,
  startPractice,
  submitPractice,
  sharePracticeToCommunity,
  getMyPractices,
  createPractice,
} = require("../controllers/practiceController");
const { protect, optionalAuth, restrictTo } = require("../middleware/authMiddleware");

// User's my practices list (for My Learning)
router.get("/my", protect, getMyPractices);

// Course & lesson practices (with optional auth to show user progress)
router.get("/course/:courseId", optionalAuth, getPracticesByCourse);
router.get("/lesson/:lessonId", optionalAuth, getPracticesByLesson);

// Single practice details
router.get("/:id", optionalAuth, getPracticeById);

// Start practice
router.post("/:id/start", protect, startPractice);

// Submit practice work (with optional portfolio project creation)
router.post("/:id/submit", protect, submitPractice);

// Share practice to community
router.post("/:id/share", protect, sharePracticeToCommunity);

// Create practice (Creator only)
router.post("/", protect, restrictTo("creator"), createPractice);

module.exports = router;
