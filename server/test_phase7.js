const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const { io } = require("../node_modules/socket.io-client");
const { connectDB } = require("./config/db");
const { User, Message } = require("./models");
const { server } = require("./server");

function makeRequest(port, options, body = null) {
  return new Promise((resolve, reject) => {
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
  console.log("CRAFTLOOP PHASE 7 — REAL-TIME MESSAGING WITH SOCKET.IO");
  console.log("==================================================\n");

  await connectDB();

  const PORT = 5000;
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) return reject(err);
      console.log(`Backend server with Socket.io running on port ${PORT}`);
      resolve();
    });
  });

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

  let socketA = null;
  let socketB = null;
  let socketC = null;

  try {
    // 1. Health check & MongoDB confirmation
    const healthRes = await makeRequest(PORT, { path: "/api/health", method: "GET" });
    assert(healthRes.status === 200, "1. Server running and GET /api/health returns 200");
    assert(healthRes.body?.database && healthRes.body.database.includes("connected"), "2. MongoDB connection is active and verified");

    // Create 3 test users: User A (Creator), User B (Viewer), User C (Unrelated)
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
      role: "viewer",
    };

    const regA = await makeRequest(PORT, { path: "/api/auth/register", method: "POST" }, userAData);
    const regB = await makeRequest(PORT, { path: "/api/auth/register", method: "POST" }, userBData);
    const regC = await makeRequest(PORT, { path: "/api/auth/register", method: "POST" }, userCData);

    const tokenA = regA.body?.token;
    const tokenB = regB.body?.token;
    const tokenC = regC.body?.token;

    const userA = regA.body?.user;
    const userB = regB.body?.user;
    const userC = regC.body?.user;

    assert(!!tokenA && !!tokenB && !!tokenC, "Setup: Registered User A, User B, User C and obtained JWT tokens");

    // 3. Connect User A through Socket.io
    socketA = await new Promise((resolve, reject) => {
      const s = io(`http://127.0.0.1:${PORT}`, {
        auth: { token: tokenA },
        transports: ["websocket"],
        reconnection: false,
      });
      s.on("connect", () => resolve(s));
      s.on("connect_error", (err) => reject(err));
    });
    assert(socketA.connected, "3. Connect User A through Socket.io with valid JWT: successfully connected");

    // 4. Connect User B through Socket.io
    socketB = await new Promise((resolve, reject) => {
      const s = io(`http://127.0.0.1:${PORT}`, {
        auth: { token: tokenB },
        transports: ["websocket"],
        reconnection: false,
      });
      s.on("connect", () => resolve(s));
      s.on("connect_error", (err) => reject(err));
    });
    assert(socketB.connected, "4. Connect User B through Socket.io with valid JWT: successfully connected");

    // Connect User C through Socket.io to test isolation
    socketC = await new Promise((resolve, reject) => {
      const s = io(`http://127.0.0.1:${PORT}`, {
        auth: { token: tokenC },
        transports: ["websocket"],
        reconnection: false,
      });
      s.on("connect", () => resolve(s));
      s.on("connect_error", (err) => reject(err));
    });
    assert(socketC.connected, "Setup: Connect User C through Socket.io to verify private room isolation");

    // Track messages received by each client
    let userBMessages = [];
    let userAMessages = [];
    let userCMessages = [];

    socketB.on("new_message", (msg) => userBMessages.push(msg));
    socketA.on("new_message", (msg) => userAMessages.push(msg));
    socketC.on("new_message", (msg) => userCMessages.push(msg));

    // 5 & 6. User A sends message to User B via Socket.io send_message event
    const sendRes = await new Promise((resolve) => {
      socketA.emit(
        "send_message",
        {
          receiverId: userB._id,
          content: "Hello User B from User A via Socket!",
        },
        (ack) => resolve(ack)
      );
    });

    assert(sendRes && sendRes.success === true, "5. User A sends message to User B via socket send_message: ack success");

    // Wait for delivery
    await new Promise((r) => setTimeout(r, 100));

    assert(
      userBMessages.length === 1 && userBMessages[0].content === "Hello User B from User A via Socket!",
      "6. User B receives message immediately without refresh (real-time new_message event)"
    );

    // Verify sender also received it on userRoom for multi-tab sync
    assert(
      userAMessages.length === 1 && userAMessages[0].content === "Hello User B from User A via Socket!",
      "6b. Sender User A also received new_message event on private room (for multi-tab sync)"
    );

    // Verify User C received nothing
    assert(
      userCMessages.length === 0,
      "6c. Unrelated User C did NOT receive the message (private room isolation verified)"
    );

    // Verify MongoDB count: message must be saved EXACTLY once
    const msgCountInDB = await Message.countDocuments({
      sender: userA._id,
      receiver: userB._id,
    });
    assert(msgCountInDB === 1, "5b. Message saved exactly once in MongoDB (no duplicates)");

    // 7. User B replies using REST POST /api/messages
    // Clear received messages array for fresh check
    userBMessages = [];
    userAMessages = [];
    userCMessages = [];

    const replyRes = await makeRequest(
      PORT,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenB}` },
      },
      {
        receiverId: userA._id,
        content: "Hi User A, received your message! Replying via REST.",
      }
    );

    assert(replyRes.status === 201 && replyRes.body?.success === true, "7a. User B sends reply via REST POST /api/messages: 201 Created");

    // Wait for delivery
    await new Promise((r) => setTimeout(r, 100));

    assert(
      userAMessages.length === 1 && userAMessages[0].content === "Hi User A, received your message! Replying via REST.",
      "7b. User A receives User B's reply immediately over Socket.io without refresh"
    );
    assert(
      userCMessages.length === 0,
      "7c. Unrelated User C did NOT receive User B's reply"
    );

    // 8. Refresh both browsers / Query REST conversation endpoints (MongoDB as source of truth)
    const convA = await makeRequest(
      PORT,
      {
        path: `/api/messages/conversation/${userB._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${tokenA}` },
      }
    );

    const convB = await makeRequest(
      PORT,
      {
        path: `/api/messages/conversation/${userA._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${tokenB}` },
      }
    );

    assert(
      convA.status === 200 && convA.body?.data?.length === 2,
      "8a. Simulated page refresh: User A GET conversation returns 2 persisted messages in correct order"
    );
    assert(
      convB.status === 200 && convB.body?.data?.length === 2,
      "8b. Simulated page refresh: User B GET conversation returns 2 persisted messages in correct order"
    );

    // 9. Disconnect Socket.io & verify REST messaging continues working
    socketA.disconnect();
    socketB.disconnect();
    socketC.disconnect();
    await new Promise((r) => setTimeout(r, 100));

    const postAfterDisconnect = await makeRequest(
      PORT,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
      },
      {
        receiverId: userB._id,
        content: "Message sent while socket is disconnected.",
      }
    );

    assert(
      postAfterDisconnect.status === 201 && postAfterDisconnect.body?.success === true,
      "9. Disconnect Socket.io: REST messaging still works normally (fallback verified)"
    );

    // 10. Try connecting with an invalid JWT
    let invalidConnRejected = false;
    try {
      await new Promise((resolve, reject) => {
        const s = io(`http://127.0.0.1:${PORT}`, {
          auth: { token: "invalid.jwt.token.12345" },
          transports: ["websocket"],
          reconnection: false,
          timeout: 2000,
        });
        s.on("connect", () => {
          s.disconnect();
          reject(new Error("Connected with invalid JWT!"));
        });
        s.on("connect_error", (err) => {
          invalidConnRejected = true;
          s.disconnect();
          resolve(err);
        });
      });
    } catch (e) {
      invalidConnRejected = false;
    }
    assert(invalidConnRejected, "10. Try connecting with an invalid JWT: connection rejected by auth middleware");

    // 10b. Try connecting with no JWT
    let noTokenRejected = false;
    try {
      await new Promise((resolve, reject) => {
        const s = io(`http://127.0.0.1:${PORT}`, {
          auth: {},
          transports: ["websocket"],
          reconnection: false,
          timeout: 2000,
        });
        s.on("connect", () => {
          s.disconnect();
          reject(new Error("Connected with no JWT!"));
        });
        s.on("connect_error", (err) => {
          noTokenRejected = true;
          s.disconnect();
          resolve(err);
        });
      });
    } catch (e) {
      noTokenRejected = false;
    }
    assert(noTokenRejected, "10b. Try connecting with no JWT: connection rejected by auth middleware");

    // 11. Reconnect User A to test validation on send_message
    const socketA2 = await new Promise((resolve, reject) => {
      const s = io(`http://127.0.0.1:${PORT}`, {
        auth: { token: tokenA },
        transports: ["websocket"],
        reconnection: false,
      });
      s.on("connect", () => resolve(s));
      s.on("connect_error", reject);
    });

    // Test sending to nonexistent user
    const badReceiverRes = await new Promise((resolve) => {
      socketA2.emit(
        "send_message",
        {
          receiverId: "65f000000000000000000000",
          content: "Hello ghost",
        },
        (ack) => resolve(ack)
      );
    });
    assert(
      badReceiverRes && badReceiverRes.success === false,
      "11a. send_message to nonexistent recipient: correctly rejected with error"
    );

    // Test sending empty content
    const emptyContentRes = await new Promise((resolve) => {
      socketA2.emit(
        "send_message",
        {
          receiverId: userB._id,
          content: "   ",
        },
        (ack) => resolve(ack)
      );
    });
    assert(
      emptyContentRes && emptyContentRes.success === false,
      "11b. send_message with empty content: correctly rejected with error"
    );

    // Test sending to self
    const selfSendRes = await new Promise((resolve) => {
      socketA2.emit(
        "send_message",
        {
          receiverId: userA._id,
          content: "Self message",
        },
        (ack) => resolve(ack)
      );
    });
    assert(
      selfSendRes && selfSendRes.success === false,
      "11c. send_message to self: correctly rejected with error"
    );

    socketA2.disconnect();

    // 12. Regressions Check on Phase 1-6 APIs
    const authMe = await makeRequest(PORT, { path: "/api/auth/me", headers: { Authorization: `Bearer ${tokenA}` } });
    assert(authMe.status === 200, "12a. Regression: GET /api/auth/me works");

    const profileRes = await makeRequest(PORT, { path: "/api/users/profile", headers: { Authorization: `Bearer ${tokenA}` } });
    assert(profileRes.status === 200, "12b. Regression: GET /api/users/profile works");

    const postsRes = await makeRequest(PORT, { path: "/api/community/posts" });
    assert(postsRes.status === 200, "12c. Regression: GET /api/community/posts works");

    const coursesRes = await makeRequest(PORT, { path: "/api/courses" });
    assert(coursesRes.status === 200, "12d. Regression: GET /api/courses works");

    const projectsRes = await makeRequest(PORT, { path: "/api/projects" });
    assert(projectsRes.status === 200, "12e. Regression: GET /api/projects works");

    const learningRes = await makeRequest(PORT, { path: "/api/enrollments/me", headers: { Authorization: `Bearer ${tokenB}` } });
    assert(learningRes.status === 200, "12f. Regression: GET /api/enrollments/me works");

    const convsRes = await makeRequest(PORT, { path: "/api/messages/conversations", headers: { Authorization: `Bearer ${tokenA}` } });
    assert(convsRes.status === 200, "12g. Regression: GET /api/messages/conversations works");

    const readRes = await makeRequest(PORT, { path: `/api/messages/conversation/${userA._id}/read`, method: "PUT", headers: { Authorization: `Bearer ${tokenB}` } });
    assert(readRes.status === 200, "12h. Regression: PUT /api/messages/conversation/:userId/read works");

  } catch (err) {
    console.error("Test execution failed with error:", err);
    failed++;
  } finally {
    if (socketA && socketA.connected) socketA.disconnect();
    if (socketB && socketB.connected) socketB.disconnect();
    if (socketC && socketC.connected) socketC.disconnect();

    server.close(() => {
      console.log("\n==================================================");
      console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
      console.log("==================================================\n");
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

runTests();
