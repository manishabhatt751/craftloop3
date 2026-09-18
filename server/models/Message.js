const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
      index: true,
    },
    senderName: {
      type: String,
      default: "User",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    recipientName: {
      type: String,
      default: "User",
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for conversation lookups
messageSchema.index({ sender: 1, recipient: 1, createdAt: 1 });
messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });
messageSchema.index({ recipient: 1, read: 1 });
messageSchema.index({ receiver: 1, read: 1 });

module.exports = mongoose.model("Message", messageSchema);
