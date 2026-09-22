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

function uploadMultipart({ path, token, filename, mimetype, buffer }) {
  return new Promise((resolve, reject) => {
    const boundary = "----CraftLoopBoundary" + Date.now();
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
        path,
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
  console.log("\n========================================================");
  console.log("  PHASE 21 TEST: MEDIA STORAGE & UPLOAD SERVICE");
  console.log("========================================================\n");

  const { connectDB } = require("./config/db");
  const { User } = require("./models");
  await connectDB();

  try {
    const timestamp = Date.now();

    // 1. Unauthenticated rejection
    const unauthUpload = await uploadMultipart({
      path: "/api/upload",
      token: null,
      filename: "test.png",
      mimetype: "image/png",
      buffer: Buffer.from("fake-png-data"),
    });
    assert(unauthUpload.status === 401, "Unauthenticated upload returns 401");

    // 2. Register test user
    const email = `upload_user_${timestamp}@craftloop.test`;
    const regRes = await new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        name: "Upload Tester",
        email,
        password: "Password123!",
        role: "creator",
      });
      const req = http.request(
        {
          hostname: "localhost",
          port: 5000,
          path: "/api/auth/register",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
        }
      );
      req.on("error", reject);
      req.write(payload);
      req.end();
    });

    const token = regRes.body?.token;
    const userId = regRes.body?.user?._id;
    assert(Boolean(token), "Created and authenticated test user");

    // 3. Reject unsupported file type
    const badFileRes = await uploadMultipart({
      path: "/api/upload",
      token,
      filename: "test.exe",
      mimetype: "application/x-msdownload",
      buffer: Buffer.from("executable"),
    });
    assert(badFileRes.status === 400, "Unsupported file type rejected with 400");

    // 4. Upload valid PNG image
    // 1x1 transparent PNG sample bytes
    const pngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const validUpload = await uploadMultipart({
      path: "/api/upload",
      token,
      filename: "sample.png",
      mimetype: "image/png",
      buffer: pngBuffer,
    });

    assert(validUpload.status === 200, "POST /api/upload with valid image returns 200");
    assert(validUpload.body?.success === true, "Upload response has success: true");
    assert(typeof validUpload.body?.url === "string", "Upload response returns url string");
    assert(Boolean(validUpload.body?.url.startsWith("http") || validUpload.body?.url.startsWith("data:")), "URL is valid HTTP or Data URI format");
    assert(typeof validUpload.body?.bytes === "number", "Bytes size returned");

    // 5. Upload valid JPEG image
    const jpegBuffer = Buffer.from("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=", "base64");
    const jpegUpload = await uploadMultipart({
      path: "/api/upload",
      token,
      filename: "avatar.jpg",
      mimetype: "image/jpeg",
      buffer: jpegBuffer,
    });
    assert(jpegUpload.status === 200, "POST /api/upload with JPEG returns 200");
    assert(jpegUpload.body?.success === true, "JPEG response has success: true");

    // Cleanup
    await User.findByIdAndDelete(userId);

    console.log("\n--------------------------------------------------------");
    console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log("--------------------------------------------------------\n");

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      console.log("✅ ALL PHASE 21 UPLOAD TESTS PASSED!");
      process.exit(0);
    }
  } catch (error) {
    console.error("Test error:", error);
    process.exit(1);
  }
}

runTests();
