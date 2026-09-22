const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Generate JWT token containing safe identity info
 */
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured in server environment");
  }
  return jwt.sign({ id, role }, secret, {
    expiresIn: "30d",
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (creator or viewer)
 * @access  Public
 */
const register = async (req, res) => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    const rawName = req.body?.name || req.body?.fullName || "";
    const rawEmail = req.body?.email || "";
    const rawPassword = req.body?.password || "";
    const rawRole = req.body?.role || "creator";

    const name = String(rawName).trim();
    const email = String(rawEmail).trim().toLowerCase();
    const password = String(rawPassword);
    const role = rawRole === "viewer" ? "viewer" : "creator";

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 3. Check whether the email already exists
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existingUser = await User.findOne({
      $or: [{ email }, { email: new RegExp(`^${escapedEmail}$`, "i") }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // 4. Hash password exactly once
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user in MongoDB Atlas
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user._id, user.role);

    // 6. Return safe response without password
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        title: user.title || "",
        skills: user.skills || [],
        balance: user.balance || 0,
      },
    });
  } catch (err) {
    console.error("Technical registration error:", err.message || err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ") || "Validation error during registration.",
      });
    }

    if (
      err.name === "MongooseServerSelectionError" ||
      err.name === "MongoNetworkError" ||
      mongoose.connection.readyState !== 1
    ) {
      return res.status(500).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
const login = async (req, res) => {
  try {
    // Check database connection state
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    const rawEmail = req.body?.email || "";
    const rawPassword = req.body?.password || "";

    const email = String(rawEmail).trim().toLowerCase();
    const password = String(rawPassword);

    // 1. Validate email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user in MongoDB (exact lowercase first, case-insensitive regex fallback)
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      user = await User.findOne({
        email: new RegExp(`^${escaped}$`, "i"),
      }).select("+password");
    }

    // 3. Reject invalid credentials with 401 without revealing whether email exists
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Generate JWT
    const token = generateToken(user._id, user.role);

    // 6. Return safe user info without password
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        title: user.title || "",
        skills: user.skills || [],
        balance: user.balance || 0,
      },
    });
  } catch (err) {
    console.error("Technical login error:", err.message || err);

    if (
      err.name === "MongooseServerSelectionError" ||
      err.name === "MongoNetworkError" ||
      mongoose.connection.readyState !== 1
    ) {
      return res.status(500).json({
        success: false,
        message: "Database service unavailable",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user
 * @access  Protected
 */
const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ success: false, message: "Database service unavailable" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        title: user.title || "",
        skills: user.skills || [],
        balance: user.balance || 0,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Technical getMe error:", err.message || err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { register, login, getMe };

