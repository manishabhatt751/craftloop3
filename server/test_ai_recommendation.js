const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/db");
const { User, Course, Project } = require("./models");
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
  console.log("CRAFTLOOP AI RECOMMENDATION ASSISTANT TEST SUITE");
  console.log("==================================================\n");

  await connectDB();

  const PORT = 5055;
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) return reject(err);
      console.log(`Backend test server running on port ${PORT}`);
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

    // Setup: Register a test user to get a valid JWT token
    const testUserData = {
      name: `Tester ${timestamp}`,
      email: `tester_${timestamp}@craftloop.test`,
      password: "password123",
      role: "viewer",
    };

    const regRes = await makeRequest(PORT, { path: "/api/auth/register", method: "POST" }, testUserData);
    assert(regRes.status === 201 && regRes.body?.token, "Setup: User registered and JWT token issued");
    const authToken = regRes.body.token;

    // Setup: Create 2 real creators in MongoDB
    const videoCreator = await User.create({
      name: "Jordan Lee (Video Pro)",
      email: `jordan_${timestamp}@craftloop.test`,
      password: "securepassword123",
      role: "creator",
      title: "Senior Video Editor & Motion Designer",
      bio: "10+ years specializing in Premiere Pro, After Effects, and YouTube content editing.",
      skills: ["Video Editing", "Motion Graphics", "Premiere Pro", "Color Grading"],
      balance: 1500,
    });

    const designCreator = await User.create({
      name: "Elena Rostova (Designer)",
      email: `elena_${timestamp}@craftloop.test`,
      password: "securepassword456",
      role: "creator",
      title: "Brand & Graphic Designer",
      bio: "Crafting modern logos, flyers, and branding identities using Photoshop and Illustrator.",
      skills: ["Graphic Design", "Branding", "Typography", "Adobe Illustrator"],
      balance: 2300,
    });

    assert(videoCreator && designCreator, "Setup: Created real creators in MongoDB");

    // Setup: Create real courses in MongoDB
    const videoCourse = await Course.create({
      title: "Mastering Video Editing & Storytelling",
      description: "Learn pacing, rough cuts, color grading, and audio design in Premiere Pro.",
      category: "Video Editing",
      level: "Beginner",
      instructor: videoCreator._id,
      status: "Published",
      lessons: [{ title: "Timeline Workflow", duration: "15 min" }],
    });

    const designCourse = await Course.create({
      title: "Creative Graphic Design & Flyer Production",
      description: "Master typography, visual balance, and vector illustration.",
      category: "Graphic Design",
      level: "Intermediate",
      instructor: designCreator._id,
      status: "Published",
      lessons: [{ title: "Grid Alignment", duration: "12 min" }],
    });

    // Setup: Create real project in MongoDB
    const videoProject = await Project.create({
      title: "Cinematic YouTube Trailer Edit",
      description: "Fast-paced promo cut with dynamic motion titles and sound design.",
      category: "Video Editing",
      tags: ["video editing", "youtube", "motion graphics"],
      tools: ["Premiere Pro", "After Effects"],
      status: "Published",
      creator: videoCreator._id,
    });

    assert(videoCourse && designCourse && videoProject, "Setup: Real courses and projects saved in MongoDB");

    // ==========================================
    // TEST 5: No authentication -> 401 response
    // ==========================================
    const unauthRes = await makeRequest(
      PORT,
      { path: "/api/ai/chat", method: "POST" },
      { message: "I want to learn video editing." }
    );
    assert(unauthRes.status === 401, "TEST 5: Unauthenticated request correctly rejected with 401");

    // ==========================================
    // TEST 6: Empty message -> 400 validation error
    // ==========================================
    const emptyRes = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { message: "   " }
    );
    assert(emptyRes.status === 400, "TEST 6: Empty message correctly rejected with 400");

    // Test 6b: Excessively long message (> 2000 chars) -> 400 validation error
    const longRes = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { message: "a".repeat(2050) }
    );
    assert(longRes.status === 400, "TEST 6b: Excessively long message (>2000 chars) rejected with 400");

    // ==========================================
    // TEST 1: User: "I want to learn video editing."
    // Expected: Relevant skills + actual matching creators/courses
    // ==========================================
    const test1Res = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { message: "I want to learn video editing." }
    );

    assert(test1Res.status === 200, "TEST 1: Request succeeded with 200 OK");
    assert(test1Res.body.success === true, "TEST 1: Response has success: true");
    assert(test1Res.body.intent?.skills?.length > 0, "TEST 1: Extracted relevant skills (e.g. Video Editing, Motion Graphics)");
    assert(
      test1Res.body.creators?.some((c) => c.id === videoCreator._id.toString()),
      "TEST 1: Successfully matched real MongoDB creator Jordan Lee"
    );
    assert(
      test1Res.body.courses?.some((c) => c.id === videoCourse._id.toString()),
      "TEST 1: Successfully matched real MongoDB course"
    );
    assert(
      test1Res.body.projects?.some((p) => p.id === videoProject._id.toString()),
      "TEST 1: Successfully matched real MongoDB project"
    );
    assert(test1Res.body.tools?.length > 0, "TEST 1: Returned suggested tools (Premiere Pro, After Effects, etc.)");
    assert(test1Res.body.nextSteps?.length > 0, "TEST 1: Returned suggested learning next steps");

    // ==========================================
    // TEST 2: User: "Which creator should I learn graphic design from?"
    // Expected: Actual matching creators from MongoDB
    // ==========================================
    const test2Res = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { message: "Which creator should I learn graphic design from?" }
    );

    assert(test2Res.status === 200, "TEST 2: Graphic design query succeeded with 200");
    assert(
      test2Res.body.creators?.some((c) => c.id === designCreator._id.toString()),
      "TEST 2: Successfully returned real graphic design creator Elena Rostova"
    );
    assert(
      test2Res.body.creators?.[0]?.reason && !test2Res.body.creators[0].reason.includes("best"),
      "TEST 2: Uses factual, relevance-based language instead of claiming creator is 'best'"
    );

    // ==========================================
    // TEST 3: User: "I want to create a YouTube video but don't know editing."
    // Expected: Skills + relevant creators + courses + tools + next step
    // ==========================================
    const test3Res = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { message: "I want to create a YouTube video but don't know editing." }
    );

    assert(test3Res.status === 200, "TEST 3: Complex YouTube editing query succeeded with 200");
    assert(test3Res.body.intent?.skills?.length > 0, "TEST 3: Identified required skills");
    assert(test3Res.body.creators?.length > 0, "TEST 3: Identified relevant creators");
    assert(test3Res.body.courses?.length > 0, "TEST 3: Identified relevant courses");
    assert(test3Res.body.tools?.length > 0, "TEST 3: Recommended useful tools");
    assert(test3Res.body.nextSteps?.length > 0, "TEST 3: Outlined actionable next steps");

    // ==========================================
    // TEST 4: Category that does not exist in DB
    // Expected: No fake creator. Show useful "no matching creator found"
    // ==========================================
    const test4Res = await makeRequest(
      PORT,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      },
      { message: "I want an expert in underwater glassblowing and sculpting." }
    );

    assert(test4Res.status === 200, "TEST 4: Non-existent category query returned 200");
    assert(test4Res.body.creators?.length === 0, "TEST 4: Zero fake creators invented (creators array is empty)");
    assert(test4Res.body.courses?.length === 0, "TEST 4: Zero fake courses invented (courses array is empty)");
    assert(
      test4Res.body.message && test4Res.body.message.toLowerCase().includes("couldn't find"),
      "TEST 4: Displays clear message that no matching CraftLoop creators were found"
    );

    // ==========================================
    // TEST 7: Security & Sensitive Data Verification
    // Passwords, hashes, JWT secrets, balances must NEVER appear in response
    // ==========================================
    const responseString = JSON.stringify(test1Res.body);
    assert(!responseString.includes("securepassword123"), "TEST 7: Password never exposed in response");
    assert(!responseString.includes("password"), "TEST 7: Password field never present in response");
    assert(!responseString.includes("1500"), "TEST 7: User balance never exposed in response");
    assert(!responseString.includes("JWT_SECRET"), "TEST 7: JWT secrets never exposed in response");

    // Clean up test server
    server.close();

    console.log("\n==================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================\n");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    server.close();
    process.exit(1);
  }
}

runTests();
