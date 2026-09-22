const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on("error", reject);
    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("\n========================================================");
  console.log("  PHASE 18 TEST: WALLET, TRANSACTIONS & WITHDRAWALS");
  console.log("========================================================\n");

  try {
    // 1. Unauthenticated rejection (401)
    const unauthRes = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/wallet",
      method: "GET",
    });
    assert(unauthRes.status === 401, "GET /api/wallet unauthenticated returns 401");

    // 2. Create and authenticate test creator
    const creatorEmail = `wallet_creator_${Date.now()}@craftloop.test`;
    const regRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Wallet Test Creator",
        email: creatorEmail,
        password: "Password123!",
        role: "creator",
      }
    );

    const token = regRes.body?.token;
    const creatorId = regRes.body?.user?._id || regRes.body?.user?.id;
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    assert(Boolean(token && creatorId), `Created and authenticated test creator (${creatorId})`);

    // 3. Fetch initial wallet
    const initWalletRes = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/wallet",
      method: "GET",
      headers: authHeaders,
    });

    assert(initWalletRes.status === 200, "GET /api/wallet returns 200");
    assert(initWalletRes.body?.success === true, "GET /api/wallet returns success: true");
    assert(typeof initWalletRes.body?.availableBalance === "number", "availableBalance is a number");
    assert(Array.isArray(initWalletRes.body?.transactions), "transactions is an array");

    // 4. Test invalid withdrawal (zero amount)
    const zeroWithdrawRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/wallet/withdraw",
        method: "POST",
        headers: authHeaders,
      },
      { amount: 0 }
    );
    assert(zeroWithdrawRes.status === 400, "Zero amount withdrawal returns 400");

    // 5. Test withdrawal exceeding balance
    const excessWithdrawRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/wallet/withdraw",
        method: "POST",
        headers: authHeaders,
      },
      { amount: 999999 }
    );
    assert(excessWithdrawRes.status === 400, "Excess withdrawal returns 400");

    // 6. Connect to DB to credit creator balance and add a transaction
    const { connectDB } = require("./config/db");
    const { User, Transaction, Notification } = require("./models");
    await connectDB();

    await User.findByIdAndUpdate(creatorId, { balance: 5000 });
    await Transaction.create({
      user: creatorId,
      type: "course_sale",
      amount: 5000,
      status: "completed",
      description: "Test Course Enrollment Sale",
    });

    // 7. Verify credited wallet
    const creditedWallet = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/wallet",
      method: "GET",
      headers: authHeaders,
    });
    assert(creditedWallet.body?.availableBalance === 5000, "Available balance updated to 5000");
    assert(creditedWallet.body?.totalEarnings >= 5000, "Total earnings reflects 5000");
    assert(creditedWallet.body?.transactions.length >= 1, "Transactions contains course sale record");

    // 8. Perform valid withdrawal
    const withdrawRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/wallet/withdraw",
        method: "POST",
        headers: authHeaders,
      },
      { amount: 1500, bankAccount: "123456789012" }
    );
    assert(withdrawRes.status === 200, "POST /api/wallet/withdraw returns 200");
    assert(withdrawRes.body?.success === true, "Withdrawal returns success");
    assert(withdrawRes.body?.availableBalance === 3500, "Withdrawal returns new balance 3500");

    // 9. Verify MongoDB user balance
    const dbUser = await User.findById(creatorId);
    assert(dbUser.balance === 3500, "MongoDB user balance correctly decremented to 3500");

    // 10. Verify withdrawal transaction in MongoDB
    const withdrawTx = await Transaction.findOne({ user: creatorId, type: "withdrawal" });
    assert(withdrawTx !== null, "Withdrawal transaction recorded in MongoDB");
    assert(withdrawTx.amount === 1500, "Withdrawal transaction amount is 1500");

    // 11. Verify notification created for withdrawal
    const notif = await Notification.findOne({ recipient: creatorId, type: "wallet" });
    assert(notif !== null, "Notification created for withdrawal");

    // 12. Fetch final wallet summary
    const finalWalletRes = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/wallet",
      method: "GET",
      headers: authHeaders,
    });
    assert(finalWalletRes.body?.availableBalance === 3500, "Final available balance is 3500");
    assert(finalWalletRes.body?.totalWithdrawn === 1500, "Final total withdrawn is 1500");
    assert(finalWalletRes.body?.transactions.length === 2, "Final transaction history has 2 entries");

    // Cleanup
    await User.findByIdAndDelete(creatorId);
    await Transaction.deleteMany({ user: creatorId });
    await Notification.deleteMany({ recipient: creatorId });
    await mongoose.disconnect();

    console.log("\n--------------------------------------------------------");
    console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log("--------------------------------------------------------\n");

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      console.log("✅ ALL 13 PHASE 18 WALLET TESTS PASSED!");
      process.exit(0);
    }
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  }
}

runTests();
