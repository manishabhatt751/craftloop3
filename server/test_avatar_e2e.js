require("dotenv").config({ path: __dirname + "/.env" });
const http = require("http");
const { connectDB } = require("./config/db");
const { User } = require("./models");

function makeRequest(options, postData = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = { ...(options.headers || {}), ...headers };
    if (postData && !reqHeaders["Content-Type"]) {
      reqHeaders["Content-Type"] = "application/json";
    }

    const req = http.request(
      { ...options, headers: reqHeaders },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: json });
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

function uploadMultipart({ path: uploadPath, token, fieldName = "file", filename, mimetype, buffer }) {
  return new Promise((resolve, reject) => {
    const boundary = "----CraftLoopBoundary" + Date.now();
    let bodyHeader = `--${boundary}\r\n`;
    bodyHeader += `Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\n`;
    bodyHeader += `Content-Type: ${mimetype}\r\n\r\n`;

    const bodyFooter = `\r\n--${boundary}--\r\n`;
    const headerBuf = Buffer.from(bodyHeader, "utf-8");
    const footerBuf = Buffer.from(bodyFooter, "utf-8");
    const totalLength = headerBuf.length + buffer.length + footerBuf.length;

    const reqHeaders = {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": totalLength,
    };
    if (token) reqHeaders["Authorization"] = `Bearer ${token}`;

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

async function run() {
  console.log("=== End-to-End Avatar Upload & Persistence Test ===");
  await connectDB();

  let passed = 0;
  let failed = 0;
  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Creator login
  const creatorLogin = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/auth/login", method: "POST" },
    { email: "creator@craftloop.com", password: "password123" }
  );
  assert(creatorLogin.status === 200 && creatorLogin.body?.token, "Creator login succeeds with 200 OK");
  const creatorToken = creatorLogin.body?.token;

  // 2. Creator upload avatar with field name 'avatar'
  const sampleJpeg = Buffer.from(
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
    "base64"
  );
  const creatorUpload = await uploadMultipart({
    path: "/api/upload",
    token: creatorToken,
    fieldName: "avatar",
    filename: "creator_avatar.jpg",
    mimetype: "image/jpeg",
    buffer: sampleJpeg,
  });

  assert(creatorUpload.status === 200, "Creator upload with field 'avatar' returns HTTP 200");
  assert(creatorUpload.body?.success === true, "Upload response indicates success: true");
  assert(creatorUpload.body?.user?.avatar, "Upload response includes user with avatar URL");
  const creatorAvatarUrl = creatorUpload.body?.url;
  assert(typeof creatorAvatarUrl === "string" && creatorAvatarUrl.startsWith("http"), "Returns real HTTP image URL");

  // 3. Verify serving uploaded image
  const parsedUrl = new URL(creatorAvatarUrl);
  const serveRes = await makeRequest({
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.pathname,
    method: "GET",
  });
  assert(serveRes.status === 200, `Uploaded image is accessible via HTTP 200 from ${parsedUrl.pathname}`);
  assert(serveRes.headers["content-type"] === "image/jpeg", "Served image has correct Content-Type: image/jpeg");

  // 4. Verify MongoDB has Creator avatar
  const dbCreator = await User.findOne({ email: "creator@craftloop.com" });
  assert(dbCreator && dbCreator.avatar === creatorAvatarUrl, "Creator User.avatar in MongoDB updated to real URL");

  // 5. GET /api/users/profile for Creator returns avatar
  const getCreatorProfile = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/users/profile", method: "GET" },
    null,
    { Authorization: `Bearer ${creatorToken}` }
  );
  assert(getCreatorProfile.status === 200 && getCreatorProfile.body?.data?.avatar === creatorAvatarUrl, "GET /api/users/profile returns avatar on reload/login");

  // 6. Viewer login
  const viewerLogin = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/auth/login", method: "POST" },
    { email: "viewer@craftloop.com", password: "password123" }
  );
  assert(viewerLogin.status === 200 && viewerLogin.body?.token, "Viewer login succeeds with 200 OK");
  const viewerToken = viewerLogin.body?.token;

  // 7. Viewer upload avatar via dedicated endpoint /api/users/profile/avatar
  const samplePng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const viewerUpload = await uploadMultipart({
    path: "/api/users/profile/avatar",
    token: viewerToken,
    fieldName: "file",
    filename: "viewer_avatar.png",
    mimetype: "image/png",
    buffer: samplePng,
  });

  assert(viewerUpload.status === 200, "Viewer upload via /api/users/profile/avatar returns HTTP 200");
  const viewerAvatarUrl = viewerUpload.body?.url;
  assert(typeof viewerAvatarUrl === "string" && viewerAvatarUrl.startsWith("http"), "Viewer returns real HTTP image URL");

  // 8. Verify MongoDB has Viewer avatar
  const dbViewer = await User.findOne({ email: "viewer@craftloop.com" });
  assert(dbViewer && dbViewer.avatar === viewerAvatarUrl, "Viewer User.avatar in MongoDB updated to real URL");

  // 9. GET /api/users/profile for Viewer returns avatar
  const getViewerProfile = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/users/profile", method: "GET" },
    null,
    { Authorization: `Bearer ${viewerToken}` }
  );
  assert(getViewerProfile.status === 200 && getViewerProfile.body?.data?.avatar === viewerAvatarUrl, "Viewer GET /api/users/profile returns avatar on reload/login");

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
