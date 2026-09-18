const mongoose = require("mongoose");
const { Enrollment, Course, User } = require("../models");

/**
 * @route   POST /api/enrollments/:courseId
 * @desc    Enroll in a course
 * @access  Private (Viewer only)
 */
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Valid course ID is required.",
      });
    }

    // Role check: Only viewers can enroll
    if (req.user.role === "creator") {
      return res.status(403).json({
        success: false,
        message: "Creators cannot enroll in courses through this endpoint.",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Check duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course.",
        data: existingEnrollment,
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      progress: 0,
      status: "in-progress",
    });

    // Add student to enrolledStudents array if not present
    if (!course.enrolledStudents.includes(req.user._id)) {
      course.enrolledStudents.push(req.user._id);
      await course.save();
    }

    await enrollment.populate({
      path: "course",
      select: "title category level thumbnail price lessons duration",
      populate: { path: "creator", select: "name avatar email" },
    });

    res.status(201).json({
      success: true,
      message: "Enrolled in course successfully.",
      data: enrollment,
    });
  } catch (err) {
    console.error("enrollInCourse error:", err);
    res.status(500).json({
      success: false,
      message: "Server error enrolling in course.",
    });
  }
};

/**
 * @route   GET /api/enrollments/me
 * @desc    Get all enrolled courses for authenticated user
 * @access  Private
 */
const getMyLearning = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .populate({
        path: "course",
        select: "title description category level thumbnail price lessons duration status",
        populate: { path: "creator", select: "name avatar email" },
      });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (err) {
    console.error("getMyLearning error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching enrolled courses.",
    });
  }
};

/**
 * @route   GET /api/enrollments/:courseId
 * @desc    Get user's enrollment for a specific course
 * @access  Private
 */
const getMyEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Valid course ID is required.",
      });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    }).populate({
      path: "course",
      select: "title category level thumbnail lessons duration status",
      populate: { path: "creator", select: "name avatar email" },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (err) {
    console.error("getMyEnrollment error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching enrollment details.",
    });
  }
};

/**
 * @route   PUT /api/enrollments/:courseId/progress
 * @desc    Update lesson progress
 * @access  Private
 */
const updateLessonProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIndex, lessonId, progress } = req.body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Valid course ID is required.",
      });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    const course = await Course.findById(courseId);
    const totalLessons = course && course.lessons ? course.lessons.length : 1;

    if (typeof lessonIndex === "number" && lessonIndex >= 0) {
      enrollment.lastAccessedLesson = lessonIndex;
      if (!enrollment.completedLessonIndexes.includes(lessonIndex)) {
        enrollment.completedLessonIndexes.push(lessonIndex);
      }
    }

    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    let calculatedProgress = enrollment.progress;
    if (typeof progress === "number") {
      calculatedProgress = Math.min(100, Math.max(0, Math.round(progress)));
    } else if (totalLessons > 0) {
      calculatedProgress = Math.min(
        100,
        Math.round((enrollment.completedLessonIndexes.length / totalLessons) * 100)
      );
    }

    enrollment.progress = calculatedProgress;
    if (calculatedProgress >= 100) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Lesson progress updated successfully.",
      data: enrollment,
    });
  } catch (err) {
    console.error("updateLessonProgress error:", err);
    res.status(500).json({
      success: false,
      message: "Server error updating progress.",
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyLearning,
  getMyEnrollment,
  updateLessonProgress,
};
