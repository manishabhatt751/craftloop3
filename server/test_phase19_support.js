const http = require("http");
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
  console.log("  PHASE 19 TEST: HELP & SUPPORT TICKETING");
  console.log("========================================================\n");

  const { connectDB } = require("./config/db");
  const { User, SupportTicket, Notification } = require("./models");
  await connectDB();

  try {
    const timestamp = Date.now();

    // 1. Anonymous ticket creation fails without name/email
    const badAnonRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/support",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { message: "Help, my app is broken!" }
    );
    assert(badAnonRes.status === 400, "Anonymous ticket without name/email rejected with 400");

    // 2. Anonymous ticket creation succeeds with name and email
    const anonRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/support",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Anonymous User",
        email: `anon_${timestamp}@test.com`,
        subject: "General Question",
        message: "How can I get started?",
      }
    );
    assert(anonRes.status === 201, "Anonymous ticket with name/email created with 201");
    assert(anonRes.body?.success === true, "Anonymous ticket response has success: true");
    const anonTicketId = anonRes.body?.data?._id;

    // 3. Register and authenticate test User A (Creator)
    const userAEmail = `support_user_a_${timestamp}@craftloop.test`;
    const regARes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Support Creator A",
        email: userAEmail,
        password: "Password123!",
        role: "creator",
      }
    );
    const tokenA = regARes.body?.token;
    const userAId = regARes.body?.user?._id || regARes.body?.user?.id;
    const authHeadersA = {
      Authorization: `Bearer ${tokenA}`,
      "Content-Type": "application/json",
    };

    // 4. Authenticated ticket creation
    const authTicketRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/support",
        method: "POST",
        headers: authHeadersA,
      },
      {
        subject: "Payout inquiry",
        message: "When does the monthly withdrawal reach the bank?",
        category: "billing",
      }
    );
    assert(authTicketRes.status === 201, "Authenticated ticket created with 201");
    assert(authTicketRes.body?.data?.user === userAId, "Ticket linked to authenticated user ID");
    assert(authTicketRes.body?.data?.email === userAEmail, "Ticket uses user's email");
    const ticketAId = authTicketRes.body?.data?._id;

    // 5. Verify notification created for User A
    const userANotif = await Notification.findOne({ recipient: userAId, type: "system" });
    assert(userANotif !== null, "Notification created for user upon ticket submission");

    // 6. User A fetches their tickets
    const getTicketsRes = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/support",
      method: "GET",
      headers: authHeadersA,
    });
    assert(getTicketsRes.status === 200, "GET /api/support returns 200 for authenticated user");
    assert(getTicketsRes.body?.count >= 1, "Tickets list has at least 1 ticket");
    assert(getTicketsRes.body?.data?.[0]?._id === ticketAId, "User's ticket found in list");

    // 7. User A fetches specific ticket by ID
    const getOneRes = await request({
      hostname: "localhost",
      port: 5000,
      path: `/api/support/${ticketAId}`,
      method: "GET",
      headers: authHeadersA,
    });
    assert(getOneRes.status === 200, "GET /api/support/:id returns 200 for ticket owner");

    // 8. Register User B and verify ownership restriction
    const userBEmail = `support_user_b_${timestamp}@craftloop.test`;
    const regBRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Support Viewer B",
        email: userBEmail,
        password: "Password123!",
        role: "viewer",
      }
    );
    const tokenB = regBRes.body?.token;
    const userBId = regBRes.body?.user?._id || regBRes.body?.user?.id;
    const authHeadersB = {
      Authorization: `Bearer ${tokenB}`,
      "Content-Type": "application/json",
    };

    const crossAccessRes = await request({
      hostname: "localhost",
      port: 5000,
      path: `/api/support/${ticketAId}`,
      method: "GET",
      headers: authHeadersB,
    });
    assert(crossAccessRes.status === 403, "User B cannot view User A's ticket (HTTP 403)");

    // Cleanup
    await SupportTicket.deleteMany({ _id: { $in: [anonTicketId, ticketAId] } });
    await User.deleteMany({ _id: { $in: [userAId, userBId] } });
    await Notification.deleteMany({ recipient: { $in: [userAId, userBId] } });

    console.log("\n--------------------------------------------------------");
    console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log("--------------------------------------------------------\n");

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      console.log("✅ ALL PHASE 19 SUPPORT TESTS PASSED!");
      process.exit(0);
    }
  } catch (error) {
    console.error("Test error:", error);
    process.exit(1);
  }
}

runTests();
