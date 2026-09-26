const mongoose = require("mongoose");
const { Practice, PracticeSubmission, Course, Project, CommunityPost } = require("../models");

/**
 * Universal practice generator based on course category and lesson title.
 * Provides tailored Quick Practice, Skill Challenge, and Real-World Project
 * for any course (technical or non-technical: Mehndi, Cooking, Video, Design, Coding, etc.)
 */
function createStarterPracticesForLesson(course, lesson, index) {
  const category = course.category || "General";
  const lessonTitle = lesson.title || `Lesson ${index + 1}`;
  const lessonIdStr = (lesson._id || lesson.id || `lesson-${index + 1}`).toString();
  const lowerCat = category.toLowerCase();
  const lowerTitle = lessonTitle.toLowerCase();

  const practices = [];

  // Determine skill-specific flavor
  if (lowerCat.includes("mehndi") || lowerTitle.includes("mehndi")) {
    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: Quick Pattern Sketch`,
      description: `Create 3 basic pattern motifs learned in "${lessonTitle}" on paper or drawing practice sheet.`,
      difficulty: "Beginner",
      type: "quick",
      estimatedTime: "15 mins",
      instructions: [
        "Take a blank paper or practice template and a cone/pen.",
        "Draw three distinct motifs (e.g., paisley, floral, or leaf grid) demonstrated in this lesson.",
        "Focus on consistent line thickness and steady hand pressure.",
        "Take a clear photo of your practice sheet.",
      ],
      skills: ["Hand Steadiness", "Motif Symmetry", "Line Consistency"],
      hints: ["Keep your cone at a 45-degree angle for smooth paste flow."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: Comprehensive Palm Design Challenge`,
      description: `Combine the individual motifs into a cohesive palm design layout with proper flow and spacing.`,
      difficulty: "Intermediate",
      type: "challenge",
      estimatedTime: "35 mins",
      instructions: [
        "Start with a central focal element on the palm.",
        "Incorporate connecting vine or shading elements from the lesson.",
        "Balance dense focal areas with elegant negative space.",
        "Capture your completed design in good lighting.",
      ],
      skills: ["Composition Flow", "Negative Space Balance", "Pattern Integration"],
      hints: ["Draft light boundary guidelines before filling in dense details."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${course.title}: Festive Bridal/Occasion Showcase Project`,
      description: `Design a full portfolio-worthy festival or occasion mehndi layout and showcase it to the community.`,
      difficulty: "Advanced",
      type: "project",
      estimatedTime: "60 mins",
      instructions: [
        "Choose an occasion theme (Festival, Eid, Wedding, or Contemporary).",
        "Create the full hand and wrist design incorporating all taught techniques.",
        "Ensure professional presentation and photograph under natural lighting.",
        "Publish this project to your CraftLoop portfolio.",
      ],
      skills: ["Portfolio Presentation", "Full Hand Composition", "Artistic Styling"],
      hints: ["Take photos with clean background and good contrast."],
      creator: course.creator,
    });
  } else if (lowerCat.includes("video") || lowerTitle.includes("video") || lowerTitle.includes("edit")) {
    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: 3-Clip Timeline Cut & Pacing`,
      description: `Import 3 raw clips and practice clean J-cuts, L-cuts, and seamless narrative pacing as covered in "${lessonTitle}".`,
      difficulty: "Beginner",
      type: "quick",
      estimatedTime: "15 mins",
      instructions: [
        "Import three sample video takes into your editing timeline.",
        "Trim dead air and align speech beats for natural rhythm.",
        "Apply at least one audio J-cut or L-cut transition.",
        "Export a short 15-second clip or screenshot your timeline.",
      ],
      skills: ["Timeline Navigation", "J/L Cuts", "Pacing & Trimming"],
      hints: ["Cut on subject action or head movements to hide cuts."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: 30-Second Teaser with Audio Leveling`,
      description: `Build an engaging 30-second teaser combining B-roll layering, background music ducking, and sound design.`,
      difficulty: "Intermediate",
      type: "challenge",
      estimatedTime: "45 mins",
      instructions: [
        "Lay down primary dialogue and level voice to -6dB to -12dB.",
        "Layer contextual B-roll clips every 4-6 seconds to maintain audience engagement.",
        "Duck background music to -22dB during dialogue.",
        "Export the polished teaser video.",
      ],
      skills: ["Audio Ducking", "B-Roll Storytelling", "Audience Retention"],
      hints: ["Use sound effects (SFX) like swooshes or hits to emphasize visual transitions."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${course.title}: Cinematic Commercial / Travel Promo Reel`,
      description: `Produce a complete, portfolio-ready cinematic promotional video using all learned editing and grading techniques.`,
      difficulty: "Advanced",
      type: "project",
      estimatedTime: "90 mins",
      instructions: [
        "Select a clear storytelling concept (e.g., travel montage, product commercial, or creator trailer).",
        "Assemble the story with dynamic pacing and rhythmic cutting to music beats.",
        "Apply cohesive color correction and grading LUTs.",
        "Add professional typography lower thirds and title cards.",
        "Add this finished project to your CraftLoop portfolio.",
      ],
      skills: ["Cinematic Storytelling", "Color Grading", "Commercial Production"],
      hints: ["Export using H.264/H.265 at maximum bitrate for YouTube/Instagram upload."],
      creator: course.creator,
    });
  } else if (lowerCat.includes("graphic") || lowerCat.includes("design") || lowerTitle.includes("typography") || lowerTitle.includes("color")) {
    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: 2-Font Hierarchy Exercise`,
      description: `Practice font pairing and visual hierarchy based on "${lessonTitle}" by designing a typographic event headline.`,
      difficulty: "Beginner",
      type: "quick",
      estimatedTime: "15 mins",
      instructions: [
        "Select an event topic (e.g., Art Exhibition, Music Night, or Tech Summit).",
        "Choose 2 complementary fonts (e.g., bold display serif headline + clean sans-serif body).",
        "Establish clear hierarchy using font scale, weight, and tracking.",
        "Export as a high-resolution PNG or JPG image.",
      ],
      skills: ["Font Pairing", "Typographic Scale", "Visual Hierarchy"],
      hints: ["Avoid using more than two font families; use weights and sizes instead."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: Social Media Campaign Graphic`,
      description: `Create a vibrant social media poster combining typography, harmonious color palettes, and balanced layout.`,
      difficulty: "Intermediate",
      type: "challenge",
      estimatedTime: "40 mins",
      instructions: [
        "Set canvas dimensions to 1080x1080 (Square) or 1080x1350 (Portrait).",
        "Apply a 60-30-10 color rule with high contrast between text and background.",
        "Incorporate a strong visual focal point and supporting secondary details.",
        "Save and export your artwork.",
      ],
      skills: ["Color Contrast", "Composition Balance", "Social Media Layout"],
      hints: ["Check contrast accessibility to ensure text is effortlessly readable on mobile screens."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${course.title}: Full Brand Identity & Promotional Poster Suite`,
      description: `Develop a comprehensive promotional poster and marketing collateral piece to add to your CraftLoop portfolio.`,
      difficulty: "Advanced",
      type: "project",
      estimatedTime: "75 mins",
      instructions: [
        "Create a real-world promotional poster for an event, brand, or local business.",
        "Include branding badge, bold call to action, date/venue, and structured grid.",
        "Export your artwork in both screen and print mockup formats.",
        "Publish directly to your CraftLoop portfolio and share in the community.",
      ],
      skills: ["Brand Identity", "Print & Digital Composition", "Portfolio Curation"],
      hints: ["Present your design in a realistic context or mockup for maximum portfolio impact."],
      creator: course.creator,
    });
  } else if (lowerCat.includes("ui") || lowerCat.includes("figma") || lowerTitle.includes("prototype") || lowerTitle.includes("interface")) {
    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: Auto-Layout Component Card`,
      description: `Build an adaptive UI component card in Figma using auto-layout, design tokens, and clean spacing.`,
      difficulty: "Beginner",
      type: "quick",
      estimatedTime: "15 mins",
      instructions: [
        "Create a card container with auto-layout padding (16px/24px).",
        "Add an image frame, title, subtitle, and primary call-to-action button.",
        "Set responsive constraints to hug contents and fill container.",
        "Export an image of your component and auto-layout configuration.",
      ],
      skills: ["Auto-Layout", "Component Constraints", "Spacing Rhythm"],
      hints: ["Use 8pt grid values (8px, 16px, 24px) for harmonious vertical rhythm."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: 3-Screen Mobile Flow Challenge`,
      description: `Design an end-to-end 3-screen mobile flow (Browse, Detail, Confirmation) with accessible color contrast.`,
      difficulty: "Intermediate",
      type: "challenge",
      estimatedTime: "45 mins",
      instructions: [
        "Design 3 connected mobile screens on a standard 390x844 canvas.",
        "Maintain cohesive typography styles and unified component styling across screens.",
        "Ensure tap targets are at least 44x44px for touch accessibility.",
        "Export screen frames or prototype link.",
      ],
      skills: ["User Flow Consistency", "Touch Accessibility", "Design Systems"],
      hints: ["Create reusable master components for navigation bars and buttons."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${course.title}: Interactive Prototype & Case Study Project`,
      description: `Assemble a clickable interactive prototype and case study for your CraftLoop portfolio.`,
      difficulty: "Advanced",
      type: "project",
      estimatedTime: "90 mins",
      instructions: [
        "Connect interactive transitions (smart animate, modal overlays) in Figma.",
        "Document user problem, wireframes, iteration rationale, and final UI.",
        "Export presentation mockups and attach your prototype URL.",
        "Add to your CraftLoop portfolio and gather feedback in Community.",
      ],
      skills: ["Interactive Prototyping", "Design Case Study", "UX Documentation"],
      hints: ["Record a brief screen walkthrough of your interactive prototype."],
      creator: course.creator,
    });
  } else {
    // Generic fallback for coding, cooking, photography, marketing, crafts, etc.
    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: Quick Hands-on Exercise`,
      description: `Apply the core technique demonstrated in "${lessonTitle}" in a focused 15-minute hands-on exercise.`,
      difficulty: "Beginner",
      type: "quick",
      estimatedTime: "15 mins",
      instructions: [
        `Review the core technique presented in "${lessonTitle}".`,
        "Set up your workspace and follow the demonstration steps independently.",
        "Verify your output against the lesson's target results.",
        "Document or capture your practice work.",
      ],
      skills: ["Hands-on Application", "Foundational Technique", "Step Execution"],
      hints: ["Take notes during the video before attempting the exercise without pausing."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${lessonTitle}: Skill Application Challenge`,
      description: `Complete a practical skill challenge combining concepts from "${lessonTitle}" without step-by-step guidance.`,
      difficulty: "Intermediate",
      type: "challenge",
      estimatedTime: "40 mins",
      instructions: [
        "Apply the lesson's skills to solve a realistic problem prompt.",
        "Make creative/technical decisions independently.",
        "Refine your solution for quality and clarity.",
        "Submit your practice result with brief notes.",
      ],
      skills: ["Independent Problem Solving", "Practical Execution", "Technique Synthesis"],
      hints: ["Check CraftLoop AI if you need guidance breaking the challenge down."],
      creator: course.creator,
    });

    practices.push({
      course: course._id,
      lessonId: lessonIdStr,
      lessonTitle,
      title: `${course.title}: Real-World Showcase Project`,
      description: `Build a comprehensive real-world outcome based on this course to showcase in your portfolio.`,
      difficulty: "Advanced",
      type: "project",
      estimatedTime: "80 mins",
      instructions: [
        "Plan and execute a complete project outcome from scratch.",
        "Incorporate best practices taught throughout the course.",
        "Package your work with high-quality documentation or visual assets.",
        "Publish directly to your CraftLoop portfolio and share in Community.",
      ],
      skills: ["End-to-End Execution", "Quality Polish", "Portfolio Presentation"],
      hints: ["Focus on creating a project you would proudly present to a client or employer."],
      creator: course.creator,
    });
  }

  return practices;
}

/**
 * @route   GET /api/practices/course/:courseId
 * @desc    Get all practice activities for a course (with user submission progress if logged in)
 * @access  Public / Optional Auth
 */
const getPracticesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Valid course ID is required." });
    }

    const course = await Course.findById(courseId).populate("creator", "name avatar");
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    let practices = await Practice.find({ course: courseId }).sort({ createdAt: 1 }).lean();

    // Auto-generate starter practices for lessons if none exist yet in MongoDB
    if (practices.length === 0 && Array.isArray(course.lessons) && course.lessons.length > 0) {
      const generated = [];
      course.lessons.forEach((lesson, idx) => {
        const lessonPractices = createStarterPracticesForLesson(course, lesson, idx);
        generated.push(...lessonPractices);
      });

      if (generated.length > 0) {
        const inserted = await Practice.insertMany(generated);
        practices = inserted.map((doc) => doc.toObject());
      }
    }

    // If user is authenticated, attach their submission progress
    if (req.user) {
      const submissions = await PracticeSubmission.find({
        user: req.user._id,
        course: courseId,
      }).lean();

      const subMap = new Map();
      submissions.forEach((s) => {
        subMap.set(s.practice.toString(), s);
      });

      practices = practices.map((p) => {
        const sub = subMap.get(p._id.toString());
        return {
          ...p,
          submission: sub || null,
          userStatus: sub ? sub.status : "not-started",
        };
      });
    } else {
      practices = practices.map((p) => ({
        ...p,
        submission: null,
        userStatus: "not-started",
      }));
    }

    res.status(200).json({
      success: true,
      count: practices.length,
      data: practices,
    });
  } catch (err) {
    console.error("getPracticesByCourse error:", err);
    res.status(500).json({ success: false, message: "Server error fetching course practices." });
  }
};

/**
 * @route   GET /api/practices/lesson/:lessonId
 * @desc    Get practices for a specific lesson
 * @access  Public / Optional Auth
 */
const getPracticesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    if (!lessonId) {
      return res.status(400).json({ success: false, message: "Lesson ID is required." });
    }

    let practices = await Practice.find({
      $or: [{ lessonId }, { lessonId: String(lessonId) }],
    }).lean();

    // If no practice found by lessonId, search by course if query provided
    if (practices.length === 0 && req.query.courseId && mongoose.Types.ObjectId.isValid(req.query.courseId)) {
      const course = await Course.findById(req.query.courseId);
      if (course && Array.isArray(course.lessons)) {
        const lessonIdx = course.lessons.findIndex(
          (l, i) => (l._id && l._id.toString() === lessonId) || String(i) === String(lessonId)
        );
        if (lessonIdx >= 0) {
          const lesson = course.lessons[lessonIdx];
          const generated = createStarterPracticesForLesson(course, lesson, lessonIdx);
          const inserted = await Practice.insertMany(generated);
          practices = inserted.map((doc) => doc.toObject());
        }
      }
    }

    if (req.user && practices.length > 0) {
      const practiceIds = practices.map((p) => p._id);
      const submissions = await PracticeSubmission.find({
        user: req.user._id,
        practice: { $in: practiceIds },
      }).lean();

      const subMap = new Map();
      submissions.forEach((s) => subMap.set(s.practice.toString(), s));

      practices = practices.map((p) => {
        const sub = subMap.get(p._id.toString());
        return {
          ...p,
          submission: sub || null,
          userStatus: sub ? sub.status : "not-started",
        };
      });
    }

    res.status(200).json({
      success: true,
      count: practices.length,
      data: practices,
    });
  } catch (err) {
    console.error("getPracticesByLesson error:", err);
    res.status(500).json({ success: false, message: "Server error fetching lesson practices." });
  }
};

/**
 * @route   GET /api/practices/:id
 * @desc    Get single practice activity details
 * @access  Public / Optional Auth
 */
const getPracticeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Practice not found." });
    }

    const practice = await Practice.findById(id)
      .populate("course", "title category thumbnail level creator lessons")
      .populate("creator", "name avatar title");

    if (!practice) {
      return res.status(404).json({ success: false, message: "Practice not found." });
    }

    let submission = null;
    if (req.user) {
      submission = await PracticeSubmission.findOne({
        user: req.user._id,
        practice: practice._id,
      }).populate("project", "title image category status");
    }

    res.status(200).json({
      success: true,
      data: practice,
      submission,
      userStatus: submission ? submission.status : "not-started",
    });
  } catch (err) {
    console.error("getPracticeById error:", err);
    res.status(500).json({ success: false, message: "Server error fetching practice." });
  }
};

/**
 * @route   POST /api/practices/:id/start
 * @desc    Start a practice activity (updates progress in MongoDB to in-progress)
 * @access  Private
 */
const startPractice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Practice not found." });
    }

    const practice = await Practice.findById(id);
    if (!practice) {
      return res.status(404).json({ success: false, message: "Practice not found." });
    }

    let submission = await PracticeSubmission.findOne({
      user: req.user._id,
      practice: practice._id,
    });

    if (!submission) {
      submission = await PracticeSubmission.create({
        user: req.user._id,
        practice: practice._id,
        course: practice.course,
        lessonId: practice.lessonId,
        status: "in-progress",
        startedAt: new Date(),
      });
    } else if (submission.status === "not-started") {
      submission.status = "in-progress";
      await submission.save();
    }

    res.status(200).json({
      success: true,
      message: "Practice activity started. Ready to build!",
      data: submission,
    });
  } catch (err) {
    console.error("startPractice error:", err);
    res.status(500).json({ success: false, message: "Server error starting practice." });
  }
};

/**
 * @route   POST /api/practices/:id/submit
 * @desc    Submit practice work (image/video/document/link/text) & optional portfolio project conversion
 * @access  Private
 */
const submitPractice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      submissionUrl,
      submissionType,
      submissionTitle,
      notes,
      createProject,
      projectTitle,
      projectDescription,
      projectCategory,
    } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Practice not found." });
    }

    const practice = await Practice.findById(id).populate("course");
    if (!practice) {
      return res.status(404).json({ success: false, message: "Practice not found." });
    }

    let submission = await PracticeSubmission.findOne({
      user: req.user._id,
      practice: practice._id,
    });

    if (!submission) {
      submission = new PracticeSubmission({
        user: req.user._id,
        practice: practice._id,
        course: practice.course ? practice.course._id : practice.course,
        lessonId: practice.lessonId,
      });
    }

    submission.status = "completed";
    submission.submissionUrl = submissionUrl || submission.submissionUrl || "";
    submission.submissionType = submissionType || submission.submissionType || "image";
    submission.submissionTitle = submissionTitle || practice.title;
    submission.notes = notes || submission.notes || "";
    submission.submittedAt = new Date();
    submission.completedAt = new Date();

    let createdProjectDoc = null;

    // Convert/Submit as CraftLoop Portfolio Project (Section 8)
    if (createProject === true || createProject === "true" || practice.type === "project") {
      try {
        const resolvedTitle = projectTitle || submissionTitle || `${practice.title} Outcome`;
        const resolvedDesc =
          projectDescription ||
          notes ||
          `Completed practice project for "${practice.title}" from course ${practice.course?.title || ""}.`;
        const resolvedCategory =
          projectCategory || (practice.course ? practice.course.category : "General");
        const resolvedImage =
          submissionType === "image" && submissionUrl
            ? submissionUrl
            : practice.course?.thumbnail || "";

        createdProjectDoc = await Project.create({
          title: resolvedTitle,
          description: resolvedDesc,
          category: resolvedCategory,
          type: "Project",
          projectType: "Project",
          image: resolvedImage,
          demoUrl: submissionType === "link" ? submissionUrl : "",
          tags: practice.skills && practice.skills.length > 0 ? practice.skills : ["Practice"],
          status: "Published",
          creator: req.user._id,
        });

        submission.project = createdProjectDoc._id;
      } catch (projErr) {
        console.warn("Could not automatically create portfolio project:", projErr.message);
      }
    }

    await submission.save();

    await submission.populate([
      { path: "practice" },
      { path: "project", select: "title image category status demoUrl" },
    ]);

    res.status(200).json({
      success: true,
      message: "Practice work submitted and marked as completed!",
      data: submission,
      project: createdProjectDoc,
    });
  } catch (err) {
    console.error("submitPractice error:", err);
    res.status(500).json({ success: false, message: "Server error submitting practice work." });
  }
};

/**
 * @route   POST /api/practices/:id/share
 * @desc    Share completed practice work to the Community feed
 * @access  Private
 */
const sharePracticeToCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const practice = await Practice.findById(id).populate("course", "title category thumbnail");
    if (!practice) {
      return res.status(404).json({ success: false, message: "Practice not found." });
    }

    const submission = await PracticeSubmission.findOne({
      user: req.user._id,
      practice: practice._id,
    }).populate("project");

    if (!submission) {
      return res.status(400).json({
        success: false,
        message: "You must start and complete this practice before sharing it to Community.",
      });
    }

    const postContent =
      message && message.trim()
        ? message.trim()
        : `I just completed the "${practice.title}" practice challenge in ${practice.course?.title || "CraftLoop"}! Feedback and thoughts are welcome.`;

    const postTags = ["Practice", ...(practice.skills || [])];

    let postPayload = {
      author: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar || "",
      authorRole: req.user.title || (req.user.role === "creator" ? "Creator" : "Learner"),
      content: postContent,
      tags: postTags,
    };

    // If attached to a CraftLoop project, use project post format
    if (submission.project) {
      postPayload.projectId = submission.project._id;
      postPayload.projectUrl = `/project/${submission.project._id}`;
      postPayload.postType = "project";
      postPayload.image = submission.project.image || submission.submissionUrl || "";
    } else {
      postPayload.image = submission.submissionUrl || "";
      postPayload.postType = "text";
    }

    const communityPost = await CommunityPost.create(postPayload);

    await communityPost.populate([
      { path: "author", select: "name avatar role title" },
      {
        path: "projectId",
        select: "title description category image tags tools demoUrl price status creator",
        populate: { path: "creator", select: "name avatar role title" },
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Practice work shared to Community successfully!",
      data: communityPost,
    });
  } catch (err) {
    console.error("sharePracticeToCommunity error:", err);
    res.status(500).json({ success: false, message: "Server error sharing practice to community." });
  }
};

/**
 * @route   GET /api/practices/my
 * @desc    Get all active and completed practices for the logged in user (for My Learning)
 * @access  Private
 */
const getMyPractices = async (req, res) => {
  try {
    const submissions = await PracticeSubmission.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .populate({
        path: "practice",
        select: "title description difficulty type estimatedTime skills instructions course lessonTitle lessonId",
        populate: { path: "course", select: "title category thumbnail level" },
      })
      .populate("project", "title image category status")
      .lean();

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    console.error("getMyPractices error:", err);
    res.status(500).json({ success: false, message: "Server error fetching your practices." });
  }
};

/**
 * @route   POST /api/practices
 * @desc    Create a practice activity for a course lesson (Creator only)
 * @access  Private (Creator)
 */
const createPractice = async (req, res) => {
  try {
    const {
      courseId,
      lessonId,
      lessonTitle,
      title,
      description,
      difficulty,
      type,
      estimatedTime,
      instructions,
      skills,
      hints,
    } = req.body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Valid course ID is required." });
    }

    if (!title || !description || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and lesson ID are required.",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Creator check: Creator must own the course or be admin
    if (course.creator && course.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only create practice activities for your own courses.",
      });
    }

    const practice = await Practice.create({
      course: courseId,
      lessonId: String(lessonId),
      lessonTitle: lessonTitle || "",
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty || "Beginner",
      type: type || "quick",
      estimatedTime: estimatedTime || "15 mins",
      instructions: Array.isArray(instructions) ? instructions : [],
      skills: Array.isArray(skills) ? skills : [],
      hints: Array.isArray(hints) ? hints : [],
      creator: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Practice activity created successfully.",
      data: practice,
    });
  } catch (err) {
    console.error("createPractice error:", err);
    res.status(500).json({ success: false, message: "Server error creating practice activity." });
  }
};

module.exports = {
  getPracticesByCourse,
  getPracticesByLesson,
  getPracticeById,
  startPractice,
  submitPractice,
  sharePracticeToCommunity,
  getMyPractices,
  createPractice,
};
