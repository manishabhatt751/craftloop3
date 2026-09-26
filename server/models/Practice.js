const mongoose = require("mongoose");

const practiceSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lessonId: {
      type: String,
      required: true,
      index: true,
    },
    lessonTitle: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: [true, "Practice title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Practice description is required"],
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    type: {
      type: String,
      enum: ["quick", "challenge", "project"],
      default: "quick",
    },
    estimatedTime: {
      type: String,
      default: "15 mins",
    },
    instructions: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

practiceSchema.index({ course: 1, lessonId: 1 });

module.exports = mongoose.model("Practice", practiceSchema);
