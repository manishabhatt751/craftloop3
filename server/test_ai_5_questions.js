const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/db");
const { server } = require("./server");

function makeRequest(port, options, body = null) {
  return new Promise((resolve, reject) => {
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

const QUESTIONS = [
  "As a beginner tell me the best app to start my editing journey.",
  "I want to learn video editing.",
  "Which creator teaches graphic design?",
  "I know HTML and CSS. What should I build?",
  "What should I learn next?",
];

async function runBenchmark() {
  console.log("\n==================================================");
  console.log("CRAFTLOOP AI — 5 QUESTIONS PERFORMANCE BENCHMARK");
  console.log("==================================================\n");

  await connectDB();

  const PORT = 5092;
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) return reject(err);
      console.log(`Benchmark test server running on port ${PORT}\n`);
      resolve();
    });
  });

  try {
    // 1. Authenticate to obtain valid JWT token
    console.log("Logging in as viewer@craftloop.com...");
    const loginRes = await makeRequest(
      PORT,
      { path: "/api/auth/login", method: "POST" },
      { email: "viewer@craftloop.com", password: "password123" }
    );

    if (loginRes.status !== 200 || !loginRes.body?.token) {
      throw new Error(`Login failed with status ${loginRes.status}: ${JSON.stringify(loginRes.body)}`);
    }

    const token = loginRes.body.token;
    console.log("Login successful! Acquired JWT token.\n");

    const results = [];

    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];
      console.log(`--------------------------------------------------`);
      console.log(`[TEST ${i + 1}/5] Question: "${q}"`);
      console.log(`--------------------------------------------------`);

      const t0 = Date.now();
      const res = await makeRequest(
        PORT,
        {
          path: "/api/ai/chat",
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
        { message: q }
      );
      const httpTotal = Date.now() - t0;

      const body = res.body || {};
      const msg = body.message || "";
      const creators = (body.creators || []).map((c) => c.name).join(", ");
      const courses = (body.courses || []).map((c) => c.title).join(", ");
      const projects = (body.projects || []).map((p) => p.title).join(", ");

      console.log(`Status: ${res.status}`);
      console.log(`Client End-to-End HTTP Time: ${httpTotal} ms`);
      console.log(`Matched Intent: ${body.intent?.type || "N/A"}`);
      console.log(`Creators: ${creators || "None"}`);
      console.log(`Courses: ${courses || "None"}`);
      console.log(`Projects: ${projects || "None"}`);
      console.log(`AI Message Preview:\n${msg.slice(0, 250)}...\n`);

      results.push({
        questionNumber: i + 1,
        question: q,
        httpTotal,
        status: res.status,
        intent: body.intent?.type,
        creatorsCount: (body.creators || []).length,
        coursesCount: (body.courses || []).length,
        projectsCount: (body.projects || []).length,
        preview: msg.slice(0, 100),
      });

      // Small pause between requests to prevent API burst limits
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log("==================================================");
    console.log("FINAL BENCHMARK SUMMARY TABLE");
    console.log("==================================================");
    console.table(
      results.map((r) => ({
        "#": r.questionNumber,
        Question: r.question.length > 35 ? r.question.slice(0, 32) + "..." : r.question,
        "Total Time (ms)": r.httpTotal,
        Status: r.status,
        Intent: r.intent,
        "Creators Rec": r.creatorsCount,
        "Courses Rec": r.coursesCount,
        "Projects Rec": r.projectsCount,
      }))
    );

    const avgTime = Math.round(results.reduce((acc, r) => acc + r.httpTotal, 0) / results.length);
    console.log(`\nAverage Total Response Time: ${avgTime} ms`);
    console.log("==================================================\n");
  } catch (err) {
    console.error("Benchmark error:", err);
  } finally {
    process.exit(0);
  }
}

runBenchmark();
