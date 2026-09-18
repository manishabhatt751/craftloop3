const mongoose = require("mongoose");
const { Message, User } = require("../models");

/**
 * @route   POST /api/messages
 * @desc    Send a message to another user
 * @access  Private (JWT protected)
 */
const sendMessage = async (req, res) => {
  try {
    const receiverId = req.body.receiverId || req.body.recipientId;
    const content = (req.body.content || req.body.text || "").trim();

    // Validate receiverId
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "A valid receiver ID is required.",
      });
    }

    // Disallow self-messaging
    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot send a message to yourself.",
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId).select("name email avatar role title");
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Recipient user does not exist.",
      });
    }

    // Validate content
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Message content cannot be empty.",
      });
    }

    // Create message in MongoDB
    const message = await Message.create({
      sender: req.user._id,
      senderName: req.user.name || "User",
      recipient: receiver._id,
      receiver: receiver._id,
      recipientName: receiver.name || "User",
      content,
      read: false,
    });

    // Populate sender & recipient safely
    await message.populate("sender", "name email avatar role title");
    await message.populate("recipient", "name email avatar role title");
    await message.populate("receiver", "name email avatar role title");

    // Real-time delivery via Socket.io to recipient
    try {
      const { getIO } = require("../socket");
      const io = getIO();
      if (io) {
        io.to(`user:${receiver._id}`).emit("new_message", message);
        io.to(`user:${req.user._id}`).emit("new_message", message);
      }
    } catch (socketErr) {
      console.warn("Socket.io emit warning:", socketErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({
      success: false,
      message: "Server error sending message.",
    });
  }
};

/**
 * @route   GET /api/messages/conversation/:userId
 * @desc    Get conversation between authenticated user and specified user
 * @access  Private (JWT protected)
 */
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "A valid user ID is required.",
      });
    }

    // Verify partner exists
    const targetUser = await User.findById(userId).select("name email avatar role title");
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          $or: [{ recipient: targetUser._id }, { receiver: targetUser._id }],
        },
        {
          sender: targetUser._id,
          $or: [{ recipient: req.user._id }, { receiver: req.user._id }],
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email avatar role title")
      .populate("recipient", "name email avatar role title")
      .populate("receiver", "name email avatar role title");

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    console.error("getConversation error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching conversation.",
    });
  }
};

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all conversations involving the authenticated user
 * @access  Private (JWT protected)
 */
const getMyConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id },
        { receiver: req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email avatar role title")
      .populate("recipient", "name email avatar role title")
      .populate("receiver", "name email avatar role title");

    const conversationsMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender && msg.sender._id.toString() === req.user._id.toString();
      const partner = isSender ? (msg.recipient || msg.receiver) : msg.sender;

      if (!partner || !partner._id) continue;
      const partnerId = partner._id.toString();

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          id: partner._id,
          partner: {
            _id: partner._id,
            name: partner.name,
            email: partner.email,
            avatar: partner.avatar,
            role: partner.role,
            title: partner.title,
          },
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: (!isSender && !msg.read) ? 1 : 0,
        });
      } else {
        if (!isSender && !msg.read) {
          conversationsMap.get(partnerId).unreadCount += 1;
        }
      }
    }

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (err) {
    console.error("getMyConversations error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching conversations.",
    });
  }
};

/**
 * @route   PUT /api/messages/conversation/:userId/read
 * @desc    Mark all messages from specified user to authenticated user as read
 * @access  Private (JWT protected)
 */
const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "A valid user ID is required.",
      });
    }

    const result = await Message.updateMany(
      {
        sender: userId,
        $or: [{ recipient: req.user._id }, { receiver: req.user._id }],
        read: false,
      },
      {
        $set: { read: true, readAt: new Date() },
      }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("markMessagesAsRead error:", err);
    res.status(500).json({
      success: false,
      message: "Server error marking messages as read.",
    });
  }
};

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete a message (sender or recipient only)
 * @access  Private (JWT protected)
 */
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const isSender = message.sender && message.sender.toString() === req.user._id.toString();
    const isRecipient =
      (message.recipient && message.recipient.toString() === req.user._id.toString()) ||
      (message.receiver && message.receiver.toString() === req.user._id.toString());

    if (!isSender && !isRecipient) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this message.",
      });
    }

    await Message.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (err) {
    console.error("deleteMessage error:", err);
    res.status(500).json({
      success: false,
      message: "Server error deleting message.",
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getMyConversations,
  markMessagesAsRead,
  deleteMessage,
};
