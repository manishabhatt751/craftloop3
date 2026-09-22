const express = require("express");
const router = express.Router();
const savedProjectController = require("../controllers/savedProjectController");
const { protect } = require("../middleware/authMiddleware");

// All saved projects routes require authentication
router.use(protect);

router.get("/", savedProjectController.getSavedProjects);
router.get("/ids", savedProjectController.getSavedProjectIds);
router.post("/:projectId", savedProjectController.saveProject);
router.delete("/:projectId", savedProjectController.unsaveProject);
router.get("/:projectId/status", savedProjectController.checkSavedStatus);

module.exports = router;
