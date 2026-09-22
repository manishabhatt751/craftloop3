const mongoose = require("mongoose");
const { SavedProject, Project } = require("../models");
const { createNotification } = require("./notificationController");

// GET /api/saved-projects
const getSavedProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await SavedProject.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "project",
        populate: { path: "creator", select: "name avatar title email" },
      });

    // Extract valid populated projects
    const validProjects = records
      .filter((r) => r.project != null)
      .map((r) => ({
        ...r.project.toObject(),
        savedAt: r.createdAt,
        savedRecordId: r._id,
      }));

    return res.status(200).json({
      success: true,
      count: validProjects.length,
      data: validProjects,
    });
  } catch (error) {
    console.error("Error fetching saved projects:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch saved projects." });
  }
};

// GET /api/saved-projects/ids
const getSavedProjectIds = async (req, res) => {
  try {
    const records = await SavedProject.find({ user: req.user._id }).select("project");
    const ids = records.map((r) => r.project.toString());
    return res.status(200).json({
      success: true,
      data: ids,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch saved project IDs." });
  }
};

// POST /api/saved-projects/:projectId
const saveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Valid project ID is required." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const existing = await SavedProject.findOne({ user: userId, project: projectId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Project is already saved.",
        data: existing,
      });
    }

    const record = await SavedProject.create({
      user: userId,
      project: projectId,
    });

    // Notify creator of bookmark
    if (project.creator && project.creator.toString() !== userId.toString()) {
      createNotification({
        recipient: project.creator,
        sender: userId,
        type: "project",
        title: "Project Bookmarked",
        message: `${req.user.name} bookmarked your project "${project.title}".`,
        relatedId: project._id,
        relatedType: "Project",
      }).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: "Project saved successfully.",
      data: record,
    });
  } catch (error) {
    console.error("Error saving project:", error);
    return res.status(500).json({ success: false, message: "Failed to save project." });
  }
};

// DELETE /api/saved-projects/:projectId
const unsaveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Valid project ID is required." });
    }

    await SavedProject.findOneAndDelete({ user: userId, project: projectId });

    return res.status(200).json({
      success: true,
      message: "Project removed from saved.",
    });
  } catch (error) {
    console.error("Error unsaving project:", error);
    return res.status(500).json({ success: false, message: "Failed to remove project from saved." });
  }
};

// GET /api/saved-projects/:projectId/status
const checkSavedStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Valid project ID is required." });
    }

    const exists = await SavedProject.exists({ user: req.user._id, project: projectId });
    return res.status(200).json({
      success: true,
      isSaved: Boolean(exists),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to check saved status." });
  }
};

module.exports = {
  getSavedProjects,
  getSavedProjectIds,
  saveProject,
  unsaveProject,
  checkSavedStatus,
};
