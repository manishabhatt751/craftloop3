const mongoose = require("mongoose");

const practiceSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    practice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Practice",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lessonId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "submitted", "completed"],
      default: "in-progress",
    },
    submissionType: {
      type: String,
      enum: ["image", "video", "document", "link", "text"],
      default: "image",
    },
    submissionUrl: {
      type: String,
      default: "",
    },
    submissionTitle: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

practiceSubmissionSchema.index({ user: 1, practice: 1 }, { unique: true });

module.exports = mongoose.model("PracticeSubmission", practiceSubmissionSchema);
