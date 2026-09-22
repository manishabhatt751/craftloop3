const { User, Transaction } = require("../models");
const { createNotification } = require("./notificationController");

// Helper to credit earnings to a creator's wallet
const recordCredit = async ({ userId, amount, type = "course_sale", description = "", referenceId = "" }) => {
  const creditAmount = Number(amount);
  if (!userId || isNaN(creditAmount) || creditAmount <= 0) return null;

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: creditAmount } },
    { returnDocument: "after" }
  );

  const transaction = await Transaction.create({
    user: userId,
    type,
    amount: creditAmount,
    status: "completed",
    description,
    referenceId,
  });

  await createNotification({
    recipient: userId,
    type: "wallet",
    title: "Payment Received",
    message: `You earned ₹${creditAmount.toLocaleString("en-IN")}${description ? ` for ${description}` : ""}.`,
    relatedId: transaction._id,
    relatedType: "Transaction",
  });

  return { user, transaction };
};

// GET /api/wallet
const getWallet = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("balance");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const availableBalance = typeof user.balance === "number" ? user.balance : 0;
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalEarnings = 0;
    let totalWithdrawn = 0;
    let thisMonth = 0;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.status === "completed") {
        if (["course_sale", "tip", "adjustment"].includes(tx.type)) {
          totalEarnings += amt;
          if (new Date(tx.createdAt) >= startOfMonth) {
            thisMonth += amt;
          }
        } else if (tx.type === "withdrawal") {
          totalWithdrawn += amt;
        }
      }
    });

    // If existing balance was set without past transactions, ensure totalEarnings accounts for it
    if (totalEarnings < availableBalance + totalWithdrawn) {
      totalEarnings = availableBalance + totalWithdrawn;
    }

    return res.status(200).json({
      success: true,
      availableBalance,
      totalEarnings,
      totalWithdrawn,
      thisMonth,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch wallet information" });
  }
};

// POST /api/wallet/withdraw
const withdraw = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, bankAccount, note } = req.body;
    const withdrawAmount = Number(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please specify a valid withdrawal amount greater than zero.",
      });
    }

    // Atomic deduction if sufficient balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, balance: { $gte: withdrawAmount } },
      { $inc: { balance: -withdrawAmount } },
      { returnDocument: "after" }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be greater than your available balance.",
      });
    }

    const description = note || (bankAccount ? `Withdrawal to bank account ending in ${String(bankAccount).slice(-4)}` : "Withdrawal via Bank Transfer");

    const transaction = await Transaction.create({
      user: userId,
      type: "withdrawal",
      amount: withdrawAmount,
      status: "completed",
      description,
    });

    await createNotification({
      recipient: userId,
      type: "wallet",
      title: "Withdrawal Successful",
      message: `Your withdrawal request of ₹${withdrawAmount.toLocaleString("en-IN")} has been processed.`,
      relatedId: transaction._id,
      relatedType: "Transaction",
    });

    return res.status(200).json({
      success: true,
      message: `Withdrawal request of ₹${withdrawAmount.toLocaleString("en-IN")} submitted successfully.`,
      availableBalance: updatedUser.balance,
      transaction,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return res.status(500).json({ success: false, message: "Failed to process withdrawal" });
  }
};

module.exports = {
  recordCredit,
  getWallet,
  withdraw,
};
