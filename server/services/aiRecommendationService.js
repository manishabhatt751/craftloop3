const { User, Course, Project } = require("../models");

/**
 * Domain knowledge base for keyword expansion, comprehensive explanations,
 * learning roadmaps, skills roadmaps, tools, and next steps.
 */
const DOMAIN_KNOWLEDGE = [
  {
    category: "Video Editing",
    keywords: [
      "video editing",
      "video editor",
      "video edit",
      "premiere",
      "premiere pro",
      "after effects",
      "motion graphics",
      "color grading",
      "youtube video",
      "youtube editing",
      "davinci",
      "davinci resolve",
      "final cut",
      "vfx",
      "montage",
      "cutting",
      "edit videos",
      "edit video",
    ],
    skills: ["Video Editing", "Motion Graphics", "Color Grading", "Content Creation", "Audio Mastering"],
    tools: ["Adobe Premiere Pro", "DaVinci Resolve", "Adobe After Effects", "CapCut", "Final Cut Pro"],
    definition:
      "Video editing is the art and technical craft of assembling, cutting, and refining video footage, audio tracks, sound effects, and visual graphics to produce a compelling, coherent story.\n\nKey Workflows in Video Editing:\n• Timeline Assembly: Arranging raw takes, trimming dead air, and building the primary narrative flow (A-Roll).\n• Narrative Pacing & Rhythm: Cutting on action, utilizing J-cuts and L-cuts to make scene transitions feel smooth and organic.\n• Audio & Sound Design: Cleaning dialogue background noise, leveling speech to -6dB/-12dB, and layering ambient sound effects.\n• Color Grading & Visual Polish: Correcting exposure balance, applying stylistic LUTs, and adding animated titles.\n\nIndustry-Standard Tools: Adobe Premiere Pro, DaVinci Resolve, Adobe After Effects, CapCut, and Final Cut Pro.",
    learningRoadmap:
      "Here is a proven 4-step roadmap to learn video editing effectively:\n\n1. Master Timeline Mechanics: Familiarize yourself with basic cutting tools, ripple edits, slip/slide tools, and essential keyboard shortcuts.\n2. Understand Pacing & Visual Rhythm: Study how pacing influences viewer emotions. Learn when to hold a shot and when to cut dynamically on subject action.\n3. Prioritize Audio Quality: Great video with bad audio is unwatchable. Learn EQ filtering, compression, and proper background music ducking.\n4. Build a Practical Portfolio: Edit sample YouTube vlogs, cinematic travel montages, commercial promo reels, or client trailers to showcase your editing range.",
    skillsRoadmap:
      "Essential skills to become a professional Video Editor:\n\n1. Timeline Assembly & Pacing: Selecting the best takes and maintaining audience retention.\n2. Audio Design & Mixing: Dialogue leveling, sound effects (SFX) placement, and audio mastering.\n3. Color Correction & Grading: Balancing shot exposures and creating cinematic mood palettes.\n4. Motion Graphics & Typography: Lower thirds, title animations, and visual transitions.\n5. Multi-format Delivery: Exporting optimized codecs for YouTube, Instagram Reels, TikTok, and cinema.\n\nKey Tools: Adobe Premiere Pro, DaVinci Resolve, After Effects, and Audition.",
    scenarioGuidance: {
      youtube:
        "Editing your first YouTube video is simpler than it seems when you break it into a clear, step-by-step workflow:\n\n1. Outline Before Shooting: Have bullet points ready so your talking points are concise and easy to cut.\n2. Choose a Beginner-Friendly Editor: Start with CapCut (quick and easy), DaVinci Resolve (free and professional), or Premiere Pro.\n3. The A-Roll Rough Cut: Lay your primary talking footage on the timeline and trim out all pauses, false starts, and filler words.\n4. Layer B-Roll & Visual Variety: Cut to screenshots, graphics, or relevant footage every 5-10 seconds to keep visual interest high.\n5. Level Your Audio: Keep your voice clear around -6dB to -12dB, and drop background music down to -20dB to -25dB.\n6. Hook the Viewer in 15 Seconds: Introduce your core topic immediately so viewers stay invested.",
    },
    nextSteps: [
      "Master timeline navigation, rough cuts, and pacing fundamentals.",
      "Practice audio leveling, sound design, and clean B-roll layering.",
      "Experiment with cinematic color grading and title animation.",
    ],
    followUps: [
      "Which CraftLoop creator can help me with video editing?",
      "Find video editing courses for beginners",
      "What tools should I install first for editing?",
    ],
  },
  {
    category: "Graphic Design",
    keywords: [
      "graphic design",
      "graphic designer",
      "graphic",
      "graphics",
      "flyer",
      "poster",
      "banner",
      "logo",
      "branding",
      "photoshop",
      "illustrator",
      "canva",
      "typography",
      "vector",
      "visual design",
    ],
    skills: ["Graphic Design", "Branding", "Typography", "Visual Identity", "Illustration", "Layout Design"],
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Canva"],
    definition:
      "Graphic design is the discipline of visual communication and problem-solving through the purposeful combination of typography, color theory, imagery, and composition. Graphic designers create visual identities, branding kits, marketing materials, posters, flyers, packaging, and digital assets that communicate clear messages and inspire audiences.\n\nCore Pillars of Graphic Design:\n• Visual Hierarchy: Guiding the viewer's eye to the most critical information first.\n• Typography: Selecting and pairing font families that convey personality and ensure effortless legibility.\n• Color Theory: Utilizing contrast, harmony, and psychological color associations to evoke emotion.\n• Composition & Grid Systems: Arranging elements with balance, rhythm, and purposeful white space.",
    learningRoadmap:
      "To learn graphic design effectively, follow this structured 4-step roadmap:\n\n1. Master Visual Design Principles: Study contrast, hierarchy, alignment, balance, repetition, and the power of white space.\n2. Learn Typography & Color Theory: Understand font anatomy, pairing rules (e.g., Serif headers with Sans-Serif body), and harmonious color palettes.\n3. Master Industry Software: Learn vector illustration in Adobe Illustrator, raster image manipulation in Photoshop, and layout creation in Figma.\n4. Build Real-World Projects: Design event flyers, brand logos, magazine layouts, and social media kits. Document your rationale in a case-study portfolio.",
    skillsRoadmap:
      "Key skills needed to become a professional Graphic Designer:\n\n1. Typography Mastery: Font pairing, kerning, leading, and typographic scale.\n2. Color Harmony & Psychology: Creating accessible, high-contrast palettes that suit brand identity.\n3. Layout & Composition: Utilizing grid systems to structure complex information visually.\n4. Software Proficiency: Adobe Illustrator (vectors), Photoshop (photo manipulation), and InDesign/Figma.\n5. Brand Strategy: Crafting cohesive logo systems, style guides, and brand collateral.",
    nextSteps: [
      "Study visual hierarchy, contrast, and color harmony principles.",
      "Design practical assets such as flyers, social posters, or brand logos.",
      "Build a portfolio highlighting your creative design process.",
    ],
    followUps: [
      "Which creator specializes in graphic design on CraftLoop?",
      "Show projects related to branding and flyers",
      "What design tools are recommended for beginners?",
    ],
  },
  {
    category: "UI/UX Design",
    keywords: [
      "ui/ux",
      "ui",
      "ux",
      "user interface",
      "user experience",
      "figma",
      "wireframe",
      "wireframing",
      "prototype",
      "prototyping",
      "design system",
      "product design",
      "user flow",
      "ui designer",
      "ux designer",
    ],
    skills: ["UI/UX Design", "Figma", "Wireframing", "Prototyping", "Design Systems", "User Research", "Usability Testing"],
    tools: ["Figma", "FigJam", "Adobe XD", "Miro"],
    definition:
      "UI (User Interface) and UX (User Experience) design are complementary disciplines focused on creating intuitive, functional, and visually compelling digital products.\n\n• UX Design (User Experience): Focuses on understanding human behavior through user research, journey mapping, information architecture, wireframing, and usability testing to solve real user problems.\n• UI Design (User Interface): Focuses on the aesthetic presentation—crafting visual touchpoints including typography, color palettes, interactive components, micro-animations, and responsive design systems.\n\nPrimary Tool of Modern UI/UX: Figma (for collaborative wireframing, component libraries, and interactive prototyping).",
    learningRoadmap:
      "Here is a comprehensive roadmap to learn UI/UX design:\n\n1. Understand UX Fundamentals: Learn user research methods, persona creation, problem definition, and customer journey mapping.\n2. Information Architecture & Wireframing: Sketch low-fidelity wireframes to organize page layouts and navigation flows before touching colors.\n3. Master Figma: Learn Auto-Layout, component variants, design tokens, interactive prototyping, and smart animations.\n4. Build Design Systems: Create scalable UI component libraries and test designs with real users through usability testing.",
    skillsRoadmap:
      "Essential skills to become a successful UI/UX Designer:\n\n1. User Research & Usability Testing: Conducting user interviews, competitive analysis, and prototype testing.\n2. Wireframing & Prototyping: Creating interactive, clickable prototypes in Figma to simulate real user journeys.\n3. Visual Design & UI Fundamentals: Spacing grids (8pt grid), typography scales, and accessible color contrast.\n4. Design Systems: Building reusable components, variants, and design tokens for engineering handoff.\n5. Information Architecture: Creating clear sitemaps, user flows, and intuitive navigation structures.\n6. Developer Collaboration: Documenting design specs and communicating effectively with frontend engineers.",
    nextSteps: [
      "Map out user personas, journey flows, and low-fidelity wireframes.",
      "Create high-fidelity UI screens using components and auto-layout in Figma.",
      "Conduct interactive prototyping and usability feedback reviews.",
    ],
    followUps: [
      "Which creator is best for learning Figma?",
      "Show UI/UX courses on CraftLoop",
      "How do I start building a design system?",
    ],
  },
  {
    category: "Web Development",
    keywords: [
      "web development",
      "web developer",
      "frontend",
      "backend",
      "fullstack",
      "full-stack",
      "programming",
      "coding",
      "javascript",
      "react",
      "node",
      "node.js",
      "express",
      "html",
      "css",
      "web app",
      "website",
    ],
    skills: ["Web Development", "React", "JavaScript", "Frontend Development", "Backend Development", "Node.js", "REST APIs"],
    tools: ["VS Code", "GitHub", "Node.js", "Vite", "Postman", "Chrome DevTools"],
    definition:
      "Web development involves the creation, building, and maintenance of websites and web applications. It spans three main disciplines:\n\n• Frontend Development: Building responsive, interactive user interfaces using HTML5, modern CSS3 (Flexbox, Grid), and JavaScript (ES6+), along with modern component libraries like React.\n• Backend Development: Writing server logic, handling user authentication, designing RESTful APIs, and managing databases with Node.js, Express, and MongoDB.\n• Full-Stack Development: Connecting frontend client applications to backend servers and databases into seamless production web platforms.",
    learningRoadmap:
      "Roadmap to learn Modern Web Development:\n\n1. Foundations: Master semantic HTML5, modern responsive CSS3 (Flexbox, Grid, Tailwind CSS), and JavaScript fundamentals (DOM, Promises, async/await, ES6+).\n2. Frontend Framework: Learn component architecture, props, state management, hooks, and routing with React.\n3. Backend & APIs: Build RESTful APIs using Node.js and Express, implement JWT authentication, and handle database persistence with MongoDB & Mongoose.\n4. Deployment & Git: Version control your code with Git & GitHub and deploy full-stack apps to platforms like Vercel or Render.",
    skillsRoadmap:
      "Core skills needed to become a Web Developer:\n\n1. JavaScript & TypeScript: Deep understanding of ES6+, asynchronous programming, and typed code.\n2. React & Component Architecture: Building reusable, performant UI components and managing state.\n3. REST API Design: Creating clean HTTP endpoints, handling query parameters, and securing routes.\n4. Database Modeling: Schema design, relationships, and queries in MongoDB or SQL.\n5. Git Version Control: Branching, pull requests, and collaborative code reviews.",
    nextSteps: [
      "Master modern JavaScript (ES6+), DOM manipulation, and asynchronous APIs.",
      "Build interactive component-driven interfaces using React.",
      "Connect frontend interfaces to backend REST APIs and databases.",
    ],
    followUps: [
      "Show web development creators on CraftLoop",
      "Find beginner-friendly React courses",
      "Show projects built with React or Node",
    ],
  },
  {
    category: "Digital Marketing",
    keywords: [
      "digital marketing",
      "marketing",
      "seo",
      "social media marketing",
      "growth",
      "analytics",
      "ads",
      "content strategy",
      "campaign",
    ],
    skills: ["Digital Marketing", "Content Strategy", "SEO", "Social Media Marketing", "Growth", "Analytics"],
    tools: ["Google Analytics", "Meta Ads Manager", "Canva", "Buffer", "Ahrefs"],
    definition:
      "Digital marketing is the strategic promotion of brands, creators, or products using digital communication channels. It encompasses Search Engine Optimization (SEO), content strategy, social media growth, email marketing campaigns, performance advertising, and data analytics to attract, engage, and convert audiences.",
    learningRoadmap:
      "Roadmap to learn Digital Marketing:\n\n1. Understand Marketing Fundamentals: Identify target demographics, create user personas, and define clear value propositions.\n2. Content & Social Media Strategy: Develop multi-channel content calendars that deliver consistent, engaging value.\n3. SEO Principles: Learn keyword research, on-page optimization, and high-quality backlink generation.\n4. Paid Ads & Analytics: Master conversion tracking, A/B testing, and ROI analysis in Google and Meta ads.",
    skillsRoadmap:
      "Core Digital Marketing Skills: SEO optimization, copywriting, social media community management, paid advertising, and Google Analytics tracking.",
    nextSteps: [
      "Identify your target demographic and core value proposition.",
      "Develop a multi-channel content calendar with SEO-optimized copy.",
      "Analyze engagement metrics to iterate on conversion rates.",
    ],
    followUps: [
      "Which creator can help me with digital marketing?",
      "Show digital marketing courses",
      "What marketing strategies work best for creators?",
    ],
  },
  {
    category: "Content Creation",
    keywords: [
      "content creation",
      "content creator",
      "creator",
      "youtube",
      "vlog",
      "podcasting",
      "podcast",
      "influencer",
      "storytelling",
      "content strategy",
      "reels",
      "tiktok",
    ],
    skills: ["Content Creation", "Storytelling", "Video Production", "Audience Growth", "Scriptwriting"],
    tools: ["OBS Studio", "Adobe Premiere Pro", "Canva", "Audacity", "CapCut"],
    definition:
      "Content creation is the process of generating engaging ideas, producing multimedia content (video, audio, written articles, or social carousels), and publishing it to build an engaged online audience. It combines structured storytelling, audience research, visual design, and brand identity.",
    learningRoadmap:
      "Roadmap to build a thriving Content Creation channel:\n\n1. Define Your Niche: Choose 1-2 core topics you are genuinely passionate and knowledgeable about.\n2. Focus on Storytelling & Hooks: The first 10 seconds of any video determine whether viewers stay or click away.\n3. Maintain Consistent Publishing: Build a sustainable production schedule and batch-record your content.\n4. Engage With Your Community: Reply to comments, ask open questions, and foster direct relationships with your followers.",
    skillsRoadmap:
      "Core Content Creation Skills: Storyboarding, scriptwriting, on-camera presentation, basic video editing, and audience analytics.",
    nextSteps: [
      "Craft high-retention hooks and structured narrative outlines.",
      "Maintain consistent publishing schedules across social channels.",
      "Engage directly with your audience in the comments and community.",
    ],
    followUps: [
      "Show content creation mentors on CraftLoop",
      "Find courses on storytelling and growth",
      "What gear do I need to start creating content?",
    ],
  },
  {
    category: "Animation & 3D",
    keywords: [
      "animation",
      "animator",
      "3d",
      "blender",
      "motion graphics",
      "character animation",
      "cgi",
      "rendering",
    ],
    skills: ["Animation", "3D Modeling", "Motion Design", "Blender", "Texturing", "Keyframing"],
    tools: ["Blender", "Adobe After Effects", "Cinema 4D", "Procreate"],
    definition:
      "Animation and 3D design involve bringing static characters, objects, and typography to life through motion, timing, and spatial composition. It ranges from 2D motion graphics in After Effects to 3D polygon modeling, texturing, lighting, rigging, and rendering in Blender or Cinema 4D.",
    learningRoadmap:
      "Roadmap to learn Animation & 3D:\n\n1. Master the 12 Principles of Animation: Timing, squash & stretch, anticipation, and easing.\n2. Learn Core Software: Practice spline modeling, lighting, and material nodes in Blender or keyframe interpolation in After Effects.\n3. Build Short Loops: Create 5-10 second looping animations to master physics and render settings.\n4. Assemble a Showreel: Collect your best 30-45 seconds of motion work into an impactful reel.",
    skillsRoadmap:
      "Key Animation Skills: 3D modeling, UV unwrapping, lighting & shading, character rigging, and curve editor graph manipulation.",
    nextSteps: [
      "Learn the core 12 principles of animation and squash/stretch physics.",
      "Practice keyframe curves and easing in After Effects or Blender.",
      "Build a 10-second looping motion piece for your portfolio.",
    ],
    followUps: [
      "Find 3D and animation creators",
      "Show motion graphics courses",
      "What animation software is best to start with?",
    ],
  },
  {
    category: "Writing & Copywriting",
    keywords: [
      "writing",
      "writer",
      "copywriting",
      "copywriter",
      "content writing",
      "blogging",
      "storytelling",
      "articles",
    ],
    skills: ["Content Writing", "Copywriting", "Storytelling", "Editing", "SEO Writing"],
    tools: ["Notion", "Grammarly", "Google Docs"],
    definition:
      "Writing and copywriting are the arts of crafting persuasive, engaging, and clear written content. Copywriting specifically focuses on inspiring action (such as subscribing, buying, or clicking), while content writing builds long-term authority and trust through articles, guides, and storytelling.",
    learningRoadmap:
      "Roadmap to learn Copywriting & Content Writing:\n\n1. Study Copy Formulas: Learn proven frameworks like AIDA (Attention, Interest, Desire, Action) and PAS (Problem, Agitate, Solution).\n2. Write Daily: Practice writing punchy headlines, email newsletters, and short-form social posts.\n3. Edit Ruthlessly: Remove passive voice, fluff words, and unnecessary adjectives to maximize clarity.",
    skillsRoadmap:
      "Core Writing Skills: Headline crafting, audience empathy, storytelling, editing, and conversion optimization.",
    nextSteps: [
      "Draft concise, reader-focused headlines and strong opening hooks.",
      "Edit ruthlessly for clarity, active voice, and rhythmic cadence.",
      "Publish weekly articles to build authority in your niche.",
    ],
    followUps: [
      "Find writing and copywriting creators",
      "Show content writing courses",
      "How can I improve my copywriting skills?",
    ],
  },
  {
    category: "Photography",
    keywords: [
      "photography",
      "photographer",
      "photo editing",
      "lightroom",
      "portrait",
      "landscape",
      "camera",
    ],
    skills: ["Photography", "Photo Editing", "Color Grading", "Visual Arts", "Lighting"],
    tools: ["Adobe Lightroom", "Adobe Photoshop"],
    definition:
      "Photography is the creative practice of capturing light, composition, and moments to tell stories or document reality. It blends technical camera mastery (shutter speed, aperture, ISO) with visual aesthetics and post-processing in tools like Adobe Lightroom and Photoshop.",
    learningRoadmap:
      "Roadmap to learn Photography:\n\n1. Master the Exposure Triangle: Understand how aperture (depth of field), shutter speed (motion blur), and ISO (noise) interact.\n2. Practice Composition: Learn the rule of thirds, leading lines, framing, and golden hour lighting.\n3. Post-Processing: Master RAW image color correction and tonal balance in Adobe Lightroom.",
    skillsRoadmap:
      "Core Photography Skills: Manual camera exposure, lighting control, portrait direction, and RAW color grading.",
    nextSteps: [
      "Master manual camera controls: shutter speed, aperture, and ISO.",
      "Practice the rule of thirds, leading lines, and lighting angles.",
      "Curate and color-correct a cohesive 10-photo thematic series.",
    ],
    followUps: [
      "Find photography creators on CraftLoop",
      "Show photo editing courses",
      "What camera settings should beginners use?",
    ],
  },
];

/**
 * Stopwords to filter out when parsing query keywords
 */
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "else", "when", "at", "by", "for",
  "with", "about", "against", "between", "into", "through", "during", "before", "after",
  "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under",
  "again", "further", "then", "once", "here", "there", "when", "where", "why", "how",
  "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just",
  "don", "should", "now", "i", "want", "learn", "teach", "me", "find", "best", "good",
  "which", "who", "whom", "creator", "creators", "course", "courses", "project", "projects",
  "like", "need", "looking", "help", "show", "give", "tell", "please", "my", "your", "our",
]);

/**
 * Extracts intent, matched domains, keywords, and skills from a natural-language query
 * @param {string} query
 * @returns {object}
 */
function extractUserIntent(query) {
  const normalized = (query || "").toLowerCase().trim();

  // Check matching predefined knowledge domains
  const matchedDomains = [];
  for (const domain of DOMAIN_KNOWLEDGE) {
    const hits = domain.keywords.filter((kw) => normalized.includes(kw));
    if (hits.length > 0) {
      matchedDomains.push({ domain, hitCount: hits.length });
    }
  }

  // Sort matched domains by number of matching keywords
  matchedDomains.sort((a, b) => b.hitCount - a.hitCount);
  const primaryDomain = matchedDomains.length > 0 ? matchedDomains[0].domain : null;

  // Extract individual meaningful keyword tokens
  const words = normalized
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const keywordSet = new Set(words);

  let extractedSkills = [];
  let extractedTools = [];
  let nextSteps = [];
  let followUpPrompts = [];

  if (primaryDomain) {
    primaryDomain.keywords.forEach((k) => keywordSet.add(k));
    extractedSkills = [...primaryDomain.skills];
    extractedTools = [...primaryDomain.tools];
    nextSteps = [...primaryDomain.nextSteps];
    followUpPrompts = [...primaryDomain.followUps];
  } else {
    extractedSkills = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    extractedTools = [];
    nextSteps = [
      "Define your specific learning outcome or creative project scope.",
      "Explore existing creator portfolios and reach out with your requirements.",
      "Start with small, consistent milestones.",
    ];
    followUpPrompts = [
      "Show me creators for this skill",
      "Find courses for beginners",
      "What should I learn first?",
    ];
  }

  let goal = normalized;
  if (goal.length > 80) {
    goal = goal.substring(0, 80) + "...";
  }

  return {
    goal,
    primaryCategory: primaryDomain ? primaryDomain.category : null,
    primaryDomainObject: primaryDomain,
    keywords: Array.from(keywordSet),
    skills: extractedSkills,
    tools: extractedTools,
    nextSteps,
    followUpPrompts,
  };
}

/**
 * Escapes regex special characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Query actual creators from MongoDB User collection
 */
async function searchRealCreators(intent) {
  const { keywords, primaryCategory, skills } = intent;

  if (!keywords || keywords.length === 0) {
    return [];
  }

  const termsToSearch = Array.from(new Set([
    ...keywords,
    ...skills.map((s) => s.toLowerCase()),
    ...(primaryCategory ? [primaryCategory.toLowerCase()] : []),
  ])).filter((t) => t && t.length >= 2);

  if (termsToSearch.length === 0) return [];

  const regexPatterns = termsToSearch.map((t) => new RegExp(escapeRegex(t), "i"));

  const creators = await User.find({
    role: "creator",
    $or: [
      { skills: { $in: regexPatterns } },
      { title: { $in: regexPatterns } },
      { bio: { $in: regexPatterns } },
      { name: { $in: regexPatterns } },
    ],
  })
    .select("_id name avatar title bio skills")
    .limit(10)
    .lean();

  if (!creators || creators.length === 0) {
    return [];
  }

  const scored = creators.map((creator) => {
    let score = 0;
    const creatorSkills = (creator.skills || []).map((s) => s.toLowerCase());
    const creatorTitle = (creator.title || "").toLowerCase();
    const creatorBio = (creator.bio || "").toLowerCase();

    termsToSearch.forEach((term) => {
      if (creatorSkills.some((s) => s.includes(term) || term.includes(s))) score += 10;
      if (creatorTitle.includes(term)) score += 8;
      if (creatorBio.includes(term)) score += 4;
    });

    const matchedSkills = (creator.skills || []).filter((s) =>
      termsToSearch.some((t) => s.toLowerCase().includes(t) || t.includes(s.toLowerCase()))
    );

    let reason = "";
    if (matchedSkills.length > 0) {
      reason = `Matches your request with skills in ${matchedSkills.join(", ")}${
        creator.title ? ` and experience as a ${creator.title}` : ""
      }.`;
    } else if (creator.title) {
      reason = `Relevant to your goal through work as a ${creator.title}.`;
    } else {
      reason = `CraftLoop creator with matching profile background.`;
    }

    return {
      id: creator._id.toString(),
      name: creator.name,
      avatar: creator.avatar || "",
      title: creator.title || "Creator",
      bio: creator.bio || "",
      skills: creator.skills || [],
      reason,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(({ score, ...item }) => item);
}

/**
 * Query actual courses from MongoDB Course collection
 */
async function searchRealCourses(intent) {
  const { keywords, primaryCategory, skills } = intent;

  const termsToSearch = Array.from(new Set([
    ...keywords,
    ...skills.map((s) => s.toLowerCase()),
    ...(primaryCategory ? [primaryCategory.toLowerCase()] : []),
  ])).filter((t) => t && t.length >= 2);

  if (termsToSearch.length === 0) return [];

  const regexPatterns = termsToSearch.map((t) => new RegExp(escapeRegex(t), "i"));

  const courses = await Course.find({
    status: "Published",
    $or: [
      { title: { $in: regexPatterns } },
      { description: { $in: regexPatterns } },
      { category: { $in: regexPatterns } },
    ],
  })
    .populate("instructor", "name avatar")
    .select("_id title description category level thumbnail price instructor lessons")
    .limit(10)
    .lean();

  if (!courses || courses.length === 0) return [];

  const scored = courses.map((course) => {
    let score = 0;
    const title = (course.title || "").toLowerCase();
    const desc = (course.description || "").toLowerCase();
    const cat = (course.category || "").toLowerCase();

    termsToSearch.forEach((term) => {
      if (title.includes(term)) score += 10;
      if (cat.includes(term)) score += 8;
      if (desc.includes(term)) score += 4;
    });

    const instructorName = course.instructor?.name || "CraftLoop Creator";
    const lessonCount = Array.isArray(course.lessons) ? course.lessons.length : 0;

    const reason = `Covers ${course.category || "practical"} concepts with ${lessonCount} lessons structured for ${
      course.level || "all"
    } learners by ${instructorName}.`;

    return {
      id: course._id.toString(),
      title: course.title,
      description: course.description || "",
      category: course.category || "General",
      level: course.level || "Beginner",
      thumbnail: course.thumbnail || "",
      price: course.price || 0,
      creator: instructorName,
      creatorId: course.instructor?._id?.toString() || "",
      reason,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(({ score, ...item }) => item);
}

/**
 * Query actual projects from MongoDB Project collection
 */
async function searchRealProjects(intent) {
  const { keywords, primaryCategory, skills } = intent;

  const termsToSearch = Array.from(new Set([
    ...keywords,
    ...skills.map((s) => s.toLowerCase()),
    ...(primaryCategory ? [primaryCategory.toLowerCase()] : []),
  ])).filter((t) => t && t.length >= 2);

  if (termsToSearch.length === 0) return [];

  const regexPatterns = termsToSearch.map((t) => new RegExp(escapeRegex(t), "i"));

  const projects = await Project.find({
    status: "Published",
    $or: [
      { title: { $in: regexPatterns } },
      { description: { $in: regexPatterns } },
      { category: { $in: regexPatterns } },
      { tags: { $in: regexPatterns } },
      { tools: { $in: regexPatterns } },
    ],
  })
    .populate("creator", "name avatar")
    .select("_id title description category image tags tools demoUrl creator likes")
    .limit(10)
    .lean();

  if (!projects || projects.length === 0) return [];

  const scored = projects.map((project) => {
    let score = 0;
    const title = (project.title || "").toLowerCase();
    const desc = (project.description || "").toLowerCase();
    const cat = (project.category || "").toLowerCase();
    const tags = (project.tags || []).map((t) => t.toLowerCase());
    const tools = (project.tools || []).map((t) => t.toLowerCase());

    termsToSearch.forEach((term) => {
      if (title.includes(term)) score += 10;
      if (cat.includes(term)) score += 8;
      if (tags.some((t) => t.includes(term))) score += 6;
      if (tools.some((t) => t.includes(term))) score += 6;
      if (desc.includes(term)) score += 4;
    });

    const creatorName = project.creator?.name || "CraftLoop Creator";
    const toolsList = (project.tools || []).slice(0, 3).join(", ");
    const reason = `Demonstrates hands-on ${project.category || "creative"} work${
      toolsList ? ` built using ${toolsList}` : ""
    } by ${creatorName}.`;

    return {
      id: project._id.toString(),
      title: project.title,
      description: project.description || "",
      category: project.category || "General",
      image: project.image || "",
      tags: project.tags || [],
      tools: project.tools || [],
      creator: creatorName,
      creatorId: project.creator?._id?.toString() || "",
      reason,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(({ score, ...item }) => item);
}

/**
 * Intelligent AI Answer Generator
 * Produces structured, articulate, educational answers for any question,
 * while grounding answers with verified CraftLoop data when relevant.
 */
function generateAIAnswer(userMessage, intent, creators = [], courses = [], projects = []) {
  const query = (userMessage || "").toLowerCase().trim();
  const domain = intent.primaryDomainObject;
  const category = intent.primaryCategory || "Creative Arts & Technology";

  // 1. Detect query intent
  const isDefinitional =
    query.startsWith("what is") ||
    query.startsWith("what are") ||
    query.startsWith("tell me about") ||
    query.startsWith("explain") ||
    query.startsWith("define") ||
    query.includes("meaning of") ||
    query.includes("what does");

  const isHowToLearn =
    query.includes("how can i learn") ||
    query.includes("how to learn") ||
    query.includes("how do i learn") ||
    query.includes("how do i start") ||
    query.includes("where to start") ||
    query.includes("guide to learn") ||
    query.includes("how to become");

  const isSkillsQuery =
    query.includes("what skills") ||
    query.includes("which skills") ||
    query.includes("skills do i need") ||
    query.includes("skills needed") ||
    query.includes("skills required") ||
    query.includes("skills useful");

  const isCreatorSearch =
    query.includes("which creator") ||
    query.includes("what creator") ||
    query.includes("which craftloop creator") ||
    query.includes("who can help") ||
    query.includes("find a creator") ||
    query.includes("recommend a creator") ||
    query.includes("best creator") ||
    query.includes("learn from");

  const isYouTubeScenario =
    query.includes("youtube") &&
    (query.includes("edit") || query.includes("video") || query.includes("start"));

  let explanation = "";

  if (isYouTubeScenario && domain?.scenarioGuidance?.youtube) {
    explanation = domain.scenarioGuidance.youtube;
  } else if (isCreatorSearch && creators.length > 0) {
    const creatorList = creators
      .map((c) => `• ${c.name} (${c.title || "Creator"}): ${c.reason}`)
      .join("\n");
    explanation = `Here are verified ${category} creators on CraftLoop who can help you with your goal:\n\n${creatorList}\n\nYou can view their profiles, explore their courses, or connect with them directly on CraftLoop!`;
  } else if (isDefinitional && domain?.definition) {
    explanation = domain.definition;
  } else if (isHowToLearn && domain?.learningRoadmap) {
    explanation = domain.learningRoadmap;
  } else if (isSkillsQuery && domain?.skillsRoadmap) {
    explanation = domain.skillsRoadmap;
  } else if (domain) {
    explanation = `${domain.definition}\n\nRecommended Next Steps:\n${domain.nextSteps
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join("\n")}\n\nTools to explore: ${domain.tools.join(", ")}.`;
  } else {
    explanation = `Here is actionable guidance for "${intent.goal}":\n\nFocus on developing core fundamentals: ${
      intent.skills.slice(0, 4).join(", ") || "Creative Problem Solving, Tool Mastery, and Execution"
    }.\n\nNext Steps:\n1. Break your goal down into small, weekly practice milestones.\n2. Create hands-on projects to apply theoretical knowledge.\n3. Share your progress in the CraftLoop community for constructive feedback.`;
  }

  // Append CraftLoop recommendations if available
  const recSnippets = [];
  if (creators.length > 0 && !isCreatorSearch) {
    const creatorNames = creators.slice(0, 2).map((c) => `${c.name} (${c.title || "Creator"})`).join(", ");
    recSnippets.push(`👤 Recommended Creators: ${creatorNames}`);
  }
  if (courses.length > 0) {
    const courseTitles = courses.slice(0, 2).map((c) => `"${c.title}"`).join(", ");
    recSnippets.push(`📚 Recommended Courses: ${courseTitles}`);
  }

  if (recSnippets.length > 0) {
    explanation += `\n\n✨ Verified CraftLoop Platform Resources:\n${recSnippets.join("\n")}`;
  } else if (creators.length === 0 && courses.length === 0) {
    explanation += `\n\nI couldn't find any matching creators or courses in CraftLoop for "${intent.goal}" yet. Explore related skills in our community or check back as new creators publish content!`;
  }

  return explanation;
}

/**
 * Main AI Recommendation Orchestrator
 * Analyzes intent, fetches real MongoDB candidates, and produces structured recommendations.
 */
async function getRecommendations(userMessage, currentUser) {
  // 1. Extract intent & domains
  const intent = extractUserIntent(userMessage);

  // 2. Query actual MongoDB data
  const [creators, courses, projects] = await Promise.all([
    searchRealCreators(intent),
    searchRealCourses(intent),
    searchRealProjects(intent),
  ]);

  // 3. Compose rich, educational AI answer + verified CraftLoop data
  const message = generateAIAnswer(userMessage, intent, creators, courses, projects);

  // 4. Return strictly structured JSON
  return {
    success: true,
    message,
    intent: {
      goal: intent.goal,
      category: intent.primaryCategory || "General",
      skills: intent.skills,
    },
    creators,
    courses,
    projects,
    tools: intent.tools,
    nextSteps: intent.nextSteps,
    followUpPrompts: intent.followUpPrompts,
  };
}

module.exports = {
  getRecommendations,
  extractUserIntent,
  generateAIAnswer,
  searchRealCreators,
  searchRealCourses,
  searchRealProjects,
  DOMAIN_KNOWLEDGE,
};
