const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const messageRoutes = require("./messageRoutes");
const courseRoutes = require("./courseRoutes");
const projectRoutes = require("./projectRoutes");
const enrollmentRoutes = require("./enrollmentRoutes");
const { protect } = require("../middleware/authMiddleware");
const { CommunityPost, User } = require("../models");

// Health check endpoint
router.get("/health", getHealthStatus);

// Authentication routes
router.use("/auth", authRoutes);

// Messages routes (Phase 6)
router.use("/messages", messageRoutes);

// Courses routes
router.use("/courses", courseRoutes);

// Projects routes
router.use("/projects", projectRoutes);

// Enrollment routes
router.use("/enrollments", enrollmentRoutes);

// User Profile endpoint
router.get("/users/profile", protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

// Community Posts endpoint
router.get("/community/posts", async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .populate("author", "name avatar role title");
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching community posts" });
  }
});

// Root API information
router.get("/", (req, res) => {
  res.json({
    message: "CraftLoop API is live",
    version: "v1",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      messages: "/api/messages",
      courses: "/api/courses",
      projects: "/api/projects",
      enrollments: "/api/enrollments",
    },
  });
});

module.exports = router;
