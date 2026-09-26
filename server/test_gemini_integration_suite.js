const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/db");
const { User, Course, Project, Enrollment } = require("./models");
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

async function runGeminiIntegrationSuite() {
  console.log("\n==================================================");
  console.log("CRAFTLOOP GEMINI INTEGRATION & 8-CASE TEST SUITE");
  console.log("==================================================\n");

  await connectDB();

  const PORT = 5092;
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
    const timestamp = Date.now();

    // 1. Register a test user with skills and an enrollment
    const testUserData = {
      name: `Alex Fullstack ${timestamp}`,
      email: `alex_${timestamp}@craftloop.test`,
      password: "securePassword123",
      role: "viewer",
    };

    const regRes = await makeRequest(
      PORT,
      { path: "/api/auth/register", method: "POST" },
      testUserData
    );
    assert(regRes.status === 201 && regRes.body?.token, "Setup: User registered with JWT");
    const authToken = regRes.body?.token;
    const testUserId = regRes.body?.user?._id || regRes.body?.user?.id;

    // Update skills and title on user
    if (testUserId) {
      await User.findByIdAndUpdate(testUserId, {
        skills: ["HTML", "CSS", "JavaScript"],
        title: "Aspiring Web Developer",
      });
    }

    // 2. Ensure real courses and creators exist in DB for testing
    let videoCreator = await User.findOne({ role: "creator", skills: { $in: [/video/i] } });
    if (!videoCreator) {
      videoCreator = await User.create({
        name: "Marcus Aurelius (Video)",
        email: `marcus_${timestamp}@craftloop.test`,
        password: "securepassword",
        role: "creator",
        skills: ["Video Editing", "Premiere Pro", "DaVinci Resolve"],
        title: "Video Editor & Filmmaker",
      });
    }

    let webCourse = await Course.findOne({ category: /development/i, status: "Published" });
    if (!webCourse) {
      webCourse = await Course.create({
        title: "Full-Stack React & Node Essentials",
        description: "Comprehensive guide to building full-stack web applications with React, Node.js, Express, and MongoDB.",
        category: "Development",
        level: "Beginner",
        status: "Published",
        instructor: videoCreator._id,
      });
    }

    // Record an enrollment for this test user (completed JavaScript)
    await Enrollment.create({
      user: testUserId,
      course: webCourse._id,
      progress: 100,
      status: "completed",
    });

    async function sendChat(message) {
      return await makeRequest(
        PORT,
        {
          path: "/api/ai/chat",
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
        },
        { message }
      );
    }

    // Helper: verify every recommended entity exists in MongoDB
    async function verifyEntitiesExistInDB(resBody) {
      if (resBody.creators && resBody.creators.length > 0) {
        for (const c of resBody.creators) {
          const exists = await User.findById(c.id);
          assert(!!exists, `Grounding: Creator "${c.name}" (ID ${c.id}) exists in MongoDB`);
        }
      }
      if (resBody.courses && resBody.courses.length > 0) {
        for (const cr of resBody.courses) {
          const exists = await Course.findById(cr.id);
          assert(!!exists, `Grounding: Course "${cr.title}" (ID ${cr.id}) exists in MongoDB`);
        }
      }
      if (resBody.projects && resBody.projects.length > 0) {
        for (const p of resBody.projects) {
          const exists = await Project.findById(p.id);
          assert(!!exists, `Grounding: Project "${p.title}" (ID ${p.id}) exists in MongoDB`);
        }
      }
    }

    // -------------------------------------------------------------------------
    // TEST CASE 1: "I want to learn graphic design."
    // Intent: SKILL_GUIDANCE / COURSE_RECOMMENDATION
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 1: 'I want to learn graphic design.' ---");
    const res1 = await sendChat("I want to learn graphic design.");
    assert(res1.status === 200, "TC1: Status 200");
    assert(res1.body.success === true, "TC1: success === true");
    assert(res1.body.message && res1.body.message.length > 50, "TC1: Returned detailed guidance");
    assert(res1.body.intent?.skills?.length > 0, "TC1: Returned design skills");
    await verifyEntitiesExistInDB(res1.body);

    // -------------------------------------------------------------------------
    // TEST CASE 2: "I am a beginner. Which course should I start?"
    // Intent: COURSE_RECOMMENDATION
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 2: 'I am a beginner. Which course should I start?' ---");
    const res2 = await sendChat("I am a beginner. Which course should I start?");
    assert(res2.status === 200, "TC2: Status 200");
    assert(res2.body.intent?.type === "COURSE_RECOMMENDATION", "TC2: Detected COURSE_RECOMMENDATION intent");
    assert(res2.body.message && res2.body.message.length > 50, "TC2: Actionable response provided");
    await verifyEntitiesExistInDB(res2.body);

    // -------------------------------------------------------------------------
    // TEST CASE 3: "Find me a creator who teaches video editing."
    // Intent: CREATOR_RECOMMENDATION
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 3: 'Find me a creator who teaches video editing.' ---");
    const res3 = await sendChat("Find me a creator who teaches video editing.");
    assert(res3.status === 200, "TC3: Status 200");
    assert(res3.body.intent?.type === "CREATOR_RECOMMENDATION", "TC3: Detected CREATOR_RECOMMENDATION intent");
    assert(res3.body.creators?.length > 0, "TC3: Successfully matched video creator(s)");
    await verifyEntitiesExistInDB(res3.body);

    // -------------------------------------------------------------------------
    // TEST CASE 4: "I know HTML and CSS. What project should I build?"
    // Intent: PROJECT_RECOMMENDATION / PRACTICE_SUGGESTION
    // Personalization: Knows HTML and CSS
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 4: 'I know HTML and CSS. What project should I build?' ---");
    const res4 = await sendChat("I know HTML and CSS. What project should I build?");
    assert(res4.status === 200, "TC4: Status 200");
    assert(
      res4.body.intent?.type === "PROJECT_RECOMMENDATION" || res4.body.intent?.type === "PRACTICE_SUGGESTION",
      "TC4: Detected project / practice intent"
    );
    assert(
      res4.body.message.toLowerCase().includes("project") ||
      res4.body.message.toLowerCase().includes("portfolio") ||
      res4.body.message.toLowerCase().includes("landing page") ||
      res4.body.message.toLowerCase().includes("build"),
      "TC4: Recommends realistic practical projects for HTML/CSS"
    );
    await verifyEntitiesExistInDB(res4.body);

    // -------------------------------------------------------------------------
    // TEST CASE 5: "I completed JavaScript. What should I learn next?"
    // Intent: NEXT_STEP
    // Personalization: Considers completed JS, points to React, Node, or Full-Stack
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 5: 'I completed JavaScript. What should I learn next?' ---");
    const res5 = await sendChat("I completed JavaScript. What should I learn next?");
    assert(res5.status === 200, "TC5: Status 200");
    assert(res5.body.intent?.type === "NEXT_STEP", "TC5: Detected NEXT_STEP intent");
    assert(
      res5.body.message.toLowerCase().includes("react") ||
      res5.body.message.toLowerCase().includes("node") ||
      res5.body.message.toLowerCase().includes("framework") ||
      res5.body.message.toLowerCase().includes("full-stack") ||
      res5.body.message.toLowerCase().includes("backend") ||
      res5.body.message.toLowerCase().includes("api"),
      "TC5: Personalized progression suggests React, Node, APIs, or Full-Stack rather than beginner basics"
    );
    await verifyEntitiesExistInDB(res5.body);

    // -------------------------------------------------------------------------
    // TEST CASE 6: "I want to become a full-stack developer."
    // Intent: LEARNING_ROADMAP
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 6: 'I want to become a full-stack developer.' ---");
    const res6 = await sendChat("I want to become a full-stack developer.");
    assert(res6.status === 200, "TC6: Status 200");
    assert(res6.body.intent?.type === "LEARNING_ROADMAP", "TC6: Detected LEARNING_ROADMAP intent");
    assert(
      res6.body.message.toLowerCase().includes("frontend") ||
      res6.body.message.toLowerCase().includes("backend") ||
      res6.body.message.toLowerCase().includes("database") ||
      res6.body.message.toLowerCase().includes("react"),
      "TC6: Returns full-stack learning roadmap covering frontend, backend, and databases"
    );
    await verifyEntitiesExistInDB(res6.body);

    // -------------------------------------------------------------------------
    // TEST CASE 7: "What is UI/UX design?"
    // Intent: GENERAL_QUESTION
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 7: 'What is UI/UX design?' ---");
    const res7 = await sendChat("What is UI/UX design?");
    assert(res7.status === 200, "TC7: Status 200");
    assert(res7.body.intent?.type === "GENERAL_QUESTION", "TC7: Detected GENERAL_QUESTION intent");
    assert(
      (res7.body.message.toLowerCase().includes("user interface") || res7.body.message.toLowerCase().includes("ui")) &&
      (res7.body.message.toLowerCase().includes("user experience") || res7.body.message.toLowerCase().includes("ux")),
      "TC7: Comprehensively explains both UI and UX design"
    );
    await verifyEntitiesExistInDB(res7.body);

    // -------------------------------------------------------------------------
    // TEST CASE 8: "Find me a quantum computing course on CraftLoop."
    // Non-existent entity in DB -> Anti-hallucination test
    // Must clearly state: "I couldn't find a matching resource on CraftLoop right now."
    // -------------------------------------------------------------------------
    console.log("\n--- TEST CASE 8: 'Find me a quantum computing course on CraftLoop.' ---");
    const res8 = await sendChat("Find me a quantum computing course on CraftLoop.");
    assert(res8.status === 200, "TC8: Status 200");
    assert(res8.body.courses?.length === 0, "TC8: Zero hallucinated courses (courses array is empty)");
    assert(
      res8.body.message.toLowerCase().includes("couldn't find") ||
      res8.body.message.toLowerCase().includes("could not find"),
      "TC8: Explicitly states 'I couldn't find a matching resource on CraftLoop right now.'"
    );
    await verifyEntitiesExistInDB(res8.body);

    // -------------------------------------------------------------------------
    // SAFETY & ERROR HANDLING TESTS
    // -------------------------------------------------------------------------
    console.log("\n--- SAFETY & ERROR HANDLING TESTS ---");
    // Missing token
    const errUnauth = await makeRequest(PORT, { path: "/api/ai/chat", method: "POST" }, { message: "Hello" });
    assert(errUnauth.status === 401, "Error 1: Missing auth token rejected with 401");

    // Invalid body
    const errBadBody = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { notAMessage: 123 }
    );
    assert(errBadBody.status === 400, "Error 2: Malformed payload rejected with 400");

    // Message too long
    const errTooLong = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { message: "z".repeat(2005) }
    );
    assert(errTooLong.status === 400, "Error 3: Message exceeding 2000 chars rejected with 400");

    console.log("\n==================================================");
    console.log(`INTEGRATION SUITE RESULT: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================\n");

    server.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test execution failed:", err);
    server.close();
    process.exit(1);
  }
}

runGeminiIntegrationSuite();
