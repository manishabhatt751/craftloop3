const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/db");
const app = require("./server");

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

function assert(condition, testName) {
  if (!condition) {
    console.error(`❌ FAIL: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${testName}`);
}

async function runTests() {
  console.log("\n==================================================");
  console.log("TESTING: CRAFTLOOP PRACTICE SYSTEM (BACKEND)");
  console.log("==================================================\n");

  await connectDB();

  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const runId = Date.now();

  try {
    // 1. Register a Viewer learner
    const learnerEmail = `learner_${runId}@craftloop.com`;
    const regLearner = await makeRequest(
      server,
      { path: "/api/auth/register", method: "POST" },
      {
        name: "Dev Learner",
        email: learnerEmail,
        password: "Password123!",
        role: "viewer",
      }
    );
    assert(regLearner.status === 201, "1. Learner registers successfully");
    const learnerToken = regLearner.body.token;

    // 2. Register a Creator
    const creatorEmail = `creator_${runId}@craftloop.com`;
    const regCreator = await makeRequest(
      server,
      { path: "/api/auth/register", method: "POST" },
      {
        name: "Mehndi Master",
        email: creatorEmail,
        password: "Password123!",
        role: "creator",
      }
    );
    assert(regCreator.status === 201, "2. Creator registers successfully");
    const creatorToken = regCreator.body.token;

    // 3. Creator publishes a Mehndi course (testing non-technical skill generalization)
    const createCourseRes = await makeRequest(
      server,
      {
        path: "/api/courses",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorToken}` },
      },
      {
        title: "Beginner Mehndi Artistry",
        description: "Learn intricate henna and mehndi patterns from basics to bridal layout.",
        category: "Mehndi",
        level: "Beginner",
        price: 25,
        lessons: [
          { title: "Basic Mehndi Patterns & Hand Position", duration: "12 mins" },
          { title: "Peacock & Floral Motif Mastery", duration: "20 mins" },
        ],
      }
    );
    assert(createCourseRes.status === 201, "3. Creator creates Mehndi course");
    const courseId = createCourseRes.body.data._id;
    const firstLessonId = createCourseRes.body.data.lessons[0]._id;

    // 4. Learner enrolls in course
    const enrollRes = await makeRequest(
      server,
      {
        path: `/api/enrollments/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(enrollRes.status === 201, "4. Learner enrolls in course");

    // 5. Query practices for course (GET /api/practices/course/:courseId)
    const practicesRes = await makeRequest(
      server,
      {
        path: `/api/practices/course/${courseId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(practicesRes.status === 200, "5. GET /api/practices/course/:courseId returns 200");
    assert(practicesRes.body.data.length > 0, "5b. Practices populated for course lessons");
    const quickPractice = practicesRes.body.data.find((p) => p.type === "quick");
    const challengePractice = practicesRes.body.data.find((p) => p.type === "challenge");
    const projectPractice = practicesRes.body.data.find((p) => p.type === "project");

    assert(Boolean(quickPractice), "5c. Quick practice activity generated");
    assert(Boolean(challengePractice), "5d. Skill challenge activity generated");
    assert(Boolean(projectPractice), "5e. Real-world project activity generated");

    // 6. Learner starts a practice (POST /api/practices/:id/start)
    const startRes = await makeRequest(
      server,
      {
        path: `/api/practices/${quickPractice._id}/start`,
        method: "POST",
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(startRes.status === 200, "6. POST /api/practices/:id/start returns 200");
    assert(startRes.body.data.status === "in-progress", "6b. Practice status is in-progress in MongoDB");

    // 7. Verify progress persists in MongoDB (refresh simulation)
    const verifyPersistRes = await makeRequest(
      server,
      {
        path: `/api/practices/${quickPractice._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(verifyPersistRes.status === 200, "7. GET /api/practices/:id returns practice details");
    assert(
      verifyPersistRes.body.userStatus === "in-progress",
      "7b. User progress remains in-progress in MongoDB (source of truth)"
    );

    // 8. Learner submits practice work (POST /api/practices/:id/submit)
    const submitRes = await makeRequest(
      server,
      {
        path: `/api/practices/${quickPractice._id}/submit`,
        method: "POST",
        headers: { Authorization: `Bearer ${learnerToken}` },
      },
      {
        submissionUrl: "https://example.com/my-mehndi-practice.jpg",
        submissionType: "image",
        notes: "Completed my 3 basic pattern motifs! Hand pressure was smooth.",
      }
    );
    assert(submitRes.status === 200, "8. POST /api/practices/:id/submit returns 200");
    assert(submitRes.body.data.status === "completed", "8b. Practice marked completed in MongoDB");

    // 9. Real-World Project Practice converts to CraftLoop portfolio project (Section 8)
    const projectSubmitRes = await makeRequest(
      server,
      {
        path: `/api/practices/${projectPractice._id}/submit`,
        method: "POST",
        headers: { Authorization: `Bearer ${learnerToken}` },
      },
      {
        submissionUrl: "https://example.com/bridal-mehndi-portfolio.jpg",
        submissionType: "image",
        notes: "Festive bridal layout with symmetry and shaded floral vines.",
        createProject: true,
        projectTitle: "Festive Bridal Mehndi Showcase",
        projectDescription: "Created as part of the Beginner Mehndi Artistry course practice challenge.",
      }
    );
    assert(projectSubmitRes.status === 200, "9. Real-World project practice submitted");
    assert(Boolean(projectSubmitRes.body.project), "9b. Portfolio Project created in MongoDB");
    assert(
      projectSubmitRes.body.project.title === "Festive Bridal Mehndi Showcase",
      "9c. Portfolio Project title matches submission"
    );

    // 10. Share completed practice work to Community (Section 12)
    const shareRes = await makeRequest(
      server,
      {
        path: `/api/practices/${projectPractice._id}/share`,
        method: "POST",
        headers: { Authorization: `Bearer ${learnerToken}` },
      },
      {
        message: "Here is my completed festive bridal mehndi practice! Looking for feedback.",
      }
    );
    assert(shareRes.status === 201, "10. Practice shared to Community feed (201 Created)");
    assert(shareRes.body.data.postType === "project", "10b. Community post linked to project");

    // 11. GET /api/practices/my (for My Learning page)
    const myPracticesRes = await makeRequest(
      server,
      {
        path: "/api/practices/my",
        method: "GET",
        headers: { Authorization: `Bearer ${learnerToken}` },
      }
    );
    assert(myPracticesRes.status === 200, "11. GET /api/practices/my returns 200");
    assert(myPracticesRes.body.count >= 2, "11b. User's practices listed in MongoDB");

    // 12. AI integration handles practice questions (Section 11)
    const aiPracticeHelpRes = await makeRequest(
      server,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${learnerToken}` },
      },
      {
        message: "I don't know how to start this poster challenge. Can you give me an easier version?",
      }
    );
    assert(aiPracticeHelpRes.status === 200, "12. AI responds to practice assistance question");
    assert(
      aiPracticeHelpRes.body.reply.toLowerCase().includes("step") ||
      aiPracticeHelpRes.body.reply.toLowerCase().includes("layout") ||
      aiPracticeHelpRes.body.reply.toLowerCase().includes("practice"),
      "12b. AI response contains practical guidance"
    );

    console.log("\n==================================================");
    console.log("ALL PRACTICE SYSTEM BACKEND TESTS PASSED!");
    console.log("==================================================\n");
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
