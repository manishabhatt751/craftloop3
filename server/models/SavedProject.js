const mongoose = require("mongoose");

const savedProjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

savedProjectSchema.index({ user: 1, project: 1 }, { unique: true });

module.exports = mongoose.model("SavedProject", savedProjectSchema);
