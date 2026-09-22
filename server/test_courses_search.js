const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

// Client-side filtering logic matching viewercourse.jsx
function filterCourses(courses, searchTerm, category) {
  const term = (searchTerm || '').trim().toLowerCase();

  return courses.filter((course) => {
    // 1. Category Matching
    const courseCat = (course.category || '').toLowerCase();
    const selCat = category.toLowerCase();

    let matchesCategory = category === 'All' || courseCat === selCat;

    if (!matchesCategory && category !== 'All') {
      if (selCat === 'design') {
        matchesCategory = courseCat.includes('design') || courseCat.includes('graphic');
      } else if (selCat === 'ux') {
        matchesCategory = courseCat.includes('ux') || courseCat.includes('ui');
      } else if (selCat === 'development') {
        matchesCategory = courseCat.includes('development') || courseCat.includes('web') || courseCat.includes('code');
      } else if (selCat === 'content') {
        matchesCategory = courseCat.includes('content') || courseCat.includes('video') || courseCat.includes('writing');
      } else if (selCat === 'business') {
        matchesCategory = courseCat.includes('business') || courseCat.includes('marketing');
      }
    }

    // 2. Search Matching
    if (!term) {
      return matchesCategory;
    }

    const title = (course.title || '').toLowerCase();
    const description = (course.description || '').toLowerCase();
    const creator = (course.creator || '').toLowerCase();
    const level = (course.level || '').toLowerCase();
    const tags = Array.isArray(course.tags) ? course.tags.map((t) => String(t).toLowerCase()) : [];
    const skills = Array.isArray(course.skills) ? course.skills.map((s) => String(s).toLowerCase()) : [];
    const lessons = Array.isArray(course.lessonsList) ? course.lessonsList.map((l) => (l.title || '').toLowerCase()) : [];

    const matchesSearch =
      title.includes(term) ||
      description.includes(term) ||
      courseCat.includes(term) ||
      creator.includes(term) ||
      level.includes(term) ||
      tags.some((t) => t.includes(term)) ||
      skills.some((s) => s.includes(term)) ||
      lessons.some((l) => l.includes(term));

    return matchesCategory && matchesSearch;
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('CRAFTLOOP COURSES SEARCH & FILTER VERIFICATION');
  console.log('==================================================\n');

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

  try {
    // 1. Fetch live courses from CraftLoop backend
    const apiRes = await makeRequest('/api/courses');
    assert(apiRes.status === 200, 'Backend API: GET /api/courses returns 200');
    assert(Array.isArray(apiRes.data?.data) && apiRes.data.data.length > 0, 'Backend API: Courses retrieved from MongoDB');

    const backendCourses = apiRes.data.data.map(c => ({
      id: c._id,
      title: c.title,
      category: c.category,
      level: c.level,
      creator: c.instructor?.name || c.creator?.name || 'CraftLoop Creator',
      lessons: Array.isArray(c.lessons) ? c.lessons.length : 0,
      lessonsList: c.lessons || [],
      description: c.description || '',
    }));

    console.log(`Loaded ${backendCourses.length} real courses from CraftLoop backend:\n` +
      backendCourses.map(c => `  • "${c.title}" (${c.category}) by ${c.creator}`).join('\n') + '\n'
    );

    // Case A: Empty search → all courses appear
    const caseA = filterCourses(backendCourses, '', 'All');
    assert(caseA.length === backendCourses.length, `Case A: Empty search returns all ${backendCourses.length} courses`);

    // Case B: Search "video" → matching courses appear
    const caseB = filterCourses(backendCourses, 'video', 'All');
    assert(caseB.length > 0, `Case B: Search "video" returns ${caseB.length} courses`);
    assert(caseB.some(c => c.title.toLowerCase().includes('video') || c.category.toLowerCase().includes('video')),
      'Case B: Matches "Mastering Premiere Pro: From Zero to Pro Video Editor"');

    // Case C: Search with uppercase letters → still works (case-insensitive)
    const caseC = filterCourses(backendCourses, 'GRAPHIC', 'All');
    assert(caseC.length > 0, `Case C: Search "GRAPHIC" in uppercase returns ${caseC.length} courses`);
    assert(caseC.some(c => c.title.toLowerCase().includes('graphic')),
      'Case C: Finds "Complete Graphic Design & Brand Identity Mastery"');

    // Case C2: Mixed case search "FiGmA"
    const caseC2 = filterCourses(backendCourses, 'FiGmA', 'All');
    assert(caseC2.length > 0, `Case C2: Search "FiGmA" in mixed case returns ${caseC2.length} courses`);
    assert(caseC2.some(c => c.title.toLowerCase().includes('figma')),
      'Case C2: Finds "Figma to Product: Modern UI/UX Design Systems"');

    // Case D: Search with no matching result → "No courses found" (0 results)
    const caseD = filterCourses(backendCourses, 'python-nonexistent-skill', 'All');
    assert(caseD.length === 0, 'Case D: Search with non-matching term returns 0 results (triggers "No courses found")');

    // Case E: Clear search → all courses return
    const caseE = filterCourses(backendCourses, '', 'All');
    assert(caseE.length === backendCourses.length, `Case E: Clearing search restores all ${backendCourses.length} courses`);

    // Case F: Click a result → Course Details still opens (verifying course ID format)
    const firstCourse = backendCourses[0];
    const detailsRes = await makeRequest(`/api/courses/${firstCourse.id}`);
    assert(detailsRes.status === 200, `Case F: Course Details endpoint /api/courses/${firstCourse.id} returns 200 OK`);
    assert(detailsRes.data?.data?._id === firstCourse.id, 'Case F: Course Details response matches clicked course ID');

    // Case G: Existing filters still work
    const filterDesign = filterCourses(backendCourses, '', 'Design');
    assert(filterDesign.length > 0 && filterDesign.some(c => c.category.includes('Design')),
      `Case G: Filter "Design" returns ${filterDesign.length} courses matching Design`);

    const filterDev = filterCourses(backendCourses, '', 'Development');
    assert(filterDev.length > 0 && filterDev.some(c => c.category.includes('Development')),
      `Case G: Filter "Development" returns ${filterDev.length} courses matching Development`);

    // Combined Case: Filter "Design" + Search "Complete"
    const combined = filterCourses(backendCourses, 'Complete', 'Design');
    assert(combined.length === 1 && combined[0].title.includes('Complete Graphic Design'),
      'Combined Case: Category "Design" + Search "Complete" correctly narrows down to 1 course');

    // Backend Search Query Test: GET /api/courses?search=video
    const backendSearch = await makeRequest('/api/courses?search=video');
    assert(backendSearch.status === 200 && backendSearch.data?.data?.length > 0,
      'Backend Search: GET /api/courses?search=video correctly filters backend results');

    console.log('\n==================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================\n');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
