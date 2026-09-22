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

async function runRegressionSuite() {
  console.log("\n==================================================");
  console.log("CRAFTLOOP FULL-STACK END-TO-END VERIFICATION SUITE");
  console.log("==================================================\n");

  await connectDB();

  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const port = server.address().port;
  console.log(`Verification test server running on port ${port}\n`);

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
    // 1. Health check
    const health = await makeRequest(server, { path: "/api/health", method: "GET" });
    assert(health.status === 200, "1. GET /api/health returns 200 OK");

    const ts = Date.now();
    const creatorCreds = {
      name: `Creator Test ${ts}`,
      email: `creator_${ts}@craftloop.com`,
      password: "password123",
      role: "creator",
    };
    const viewerCreds = {
      name: `Viewer Test ${ts}`,
      email: `viewer_${ts}@craftloop.com`,
      password: "password123",
      role: "viewer",
    };

    // 2. Creator Registration
    const regCreator = await makeRequest(server, { path: "/api/auth/register", method: "POST" }, creatorCreds);
    assert(regCreator.status === 201 && regCreator.body.token, "2. Creator registration returns 201 and JWT token");
    const creatorToken = regCreator.body.token;
    const creatorId = regCreator.body.user._id;

    // 3. Viewer Registration
    const regViewer = await makeRequest(server, { path: "/api/auth/register", method: "POST" }, viewerCreds);
    assert(regViewer.status === 201 && regViewer.body.token, "3. Viewer registration returns 201 and JWT token");
    const viewerToken = regViewer.body.token;
    const viewerId = regViewer.body.user._id;

    // 4. Creator Login
    const loginCreator = await makeRequest(server, { path: "/api/auth/login", method: "POST" }, {
      email: creatorCreds.email,
      password: creatorCreds.password,
    });
    assert(loginCreator.status === 200 && loginCreator.body.token, "4. Creator login returns 200 and token");

    // 5. Viewer Login
    const loginViewer = await makeRequest(server, { path: "/api/auth/login", method: "POST" }, {
      email: viewerCreds.email,
      password: viewerCreds.password,
    });
    assert(loginViewer.status === 200 && loginViewer.body.token, "5. Viewer login returns 200 and token");

    // 6. Profile GET
    const profGet = await makeRequest(server, {
      path: "/api/users/profile",
      headers: { Authorization: `Bearer ${creatorToken}` },
    });
    assert(profGet.status === 200 && profGet.body.data.email === creatorCreds.email, "6. GET /api/users/profile returns authenticated creator");

    // 7. Profile PUT (update)
    const profPut = await makeRequest(
      server,
      {
        path: "/api/users/profile",
        method: "PUT",
        headers: { Authorization: `Bearer ${creatorToken}` },
      },
      {
        title: "Lead Visual Designer",
        bio: "Designing innovative systems at CraftLoop.",
        skills: ["UI/UX Design", "Figma", "Branding"],
      }
    );
    assert(
      profPut.status === 200 &&
      profPut.body.data.title === "Lead Visual Designer" &&
      profPut.body.data.skills.includes("Figma"),
      "7. PUT /api/users/profile updates title and skills"
    );

    // 8. Creator creates a project
    const createProj = await makeRequest(
      server,
      {
        path: "/api/projects",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorToken}` },
      },
      {
        title: `Design System Project ${ts}`,
        category: "Design",
        description: "Comprehensive tokenized UI kit",
        status: "Published",
        tags: ["Design", "UI/UX"],
      }
    );
    assert(createProj.status === 201 && createProj.body.data.title.includes("Design System"), "8. Creator creates project (POST /api/projects returns 201)");
    const projectId = createProj.body.data._id;

    // 9. Viewer or anyone lists projects
    const listProj = await makeRequest(server, { path: "/api/projects", method: "GET" });
    assert(listProj.status === 200 && listProj.body.data.length > 0, "9. GET /api/projects lists projects");

    // 10. Creator creates a course
    const createCourse = await makeRequest(
      server,
      {
        path: "/api/courses",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorToken}` },
      },
      {
        title: `Modern React Masterclass ${ts}`,
        category: "Development",
        level: "Beginner",
        description: "Master React and modern web development.",
        status: "Published",
        lessons: [
          { title: "Introduction to React", duration: "12 min", description: "Getting started" },
          { title: "Components & Props", duration: "20 min", description: "Reusable UI blocks" },
        ],
      }
    );
    assert(createCourse.status === 201 && createCourse.body.data.title.includes("Modern React"), "10. Creator creates course (POST /api/courses returns 201)");
    const courseId = createCourse.body.data._id;

    // 11. Viewer views courses
    const listCourses = await makeRequest(server, { path: "/api/courses", method: "GET" });
    assert(listCourses.status === 200 && listCourses.body.data.length > 0, "11. GET /api/courses lists published courses");

    // 12. Viewer views single course details
    const singleCourse = await makeRequest(server, { path: `/api/courses/${courseId}`, method: "GET" });
    assert(singleCourse.status === 200 && singleCourse.body.data._id === courseId, "12. GET /api/courses/:id returns single course details");

    // 13. Viewer enrolls in course
    const enrollRes = await makeRequest(
      server,
      {
        path: `/api/enrollments/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${viewerToken}` },
      }
    );
    assert(enrollRes.status === 201 && enrollRes.body.data.course, "13. Viewer enrolls in course (POST /api/enrollments/:id returns 201)");

    // 14. Duplicate enrollment prevention
    const duplicateEnroll = await makeRequest(
      server,
      {
        path: `/api/enrollments/${courseId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${viewerToken}` },
      }
    );
    assert(duplicateEnroll.status === 400, "14. Duplicate enrollment prevented (returns 400 Bad Request)");

    // 15. Viewer gets My Learning
    const myLearning = await makeRequest(
      server,
      {
        path: "/api/enrollments/me",
        headers: { Authorization: `Bearer ${viewerToken}` },
      }
    );
    assert(myLearning.status === 200 && myLearning.body.data.length >= 1, "15. GET /api/enrollments/me returns viewer's enrolled courses");

    // 16. Viewer updates lesson progress
    const progressRes = await makeRequest(
      server,
      {
        path: `/api/enrollments/${courseId}/progress`,
        method: "PUT",
        headers: { Authorization: `Bearer ${viewerToken}` },
      },
      {
        lessonIndex: 0,
        progress: 50,
      }
    );
    assert(progressRes.status === 200 && progressRes.body.data.progress === 50, "16. PUT /api/enrollments/:id/progress updates lesson progress");

    // 17. Community API: Create post
    const postRes = await makeRequest(
      server,
      {
        path: "/api/community/posts",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorToken}` },
      },
      {
        content: "Excited to share our newest design token system on CraftLoop!",
        category: "Design",
      }
    );
    assert(postRes.status === 201 && postRes.body.data.content.includes("Excited to share"), "17. POST /api/community/posts creates community post");
    const postId = postRes.body.data._id;

    // 18. Community API: Like post
    const likeRes = await makeRequest(
      server,
      {
        path: `/api/community/posts/${postId}/like`,
        method: "POST",
        headers: { Authorization: `Bearer ${viewerToken}` },
      }
    );
    assert(likeRes.status === 200 && likeRes.body.likesCount === 1, "18. POST /api/community/posts/:id/like toggles like count to 1");

    // 19. Community API: Add comment
    const commentRes = await makeRequest(
      server,
      {
        path: `/api/community/posts/${postId}/comments`,
        method: "POST",
        headers: { Authorization: `Bearer ${viewerToken}` },
      },
      {
        text: "Looks fantastic! Love the color transitions.",
      }
    );
    assert(commentRes.status === 201 && commentRes.body.data.comments.length === 1, "19. POST /api/community/posts/:id/comments adds comment");

    // 20. Community API: Viewer unauthorized delete of creator's post
    const unauthDelete = await makeRequest(
      server,
      {
        path: `/api/community/posts/${postId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${viewerToken}` },
      }
    );
    assert(unauthDelete.status === 403, "20. Viewer unauthorized delete of creator's post rejected with 403 Forbidden");

    // 21. Community API: Creator deletes own post
    const authDelete = await makeRequest(
      server,
      {
        path: `/api/community/posts/${postId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${creatorToken}` },
      }
    );
    assert(authDelete.status === 200, "21. Creator deletes own post successfully (returns 200)");

    // 22. Messaging: Creator sends message to Viewer
    const sendMsg = await makeRequest(
      server,
      {
        path: "/api/messages",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorToken}` },
      },
      {
        receiverId: viewerId,
        content: "Hi, welcome to CraftLoop! Let me know if you need help with the course.",
      }
    );
    assert(sendMsg.status === 201 && sendMsg.body.data.content.includes("welcome to CraftLoop"), "22. POST /api/messages sends message between creator and viewer");

    // 23. Messaging: Viewer reads conversation
    const getConv = await makeRequest(
      server,
      {
        path: `/api/messages/conversation/${creatorId}`,
        headers: { Authorization: `Bearer ${viewerToken}` },
      }
    );
    assert(getConv.status === 200 && getConv.body.data.length === 1, "23. GET /api/messages/conversation/:id retrieves conversation");

    // 24. AI Chat endpoint
    const aiRes = await makeRequest(
      server,
      {
        path: "/api/ai/chat",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorToken}` },
      },
      {
        message: "I want to learn modern UI UX design with Figma",
      }
    );
    assert(aiRes.status === 200 && aiRes.body.success === true, "24. POST /api/ai/chat returns intelligent recommendation response");

    // 25. Security check: No password or hash exposed in user responses
    const jsonStr = JSON.stringify(regCreator.body) + JSON.stringify(profGet.body) + JSON.stringify(profPut.body);
    const hasPassword = jsonStr.includes("$2a$") || jsonStr.includes("$2b$");
    assert(!hasPassword, "25. Security: Passwords and password hashes never exposed in responses");

  } catch (err) {
    console.error("Regression suite error:", err);
    failed++;
  } finally {
    server.close();
    console.log(`\n==================================================`);
    console.log(`FULL REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==================================================\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runRegressionSuite();
