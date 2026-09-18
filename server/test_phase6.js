const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/db");
const app = require("./server");

// Helper to make HTTP requests against our app
function makeRequest(server, options, body = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: "127.0.0.1",
      port,
      path: options.path,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed,
        });
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
  console.log("\n==================================================");
  console.log("CRAFTLOOP PHASE 6 — MESSAGES API VERIFICATION");
  console.log("==================================================\n");

  // Connect DB
  await connectDB();

  // Start test server on random port
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. GET /api/health
    const healthRes = await makeRequest(server, { path: "/api/health", method: "GET" });
    assert(healthRes.status === 200, "1. GET /api/health returns 200");

    // Create unique users A, B, C for testing
    const timestamp = Date.now();
    const userAData = {
      name: `User A ${timestamp}`,
      email: `usera_${timestamp}@test.com`,
      password: "password123",
      role: "creator",
    };
    const userBData = {
      name: `User B ${timestamp}`,
      email: `userb_${timestamp}@test.com`,
      password: "password123",
      role: "viewer",
    };
    const userCData = {
      name: `User C ${timestamp}`,
      email: `userc_${timestamp}@test.com`,
      password: "password123",
      role: "creator",
    };

    // 2. Register / Login User A
    const regARes = await makeRequest(server, { path: "/api/auth/register", method: "POST" }, userAData);
    const tokenA = regARes.body.token;
    const userAId = regARes.body.user._id;
    assert(regARes.status === 201 && !!tokenA, "2. Register/Login as User A succeeds with JWT");

    // 3. Register / Login User B
    const regBRes = await makeRequest(server, { path: "/api/auth/register", method: "POST" }, userBData);
    const tokenB = regBRes.body.token;
    const userBId = regBRes.body.user._id;
    assert(regBRes.status === 201 && !!tokenB, "3. Register/Login as User B succeeds with JWT");

    // Register User C
    const regCRes = await makeRequest(server, { path: "/api/auth/register", method: "POST" }, userCData);
    const tokenC = regCRes.body.token;
    const userCId = regCRes.body.user._id;

    // 4. User A sends message to User B
    const sendRes1 = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
      },
      {
        receiverId: userBId,
        content: "Hello User B from User A!",
      }
    );
    assert(sendRes1.status === 201 && sendRes1.body.data.content === "Hello User B from User A!", "4. User A sends message to User B");
    const messageId1 = sendRes1.body.data._id;

    // 5. User B sends message to User A
    const sendRes2 = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenB}` },
      },
      {
        receiverId: userAId,
        content: "Hi User A, thanks for reaching out!",
      }
    );
    assert(sendRes2.status === 201 && sendRes2.body.data.content === "Hi User A, thanks for reaching out!", "5. User B sends reply message to User A");

    // User B sends message to User C
    const sendResBC = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenB}` },
      },
      {
        receiverId: userCId,
        content: "Private message between B and C",
      }
    );
    const messageIdBC = sendResBC.body.data._id;

    // 6. User A gets conversation with User B
    const convARes = await makeRequest(
      server,
      {
        path: `/api/messages/conversation/${userBId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${tokenA}` },
      }
    );
    assert(
      convARes.status === 200 &&
      convARes.body.data.length === 2 &&
      convARes.body.data[0].content === "Hello User B from User A!" &&
      convARes.body.data[1].content === "Hi User A, thanks for reaching out!",
      "6. User A gets conversation with User B (only A ↔ B messages, chronologically ordered)"
    );

    // 7. User B gets conversation with User A
    const convBRes = await makeRequest(
      server,
      {
        path: `/api/messages/conversation/${userAId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${tokenB}` },
      }
    );
    assert(
      convBRes.status === 200 &&
      convBRes.body.data.length === 2 &&
      convBRes.body.data[0].content === "Hello User B from User A!" &&
      convBRes.body.data[1].content === "Hi User A, thanks for reaching out!",
      "7. User B gets conversation with User A (same conversation from B's perspective)"
    );

    // 8. User A gets conversations list
    const myConvARes = await makeRequest(
      server,
      {
        path: "/api/messages/conversations",
        method: "GET",
        headers: { Authorization: `Bearer ${tokenA}` },
      }
    );
    assert(
      myConvARes.status === 200 &&
      myConvARes.body.data.length === 1 &&
      myConvARes.body.data[0].partner._id === userBId,
      "8. User A gets conversations (only conversations involving User A)"
    );

    // 9. User B gets conversations list
    const myConvBRes = await makeRequest(
      server,
      {
        path: "/api/messages/conversations",
        method: "GET",
        headers: { Authorization: `Bearer ${tokenB}` },
      }
    );
    assert(
      myConvBRes.status === 200 &&
      myConvBRes.body.data.length === 2, // With A and with C
      "9. User B gets conversations (both A and C conversations)"
    );

    // 10. User A tries to access conversation between User B and User C
    const convACRes = await makeRequest(
      server,
      {
        path: `/api/messages/conversation/${userCId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${tokenA}` },
      }
    );
    assert(
      convACRes.status === 200 &&
      convACRes.body.data.length === 0,
      "10. User A gets conversation with User C returns 0 messages (no unauthorized B↔C messages leaked)"
    );

    // 11. User A sends an empty message
    const emptyMsgRes = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
      },
      {
        receiverId: userBId,
        content: "    ",
      }
    );
    assert(emptyMsgRes.status === 400, "11. Empty message returns 400 validation error");

    // 12. Request messaging endpoint without JWT
    const noJwtRes = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
      },
      {
        receiverId: userBId,
        content: "No token message",
      }
    );
    assert(noJwtRes.status === 401, "12. Request without JWT returns 401 Unauthorized");

    // 13. Invalid receiver ID
    const invalidIdRes = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
      },
      {
        receiverId: "invalid-id-123",
        content: "Invalid receiver id test",
      }
    );
    assert(invalidIdRes.status === 400, "13. Invalid receiver ID returns 400 validation error");

    // 14. Non-existent receiver
    const fakeObjectId = "507f1f77bcf86cd799439011";
    const nonExistentRes = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
      },
      {
        receiverId: fakeObjectId,
        content: "Hello non-existent user",
      }
    );
    assert(nonExistentRes.status === 404, "14. Non-existent receiver returns 404 Not Found");

    // 15. Mark conversation as read
    const markReadRes = await makeRequest(
      server,
      {
        path: `/api/messages/conversation/${userBId}/read`,
        method: "PUT",
        headers: { Authorization: `Bearer ${tokenA}` },
      }
    );
    assert(markReadRes.status === 200, "15. Mark conversation as read returns 200 Success");

    // 16. Verify no password or password hash appears in message responses
    const jsonStr = JSON.stringify(convARes.body);
    const hasPassword = jsonStr.includes("password") || jsonStr.includes("$2a$") || jsonStr.includes("$2b$");
    assert(!hasPassword, "16. Verified no password or password hash exposed in responses");

    // 17. Delete message tests
    // A deletes message1 (which A sent)
    const deleteOwnRes = await makeRequest(
      server,
      {
        path: `/api/messages/${messageId1}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenA}` },
      }
    );
    assert(deleteOwnRes.status === 200, "17a. Delete own message returns 200 Success");

    // A tries to delete messageBC (sent between B and C)
    const deleteUnauthRes = await makeRequest(
      server,
      {
        path: `/api/messages/${messageIdBC}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenA}` },
      }
    );
    assert(deleteUnauthRes.status === 403, "17b. Unauthorized deletion returns 403 Forbidden");

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  } finally {
    server.close();
    console.log(`\n==================================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==================================================\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
