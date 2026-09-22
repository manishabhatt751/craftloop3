const { SupportTicket } = require("../models");
const { createNotification } = require("./notificationController");

// POST /api/support
const createTicket = async (req, res) => {
  try {
    const { subject, message, category, priority, name, email } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const ticketName = req.user?.name || name;
    const ticketEmail = req.user?.email || email;

    if (!ticketName || !String(ticketName).trim() || !ticketEmail || !String(ticketEmail).trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required to submit a support ticket.",
      });
    }

    const ticketSubject = subject && String(subject).trim() ? String(subject).trim() : "Support Inquiry";

    const ticket = await SupportTicket.create({
      user: req.user?._id || null,
      name: String(ticketName).trim(),
      email: String(ticketEmail).trim().toLowerCase(),
      subject: ticketSubject,
      message: String(message).trim(),
      category: category || "general",
      priority: priority || "medium",
    });

    if (req.user?._id) {
      await createNotification({
        recipient: req.user._id,
        type: "system",
        title: "Support Ticket Received",
        message: `We received your inquiry "${ticketSubject}". Our support team will follow up shortly.`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Your support request has been submitted successfully.",
      data: ticket,
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit support request.",
    });
  }
};

// GET /api/support
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets.",
    });
  }
};

// GET /api/support/:id
const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found.",
      });
    }

    // Ownership check
    if (
      (!ticket.user || ticket.user.toString() !== req.user._id.toString()) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this ticket.",
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket.",
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
};
