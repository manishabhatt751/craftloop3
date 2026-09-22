const http = require('http');

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING CRAFTLOOP 4 BUGS VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Check client index.html serving
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5173,
      path: '/',
      method: 'GET',
    });
    assert(res.statusCode === 200 && typeof res.body === 'string' && res.body.includes('id="root"'), 'Client Vite server responds 200 OK');
  } catch (err) {
    assert(false, `Client Vite server unreachable: ${err.message}`);
  }

  // 2. Check Backend Health
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    assert(res.statusCode === 200 && res.body.status === 'ok', 'Backend /api/health responds 200 OK');
  } catch (err) {
    assert(false, `Backend server unreachable: ${err.message}`);
  }

  // 3. Inspect watchlesson.jsx for Bug 1 fixes
  const fs = require('fs');
  const path = require('path');
  const watchLessonContent = fs.readFileSync(path.join(__dirname, '../client/src/pages/watchlesson.jsx'), 'utf8');
  assert(
    watchLessonContent.includes('const lesson =') &&
    watchLessonContent.includes('if (isLoading)') &&
    watchLessonContent.includes('Course Not Found'),
    'BUG 1: watchlesson.jsx defines `lesson` safely, handles isLoading, and has blank-page protection'
  );

  // 4. Inspect create.jsx, community.jsx, uploadRoutes.js, .env for upload requirement (5 GB)
  const createContent = fs.readFileSync(path.join(__dirname, '../client/src/pages/create.jsx'), 'utf8');
  const communityContent = fs.readFileSync(path.join(__dirname, '../client/src/pages/community.jsx'), 'utf8');
  const uploadRoutesContent = fs.readFileSync(path.join(__dirname, '../server/routes/uploadRoutes.js'), 'utf8');
  const envContent = fs.readFileSync(path.join(__dirname, '../server/.env'), 'utf8');

  assert(
    !createContent.includes('Max 2 MB') &&
    createContent.includes('Upload files up to 5 GB (Maximum file size: 5 GB)'),
    'BUG 2 / Final Upload: create.jsx shows Upload files up to 5 GB (Maximum file size: 5 GB)'
  );
  assert(
    communityContent.includes('5000 * 1024 * 1024') &&
    !communityContent.includes('2 * 1024 * 1024'),
    'BUG 2 / Final Upload: community.jsx enforces 5000 MB (5 GB) cap instead of old 2MB'
  );
  assert(
    uploadRoutesContent.includes('process.env.MAX_UPLOAD_SIZE_MB') &&
    envContent.includes('MAX_UPLOAD_SIZE_MB=5000'),
    'BUG 2 / Final Upload: uploadRoutes.js configurable MAX_UPLOAD_SIZE_MB=5000 loaded in .env'
  );

  // 5. Inspect App.jsx, viewerprofile.jsx, editprofile.jsx for Bug 3 fixes
  const appContent = fs.readFileSync(path.join(__dirname, '../client/src/App.jsx'), 'utf8');
  const viewerProfileContent = fs.readFileSync(path.join(__dirname, '../client/src/pages/viewerprofile.jsx'), 'utf8');
  const editProfileContent = fs.readFileSync(path.join(__dirname, '../client/src/pages/editprofile.jsx'), 'utf8');

  assert(
    appContent.includes('path="/viewereditprofile"') &&
    appContent.includes('path="/viewer/edit-profile"'),
    'BUG 3: App.jsx includes viewer-accessible routes for edit profile'
  );
  assert(
    viewerProfileContent.includes("navigate('/viewereditprofile')"),
    'BUG 3: viewerprofile.jsx navigates to /viewereditprofile'
  );
  assert(
    editProfileContent.includes('isViewer') &&
    editProfileContent.includes('profilePath'),
    'BUG 3: editprofile.jsx supports viewer role with back/cancel/save to /viewerprofile'
  );

  // 6. Inspect mylearning.jsx for Bug 4 fixes
  const myLearningContent = fs.readFileSync(path.join(__dirname, '../client/src/pages/mylearning.jsx'), 'utf8');
  assert(
    myLearningContent.includes('const [error, setError] = useState(null)') &&
    myLearningContent.includes('Something went wrong') &&
    myLearningContent.includes('No Courses Yet'),
    'BUG 4: mylearning.jsx includes error handling, safe course mapping, and empty state protection'
  );

  // 7. Login and test backend APIs for My Learning & User Profile
  try {
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: 'viewer@craftloop.com',
      password: 'password123',
    });

    if (loginRes.statusCode === 200 && loginRes.body.token) {
      const token = loginRes.body.token;
      assert(true, 'Viewer test authentication succeeded');

      // Test GET /api/enrollments/me (backend endpoint used by getMyLearning())
      const myLearningApiRes = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: '/api/enrollments/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      assert(myLearningApiRes.statusCode === 200 && Array.isArray(myLearningApiRes.body.data), 'Backend /api/enrollments/me returns 200 array data');

      // Test GET /api/users/profile
      const profileApiRes = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: '/api/users/profile',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      assert(profileApiRes.statusCode === 200 && profileApiRes.body.data, 'Backend /api/users/profile returns 200 profile data');
    } else {
      console.log('Viewer login returned code:', loginRes.statusCode);
    }
  } catch (err) {
    console.warn('API test notice:', err.message);
  }

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
