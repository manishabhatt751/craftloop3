const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, restrictTo, optionalAuth } = require("../middleware/authMiddleware");

router.get("/", optionalAuth, getProjects);
router.get("/:id", getProjectById);
router.post("/", protect, restrictTo("creator"), createProject);
router.put("/:id", protect, restrictTo("creator"), updateProject);
router.delete("/:id", protect, restrictTo("creator"), deleteProject);

module.exports = router;
