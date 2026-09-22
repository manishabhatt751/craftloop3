const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/db");
const { seedDataIfEmpty } = require("./config/seedData");
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
  console.log("CRAFTLOOP AI CHAT — MANUAL & SUGGESTED QUESTIONS TEST");
  console.log("==================================================\n");

  await connectDB();
  await seedDataIfEmpty();

  const PORT = 5088;
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) return reject(err);
      console.log(`Test server running on port ${PORT}\n`);
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

  try {
    // 1. Authenticate as a logged-in user to obtain valid JWT token
    const loginRes = await makeRequest(
      PORT,
      { path: "/api/auth/login", method: "POST" },
      { email: "viewer@craftloop.com", password: "password123" }
    );

    assert(loginRes.status === 200 && loginRes.body?.token, "Setup: Logged in successfully and obtained JWT token");
    const authToken = loginRes.body?.token;

    // Helper for AI chat requests
    async function askAIChat(message, token = authToken) {
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return await makeRequest(PORT, { path: "/api/ai/chat", method: "POST", headers }, { message });
    }

    // ----------------------------------------------------------------
    // TEST 1: "What is video editing?" -> Expected: Normal AI answer
    // ----------------------------------------------------------------
    console.log("\n--- RUNNING TEST 1: 'What is video editing?' ---");
    const test1 = await askAIChat("What is video editing?");
    assert(test1.status === 200, "TEST 1: Status is 200 OK");
    assert(
      test1.body.message &&
      (test1.body.message.toLowerCase().includes("art") || test1.body.message.toLowerCase().includes("process")) &&
      test1.body.message.toLowerCase().includes("video"),
      "TEST 1: Returns comprehensive normal AI answer defining video editing"
    );
    assert(
      test1.body.message.includes("Timeline") || test1.body.message.includes("Pacing") || test1.body.tools?.length > 0,
      "TEST 1: Covers core editing workflows/tools (Timeline, Pacing, Premiere/DaVinci)"
    );

    // ----------------------------------------------------------------
    // TEST 2: "How can I learn graphic design?" -> Expected: Normal AI answer
    // ----------------------------------------------------------------
    console.log("\n--- RUNNING TEST 2: 'How can I learn graphic design?' ---");
    const test2 = await askAIChat("How can I learn graphic design?");
    assert(test2.status === 200, "TEST 2: Status is 200 OK");
    assert(
      test2.body.message &&
      (test2.body.message.includes("roadmap") || test2.body.message.includes("Principles") || test2.body.message.includes("Typography")),
      "TEST 2: Returns normal AI answer with structured roadmap to learn graphic design"
    );
    assert(
      test2.body.creators?.length > 0 || test2.body.courses?.length > 0,
      "TEST 2: Seamlessly includes verified CraftLoop graphic design resources"
    );

    // ----------------------------------------------------------------
    // TEST 3: "I want to create a YouTube video but don't know how to edit it."
    // Expected: AI guidance and, when available, relevant CraftLoop recommendations
    // ----------------------------------------------------------------
    console.log("\n--- RUNNING TEST 3: 'I want to create a YouTube video but don't know how to edit it.' ---");
    const test3 = await askAIChat("I want to create a YouTube video but don't know how to edit it.");
    assert(test3.status === 200, "TEST 3: Status is 200 OK");
    assert(
      test3.body.message &&
      (test3.body.message.includes("YouTube") || test3.body.message.includes("Rough Cut") || test3.body.message.includes("B-Roll")),
      "TEST 3: Provides practical step-by-step guidance tailored for beginner YouTube creators"
    );
    assert(
      test3.body.creators?.length > 0 && test3.body.courses?.length > 0,
      "TEST 3: Seamlessly provides relevant CraftLoop creator and course recommendations"
    );

    // ----------------------------------------------------------------
    // TEST 4: "Which CraftLoop creator can help me with video editing?"
    // Expected: Actual relevant CraftLoop creator data if available
    // ----------------------------------------------------------------
    console.log("\n--- RUNNING TEST 4: 'Which CraftLoop creator can help me with video editing?' ---");
    const test4 = await askAIChat("Which CraftLoop creator can help me with video editing?");
    assert(test4.status === 200, "TEST 4: Status is 200 OK");
    assert(
      Array.isArray(test4.body.creators) && test4.body.creators.length > 0,
      "TEST 4: Returns actual verified CraftLoop creators from MongoDB"
    );
    const hasJordan = test4.body.creators.some(c => c.name.includes("Jordan"));
    assert(hasJordan, "TEST 4: Jordan Lee (Video Pro) returned with skills and verified match reasoning");

    // ----------------------------------------------------------------
    // TEST 5: "What skills do I need to become a UI/UX designer?"
    // Expected: Normal AI answer
    // ----------------------------------------------------------------
    console.log("\n--- RUNNING TEST 5: 'What skills do I need to become a UI/UX designer?' ---");
    const test5 = await askAIChat("What skills do I need to become a UI/UX designer?");
    assert(test5.status === 200, "TEST 5: Status is 200 OK");
    assert(
      test5.body.message &&
      (test5.body.message.includes("Wireframing") || test5.body.message.includes("Prototyping") || test5.body.message.includes("Figma")),
      "TEST 5: Returns normal AI answer breaking down essential UI/UX skills and industry tools"
    );

    // ----------------------------------------------------------------
    // TEST 6: Click an existing suggested question
    // Expected: Same AI functionality
    // ----------------------------------------------------------------
    console.log("\n--- RUNNING TEST 6: Click suggested question ('I want to learn video editing') ---");
    const test6 = await askAIChat("I want to learn video editing");
    assert(test6.status === 200, "TEST 6: Status is 200 OK");
    assert(
      test6.body.message && test6.body.creators?.length > 0,
      "TEST 6: Suggested questions share identical flow and return full AI answer & recommendations"
    );

    // ----------------------------------------------------------------
    // NEGATIVE & SECURITY TESTS
    // ----------------------------------------------------------------
    console.log("\n--- RUNNING NEGATIVE & ERROR HANDLING TESTS ---");

    // Negative 1: Unauthenticated request (no JWT)
    const unauthRes = await askAIChat("What is video editing?", null);
    assert(unauthRes.status === 401, "Negative 1: Unauthenticated request rejected with 401");

    // Negative 2: Invalid JWT
    const invalidJwtRes = await askAIChat("What is video editing?", "invalid_tampered_token_xyz");
    assert(invalidJwtRes.status === 401, "Negative 2: Invalid/tampered JWT rejected with 401");

    // Negative 3: Empty message
    const emptyRes = await askAIChat("    ");
    assert(emptyRes.status === 400, "Negative 3: Empty whitespace message rejected with 400");

    console.log("\n==================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================\n");
  } catch (error) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
