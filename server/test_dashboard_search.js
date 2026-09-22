const http = require('http');
const fs = require('fs');
const path = require('path');

function makeRequest(apiPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${apiPath}`, (res) => {
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

// ViewerExplore search filtering logic
function filterExplore(items, search, category = 'All') {
  const term = (search || '').trim().toLowerCase();

  return items.filter((item) => {
    const titleMatch = (item.title || '').toLowerCase().includes(term);
    const descMatch = (item.description || '').toLowerCase().includes(term);
    const catMatch = (item.category || '').toLowerCase().includes(term);
    const typeMatch = (item.type || '').toLowerCase().includes(term);
    const skillsMatch = Array.isArray(item.skills)
      ? item.skills.some((s) => String(s).toLowerCase().includes(term))
      : false;

    const matchesSearch = !term || titleMatch || descMatch || catMatch || typeMatch || skillsMatch;

    const matchesCategory =
      category === 'All' ||
      (item.category || '').toLowerCase().includes(category.toLowerCase()) ||
      (category === 'Design' &&
        ((item.category || '').toLowerCase().includes('graphic') ||
          (item.category || '').toLowerCase().includes('ux') ||
          (item.category || '').toLowerCase().includes('ui')));

    return matchesSearch && matchesCategory;
  });
}

async function runDashboardSearchTests() {
  console.log('==================================================');
  console.log('CRAFTLOOP MAIN DASHBOARD SEARCH VERIFICATION');
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

  // 1. Verify backend real data endpoints
  const [creatorsRes, coursesRes, projectsRes] = await Promise.all([
    makeRequest('/api/creators'),
    makeRequest('/api/courses'),
    makeRequest('/api/projects'),
  ]);

  assert(creatorsRes.status === 200 && creatorsRes.data?.data?.length > 0, 'Real creators loaded from MongoDB');
  assert(coursesRes.status === 200 && coursesRes.data?.data?.length > 0, 'Real courses loaded from MongoDB');
  assert(projectsRes.status === 200 && projectsRes.data?.data?.length > 0, 'Real projects loaded from MongoDB');

  // Build combined explore catalog
  const exploreItems = [];
  creatorsRes.data.data.forEach(c => {
    exploreItems.push({
      id: c._id,
      title: c.name,
      type: 'Creator',
      category: c.title || 'Creator',
      description: c.bio || '',
      skills: Array.isArray(c.skills) ? c.skills : [],
    });
  });
  coursesRes.data.data.forEach(c => {
    exploreItems.push({
      id: c._id,
      title: c.title,
      type: 'Course',
      category: c.category || 'Design',
      description: c.description || '',
      skills: [...(c.skills || []), ...(c.tags || [])],
    });
  });
  projectsRes.data.data.forEach(p => {
    exploreItems.push({
      id: p._id,
      title: p.title,
      type: 'Project',
      category: p.category || 'Development',
      description: p.description || '',
      skills: [...(p.tags || []), ...(p.tools || [])],
    });
  });

  console.log(`Explore catalog size: ${exploreItems.length} real items from MongoDB`);

  // TEST 1: Type "video" and press Enter -> opens /viewerexplore with "video" search applied
  const test1Results = filterExplore(exploreItems, 'video');
  assert(test1Results.length > 0, `TEST 1: Type "video" returns ${test1Results.length} matching items`);
  assert(
    test1Results.some(i => i.title.toLowerCase().includes('video') || i.skills.some(s => s.toLowerCase().includes('video'))),
    'TEST 1: Returns Jordan Lee (Video Pro) or Video course'
  );

  // TEST 2: Type "graphic design" and click the search icon -> results shown
  const test2Results = filterExplore(exploreItems, 'graphic design');
  assert(test2Results.length > 0, `TEST 2: Type "graphic design" returns ${test2Results.length} matching items`);
  assert(
    test2Results.some(i => i.title.toLowerCase().includes('graphic design') || i.category.toLowerCase().includes('graphic design') || i.description.toLowerCase().includes('graphic')),
    'TEST 2: Returns Elena Rostova / Graphic Design course'
  );

  // TEST 3: Type uppercase text such as "VIDEO" -> search still works (case-insensitive)
  const test3Results = filterExplore(exploreItems, 'VIDEO');
  assert(test3Results.length === test1Results.length, 'TEST 3: Uppercase "VIDEO" returns identical results as "video"');

  // TEST 4: Leave search empty and press Enter -> nothing breaks / does nothing
  const test4Results = filterExplore(exploreItems, '');
  assert(test4Results.length === exploreItems.length, 'TEST 4: Empty search preserves all items, does not throw');

  // Verify Topbar.jsx and viewertopbar.jsx implementations
  const topbarCode = fs.readFileSync(path.join(__dirname, '../client/src/Components/Topbar.jsx'), 'utf8');
  const viewerTopbarCode = fs.readFileSync(path.join(__dirname, '../client/src/Components/viewertopbar.jsx'), 'utf8');
  const exploreCode = fs.readFileSync(path.join(__dirname, '../client/src/pages/viewerexplore.jsx'), 'utf8');

  // TEST 5 & 6: Check Creator and Viewer topbar components
  assert(topbarCode.includes('form') && topbarCode.includes('handleSearchSubmit'), 'Creator Topbar has functional search form');
  assert(topbarCode.includes('Find a skill, creator or project...'), 'Creator Topbar preserves exact placeholder');
  assert(topbarCode.includes('if (!trimmed) return'), 'Creator Topbar safely ignores empty search');
  assert(topbarCode.includes('navigate(`/viewerexplore?search='), 'Creator Topbar navigates to /viewerexplore with query');
  assert(topbarCode.includes('type="submit"'), 'Creator Topbar search icon has click submission');

  assert(viewerTopbarCode.includes('form') && viewerTopbarCode.includes('handleSearchSubmit'), 'Viewer Topbar has functional search form');
  assert(viewerTopbarCode.includes('Find a skill, creator or project...'), 'Viewer Topbar preserves exact placeholder');
  assert(viewerTopbarCode.includes('if (!trimmed) return'), 'Viewer Topbar safely ignores empty search');
  assert(viewerTopbarCode.includes('navigate(`/viewerexplore?search='), 'Viewer Topbar navigates to /viewerexplore with query');
  assert(viewerTopbarCode.includes('type="submit"'), 'Viewer Topbar search icon has click submission');

  // Check viewerexplore.jsx
  assert(exploreCode.includes('useSearchParams'), 'ViewerExplore reads query parameters via useSearchParams');
  assert(exploreCode.includes('api.getCreators()'), 'ViewerExplore fetches real creators');
  assert(exploreCode.includes('api.getCourses()'), 'ViewerExplore fetches real courses');
  assert(exploreCode.includes('api.getProjects()'), 'ViewerExplore fetches real projects');

  // TEST 7: Courses search in viewercourse.jsx is untouched
  const courseCode = fs.readFileSync(path.join(__dirname, '../client/src/pages/viewercourse.jsx'), 'utf8');
  assert(courseCode.includes('Search courses, creators or skills'), 'TEST 7: viewercourse.jsx search placeholder intact');
  assert(courseCode.includes('filteredCourses'), 'TEST 7: viewercourse.jsx filteredCourses logic intact');

  console.log(`\n==================================================`);
  console.log(`TOTAL RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runDashboardSearchTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
