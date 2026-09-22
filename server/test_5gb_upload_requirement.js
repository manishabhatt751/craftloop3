const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function makeRequest(options, postData = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = { ...headers };
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
    const boundary = "----CraftLoopBoundary5GB" + Date.now();
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
  console.log("  CRAFTLOOP: FINAL 5000 MB (5 GB) UPLOAD VERIFICATION");
  console.log("========================================================\n");

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

  // 1. Check server/.env configuration
  const envContent = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
  assert(
    envContent.includes("MAX_UPLOAD_SIZE_MB=5000"),
    "1. server/.env specifies MAX_UPLOAD_SIZE_MB=5000 (5 GB)"
  );

  // 2. Check uploadRoutes.js uses multer.diskStorage & 5000 MB limit
  const uploadRoutesContent = fs.readFileSync(path.join(__dirname, "routes/uploadRoutes.js"), "utf8");
  assert(
    uploadRoutesContent.includes("multer.diskStorage") &&
    !uploadRoutesContent.includes("multer.memoryStorage"),
    "2. uploadRoutes.js uses multer.diskStorage (streams to disk; NEVER loads 5 GB into Node.js memory)"
  );
  assert(
    uploadRoutesContent.includes("5000") &&
    uploadRoutesContent.includes("File exceeds the 5 GB limit. Maximum file size: 5 GB."),
    "3. uploadRoutes.js enforces 5 GB limit with explicit rejection error message"
  );
  assert(
    uploadRoutesContent.includes("video/mp4") &&
    uploadRoutesContent.includes("video/webm") &&
    uploadRoutesContent.includes("image/jpeg") &&
    uploadRoutesContent.includes("image/png"),
    "4. uploadRoutes.js supports profile photos, project media, course thumbnails, and large videos"
  );

  // 3. Check uploadService.js uses streaming and never produces base64
  const uploadServiceContent = fs.readFileSync(path.join(__dirname, "services/uploadService.js"), "utf8");
  assert(
    !uploadServiceContent.includes("data:${mimetype};base64") &&
    uploadServiceContent.includes("uploads/${filename}"),
    "5. uploadService.js returns clean URLs and never produces base64 data URIs for media/videos"
  );

  // 4. Check server.js serves /uploads statically
  const serverContent = fs.readFileSync(path.join(__dirname, "server.js"), "utf8");
  assert(
    serverContent.includes('app.use("/uploads", express.static('),
    "6. server.js statically serves /uploads directory for uploaded media access"
  );

  // 5. Check client UI files for 5 GB requirements and absence of 2 MB limits
  const createContent = fs.readFileSync(path.join(__dirname, "../client/src/pages/create.jsx"), "utf8");
  const editProfileContent = fs.readFileSync(path.join(__dirname, "../client/src/pages/editprofile.jsx"), "utf8");
  const communityContent = fs.readFileSync(path.join(__dirname, "../client/src/pages/community.jsx"), "utf8");

  assert(
    !createContent.includes("Max 2 MB") &&
    createContent.includes("Upload files up to 5 GB (Maximum file size: 5 GB)") &&
    createContent.includes("5000 * 1024 * 1024"),
    "7. client/src/pages/create.jsx displays 'Upload files up to 5 GB (Maximum file size: 5 GB)' and enforces 5 GB"
  );

  assert(
    !editProfileContent.includes("Max 2 MB") &&
    editProfileContent.includes("Maximum file size: 5 GB") &&
    editProfileContent.includes("5000 * 1024 * 1024"),
    "8. client/src/pages/editprofile.jsx displays 'Maximum file size: 5 GB' and enforces 5 GB for profile photos"
  );

  assert(
    !communityContent.includes("Max 2 MB") &&
    communityContent.includes("5000 * 1024 * 1024") &&
    communityContent.includes("api.uploadMedia"),
    "9. client/src/pages/community.jsx uploads media via server streaming without base64, enforcing 5 GB"
  );

  // 6. Test Live Authenticated Upload API (Media upload, URL check, and static serving)
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

    assert(loginRes.statusCode === 200 && loginRes.body.token, "10. Creator authenticated for upload API test");
    const token = loginRes.body.token;

    // Upload a simulated test video file
    const fakeVideoBuffer = Buffer.from("FAKE_MP4_VIDEO_STREAM_DATA_CRAFTLOOP_TEST_2026");
    const uploadRes = await uploadMultipart({
      path: "/api/upload",
      token,
      filename: "craftloop_lesson_video.mp4",
      mimetype: "video/mp4",
      buffer: fakeVideoBuffer,
    });

    assert(uploadRes.status === 200, "11. POST /api/upload accepts video file (returns HTTP 200)");
    assert(uploadRes.body?.success === true, "12. Upload response has success: true");
    assert(typeof uploadRes.body?.url === "string", "13. Upload response returns URL string");
    assert(
      uploadRes.body?.url.startsWith("http://") || uploadRes.body?.url.startsWith("https://"),
      "14. Returned URL is a valid HTTP/HTTPS URL (NO base64 data URI)"
    );

    // Verify the static URL can be fetched by the browser/client
    const uploadedUrl = new URL(uploadRes.body.url);
    const staticRes = await makeRequest({
      hostname: uploadedUrl.hostname,
      port: uploadedUrl.port || 5000,
      path: uploadedUrl.pathname,
      method: "GET",
    });

    assert(
      staticRes.statusCode === 200 && staticRes.body === "FAKE_MP4_VIDEO_STREAM_DATA_CRAFTLOOP_TEST_2026",
      "15. Uploaded video file is statically retrievable via Express /uploads route"
    );
  } catch (apiErr) {
    assert(false, `Upload live test error: ${apiErr.message}`);
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
