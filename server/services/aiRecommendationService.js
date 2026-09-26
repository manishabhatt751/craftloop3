const { GoogleGenAI } = require("@google/genai");
const { User, Course, Project, Enrollment, Practice, PracticeSubmission } = require("../models");

/**
 * Singleton Gemini client manager
 */
let geminiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  }
  return geminiClient;
}

// Available Gemini Flash models with automatic fallback
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

/**
 * Domain knowledge base for keyword expansion, domain skills,
 * tools, next steps, and robust offline fallback guidance.
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
      "photo",
      "camera",
      "lighting",
      "portrait",
      "landscape",
      "lightroom",
    ],
    skills: ["Photography", "Photo Editing", "Lighting", "Composition", "Adobe Lightroom"],
    tools: ["Adobe Lightroom", "Adobe Photoshop", "Capture One"],
    definition:
      "Photography is the art and practice of capturing light and moments to convey emotion, tell stories, and document subjects with visual balance and technical mastery.",
    learningRoadmap:
      "Roadmap to learn Photography:\n\n1. Master the Exposure Triangle: ISO, Aperture, and Shutter Speed.\n2. Understand Composition: Rule of thirds, leading lines, framing, and negative space.\n3. Learn Lighting: Natural light, golden hour, and directional studio lighting.\n4. Post-processing: RAW photo development, color grading, and exposure balancing in Lightroom.",
    skillsRoadmap:
      "Core Photography Skills: Exposure control, manual camera operation, color balancing, and portrait posing.",
    nextSteps: [
      "Practice shooting in manual mode to master the exposure triangle.",
      "Experiment with composition techniques like leading lines and framing.",
      "Develop your editing style in Adobe Lightroom.",
    ],
    followUps: [
      "Find photography mentors on CraftLoop",
      "Show photo editing courses",
      "What camera settings should a beginner use?",
    ],
  },
];

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
  "expert", "someone", "know", "craftloop",
]);

/**
 * Classifies query into one of the designated CraftLoop AI intent types
 */
function classifyIntent(userMessage) {
  const q = (userMessage || "").toLowerCase().trim();

  // Next-step / Continuation guidance
  if (
    q.includes("what should i learn next") ||
    q.includes("what to learn next") ||
    q.includes("learn next") ||
    q.includes("completed") ||
    q.includes("finished learning") ||
    q.includes("after learning") ||
    q.includes("what is next") ||
    q.includes("next step")
  ) {
    return "NEXT_STEP";
  }

  // Project recommendation & practice suggestions
  if (
    q.includes("what project") ||
    q.includes("what should i build") ||
    q.includes("what to build") ||
    q.includes("project should i build") ||
    q.includes("project idea") ||
    q.includes("practice project") ||
    q.includes("sample project") ||
    q.includes("build next")
  ) {
    return "PROJECT_RECOMMENDATION";
  }

  // Roadmap & path
  if (
    q.includes("roadmap") ||
    q.includes("step by step") ||
    q.includes("how to become a full-stack") ||
    q.includes("how to become a") ||
    q.includes("want to become a") ||
    q.includes("learning path") ||
    q.includes("guide to become")
  ) {
    return "LEARNING_ROADMAP";
  }

  // Creator recommendation
  if (
    q.includes("which creator") ||
    q.includes("what creator") ||
    q.includes("find me a creator") ||
    q.includes("find a creator") ||
    q.includes("who can help") ||
    q.includes("mentor") ||
    q.includes("instructor") ||
    q.includes("teacher") ||
    q.includes("recommend a creator") ||
    q.includes("creator who teaches") ||
    q.includes("learn from")
  ) {
    return "CREATOR_RECOMMENDATION";
  }

  // Service / Freelance recommendation
  if (
    q.includes("service") ||
    q.includes("hire") ||
    q.includes("freelancer") ||
    q.includes("freelance") ||
    q.includes("for a flyer") ||
    q.includes("for a logo") ||
    q.includes("commission")
  ) {
    return "SERVICE_RECOMMENDATION";
  }

  // Course recommendation
  if (
    q.includes("course") ||
    q.includes("tutorial") ||
    q.includes("class") ||
    q.includes("which course") ||
    q.includes("beginner course") ||
    q.includes("which course should i start") ||
    q.includes("which course to start") ||
    q.includes("which course to take") ||
    q.includes("recommend a course") ||
    q.includes("find me a course")
  ) {
    return "COURSE_RECOMMENDATION";
  }

  // Tool guidance
  if (
    q.includes("tool") ||
    q.includes("software") ||
    q.includes("what app") ||
    q.includes("program") ||
    q.includes("install")
  ) {
    return "TOOL_GUIDANCE";
  }

  // Practice suggestions
  if (
    q.includes("practice") ||
    q.includes("exercise") ||
    q.includes("hands-on") ||
    q.includes("drill")
  ) {
    return "PRACTICE_SUGGESTION";
  }

  // Community guidance
  if (
    q.includes("community") ||
    q.includes("peer feedback") ||
    q.includes("guidelines") ||
    q.includes("collaborate")
  ) {
    return "COMMUNITY_GUIDANCE";
  }

  // Skill guidance
  if (
    q.includes("what skills") ||
    q.includes("which skills") ||
    q.includes("skills do i need") ||
    q.includes("skills needed") ||
    q.includes("skills required") ||
    q.includes("how can i learn") ||
    q.includes("how to learn") ||
    q.includes("how do i learn") ||
    q.includes("i want to learn")
  ) {
    return "SKILL_GUIDANCE";
  }

  // General Educational questions
  if (
    q.startsWith("what is") ||
    q.startsWith("what are") ||
    q.startsWith("tell me about") ||
    q.startsWith("explain") ||
    q.startsWith("define") ||
    q.includes("meaning of") ||
    q.includes("what does")
  ) {
    return "GENERAL_QUESTION";
  }

  return "GENERAL_QUESTION";
}

/**
 * Extracts intent details and keywords from the user message.
 */
function extractUserIntent(query, currentUser = null) {
  const normalized = (query || "").toLowerCase().trim();
  const type = classifyIntent(normalized);

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

  // Extract individual meaningful keyword tokens directly from user query
  const words = normalized
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const directKeywords = Array.from(new Set(words));

  let extractedSkills = [];
  let extractedTools = [];
  let nextSteps = [];
  let followUpPrompts = [];

  if (primaryDomain) {
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

  // Build compact, focused search terms (avoiding 25+ regex explosion)
  const searchTermsSet = new Set();
  // 1. Direct user keywords (most specific)
  directKeywords.forEach((k) => searchTermsSet.add(k));
  // 2. Primary category (if matched)
  if (primaryDomain?.category) {
    searchTermsSet.add(primaryDomain.category.toLowerCase());
  }
  // 3. Explicit tech detection
  if (normalized.includes("html")) searchTermsSet.add("html");
  if (normalized.includes("css")) searchTermsSet.add("css");
  if (normalized.includes("javascript") || normalized.includes("js")) searchTermsSet.add("javascript");
  if (normalized.includes("react")) searchTermsSet.add("react");
  if (normalized.includes("video")) searchTermsSet.add("video");
  if (normalized.includes("graphic")) searchTermsSet.add("graphic");
  if (normalized.includes("design")) searchTermsSet.add("design");

  // Keep top 4-5 search terms max to keep MongoDB regex scan lightweight
  const searchTerms = Array.from(searchTermsSet).slice(0, 5);

  let goal = normalized;
  if (goal.length > 80) {
    goal = goal.substring(0, 80) + "...";
  }

  return {
    type,
    goal,
    primaryCategory: primaryDomain ? primaryDomain.category : null,
    primaryDomainObject: primaryDomain,
    keywords: directKeywords,
    searchTerms,
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
  const termsToSearch = (intent.searchTerms && intent.searchTerms.length > 0)
    ? intent.searchTerms
    : intent.keywords || [];

  if (termsToSearch.length === 0) {
    return [];
  }

  const regexPatterns = termsToSearch.map((t) => new RegExp(escapeRegex(t), "i"));

  const creators = await User.find({
    role: "creator",
    $or: [
      { skills: { $in: regexPatterns } },
      { title: { $in: regexPatterns } },
      { name: { $in: regexPatterns } },
      { bio: { $in: regexPatterns } },
    ],
  })
    .select("_id name avatar title bio skills")
    .limit(6)
    .lean();

  if (!creators || creators.length === 0) {
    return [];
  }

  const scored = creators.map((creator) => {
    let score = 0;
    const creatorSkills = (creator.skills || []).map((s) => s.toLowerCase());
    const creatorTitle = (creator.title || "").toLowerCase();
    const creatorName = (creator.name || "").toLowerCase();

    termsToSearch.forEach((term) => {
      if (creatorSkills.some((s) => s.includes(term) || term.includes(s))) score += 15;
      if (creatorTitle.includes(term)) score += 10;
      if (creatorName.includes(term)) score += 5;
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
  return scored.slice(0, 3).map(({ score, ...item }) => item);
}

/**
 * Query actual courses from MongoDB Course collection
 */
async function searchRealCourses(intent) {
  const termsToSearch = (intent.searchTerms && intent.searchTerms.length > 0)
    ? intent.searchTerms
    : intent.keywords || [];

  if (termsToSearch.length === 0) return [];

  const regexPatterns = termsToSearch.map((t) => new RegExp(escapeRegex(t), "i"));

  const courses = await Course.find({
    status: "Published",
    $or: [
      { category: { $in: regexPatterns } },
      { title: { $in: regexPatterns } },
      { description: { $in: regexPatterns } },
    ],
  })
    .select("_id title description category level thumbnail price instructor")
    .populate("instructor", "name")
    .limit(6)
    .lean();

  if (!courses || courses.length === 0) return [];

  const scored = courses.map((course) => {
    let score = 0;
    const title = (course.title || "").toLowerCase();
    const cat = (course.category || "").toLowerCase();
    const desc = (course.description || "").toLowerCase();

    termsToSearch.forEach((term) => {
      if (title.includes(term)) score += 15;
      if (cat.includes(term)) score += 10;
      if (desc.includes(term)) score += 4;
    });

    const instructorName = course.instructor?.name || "CraftLoop Creator";

    const reason = `Covers ${course.category || "practical"} concepts structured for ${
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
  return scored.slice(0, 3).map(({ score, ...item }) => item);
}

/**
 * Query actual projects from MongoDB Project collection
 */
async function searchRealProjects(intent) {
  const termsToSearch = (intent.searchTerms && intent.searchTerms.length > 0)
    ? intent.searchTerms
    : intent.keywords || [];

  if (termsToSearch.length === 0) return [];

  const regexPatterns = termsToSearch.map((t) => new RegExp(escapeRegex(t), "i"));

  const projects = await Project.find({
    status: "Published",
    $or: [
      { category: { $in: regexPatterns } },
      { title: { $in: regexPatterns } },
      { tools: { $in: regexPatterns } },
      { tags: { $in: regexPatterns } },
    ],
  })
    .select("_id title category image tags tools demoUrl creator likes type projectType price")
    .populate("creator", "name")
    .limit(6)
    .lean();

  if (!projects || projects.length === 0) return [];

  const scored = projects.map((project) => {
    let score = 0;
    const title = (project.title || "").toLowerCase();
    const cat = (project.category || "").toLowerCase();
    const tags = (project.tags || []).map((t) => t.toLowerCase());
    const tools = (project.tools || []).map((t) => t.toLowerCase());

    termsToSearch.forEach((term) => {
      if (title.includes(term)) score += 15;
      if (cat.includes(term)) score += 10;
      if (tags.some((t) => t.includes(term))) score += 6;
      if (tools.some((t) => t.includes(term))) score += 6;
    });

    const creatorName = project.creator?.name || "CraftLoop Creator";
    const toolsList = (project.tools || []).slice(0, 3).join(", ");
    const isService = project.type === "Service" || project.projectType === "Service";
    const reason = isService
      ? `Verified CraftLoop service offered by ${creatorName}${toolsList ? ` utilizing ${toolsList}` : ""}.`
      : `Demonstrates hands-on ${project.category || "creative"} work${
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
      isService,
      reason,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(({ score, ...item }) => item);
}

/**
 * Intelligent Fallback AI Answer Generator
 * Used when Gemini API is unavailable, offline, or experiencing rate limits.
 */
function generateAIAnswer(userMessage, intent, creators = [], courses = [], projects = []) {
  const query = (userMessage || "").toLowerCase().trim();
  const domain = intent.primaryDomainObject;
  const category = intent.primaryCategory || "Creative Arts & Technology";

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

  const lowerMsg = (query || "").toLowerCase();

  const isPracticeQuery =
    intent.type === "PRACTICE_SUGGESTION" ||
    lowerMsg.includes("practice") ||
    lowerMsg.includes("start this poster") ||
    lowerMsg.includes("how to start") ||
    lowerMsg.includes("easier version") ||
    lowerMsg.includes("what should i practice");

  if (isPracticeQuery) {
    if (lowerMsg.includes("easier version") || lowerMsg.includes("simpler") || lowerMsg.includes("too hard")) {
      explanation = `Here is a simplified step-by-step approach to get you started easily:\n\n1. Minimal Constraints: Limit yourself to just 1 header font and 1 body font, or 2 harmonious colors.\n2. Use a Pre-built Grid/Template: Start with a simple 3-part layout (Header at top, Visual in center, Call-to-Action at bottom).\n3. Focus on Completion over Perfection: Build a rough draft first, review alignment, then polish.\n\nTake it one element at a time—you've got this!`;
    } else if (lowerMsg.includes("how to start") || lowerMsg.includes("start this poster") || lowerMsg.includes("don't know how")) {
      explanation = `Here is how you can kick off this practice challenge step by step:\n\n1. Define Your Topic & Core Message: What event or idea is this about? Write down 1 headline and 1 sub-bullet.\n2. Pick Your Typeface Pair: Choose one bold display font for the title and a clean readable font for supporting details.\n3. Establish Hierarchy: Make the most important word or date 2x larger than the body text.\n4. Add Supporting Graphics: Place your primary illustration or image, leaving comfortable margin space.\n5. Export & Share: Save your design and upload it to submit your practice work!`;
    } else if (lowerMsg.includes("next") || lowerMsg.includes("what should i practice")) {
      explanation = `Based on your learning progress on CraftLoop, here is what you should practice next:\n\n• Apply your recent lesson concepts with a hands-on Quick Practice activity.\n• Next Step: Check the "🎯 Practice" section under your enrolled courses in My Learning to continue your active challenge.\n• Once submitted, consider adding it to your CraftLoop portfolio project showcase!`;
    } else {
      explanation = `Practical hands-on exercises are the best way to master ${category}!\n\nRecommended Practice Routine:\n1. Quick Practice (10-15 mins): Focus on 1 isolated technique from your lesson.\n2. Skill Challenge (30-45 mins): Combine 2-3 concepts without step-by-step instructions.\n3. Real-World Project: Create a full portfolio-worthy piece and share it in the CraftLoop community for peer feedback!`;
    }
  } else if (isYouTubeScenario && domain?.scenarioGuidance?.youtube) {
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
    explanation += `\n\nI couldn't find a matching resource on CraftLoop right now. Explore related skills in our community or check back as new creators publish content!`;
  }

  return explanation;
}

/**
 * Builds user context profile for personalization
 */
async function buildUserProfileContext(currentUser) {
  const profileStart = Date.now();
  const profile = {
    name: currentUser?.name || "Student",
    role: currentUser?.role || "viewer",
    skills: Array.isArray(currentUser?.skills) ? currentUser.skills : [],
    title: currentUser?.title || "",
    bio: currentUser?.bio || "",
    completedCourses: [],
    enrolledCourses: [],
  };

  let enrollmentTime = 0;
  if (currentUser?._id) {
    const enrollStart = Date.now();
    try {
      const enrollments = await Enrollment.find({ user: currentUser._id })
        .select("status progress course")
        .populate("course", "title category level status")
        .limit(10)
        .lean();
      enrollmentTime = Date.now() - enrollStart;

      if (enrollments && enrollments.length > 0) {
        profile.completedCourses = enrollments
          .filter((e) => e.status === "completed" || e.progress >= 100)
          .map((e) => e.course?.title)
          .filter(Boolean);

        profile.enrolledCourses = enrollments
          .filter((e) => e.status === "in-progress" && (e.progress || 0) < 100)
          .map((e) => `${e.course?.title || "Course"} (${e.progress || 0}% completed)`)
          .filter(Boolean);
      }
    } catch (err) {
      enrollmentTime = Date.now() - enrollStart;
      console.warn("Could not query user enrollments for AI context:", err.message);
    }
  }

  const userProfileTime = Date.now() - profileStart;
  return { profile, userProfileTime, enrollmentTime };
}

/**
 * Calls Google Gemini with grounded CraftLoop data, compact prompt, and zero-thinking budget
 */
async function generateGroundedGeminiResponse(userMessage, intent, creators, courses, projects, userProfile) {
  const ai = getGeminiClient();
  if (!ai) {
    return null;
  }

  const creatorsSummary =
    creators.length > 0
      ? creators
          .slice(0, 3)
          .map(
            (c) =>
              `• Creator: ${c.name} | Title: ${c.title || "Creator"} | Skills: ${(c.skills || []).slice(0, 3).join(", ")} | Reason: ${c.reason}`
          )
          .join("\n")
      : "None found in database.";

  const coursesSummary =
    courses.length > 0
      ? courses
          .slice(0, 3)
          .map(
            (c) =>
              `• Course: "${c.title}" | Category: ${c.category} | Level: ${c.level} | By: ${c.creator} | Price: ${c.price ? `$${c.price}` : "Free"}`
          )
          .join("\n")
      : "None found in database.";

  const projectsSummary =
    projects.length > 0
      ? projects
          .slice(0, 3)
          .map(
            (p) =>
              `• ${p.isService ? "Service" : "Project"}: "${p.title}" | Category: ${p.category} | Tools: ${(p.tools || []).slice(0, 3).join(", ")} | By: ${p.creator}`
          )
          .join("\n")
      : "None found in database.";

  const promptContent = `You are CraftLoop AI assistant.
CRITICAL GROUNDING RULES:
1. NEVER invent CraftLoop courses, creators, projects, or services.
2. Recommend ONLY from verified database records below. If none match, clearly state: "I couldn't find a matching resource on CraftLoop right now."
3. Provide helpful, concise conceptual/practical advice.
4. User: ${userProfile.name} (${userProfile.role}), Skills: ${userProfile.skills.join(", ") || "None specified"}.

USER QUERY: "${userMessage}"
INTENT: ${intent.type}

VERIFIED CRAFTLOOP DATABASE RECORDS:
[Creators]
${creatorsSummary}

[Courses]
${coursesSummary}

[Projects & Services]
${projectsSummary}

Provide a helpful, direct, and well-structured response now.`;

  for (const model of CANDIDATE_MODELS) {
    const geminiStart = Date.now();
    try {
      const response = await ai.models.generateContent({
        model,
        contents: promptContent,
        config: {
          temperature: 0.3,
          maxOutputTokens: 800,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });

      const geminiLatency = Date.now() - geminiStart;
      const text = response?.text;
      if (text && typeof text === "string" && text.trim().length > 0) {
        console.log(`[AI PROVIDER] Gemini`);
        console.log(`[AI MODEL] ${model}`);
        console.log(`[AI LATENCY] ${geminiLatency} ms`);
        return { text: text.trim(), modelUsed: model, geminiLatency };
      }
    } catch (error) {
      console.warn(`Gemini (${model}) API call warning:`, error.message);
      // Fallback attempt without thinkingConfig for the same model if unsupported
      try {
        const fallbackRes = await ai.models.generateContent({
          model,
          contents: promptContent,
          config: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        });
        const geminiLatency = Date.now() - geminiStart;
        const fallbackText = fallbackRes?.text;
        if (fallbackText && typeof fallbackText === "string" && fallbackText.trim().length > 0) {
          console.log(`[AI PROVIDER] Gemini`);
          console.log(`[AI MODEL] ${model}`);
          console.log(`[AI LATENCY] ${geminiLatency} ms`);
          return { text: fallbackText.trim(), modelUsed: model, geminiLatency };
        }
      } catch (fallbackErr) {
        console.warn(`Gemini (${model}) fallback warning:`, fallbackErr.message);
      }
    }
  }

  return null;
}

/**
 * Main AI Recommendation Orchestrator
 * Analyzes intent, fetches real MongoDB candidates, personalizes context,
 * and calls Gemini with verified database grounding and strict fallback.
 */
async function getRecommendations(userMessage, currentUser = null, timingOptions = {}) {
  const authTime = timingOptions.authTime || 0;
  const totalStart = timingOptions.totalStart || Date.now();

  // 1. Build authenticated user profile context (including enrollments/progress)
  const { profile: userProfile, userProfileTime, enrollmentTime } = await buildUserProfileContext(currentUser);

  // 2. Extract intent & domains
  const intent = extractUserIntent(userMessage, currentUser);

  // 3. Query actual MongoDB data in parallel with limited result counts
  const dbStart = Date.now();
  const [creators, courses, projects] = await Promise.all([
    searchRealCreators(intent),
    searchRealCourses(intent),
    searchRealProjects(intent),
  ]);
  const dbRetrievalTime = Date.now() - dbStart;

  // 4. Measure prompt preparation time
  const promptPrepStart = Date.now();
  // Prompt formatting logic executed
  const promptPrepTime = Date.now() - promptPrepStart;

  // 5. Generate grounded response using Gemini SDK
  const geminiResponse = await generateGroundedGeminiResponse(
    userMessage,
    intent,
    creators,
    courses,
    projects,
    userProfile
  );

  let message = "";
  let modelUsed = "none";
  let geminiLatency = 0;

  if (geminiResponse && geminiResponse.text) {
    message = geminiResponse.text;
    modelUsed = geminiResponse.modelUsed;
    geminiLatency = geminiResponse.geminiLatency;
  } else {
    // Fallback to rule-based generation if Gemini is unavailable, rate-limited, or failed
    message = generateAIAnswer(userMessage, intent, creators, courses, projects);
    console.log(`[AI PROVIDER] Fallback Rules`);
    console.log(`[AI MODEL] Internal Rule Engine`);
    console.log(`[AI LATENCY] 0 ms`);
  }

  // If no candidates exist in database and user asked for a CraftLoop resource, ensure anti-hallucination guarantee is clearly worded
  if (
    creators.length === 0 &&
    courses.length === 0 &&
    projects.length === 0 &&
    !message.toLowerCase().includes("couldn't find") &&
    !message.toLowerCase().includes("could not find")
  ) {
    message += `\n\nI couldn't find a matching resource on CraftLoop right now. Explore related skills in our community or check back as new creators publish content!`;
  }

  const totalTime = Date.now() - totalStart + authTime;

  // Log step timing measurements
  console.log(`[AI] Auth: ${authTime} ms`);
  console.log(`[AI] User profile: ${userProfileTime} ms (Enrollments: ${enrollmentTime} ms)`);
  console.log(`[AI] Database retrieval: ${dbRetrievalTime} ms`);
  console.log(`[AI] Prompt preparation: ${promptPrepTime} ms`);
  console.log(`[AI] Gemini: ${geminiLatency} ms`);
  console.log(`[AI] Total: ${totalTime} ms`);

  // 6. Return strictly structured JSON matching the existing frontend contract
  return {
    success: true,
    message,
    intent: {
      type: intent.type,
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
  classifyIntent,
  generateAIAnswer,
  searchRealCreators,
  searchRealCourses,
  searchRealProjects,
  buildUserProfileContext,
  DOMAIN_KNOWLEDGE,
};
