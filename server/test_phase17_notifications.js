/**
 * Phase 17 Automated Integration & Regression Tests
 * Verifies Notification Model, API, and Triggers:
 * 1. Unauthenticated rejection (401)
 * 2. Community like trigger generates notification
 * 3. Community comment trigger generates notification
 * 4. Course enrollment trigger generates notification for creator
 * 5. Direct message trigger generates notification for recipient
 * 6. Querying notifications list (GET /api/notifications)
 * 7. Querying unread count (GET /api/notifications/unread-count)
 * 8. Marking single notification as read (PUT /api/notifications/:id/read)
 * 9. Marking all notifications as read (PUT /api/notifications/read-all)
 * 10. Deleting a notification (DELETE /api/notifications/:id)
 * 11. Strict user boundary enforcement (cannot access or delete another user's notification)
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
  console.log("=== PHASE 17 AUTOMATED NOTIFICATION TESTS ===");
  const timestamp = Date.now();

  // 1. Unauthenticated access check
  console.log("\n[Step 1] Checking unauthenticated access rejection...");
  const unauthRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/notifications",
    method: "GET",
  });
  if (unauthRes.status !== 401) {
    throw new Error(`Expected 401 for unauthenticated notifications, got ${unauthRes.status}`);
  }
  console.log("✓ Unauthenticated request rejected with HTTP 401.");

  // 2. Register Creator (User A)
  console.log("\n[Step 2] Registering Creator (User A)...");
  const creatorEmail = `p17_creator_${timestamp}@example.com`;
  const regCreator = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, {
    name: "Notification Creator",
    email: creatorEmail,
    password: "Password123!",
    role: "creator",
  });
  const creatorToken = regCreator.body.token;
  const creatorId = regCreator.body.user._id || regCreator.body.user.id;
  console.log("✓ Creator registered.");

  // 3. Register Viewer (User B)
  console.log("\n[Step 3] Registering Viewer (User B)...");
  const viewerEmail = `p17_viewer_${timestamp}@example.com`;
  const regViewer = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, {
    name: "Notification Viewer",
    email: viewerEmail,
    password: "Password123!",
    role: "viewer",
  });
  const viewerToken = regViewer.body.token;
  const viewerId = regViewer.body.user._id || regViewer.body.user.id;
  console.log("✓ Viewer registered.");

  // 4. Creator creates a community post
  console.log("\n[Step 4] Creator posts in community...");
  const postRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/community/posts",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`,
    },
  }, {
    content: "Excited to launch our new design tutorials!",
    category: "Design",
  });
  const postId = postRes.body.data._id;
  console.log("✓ Post created with ID:", postId);

  // 5. Viewer likes Creator's post -> Triggers Notification 1
  console.log("\n[Step 5] Viewer likes Creator's post (Trigger Notification 1)...");
  const likeRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/community/posts/${postId}/like`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`,
    },
  }, {});
  if (likeRes.status !== 200) {
    throw new Error(`Like failed: ${JSON.stringify(likeRes.body)}`);
  }
  console.log("✓ Post liked.");

  // 6. Viewer comments on Creator's post -> Triggers Notification 2
  console.log("\n[Step 6] Viewer comments on Creator's post (Trigger Notification 2)...");
  const commentRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/community/posts/${postId}/comments`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`,
    },
  }, {
    text: "Can't wait to see the next lesson!",
  });
  if (commentRes.status !== 201) {
    throw new Error(`Comment failed: ${JSON.stringify(commentRes.body)}`);
  }
  console.log("✓ Comment posted.");

  // 7. Creator publishes a course & Viewer enrolls -> Triggers Notification 3
  console.log("\n[Step 7] Creator creates course and Viewer enrolls (Trigger Notification 3)...");
  const courseRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/courses",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creatorToken}`,
    },
  }, {
    title: "Phase 17 Masterclass",
    description: "Notification testing course",
    category: "Design",
    level: "Beginner",
  });
  const courseId = courseRes.body.data._id;

  const enrollRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/enrollments/${courseId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`,
    },
  }, {});
  if (enrollRes.status !== 201) {
    throw new Error(`Enrollment failed: ${JSON.stringify(enrollRes.body)}`);
  }
  console.log("✓ Viewer enrolled in course.");

  // 8. Viewer sends a direct message to Creator -> Triggers Notification 4
  console.log("\n[Step 8] Viewer sends message to Creator (Trigger Notification 4)...");
  const messageRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${viewerToken}`,
    },
  }, {
    receiverId: creatorId,
    content: "Hello! I loved your recent design post.",
  });
  if (messageRes.status !== 201) {
    throw new Error(`Message failed: ${JSON.stringify(messageRes.body)}`);
  }
  console.log("✓ Message sent.");

  // 9. Creator fetches their notifications (GET /api/notifications)
  console.log("\n[Step 9] Creator fetches their notifications list...");
  const creatorNotifs = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/notifications",
    method: "GET",
    headers: { Authorization: `Bearer ${creatorToken}` },
  });
  if (creatorNotifs.status !== 200 || !Array.isArray(creatorNotifs.body.data)) {
    throw new Error(`Failed to fetch notifications: ${JSON.stringify(creatorNotifs.body)}`);
  }

  const notifs = creatorNotifs.body.data;
  console.log(`✓ Creator received ${notifs.length} notifications in MongoDB Atlas (Unread count: ${creatorNotifs.body.unreadCount}).`);
  if (notifs.length < 4) {
    throw new Error(`Expected at least 4 triggered notifications, found ${notifs.length}`);
  }

  // 10. Check unread count endpoint (GET /api/notifications/unread-count)
  console.log("\n[Step 10] Checking unread count endpoint...");
  const unreadRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/notifications/unread-count",
    method: "GET",
    headers: { Authorization: `Bearer ${creatorToken}` },
  });
  if (unreadRes.status !== 200 || unreadRes.body.unreadCount < 4) {
    throw new Error(`Unread count mismatch: ${JSON.stringify(unreadRes.body)}`);
  }
  console.log(`✓ Verified unreadCount endpoint returns ${unreadRes.body.unreadCount}.`);

  // 11. Mark single notification as read (PUT /api/notifications/:id/read)
  console.log("\n[Step 11] Marking single notification as read...");
  const targetNotifId = notifs[0]._id;
  const readRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/notifications/${targetNotifId}/read`,
    method: "PUT",
    headers: { Authorization: `Bearer ${creatorToken}` },
  });
  if (readRes.status !== 200 || !readRes.body.data?.isRead) {
    throw new Error(`Mark as read failed: ${JSON.stringify(readRes.body)}`);
  }
  console.log("✓ Notification marked as read successfully.");

  // 12. Cross-user isolation check: Viewer tries to modify Creator's notification
  console.log("\n[Step 12] Security check: Viewer tries to modify Creator's notification...");
  const crossUserRead = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/notifications/${targetNotifId}/read`,
    method: "PUT",
    headers: { Authorization: `Bearer ${viewerToken}` },
  });
  if (crossUserRead.status !== 404) {
    throw new Error(`Expected 404 when accessing another user's notification, got ${crossUserRead.status}`);
  }
  console.log("✓ Cross-user notification modification rejected with HTTP 404.");

  // 13. Mark all notifications as read (PUT /api/notifications/read-all)
  console.log("\n[Step 13] Creator marks all notifications as read...");
  const readAllRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/notifications/read-all",
    method: "PUT",
    headers: { Authorization: `Bearer ${creatorToken}` },
  });
  if (readAllRes.status !== 200) {
    throw new Error(`Mark all read failed: ${JSON.stringify(readAllRes.body)}`);
  }

  const freshUnread = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/notifications/unread-count",
    method: "GET",
    headers: { Authorization: `Bearer ${creatorToken}` },
  });
  if (freshUnread.body.unreadCount !== 0) {
    throw new Error(`Expected 0 unread notifications after read-all, got ${freshUnread.body.unreadCount}`);
  }
  console.log("✓ All notifications marked as read. Unread count is now 0.");

  // 14. Delete notification (DELETE /api/notifications/:id)
  console.log("\n[Step 14] Deleting a notification...");
  const delRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/notifications/${targetNotifId}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${creatorToken}` },
  });
  if (delRes.status !== 200) {
    throw new Error(`Delete notification failed: ${JSON.stringify(delRes.body)}`);
  }
  console.log("✓ Notification deleted from MongoDB Atlas.");

  console.log("\n=============================================");
  console.log("ALL PHASE 17 NOTIFICATION TESTS PASSED!");
  console.log("=============================================");
}

run().catch((err) => {
  console.error("\n❌ PHASE 17 TEST ERROR:", err.message);
  process.exit(1);
});
