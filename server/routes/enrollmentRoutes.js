const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyLearning,
  getMyEnrollment,
  updateLessonProgress,
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMyLearning);
router.get("/:courseId", protect, getMyEnrollment);
router.post("/:courseId", protect, enrollInCourse);
router.put("/:courseId/progress", protect, updateLessonProgress);

module.exports = router;
