/**
 * Phase 14 Integration & Regression Test
 * Verifies Your Projects + Your Courses MongoDB APIs:
 * - Creator Project CRUD & ownership authorization
 * - Creator Course CRUD & Lesson/Syllabus updates in MongoDB
 * - Strict JWT creator ownership enforcement (403 for other users)
 * - Viewer public course & syllabus accessibility
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
  console.log("=== PHASE 14 AUTOMATED INTEGRATION TESTS ===");
  const timestamp = Date.now();

  // 1. Register test Creator
  console.log("\n[Step 1] Registering test Creator...");
  const creatorEmail = `test_creator_p14_${timestamp}@example.com`;
  const regCreator = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    name: "Phase 14 Creator",
    email: creatorEmail,
    password: "Password123!",
    role: "creator"
  });

  if (regCreator.status !== 201 || !regCreator.body.token) {
    throw new Error(`Creator registration failed: ${JSON.stringify(regCreator.body)}`);
  }
  const creatorToken = regCreator.body.token;
  console.log("✓ Creator registered successfully.");

  // 2. Register test Viewer (for ownership & regression checks)
  console.log("\n[Step 2] Registering second user (Viewer)...");
  const viewerEmail = `test_viewer_p14_${timestamp}@example.com`;
  const regViewer = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    name: "Phase 14 Viewer",
    email: viewerEmail,
    password: "Password123!",
    role: "viewer"
  });

  if (regViewer.status !== 201 || !regViewer.body.token) {
    throw new Error(`Viewer registration failed: ${JSON.stringify(regViewer.body)}`);
  }
  const viewerToken = regViewer.body.token;
  console.log("✓ Viewer registered successfully.");

  // 3. Project Creation by Creator
  console.log("\n[Step 3] Creator creates project in MongoDB...");
  const createProjRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/projects",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`
    }
  }, {
    title: "Fullstack Mobile App",
    description: "React Native with Node.js backend",
    category: "Mobile",
    type: "Project",
    projectType: "Project",
    skills: "React Native, Redux, Node.js",
    tags: ["React Native", "Redux"],
    status: "Published"
  });

  if (createProjRes.status !== 201 || !createProjRes.body.data?._id) {
    throw new Error(`Project creation failed: ${JSON.stringify(createProjRes.body)}`);
  }
  const projectId = createProjRes.body.data._id;
  console.log(`✓ Project created in MongoDB with ID: ${projectId}`);

  // 4. Creator lists their projects
  console.log("\n[Step 4] Creator queries their projects (GET /api/projects?mine=true)...");
  const myProjectsRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/projects?mine=true",
    method: "GET",
    headers: { Authorization: `Bearer ${creatorToken}` }
  });

  if (myProjectsRes.status !== 200 || !Array.isArray(myProjectsRes.body.data)) {
    throw new Error(`GET my projects failed: ${JSON.stringify(myProjectsRes.body)}`);
  }
  const foundProj = myProjectsRes.body.data.find(p => p._id === projectId);
  if (!foundProj) {
    throw new Error("Created project not found in creator's project list!");
  }
  console.log(`✓ Project found in creator's project list: "${foundProj.title}"`);

  // 5. Creator updates their project
  console.log("\n[Step 5] Creator updates project (PUT /api/projects/:id)...");
  const updateProjRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/projects/${projectId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`
    }
  }, {
    title: "Fullstack Mobile App (Updated)",
    description: "Updated description with GraphQL",
    status: "Published"
  });

  if (updateProjRes.status !== 200 || updateProjRes.body.data.title !== "Fullstack Mobile App (Updated)") {
    throw new Error(`Update project failed: ${JSON.stringify(updateProjRes.body)}`);
  }
  console.log("✓ Project updated successfully in MongoDB.");

  // 6. Unauthorized user attempts to update/delete Creator's project
  console.log("\n[Step 6] Unauthorized modification check (Viewer tries to update Creator's project)...");
  const unauthUpdateRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/projects/${projectId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {
    title: "Hacked Title"
  });

  if (unauthUpdateRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden, got ${unauthUpdateRes.status}`);
  }
  console.log("✓ Unauthorized project modification correctly rejected with HTTP 403.");

  // 7. Course Creation by Creator
  console.log("\n[Step 7] Creator creates course in MongoDB...");
  const createCourseRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/courses",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`
    }
  }, {
    title: "Advanced React Patterns",
    description: "Master Compound Components and Custom Hooks",
    category: "Development",
    level: "Advanced",
    status: "Published",
    lessons: [
      {
        title: "Introduction to Compound Components",
        description: "Overview of compound patterns",
        duration: "12 mins",
        videoUrl: "https://youtube.com/watch?v=sample1",
        order: 1
      }
    ]
  });

  if (createCourseRes.status !== 201 || !createCourseRes.body.data?._id) {
    throw new Error(`Course creation failed: ${JSON.stringify(createCourseRes.body)}`);
  }
  const courseId = createCourseRes.body.data._id;
  console.log(`✓ Course created in MongoDB with ID: ${courseId}`);

  // 8. Creator queries their courses
  console.log("\n[Step 8] Creator queries their courses (GET /api/courses?mine=true)...");
  const myCoursesRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/courses?mine=true",
    method: "GET",
    headers: { Authorization: `Bearer ${creatorToken}` }
  });

  if (myCoursesRes.status !== 200 || !Array.isArray(myCoursesRes.body.data)) {
    throw new Error(`GET my courses failed: ${JSON.stringify(myCoursesRes.body)}`);
  }
  const foundCourse = myCoursesRes.body.data.find(c => c._id === courseId);
  if (!foundCourse) {
    throw new Error("Created course not found in creator's course list!");
  }
  console.log(`✓ Course found in creator's course list: "${foundCourse.title}" (${foundCourse.lessons.length} lesson)`);

  // 9. Creator adds/edits lessons in syllabus (PUT /api/courses/:id)
  console.log("\n[Step 9] Creator updates syllabus/lessons via PUT /api/courses/:id...");
  const updateLessonsRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/courses/${courseId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`
    }
  }, {
    lessons: [
      {
        title: "Introduction to Compound Components (Updated)",
        description: "Overview of compound patterns with modern React 18",
        duration: "15 mins",
        videoUrl: "https://youtube.com/watch?v=sample1",
        order: 1
      },
      {
        title: "Building Flexible Accordion",
        description: "Step by step implementation of custom accordion",
        duration: "20 mins",
        videoUrl: "https://youtube.com/watch?v=sample2",
        order: 2
      }
    ]
  });

  if (updateLessonsRes.status !== 200 || updateLessonsRes.body.data.lessons.length !== 2) {
    throw new Error(`Course lesson update failed: ${JSON.stringify(updateLessonsRes.body)}`);
  }
  console.log(`✓ Course lessons updated in MongoDB Atlas (Now contains ${updateLessonsRes.body.data.lessons.length} lessons).`);

  // 10. Unauthorized user attempts to edit Creator's course
  console.log("\n[Step 10] Unauthorized course modification check...");
  const unauthCourseRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/courses/${courseId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {
    title: "Unauthorized Course Takeover"
  });

  if (unauthCourseRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden, got ${unauthCourseRes.status}`);
  }
  console.log("✓ Unauthorized course update correctly rejected with HTTP 403.");

  // 11. Viewer regression test: View public course & syllabus
  console.log("\n[Step 11] Viewer regression check (GET /api/courses/:id)...");
  const publicCourseRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/courses/${courseId}`,
    method: "GET"
  });

  if (publicCourseRes.status !== 200 || !publicCourseRes.body.data) {
    throw new Error(`Public course fetch failed: ${JSON.stringify(publicCourseRes.body)}`);
  }
  const publicCourse = publicCourseRes.body.data;
  if (publicCourse.lessons.length !== 2) {
    throw new Error(`Expected 2 lessons for viewer, found: ${publicCourse.lessons.length}`);
  }
  console.log(`✓ Viewer successfully accesses public course: "${publicCourse.title}" with ${publicCourse.lessons.length} lessons.`);

  // 12. Creator deletes project
  console.log("\n[Step 12] Creator deletes project (DELETE /api/projects/:id)...");
  const deleteProjRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/projects/${projectId}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${creatorToken}` }
  });

  if (deleteProjRes.status !== 200) {
    throw new Error(`Project deletion failed: ${JSON.stringify(deleteProjRes.body)}`);
  }
  console.log("✓ Project deleted from MongoDB.");

  // Verify project is no longer returned in creator list
  const afterDeleteRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/projects?mine=true",
    method: "GET",
    headers: { Authorization: `Bearer ${creatorToken}` }
  });
  const remaining = afterDeleteRes.body.data.find(p => p._id === projectId);
  if (remaining) {
    throw new Error("Project still exists after deletion!");
  }
  console.log("✓ Verified project no longer exists in creator list.");

  console.log("\n=============================================");
  console.log("ALL PHASE 14 TESTS PASSED PERFECTLY!");
  console.log("=============================================");
}

run().catch((err) => {
  console.error("\n❌ PHASE 14 TEST ERROR:", err.message);
  process.exit(1);
});
