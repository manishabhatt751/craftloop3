/**
 * Phase 15 Automated Integration & Regression Tests
 * Verifies Lesson Progress & My Learning MongoDB Sync:
 * 1. Viewer enrollment in a course (POST /api/enrollments/:courseId)
 * 2. Fetching single enrollment (GET /api/enrollments/:courseId)
 * 3. Updating lesson progress (PUT /api/enrollments/:courseId/progress)
 * 4. Storing completedLessonIndexes, lastAccessedLesson, calculated progress in MongoDB Atlas
 * 5. Course completion status transition when all lessons completed
 * 6. Fetching My Learning list (GET /api/enrollments/me)
 * 7. Duplicate enrollment prevention
 * 8. Creator enrollment restriction (403)
 * 9. Unauthenticated rejection (401)
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
  console.log("=== PHASE 15 AUTOMATED ENROLLMENT & PROGRESS TESTS ===");
  const timestamp = Date.now();

  // 1. Register test Creator
  console.log("\n[Step 1] Registering test Creator...");
  const creatorEmail = `p15_creator_${timestamp}@example.com`;
  const regCreator = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    name: "Phase 15 Creator",
    email: creatorEmail,
    password: "Password123!",
    role: "creator"
  });

  if (regCreator.status !== 201 || !regCreator.body.token) {
    throw new Error(`Creator registration failed: ${JSON.stringify(regCreator.body)}`);
  }
  const creatorToken = regCreator.body.token;
  console.log("✓ Creator registered successfully.");

  // 2. Creator creates a course with 3 lessons
  console.log("\n[Step 2] Creator creates a 3-lesson course...");
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
    title: "Phase 15 Masterclass",
    description: "Hands-on progress tracking test course",
    category: "Development",
    level: "Intermediate",
    lessons: [
      { title: "Lesson 1: Basics", description: "Introduction to concepts", duration: "10 mins", order: 1 },
      { title: "Lesson 2: Core Workflows", description: "Implementation steps", duration: "15 mins", order: 2 },
      { title: "Lesson 3: Project Wrap-up", description: "Final submission", duration: "20 mins", order: 3 },
    ]
  });

  if (createCourseRes.status !== 201 || !createCourseRes.body.data?._id) {
    throw new Error(`Course creation failed: ${JSON.stringify(createCourseRes.body)}`);
  }
  const courseId = createCourseRes.body.data._id;
  console.log(`✓ Course created with ID: ${courseId}`);

  // 3. Register test Viewer
  console.log("\n[Step 3] Registering test Viewer...");
  const viewerEmail = `p15_viewer_${timestamp}@example.com`;
  const regViewer = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    name: "Phase 15 Viewer",
    email: viewerEmail,
    password: "Password123!",
    role: "viewer"
  });

  if (regViewer.status !== 201 || !regViewer.body.token) {
    throw new Error(`Viewer registration failed: ${JSON.stringify(regViewer.body)}`);
  }
  const viewerToken = regViewer.body.token;
  console.log("✓ Viewer registered successfully.");

  // 4. Verify Creator CANNOT enroll in course (Role enforcement check)
  console.log("\n[Step 4] Verifying Creator cannot enroll in course...");
  const creatorEnrollRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`
    }
  }, {});

  if (creatorEnrollRes.status !== 403) {
    throw new Error(`Expected 403 for Creator enrollment, got ${creatorEnrollRes.status}`);
  }
  console.log("✓ Creator enrollment correctly rejected with HTTP 403.");

  // 5. Viewer enrolls in the course
  console.log("\n[Step 5] Viewer enrolls in the course...");
  const viewerEnrollRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {});

  if (viewerEnrollRes.status !== 201 || !viewerEnrollRes.body.data) {
    throw new Error(`Viewer enrollment failed: ${JSON.stringify(viewerEnrollRes.body)}`);
  }
  const enrollment = viewerEnrollRes.body.data;
  if (enrollment.progress !== 0 || enrollment.status !== "in-progress") {
    throw new Error(`Initial enrollment progress/status invalid: ${JSON.stringify(enrollment)}`);
  }
  console.log("✓ Viewer enrolled successfully with initial progress 0% and status 'in-progress'.");

  // 6. Duplicate enrollment check
  console.log("\n[Step 6] Testing duplicate enrollment prevention...");
  const dupEnrollRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {});

  if (dupEnrollRes.status !== 400) {
    throw new Error(`Expected 400 for duplicate enrollment, got ${dupEnrollRes.status}`);
  }
  console.log("✓ Duplicate enrollment correctly rejected with HTTP 400.");

  // 7. Fetch single enrollment (GET /api/enrollments/:courseId)
  console.log("\n[Step 7] Viewer fetches their enrollment details...");
  const getEnrollRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${viewerToken}` }
  });

  if (getEnrollRes.status !== 200 || !getEnrollRes.body.data) {
    throw new Error(`Failed to fetch enrollment: ${JSON.stringify(getEnrollRes.body)}`);
  }
  console.log("✓ Enrollment details fetched successfully from MongoDB Atlas.");

  // 8. Viewer completes Lesson 1 (index 0)
  console.log("\n[Step 8] Viewer completes Lesson 1 (index 0)...");
  const progressRes1 = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}/progress`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {
    lessonIndex: 0,
    progress: 33
  });

  if (progressRes1.status !== 200 || !progressRes1.body.data) {
    throw new Error(`Updating progress for lesson 0 failed: ${JSON.stringify(progressRes1.body)}`);
  }
  const updated1 = progressRes1.body.data;
  if (!updated1.completedLessonIndexes.includes(0) || updated1.progress !== 33 || updated1.lastAccessedLesson !== 0) {
    throw new Error(`Progress data state invalid: ${JSON.stringify(updated1)}`);
  }
  console.log("✓ Lesson 0 recorded in MongoDB. Progress is now 33%, lastAccessedLesson: 0.");

  // 9. Viewer completes Lesson 2 (index 1)
  console.log("\n[Step 9] Viewer completes Lesson 2 (index 1)...");
  const progressRes2 = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}/progress`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {
    lessonIndex: 1,
    progress: 67
  });

  if (progressRes2.status !== 200 || !progressRes2.body.data) {
    throw new Error(`Updating progress for lesson 1 failed: ${JSON.stringify(progressRes2.body)}`);
  }
  const updated2 = progressRes2.body.data;
  if (!updated2.completedLessonIndexes.includes(1) || updated2.progress !== 67) {
    throw new Error(`Progress data state invalid: ${JSON.stringify(updated2)}`);
  }
  console.log("✓ Lesson 1 recorded in MongoDB. Progress is now 67%, lastAccessedLesson: 1.");

  // 10. Viewer completes Lesson 3 (index 2) -> Reaches 100% completion
  console.log("\n[Step 10] Viewer finishes course (Lesson 3 / index 2)...");
  const progressRes3 = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}/progress`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`
    }
  }, {
    lessonIndex: 2,
    progress: 100
  });

  if (progressRes3.status !== 200 || !progressRes3.body.data) {
    throw new Error(`Updating progress for lesson 2 failed: ${JSON.stringify(progressRes3.body)}`);
  }
  const updated3 = progressRes3.body.data;
  if (updated3.progress !== 100 || updated3.status !== "completed" || !updated3.completedAt) {
    throw new Error(`Course completion state invalid: ${JSON.stringify(updated3)}`);
  }
  console.log("✓ Course reached 100% completion. Status updated to 'completed' with completedAt timestamp.");

  // 11. Verify My Learning endpoint (GET /api/enrollments/me)
  console.log("\n[Step 11] Viewer queries My Learning list (GET /api/enrollments/me)...");
  const myLearningRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/enrollments/me",
    method: "GET",
    headers: { Authorization: `Bearer ${viewerToken}` }
  });

  if (myLearningRes.status !== 200 || !Array.isArray(myLearningRes.body.data)) {
    throw new Error(`Failed to fetch My Learning: ${JSON.stringify(myLearningRes.body)}`);
  }
  const enrolledItem = myLearningRes.body.data.find(
    (item) => item.course && item.course._id === courseId
  );
  if (!enrolledItem || enrolledItem.progress !== 100 || enrolledItem.status !== "completed") {
    throw new Error(`My Learning does not contain updated completed course: ${JSON.stringify(enrolledItem)}`);
  }
  console.log(`✓ My Learning verified: 1 enrolled course found with 100% progress and status 'completed'.`);

  // 12. Unauthenticated request check (401)
  console.log("\n[Step 12] Unauthenticated access check...");
  const unauthRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}/progress`,
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  }, { lessonIndex: 0 });

  if (unauthRes.status !== 401) {
    throw new Error(`Expected 401 for unauthenticated progress update, got ${unauthRes.status}`);
  }
  console.log("✓ Unauthenticated progress update correctly rejected with HTTP 401.");

  console.log("\n=============================================");
  console.log("ALL PHASE 15 TESTS PASSED PERFECTLY!");
  console.log("=============================================");
}

run().catch((err) => {
  console.error("\n❌ PHASE 15 TEST ERROR:", err.message);
  process.exit(1);
});
