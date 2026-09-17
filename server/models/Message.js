const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    senderName: {
      type: String,
      default: "User",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    recipientName: {
      type: String,
      default: "User",
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
