const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    image: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    tools: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
    likes: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Project", projectSchema);
