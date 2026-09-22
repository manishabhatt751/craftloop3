const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { connectDB } = require("./config/db");
const { User } = require("./models");

async function makeRequest(options, postData = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = { ...(options.headers || {}), ...headers };
    if (postData && !reqHeaders["Content-Type"]) {
      reqHeaders["Content-Type"] = "application/json";
    }

    const req = http.request(
      {
        ...options,
        headers: reqHeaders,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
        });
      }
    );

    req.on("error", reject);

    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

function uploadMultipart({ path: uploadPath, token, filename, mimetype, buffer }) {
  return new Promise((resolve, reject) => {
    const boundary = "----CraftLoopBoundaryProfileTest" + Date.now();
    let bodyHeader = `--${boundary}\r\n`;
    bodyHeader += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
    bodyHeader += `Content-Type: ${mimetype}\r\n\r\n`;

    const bodyFooter = `\r\n--${boundary}--\r\n`;

    const headerBuf = Buffer.from(bodyHeader, "utf-8");
    const footerBuf = Buffer.from(bodyFooter, "utf-8");
    const totalLength = headerBuf.length + buffer.length + footerBuf.length;

    const reqHeaders = {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": totalLength,
    };
    if (token) {
      reqHeaders["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: uploadPath,
        method: "POST",
        headers: reqHeaders,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(headerBuf);
    req.write(buffer);
    req.write(footerBuf);
    req.end();
  });
}

async function runTests() {
  console.log("========================================================");
  console.log("  CRAFTLOOP: PROFILE PICTURE UPLOAD & ENTITY SIZE TEST");
  console.log("========================================================\n");

  await connectDB();

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify API Service handles FormData correctly
  const apiServiceContent = fs.readFileSync(path.join(__dirname, "../client/src/services/api.js"), "utf8");
  assert(
    apiServiceContent.includes("body instanceof FormData") &&
    apiServiceContent.includes("isFormData ? body : JSON.stringify(body)"),
    "1. client/src/services/api.js passes FormData intact without stringifying to '{}'"
  );

  // 2. Verify editprofile.jsx does not use readAsDataURL fallback
  const editProfileContent = fs.readFileSync(path.join(__dirname, "../client/src/pages/editprofile.jsx"), "utf8");
  assert(
    !editProfileContent.includes("reader.readAsDataURL(file)"),
    "2. client/src/pages/editprofile.jsx has eliminated base64 readAsDataURL fallback"
  );

  // 3. Test Creator: Login -> Upload profile picture -> PUT /api/users/profile
  let creatorToken = null;
  let creatorId = null;
  try {
    const loginRes = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
    }, {
      email: "creator@craftloop.com",
      password: "password123",
    });

    assert(loginRes.statusCode === 200 && loginRes.body.token, "3. Creator logged in successfully");
    creatorToken = loginRes.body.token;
    creatorId = loginRes.body.user?._id;

    // Upload an avatar image as multipart/form-data
    const testAvatarJpg = Buffer.from(
      "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
      "base64"
    );

    const uploadRes = await uploadMultipart({
      path: "/api/upload",
      token: creatorToken,
      filename: "creator_avatar.jpg",
      mimetype: "image/jpeg",
      buffer: testAvatarJpg,
    });

    assert(uploadRes.status === 200, "4. Creator profile image upload returns HTTP 200");
    assert(uploadRes.body?.success === true, "5. Upload response indicates success: true");
    assert(
      typeof uploadRes.body?.url === "string" && uploadRes.body.url.startsWith("http"),
      "6. Upload returns HTTP URL string (NO base64 data URI)"
    );

    const uploadedAvatarUrl = uploadRes.body.url;

    // Send PUT /api/users/profile with updated avatar URL (tiny JSON payload)
    const updateRes = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/api/users/profile",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${creatorToken}`,
      },
    }, {
      name: "Creator Updated",
      avatar: uploadedAvatarUrl,
    });

    assert(updateRes.statusCode === 200, "7. PUT /api/users/profile succeeds with 200 OK (NO 413 error!)");
    assert(updateRes.body?.data?.avatar === uploadedAvatarUrl, "8. Response data has updated avatar URL");

    // Check MongoDB directly
    const dbCreator = await User.findById(creatorId);
    assert(
      dbCreator && dbCreator.avatar === uploadedAvatarUrl,
      "9. MongoDB User.avatar updated with the clean storage URL"
    );
  } catch (err) {
    assert(false, `Creator test error: ${err.message}`);
  }

  // 4. Test Viewer: Login -> Upload profile picture -> PUT /api/users/profile
  let viewerToken = null;
  let viewerId = null;
  try {
    const loginRes = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
    }, {
      email: "viewer@craftloop.com",
      password: "password123",
    });

    assert(loginRes.statusCode === 200 && loginRes.body.token, "10. Viewer logged in successfully");
    viewerToken = loginRes.body.token;
    viewerId = loginRes.body.user?._id;

    // Upload an avatar image as multipart/form-data
    const testViewerAvatarPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const uploadRes = await uploadMultipart({
      path: "/api/upload",
      token: viewerToken,
      filename: "viewer_avatar.png",
      mimetype: "image/png",
      buffer: testViewerAvatarPng,
    });

    assert(uploadRes.status === 200, "11. Viewer profile image upload returns HTTP 200");
    const viewerAvatarUrl = uploadRes.body.url;

    // Send PUT /api/users/profile with updated avatar URL
    const updateRes = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/api/users/profile",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${viewerToken}`,
      },
    }, {
      name: "Viewer Updated",
      avatar: viewerAvatarUrl,
    });

    assert(updateRes.statusCode === 200, "12. Viewer PUT /api/users/profile succeeds with 200 OK");
    assert(updateRes.body?.data?.avatar === viewerAvatarUrl, "13. Response data has updated viewer avatar URL");

    // Check MongoDB directly
    const dbViewer = await User.findById(viewerId);
    assert(
      dbViewer && dbViewer.avatar === viewerAvatarUrl,
      "14. MongoDB User.avatar updated for Viewer with storage URL"
    );
  } catch (err) {
    assert(false, `Viewer test error: ${err.message}`);
  }

  // 5. Test Normal APIs continue to work with express.json({ limit: '2mb' })
  try {
    // GET /api/courses
    const coursesRes = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/api/courses",
      method: "GET",
    });
    assert(coursesRes.statusCode === 200, "15. GET /api/courses works normally");

    // GET /api/projects
    const projectsRes = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/api/projects",
      method: "GET",
    });
    assert(projectsRes.statusCode === 200, "16. GET /api/projects works normally");

    // GET /api/community/posts
    const commRes = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/api/community/posts",
      method: "GET",
    });
    assert(commRes.statusCode === 200, "17. GET /api/community/posts works normally");
  } catch (err) {
    assert(false, `API regression error: ${err.message}`);
  }

  console.log("\n========================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("========================================================\n");

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
