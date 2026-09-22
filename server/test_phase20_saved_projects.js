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
  console.log("  PHASE 20 TEST: SAVED PROJECTS & BOOKMARKS");
  console.log("========================================================\n");

  const { connectDB } = require("./config/db");
  const { User, Project, SavedProject, Notification } = require("./models");
  await connectDB();

  try {
    const timestamp = Date.now();

    // 1. Unauthenticated rejection
    const unauthRes = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/saved-projects",
      method: "GET",
    });
    assert(unauthRes.status === 401, "Unauthenticated GET /api/saved-projects returns 401");

    // 2. Register Creator
    const creatorEmail = `saved_creator_${timestamp}@craftloop.test`;
    const regCreator = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Saved Project Creator",
        email: creatorEmail,
        password: "Password123!",
        role: "creator",
      }
    );
    const creatorId = regCreator.body?.user?._id;

    // Create a project belonging to Creator
    const project = await Project.create({
      title: "Handmade Ceramic Vase",
      description: "Artisanal ceramic vase hand-thrown on the wheel.",
      category: "Ceramics",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61",
      creator: creatorId,
    });
    const projectId = String(project._id);

    // 3. Register Viewer
    const viewerEmail = `saved_viewer_${timestamp}@craftloop.test`;
    const regViewer = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Saved Project Viewer",
        email: viewerEmail,
        password: "Password123!",
        role: "viewer",
      }
    );
    const viewerToken = regViewer.body?.token;
    const viewerId = regViewer.body?.user?._id;
    const viewerHeaders = {
      Authorization: `Bearer ${viewerToken}`,
      "Content-Type": "application/json",
    };

    // 4. Save project via POST /api/saved-projects/:projectId
    const saveRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: `/api/saved-projects/${projectId}`,
        method: "POST",
        headers: viewerHeaders,
      },
      {}
    );
    assert(saveRes.status === 201, "POST /api/saved-projects/:id returns 201");
    assert(saveRes.body?.success === true, "POST /api/saved-projects/:id returns success");

    // 5. Verify notification created for Creator
    const creatorNotif = await Notification.findOne({ recipient: creatorId, type: "project" });
    assert(creatorNotif !== null, "Notification created for Creator when project is saved");

    // 6. Test idempotent duplicate save
    const dupRes = await request(
      {
        hostname: "localhost",
        port: 5000,
        path: `/api/saved-projects/${projectId}`,
        method: "POST",
        headers: viewerHeaders,
      },
      {}
    );
    assert(dupRes.status === 200, "Duplicate save handled gracefully with 200");

    // 7. Check status via GET /api/saved-projects/:projectId/status
    const statusRes = await request({
      hostname: "localhost",
      port: 5000,
      path: `/api/saved-projects/${projectId}/status`,
      method: "GET",
      headers: viewerHeaders,
    });
    assert(statusRes.body?.isSaved === true, "Status returns isSaved: true");

    // 8. Fetch saved projects list
    const listRes = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/saved-projects",
      method: "GET",
      headers: viewerHeaders,
    });
    assert(listRes.status === 200, "GET /api/saved-projects returns 200");
    assert(listRes.body?.count === 1, "Saved projects count is 1");
    assert(listRes.body?.data?.[0]?._id === projectId, "Saved project contains correct project ID");
    assert(listRes.body?.data?.[0]?.creator?.name === "Saved Project Creator", "Populates creator name");

    // 9. Fetch saved project IDs
    const idsRes = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/saved-projects/ids",
      method: "GET",
      headers: viewerHeaders,
    });
    assert(Array.isArray(idsRes.body?.data), "GET /api/saved-projects/ids returns array");
    assert(idsRes.body?.data?.includes(projectId), "IDs array includes saved project ID");

    // 10. Unsave project via DELETE /api/saved-projects/:projectId
    const unsaveRes = await request({
      hostname: "localhost",
      port: 5000,
      path: `/api/saved-projects/${projectId}`,
      method: "DELETE",
      headers: viewerHeaders,
    });
    assert(unsaveRes.status === 200, "DELETE /api/saved-projects/:id returns 200");

    // 11. Verify status is now false
    const afterStatus = await request({
      hostname: "localhost",
      port: 5000,
      path: `/api/saved-projects/${projectId}/status`,
      method: "GET",
      headers: viewerHeaders,
    });
    assert(afterStatus.body?.isSaved === false, "Status returns isSaved: false after unsave");

    // 12. Verify list is now empty
    const finalList = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/saved-projects",
      method: "GET",
      headers: viewerHeaders,
    });
    console.log("finalList body:", JSON.stringify(finalList.body));
    assert(finalList.body?.count === 0, "Saved projects list is empty after unsave");

    // Cleanup
    await Project.findByIdAndDelete(projectId);
    await SavedProject.deleteMany({ user: viewerId });
    await User.deleteMany({ _id: { $in: [creatorId, viewerId] } });
    await Notification.deleteMany({ recipient: { $in: [creatorId, viewerId] } });

    console.log("\n--------------------------------------------------------");
    console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log("--------------------------------------------------------\n");

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      console.log("✅ ALL 13 PHASE 20 SAVED PROJECTS TESTS PASSED!");
      process.exit(0);
    }
  } catch (error) {
    console.error("Test error:", error);
    process.exit(1);
  }
}

runTests();
