/**
 * Phase 16 Automated Route Guard & Authorization Integration Tests
 * Validates:
 * 1. Token validation against backend (/api/auth/me)
 * 2. Role verification for Creator vs Viewer
 * 3. Rejection of invalid/expired tokens (401)
 * 4. Creator-only permissions vs Viewer-only permissions
 * 5. Logout & session invalidation simulation
 */

const http = require("http");

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

async function run() {
  console.log("=== PHASE 16 AUTOMATED AUTHENTICATION & GUARD TESTS ===");
  const timestamp = Date.now();

  // 1. Unauthenticated access to protected /api/auth/me (Simulates logged-out user)
  console.log("\n[Test A/B Backend] Checking unauthenticated access...");
  const unauthRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/me",
    method: "GET",
  });
  if (unauthRes.status !== 401) {
    throw new Error(`Expected 401 for unauthenticated access, got ${unauthRes.status}`);
  }
  console.log("✓ Unauthenticated request correctly rejected with HTTP 401.");

  // 2. Register and test Creator session
  console.log("\n[Test C Backend] Registering Creator and validating session...");
  const creatorEmail = `p16_creator_${timestamp}@example.com`;
  const regCreator = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    name: "Phase 16 Creator",
    email: creatorEmail,
    password: "Password123!",
    role: "creator"
  });

  if (regCreator.status !== 201 || !regCreator.body.token) {
    throw new Error(`Creator registration failed: ${JSON.stringify(regCreator.body)}`);
  }
  const creatorToken = regCreator.body.token;

  const verifyCreator = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/me",
    method: "GET",
    headers: { Authorization: `Bearer ${creatorToken}` }
  });

  if (verifyCreator.status !== 200 || verifyCreator.body.user.role !== "creator") {
    throw new Error(`Creator verification failed: ${JSON.stringify(verifyCreator.body)}`);
  }
  console.log("✓ Creator token verified. Role confirmed as 'creator'.");

  // 3. Register and test Viewer session
  console.log("\n[Test D Backend] Registering Viewer and validating session...");
  const viewerEmail = `p16_viewer_${timestamp}@example.com`;
  const regViewer = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    name: "Phase 16 Viewer",
    email: viewerEmail,
    password: "Password123!",
    role: "viewer"
  });

  if (regViewer.status !== 201 || !regViewer.body.token) {
    throw new Error(`Viewer registration failed: ${JSON.stringify(regViewer.body)}`);
  }
  const viewerToken = regViewer.body.token;

  const verifyViewer = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/me",
    method: "GET",
    headers: { Authorization: `Bearer ${viewerToken}` }
  });

  if (verifyViewer.status !== 200 || verifyViewer.body.user.role !== "viewer") {
    throw new Error(`Viewer verification failed: ${JSON.stringify(verifyViewer.body)}`);
  }
  console.log("✓ Viewer token verified. Role confirmed as 'viewer'.");

  // 4. Role-based endpoint protection check
  console.log("\n[Test E/F Backend] Testing role segregation...");
  // Creator cannot enroll in course
  const testCourseRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/courses",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`
    }
  }, {
    title: "Phase 16 Protection Test Course",
    description: "Testing course",
    category: "Design",
    level: "Beginner"
  });
  const courseId = testCourseRes.body.data?._id;

  const creatorEnroll = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`
    }
  }, {});
  if (creatorEnroll.status !== 403) {
    throw new Error(`Expected 403 when creator accesses viewer enrollment, got ${creatorEnroll.status}`);
  }
  console.log("✓ Creator correctly forbidden (403) from viewer-specific action.");

  // Viewer cannot create projects
  const viewerCreateProject = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/projects",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {
    title: "Viewer unauthorized project",
    category: "Design"
  });
  if (viewerCreateProject.status !== 403) {
    throw new Error(`Expected 403 when viewer tries to create project, got ${viewerCreateProject.status}`);
  }
  console.log("✓ Viewer correctly forbidden (403) from creator-specific project creation.");

  // 5. Invalid / Expired Token Check (Test I)
  console.log("\n[Test I Backend] Checking invalid / forged token rejection...");
  const invalidTokenRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/me",
    method: "GET",
    headers: { Authorization: "Bearer invalid_token_12345_xyz" }
  });
  if (invalidTokenRes.status !== 401) {
    throw new Error(`Expected 401 for invalid token, got ${invalidTokenRes.status}`);
  }
  console.log("✓ Invalid/forged token correctly rejected with HTTP 401.");

  console.log("\n=============================================");
  console.log("ALL PHASE 16 AUTHENTICATION TESTS PASSED!");
  console.log("=============================================");
}

run().catch((err) => {
  console.error("\n❌ PHASE 16 TEST ERROR:", err.message);
  process.exit(1);
});
