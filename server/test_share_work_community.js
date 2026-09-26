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
  console.log("TESTING: SHARE MY WORK IN COMMUNITY BACKEND");
  console.log("==================================================\n");

  await connectDB();

  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const runId = Date.now();

  try {
    // 1. Register Creator A
    const creatorAEmail = `creatorA_${runId}@example.com`;
    const regCreatorARes = await makeRequest(
      server,
      { path: "/api/auth/register", method: "POST" },
      {
        name: "Creator Alpha",
        email: creatorAEmail,
        password: "Password123!",
        role: "creator",
      }
    );
    assert(regCreatorARes.status === 201, "1. Creator A registers successfully");
    const creatorAToken = regCreatorARes.body.token;

    // 2. Register Creator B
    const creatorBEmail = `creatorB_${runId}@example.com`;
    const regCreatorBRes = await makeRequest(
      server,
      { path: "/api/auth/register", method: "POST" },
      {
        name: "Creator Beta",
        email: creatorBEmail,
        password: "Password123!",
        role: "creator",
      }
    );
    assert(regCreatorBRes.status === 201, "2. Creator B registers successfully");
    const creatorBToken = regCreatorBRes.body.token;

    // 3. Creator A creates a Project
    const createProjRes = await makeRequest(
      server,
      {
        path: "/api/projects",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorAToken}` },
      },
      {
        title: "Alpha Portfolio Showcase",
        description: "A showcase of branding and visual identity.",
        category: "Design",
        image: "https://example.com/alpha-project.jpg",
        tags: ["Branding", "Showcase"],
      }
    );
    assert(createProjRes.status === 201, "3. Creator A creates a Project");
    const projectIdA = createProjRes.body.data._id;

    // 4. Creator B attempts to share Creator A's project -> Must be 403 Forbidden
    const unauthShareRes = await makeRequest(
      server,
      {
        path: "/api/community/posts",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorBToken}` },
      },
      {
        content: "I want to share someone else's project!",
        projectId: projectIdA,
      }
    );
    assert(
      unauthShareRes.status === 403,
      "4. Creator B sharing Creator A's project rejected with 403 Forbidden"
    );
    assert(
      unauthShareRes.body.message === "You can only share your own projects.",
      "4b. Correct 403 error message returned"
    );

    // 5. Sharing non-existent project returns 404
    const notFoundShareRes = await makeRequest(
      server,
      {
        path: "/api/community/posts",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorAToken}` },
      },
      {
        content: "Check this out",
        projectId: "507f1f77bcf86cd799439011",
      }
    );
    assert(notFoundShareRes.status === 404, "5. Non-existent projectId rejected with 404");

    // 6. Creator A shares own project to Community
    const shareOwnProjRes = await makeRequest(
      server,
      {
        path: "/api/community/posts",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorAToken}` },
      },
      {
        content: "Check out my new portfolio project on CraftLoop!",
        projectId: projectIdA,
        projectUrl: `http://localhost:5174/project/${projectIdA}`,
      }
    );
    assert(shareOwnProjRes.status === 201, "6. Creator A shares own project successfully (201 Created)");
    const createdPost = shareOwnProjRes.body.data;
    assert(createdPost.postType === "project", "6b. postType is set to 'project'");
    assert(createdPost.projectId._id.toString() === projectIdA.toString(), "6c. projectId is populated");
    assert(
      createdPost.projectId.title === "Alpha Portfolio Showcase",
      "6d. projectId contains project title"
    );
    assert(
      createdPost.projectUrl === `http://localhost:5174/project/${projectIdA}`,
      "6e. projectUrl matches attached link"
    );

    // 7. Verify GET /api/community/posts includes project data
    const getPostsRes = await makeRequest(server, {
      path: "/api/community/posts",
      method: "GET",
    });
    assert(getPostsRes.status === 200, "7. GET /api/community/posts returns 200");
    const foundSharedPost = getPostsRes.body.data.find(
      (p) => p._id.toString() === createdPost._id.toString()
    );
    assert(Boolean(foundSharedPost), "7b. Shared post found in feed");
    assert(
      foundSharedPost.projectId && foundSharedPost.projectId.title === "Alpha Portfolio Showcase",
      "7c. Populated project title preserved in GET feed"
    );

    // 8. Normal text post creation still works
    const normalPostRes = await makeRequest(
      server,
      {
        path: "/api/community/posts",
        method: "POST",
        headers: { Authorization: `Bearer ${creatorAToken}` },
      },
      {
        content: "Just a regular discussion post!",
        category: "Design",
      }
    );
    assert(normalPostRes.status === 201, "8. Standard text post creation still works (201 Created)");
    assert(normalPostRes.body.data.postType === "text", "8b. Normal post has postType 'text'");

    console.log("\n==================================================");
    console.log("ALL SHARE WORK COMMUNITY TESTS PASSED SUCCESSFULLY!");
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
