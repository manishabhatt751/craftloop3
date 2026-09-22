const { spawn } = require("child_process");
const path = require("path");

const testScripts = [
  { name: "Phase 1: Auth Flow", script: "test_auth_flow.js" },
  { name: "Phase 12: Community API & DB Sync", script: "test_phase12_community.js" },
  { name: "Phase 13: Profile Management & MongoDB Sync", script: "test_phase13_profile.js" },
  { name: "Phase 14: Projects & Courses MongoDB Sync", script: "test_phase14_projects_courses.js" },
  { name: "Phase 15: Lesson Progress & My Learning Sync", script: "test_phase15_enrollment_progress.js" },
  { name: "Phase 16: Protected Routes & Auth Boundaries", script: "test_phase16_protected_routes.js" },
  { name: "Phase 17: Real Notification System & Triggers", script: "test_phase17_notifications.js" },
  { name: "Phase 18: Creator Wallet, Ledger & Withdrawals", script: "test_phase18_wallet.js" },
  { name: "Phase 19: Help & Support Ticketing", script: "test_phase19_support.js" },
  { name: "Phase 20: Saved Projects / Bookmarks Persistence", script: "test_phase20_saved_projects.js" },
  { name: "Phase 21: Media Upload & Cloud Storage Service", script: "test_phase21_upload.js" },
];

function runScript(scriptObj) {
  return new Promise((resolve) => {
    console.log(`\n▶ Running: [${scriptObj.name}] (${scriptObj.script})...`);
    const proc = spawn(process.execPath, [path.join(__dirname, scriptObj.script)], {
      cwd: __dirname,
      stdio: "inherit",
      env: process.env,
    });

    proc.on("close", (code) => {
      if (code === 0) {
        console.log(`✔ [${scriptObj.name}] PASSED`);
        resolve({ ...scriptObj, passed: true });
      } else {
        console.error(`✖ [${scriptObj.name}] FAILED with exit code ${code}`);
        resolve({ ...scriptObj, passed: false, code });
      }
    });

    proc.on("error", (err) => {
      console.error(`✖ [${scriptObj.name}] Error spawning process:`, err);
      resolve({ ...scriptObj, passed: false, error: err });
    });
  });
}

async function runMasterSuite() {
  console.log("==================================================================");
  console.log("      CRAFTLOOP MASTER AUTOMATED PRODUCTION REGRESSION SUITE      ");
  console.log("==================================================================");

  const results = [];
  for (const test of testScripts) {
    const result = await runScript(test);
    results.push(result);
  }

  console.log("\n==================================================================");
  console.log("                  FINAL SUITE EXECUTION SUMMARY                   ");
  console.log("==================================================================");

  let totalPassed = 0;
  let totalFailed = 0;

  results.forEach((r) => {
    if (r.passed) {
      console.log(`  [PASS] ${r.name}`);
      totalPassed++;
    } else {
      console.log(`  [FAIL] ${r.name}`);
      totalFailed++;
    }
  });

  console.log("------------------------------------------------------------------");
  console.log(`Total: ${results.length} test suites | Passed: ${totalPassed} | Failed: ${totalFailed}`);
  console.log("==================================================================\n");

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    console.log("🎉 ALL PRODUCTION REGRESSION TEST SUITES PASSED FLAWLESSLY!\n");
    process.exit(0);
  }
}

runMasterSuite();
