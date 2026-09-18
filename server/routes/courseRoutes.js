const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, restrictTo, optionalAuth } = require("../middleware/authMiddleware");

router.get("/", optionalAuth, getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, restrictTo("creator"), createCourse);
router.put("/:id", protect, restrictTo("creator"), updateCourse);
router.delete("/:id", protect, restrictTo("creator"), deleteCourse);

module.exports = router;
