const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const messageRoutes = require("./messageRoutes");
const courseRoutes = require("./courseRoutes");
const projectRoutes = require("./projectRoutes");
const enrollmentRoutes = require("./enrollmentRoutes");
const aiRoutes = require("./aiRoutes");
const notificationRoutes = require("./notificationRoutes");
const walletRoutes = require("./walletRoutes");
const supportRoutes = require("./supportRoutes");
const savedProjectRoutes = require("./savedProjectRoutes");
const uploadRoutes = require("./uploadRoutes");
const { createNotification } = require("../controllers/notificationController");
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

// AI Chat & Recommendation Assistant routes
router.use("/ai", aiRoutes);

// Notification routes (Phase 17)
router.use("/notifications", notificationRoutes);

// Wallet routes (Phase 18)
router.use("/wallet", walletRoutes);

// Support routes (Phase 19)
router.use("/support", supportRoutes);

// Saved Projects routes (Phase 20)
router.use("/saved-projects", savedProjectRoutes);

// Media Upload routes (Phase 21)
router.use("/upload", uploadRoutes);

// Creators public endpoint for Explore & Search
router.get("/creators", async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: "creator" };
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { bio: searchRegex },
        { skills: { $in: [searchRegex] } },
      ];
    }
    const creators = await User.find(query)
      .select("name email title bio skills avatar")
      .lean();
    res.status(200).json({
      success: true,
      count: creators.length,
      data: creators,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching creators" });
  }
});

// User Profile endpoints
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

router.put("/users/profile", protect, async (req, res) => {
  try {
    const { name, bio, title, profession, skills, avatar, location, username, socialLinks } = req.body;
    const updateData = {};
    if (name) updateData.name = String(name).trim();
    if (bio !== undefined) updateData.bio = String(bio).trim();
    const resolvedTitle = title !== undefined ? title : profession;
    if (resolvedTitle !== undefined) updateData.title = String(resolvedTitle).trim();
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : String(skills).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (avatar !== undefined) updateData.avatar = avatar;
    if (location !== undefined) updateData.location = String(location).trim();
    if (username !== undefined) updateData.username = String(username).trim();
    if (socialLinks !== undefined && typeof socialLinks === "object") updateData.socialLinks = socialLinks;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// Community Posts endpoints
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

router.post("/community/posts", protect, async (req, res) => {
  try {
    const { content, category, tags, image } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: "Post content is required." });
    }

    const postTags = Array.isArray(tags) ? tags : (category ? [category] : []);
    const post = await CommunityPost.create({
      author: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar || "",
      authorRole: req.user.title || (req.user.role === "creator" ? "Creator" : "Viewer"),
      content: String(content).trim(),
      tags: postTags,
      image: image || "",
    });

    await post.populate("author", "name avatar role title");

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: post,
    });
  } catch (err) {
    console.error("Create community post error:", err);
    res.status(500).json({ success: false, message: "Error creating community post" });
  }
});

router.post("/community/posts/:id/like", protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const userIdStr = req.user._id.toString();
    const likedIndex = post.likes.findIndex((id) => id.toString() === userIdStr);

    if (likedIndex >= 0) {
      post.likes.splice(likedIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    // Trigger notification on like
    if (likedIndex < 0 && post.author && post.author.toString() !== req.user._id.toString()) {
      createNotification({
        recipient: post.author,
        sender: req.user._id,
        type: "community",
        title: "New like on your post",
        message: `${req.user.name} liked your community post.`,
        relatedId: post._id,
        relatedType: "CommunityPost",
      });
    }

    res.status(200).json({
      success: true,
      liked: likedIndex < 0,
      likesCount: post.likes.length,
      data: post,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating like" });
  }
});

router.post("/community/posts/:id/comments", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required." });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const comment = {
      author: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar || "",
      text: String(text).trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Trigger notification on comment
    if (post.author && post.author.toString() !== req.user._id.toString()) {
      createNotification({
        recipient: post.author,
        sender: req.user._id,
        type: "community",
        title: "New comment on your post",
        message: `${req.user.name} commented: "${String(text).slice(0, 50)}${String(text).length > 50 ? "..." : ""}"`,
        relatedId: post._id,
        relatedType: "CommunityPost",
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: post,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding comment" });
  }
});

router.delete("/community/posts/:id", protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    // Ownership check: only the author can delete their post
    if (post.author && post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post." });
    }

    await post.deleteOne();
    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting post" });
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
      ai: "/api/ai/chat",
    },
  });
});

module.exports = router;
