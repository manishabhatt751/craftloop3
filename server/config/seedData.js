const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User, Course, Project } = require("../models");

// Stable ObjectIds so tokens and references remain valid across in-memory restarts
const SEED_IDS = {
  viewerUser: new mongoose.Types.ObjectId("65f000000000000000000001"),
  creatorUser: new mongoose.Types.ObjectId("65f000000000000000000002"),
  videoCreator: new mongoose.Types.ObjectId("65f000000000000000000003"),
  designCreator: new mongoose.Types.ObjectId("65f000000000000000000004"),
  uiCreator: new mongoose.Types.ObjectId("65f000000000000000000005"),
  devCreator: new mongoose.Types.ObjectId("65f000000000000000000006"),
  videoCourse: new mongoose.Types.ObjectId("65f000000000000000000011"),
  designCourse: new mongoose.Types.ObjectId("65f000000000000000000012"),
  uiCourse: new mongoose.Types.ObjectId("65f000000000000000000013"),
  devCourse: new mongoose.Types.ObjectId("65f000000000000000000014"),
  videoProject: new mongoose.Types.ObjectId("65f000000000000000000021"),
  designProject: new mongoose.Types.ObjectId("65f000000000000000000022"),
  uiProject: new mongoose.Types.ObjectId("65f000000000000000000023"),
  devProject: new mongoose.Types.ObjectId("65f000000000000000000024"),
};

/**
 * Seeds initial essential data if collections are empty.
 * Runs on server start to guarantee real creators, courses, and projects
 * are always available for the AI recommendation system and active logins.
 */
async function seedDataIfEmpty() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Already populated
    }

    console.log("🌱 Populating initial CraftLoop seed data for creators, courses & AI...");

    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash("password123", salt);

    // 1. Seed Users & Creators
    const usersToInsert = [
      {
        _id: SEED_IDS.viewerUser,
        name: "Alex Viewer",
        email: "viewer@craftloop.com",
        password: defaultPasswordHash,
        role: "viewer",
        bio: "Passionate digital learner exploring creative arts and technology.",
      },
      {
        _id: SEED_IDS.creatorUser,
        name: "Morgan Creator",
        email: "creator@craftloop.com",
        password: defaultPasswordHash,
        role: "creator",
        title: "Digital Media Producer",
        bio: "Creating multimedia courses, design templates, and interactive tutorials.",
        skills: ["Video Editing", "Content Creation", "Graphic Design"],
        balance: 1200,
      },
      {
        _id: SEED_IDS.videoCreator,
        name: "Jordan Lee (Video Pro)",
        email: "jordan@craftloop.com",
        password: defaultPasswordHash,
        role: "creator",
        title: "Senior Video Editor & Motion Designer",
        bio: "Specializing in Adobe Premiere Pro, DaVinci Resolve, color grading, and dynamic YouTube video editing.",
        skills: ["Video Editing", "Motion Graphics", "Premiere Pro", "DaVinci Resolve", "Color Grading", "Content Creation"],
        balance: 2450,
      },
      {
        _id: SEED_IDS.designCreator,
        name: "Elena Rostova (Designer)",
        email: "elena@craftloop.com",
        password: defaultPasswordHash,
        role: "creator",
        title: "Brand & Graphic Designer",
        bio: "Crafting modern logos, flyers, typography systems, and brand identity kits using Illustrator and Photoshop.",
        skills: ["Graphic Design", "Branding", "Typography", "Adobe Illustrator", "Photoshop", "Visual Identity"],
        balance: 3100,
      },
      {
        _id: SEED_IDS.uiCreator,
        name: "Alex Chen (UI/UX)",
        email: "alex@craftloop.com",
        password: defaultPasswordHash,
        role: "creator",
        title: "Principal UI/UX Designer",
        bio: "Building accessible design systems, user flows, and interactive prototypes in Figma.",
        skills: ["UI/UX Design", "Figma", "Wireframing", "Prototyping", "Design Systems", "User Research"],
        balance: 4200,
      },
      {
        _id: SEED_IDS.devCreator,
        name: "Sarah Dev (Full-Stack)",
        email: "sarah@craftloop.com",
        password: defaultPasswordHash,
        role: "creator",
        title: "Full-Stack Web Developer",
        bio: "Modern web applications with React, Node.js, Express, MongoDB, and Tailwind CSS.",
        skills: ["Web Development", "React", "JavaScript", "Node.js", "Frontend Development", "Backend Development"],
        balance: 3800,
      },
    ];

    await User.insertMany(usersToInsert);

    // 2. Seed Published Courses
    const coursesToInsert = [
      {
        _id: SEED_IDS.videoCourse,
        title: "Mastering Premiere Pro: From Zero to Pro Video Editor",
        description: "Comprehensive step-by-step video editing course covering timeline assembly, audio cleanup, B-roll layering, color grading, and YouTube optimization.",
        category: "Video Editing",
        level: "Beginner",
        price: 49.99,
        status: "Published",
        instructor: SEED_IDS.videoCreator,
        creator: SEED_IDS.videoCreator,
        lessons: [
          { title: "Workspace & Timeline Fundamentals", duration: 15, isFree: true },
          { title: "Cutting Techniques & Narrative Pacing", duration: 25, isFree: false },
          { title: "Audio Mastering & Sound Design", duration: 20, isFree: false },
          { title: "Cinematic Color Correction & Grading", duration: 30, isFree: false },
        ],
      },
      {
        _id: SEED_IDS.designCourse,
        title: "Complete Graphic Design & Brand Identity Mastery",
        description: "Master visual hierarchy, typography, color harmony, and professional logo & flyer creation using Adobe Illustrator and Photoshop.",
        category: "Graphic Design",
        level: "Beginner",
        price: 39.99,
        status: "Published",
        instructor: SEED_IDS.designCreator,
        creator: SEED_IDS.designCreator,
        lessons: [
          { title: "Core Principles of Visual Design", duration: 18, isFree: true },
          { title: "Typography That Commands Attention", duration: 22, isFree: false },
          { title: "Designing Modern Marketing Flyers", duration: 28, isFree: false },
        ],
      },
      {
        _id: SEED_IDS.uiCourse,
        title: "Figma to Product: Modern UI/UX Design Systems",
        description: "Design intuitive digital products, wireframes, component libraries, and clickable interactive prototypes in Figma.",
        category: "UI/UX Design",
        level: "Intermediate",
        price: 59.99,
        status: "Published",
        instructor: SEED_IDS.uiCreator,
        creator: SEED_IDS.uiCreator,
        lessons: [
          { title: "User Research & Information Architecture", duration: 20, isFree: true },
          { title: "Figma Auto-Layout & Design Tokens", duration: 35, isFree: false },
          { title: "Interactive Usability Prototyping", duration: 30, isFree: false },
        ],
      },
      {
        _id: SEED_IDS.devCourse,
        title: "Full-Stack Web Development with React & Node.js",
        description: "Build robust, responsive web applications from scratch with modern React, Express REST APIs, and MongoDB database modeling.",
        category: "Web Development",
        level: "Beginner",
        price: 69.99,
        status: "Published",
        instructor: SEED_IDS.devCreator,
        creator: SEED_IDS.devCreator,
        lessons: [
          { title: "Modern JavaScript & React Fundamentals", duration: 25, isFree: true },
          { title: "Building REST APIs with Express & Node", duration: 35, isFree: false },
          { title: "Database Modeling with MongoDB & Mongoose", duration: 30, isFree: false },
        ],
      },
    ];

    await Course.insertMany(coursesToInsert);

    // 3. Seed Published Projects
    const projectsToInsert = [
      {
        _id: SEED_IDS.videoProject,
        title: "Cinematic Travel Montage & Color Grading Showcase",
        description: "A 4K cinematic travel video montage featuring multi-cam timeline cuts, sound design pacing, and custom LUT color grading.",
        category: "Video Editing",
        tags: ["Video Editing", "Premiere Pro", "Color Grading", "YouTube"],
        tools: ["Adobe Premiere Pro", "DaVinci Resolve", "After Effects"],
        status: "Published",
        creator: SEED_IDS.videoCreator,
        likes: 12,
      },
      {
        _id: SEED_IDS.designProject,
        title: "EcoTech Brand Identity & Marketing Flyer Suite",
        description: "A complete brand identity design system including modern vector logo, typography guidelines, and promotional marketing collateral.",
        category: "Graphic Design",
        tags: ["Graphic Design", "Branding", "Flyer", "Typography"],
        tools: ["Adobe Illustrator", "Photoshop", "Figma"],
        status: "Published",
        creator: SEED_IDS.designCreator,
        likes: 12,
      },
      {
        _id: SEED_IDS.uiProject,
        title: "FinTech Mobile Banking App UI Kit & Prototype",
        description: "High-fidelity mobile banking UI kit with light/dark themes, auto-layout components, and micro-interaction animations.",
        category: "UI/UX Design",
        tags: ["UI/UX Design", "Figma", "Design Systems", "Prototyping"],
        tools: ["Figma", "FigJam", "Miro"],
        status: "Published",
        creator: SEED_IDS.uiCreator,
        likes: 12,
      },
      {
        _id: SEED_IDS.devProject,
        title: "CraftLoop Social Marketplace Platform",
        description: "Interactive full-stack web application featuring JWT authentication, real-time messaging with Socket.io, and REST APIs.",
        category: "Web Development",
        tags: ["Web Development", "React", "Node.js", "MongoDB"],
        tools: ["VS Code", "Node.js", "React", "Tailwind CSS"],
        status: "Published",
        creator: SEED_IDS.devCreator,
        likes: 12,
      },
    ];

    await Project.insertMany(projectsToInsert);

    console.log("✅ CraftLoop initial seed data created successfully.");
  } catch (error) {
    console.warn("⚠️  Seed data warning:", error.message);
  }
}

/**
 * Safely removes ONLY artificial seed records (by explicit SEED_IDS & demo emails).
 * STRICTLY PRESERVES all legitimate real user-created accounts, projects, and courses.
 */
async function cleanSeedDataOnly() {
  try {
    const seedUserIds = [
      SEED_IDS.viewerUser,
      SEED_IDS.creatorUser,
      SEED_IDS.videoCreator,
      SEED_IDS.designCreator,
      SEED_IDS.uiCreator,
      SEED_IDS.devCreator,
    ];

    const seedCourseIds = [
      SEED_IDS.videoCourse,
      SEED_IDS.designCourse,
      SEED_IDS.uiCourse,
      SEED_IDS.devCourse,
    ];

    const seedProjectIds = [
      SEED_IDS.videoProject,
      SEED_IDS.designProject,
      SEED_IDS.uiProject,
      SEED_IDS.devProject,
    ];

    const demoEmails = [
      "viewer@craftloop.com",
      "creator@craftloop.com",
      "jordan@craftloop.com",
      "elena@craftloop.com",
      "alex@craftloop.com",
      "sarah@craftloop.com",
    ];

    const removedUsers = await User.deleteMany({
      $or: [
        { _id: { $in: seedUserIds } },
        { email: { $in: demoEmails } },
      ],
    });

    const removedCourses = await Course.deleteMany({
      $or: [
        { _id: { $in: seedCourseIds } },
        { instructor: { $in: seedUserIds } },
        { creator: { $in: seedUserIds } },
      ],
    });

    const removedProjects = await Project.deleteMany({
      $or: [
        { _id: { $in: seedProjectIds } },
        { creator: { $in: seedUserIds } },
      ],
    });

    console.log("🧹 Seed clean-up complete:");
    console.log(`   Removed ${removedUsers.deletedCount} seed users`);
    console.log(`   Removed ${removedCourses.deletedCount} seed courses`);
    console.log(`   Removed ${removedProjects.deletedCount} seed projects`);
    console.log("   All real user accounts and real projects/courses strictly preserved.");
    return { removedUsers, removedCourses, removedProjects };
  } catch (error) {
    console.error("Clean seed data error:", error.message);
    throw error;
  }
}

module.exports = { seedDataIfEmpty, cleanSeedDataOnly, SEED_IDS };

