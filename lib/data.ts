import type {
  Experience,
  EducationItem,
  Project,
  Service,
  SkillCategory,
  Stat,
  AchievementCard,
  PhilosophyPrinciple,
  CurrentStatus,
  CurrentFocusItem,
} from "@/types";
import aiSqlAssistantImage from "@/public/projects/ai-sql-assistant.png";
import aiAutomationEngineImage from "@/public/projects/ai-automation-engine.png";
import futureSaasSuiteImage from "@/public/projects/future-saas-suite.png";

/* ============================================================
   Hero
   ============================================================ */
export const HERO_HEADLINE = "I Build Intelligent Digital Experiences.";
export const HERO_ROLES = [
  "AI Engineer",
  "Full-Stack Developer",
  "Automation Builder",
  "Software Engineer",
];
export const HERO_SUMMARY =
  "I design and ship AI-native products — from natural-language interfaces to autonomous automation — blending engineering rigor with cinematic interfaces that feel alive.";

/* ============================================================
   About
   ============================================================ */
export const ABOUT = {
  name: "Zayd Hassan",
  location: "Remote · Worldwide",
  bio: [
    "I'm an AI engineer and full-stack developer obsessed with the intersection of intelligence and interface — building systems that don't just work, but feel effortless.",
    "My focus is end-to-end delivery: production LLM applications, automation pipelines, and the polished front-ends that make them feel like products people love to use.",
    "When I'm not shipping, I'm studying the bleeding edge of agent architectures, motion design, and the craft of building software that feels premium.",
  ],
  mission:
    "To make intelligent software feel inevitable — beautiful, fast, and quietly powerful.",
  stats: [
    {
      label: "Years Learning",
      value: 4,
      suffix: "+",
      accent: "purple",
      tooltip: "Self-taught across AI, full-stack & cloud.",
    },
    {
      label: "Core Domains",
      value: 6,
      accent: "cyan",
      tooltip: "AI, full-stack, automation, cloud, UI & backend.",
    },
    {
      label: "GitHub Contributions",
      value: 500,
      suffix: "+",
      accent: "blue",
      tooltip: "Active across OSS & personal repos.",
    },
    {
      label: "Technologies",
      value: 30,
      suffix: "+",
      accent: "purple",
      tooltip: "From LLMs to Postgres to Three.js.",
    },
  ] as Stat[],
};

/* ============================================================
   Skills
   ============================================================ */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    icon: "code",
    accent: "cyan",
    skills: [
      { name: "TypeScript", level: 92 },
      { name: "Python", level: 92 },
      { name: "JavaScript (ES6+)", level: 90 },
      { name: "SQL", level: 86 },
      { name: "C++", level: 80 },
    ],
  },
  {
    title: "AI / ML",
    icon: "brain",
    accent: "purple",
    skills: [
      { name: "LLM Applications", level: 93 },
      { name: "LangChain / RAG", level: 88 },
      { name: "Prompt Engineering", level: 92 },
      { name: "OpenAI / Anthropic", level: 90 },
      { name: "AI Agents & Tool-Use", level: 86 },
      { name: "Vector Databases", level: 82 },
    ],
  },
  {
    title: "Frameworks",
    icon: "layout",
    accent: "blue",
    skills: [
      { name: "React.js / Next.js", level: 94 },
      { name: "Tailwind CSS", level: 92 },
      { name: "FastAPI", level: 88 },
      { name: "Node.js / Express.js", level: 88 },
      { name: "Redux / Zustand", level: 86 },
      { name: "REST / GraphQL APIs", level: 86 },
    ],
  },
  {
    title: "Cloud / DevOps",
    icon: "cloud",
    accent: "cyan",
    skills: [
      { name: "AWS (EC2/S3/Lambda/RDS)", level: 84 },
      { name: "Terraform", level: 78 },
      { name: "Kubernetes", level: 74 },
      { name: "CI/CD (GitHub Actions)", level: 82 },
      { name: "n8n Workflow Automation", level: 85 },
      { name: "Git / GitHub", level: 93 },
    ],
  },
  {
    title: "Databases",
    icon: "database",
    accent: "blue",
    skills: [
      { name: "PostgreSQL", level: 88 },
      { name: "Prisma", level: 86 },
      { name: "Neon (Serverless PG)", level: 84 },
      { name: "MongoDB", level: 82 },
      { name: "Firebase", level: 82 },
      { name: "MySQL", level: 80 },
    ],
  },
  {
    title: "Core / Fundamentals",
    icon: "wrench",
    accent: "purple",
    skills: [
      { name: "Data Structures & Algorithms", level: 76 },
      { name: "System Design", level: 84 },
      { name: "Auth & Authorization", level: 86 },
      { name: "Logging & Monitoring", level: 82 },
      { name: "Unit Testing", level: 80 },
      { name: "Agile / SDLC", level: 86 },
    ],
  },
];

/* ============================================================
   Projects
   ============================================================ */
export const PROJECTS: Project[] = [
  {
    slug: "ai-sql-assistant",
    image: aiSqlAssistantImage,
    title: "AI SQL Assistant",
    tagline: "Natural language → optimized SQL.",
    description:
      "A production SaaS that converts natural language into optimized, executable SQL. Features JWT authentication, Stripe subscription billing, schema-aware context, and a real-time query editor with explain-plan insights.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Stripe", "LLMs"],
    github: "https://github.com/zaydhassan/sql-assistant",
    demo: "https://sql-assistant-c410.onrender.com",
    accent: "purple",
    year: "2025",
    status: "live",
    category: "AI SaaS · Production",
    highlights: [
      "Natural-language → optimized SQL with schema-aware context",
      "JWT auth and Stripe subscription billing, end-to-end",
      "Real-time editor with explain-plan insights and saved queries",
    ],
    metrics: [
      { label: "Query latency", value: "−40%" },
      { label: "Auth", value: "JWT" },
      { label: "Billing", value: "Stripe" },
    ],
  },
  {
    slug: "ai-automation-engine",
    image: aiAutomationEngineImage,
    title: "AI Automation Engine",
    tagline: "Self-running workflows that act on intent.",
    description:
      "An automation platform that chains LLMs, tool calls, and triggers into resilient background workflows — turning repetitive business processes into self-healing pipelines.",
    tags: ["Python", "LangChain", "n8n", "Redis", "OpenAI"],
    github: "https://github.com/zaydhassan/automation-engine",
    accent: "cyan",
    year: "2025",
    status: "shipped",
    category: "Automation Platform",
    highlights: [
      "Chained LLMs with tool-use into self-healing pipelines",
      "Event-driven triggers via webhooks, n8n, and queues",
      "Cut manual workload on repetitive processes by ~80%",
    ],
    metrics: [
      { label: "Workflows", value: "12+" },
      { label: "Uptime", value: "99.9%" },
      { label: "Latency", value: "<2s" },
    ],
  },
  {
    slug: "future-saas-suite",
    image: futureSaasSuiteImage,
    title: "Future SaaS Suite",
    tagline: "A portfolio of upcoming AI-native products.",
    description:
      "A roadmap of AI-native SaaS products in active development — agent dashboards, autonomous research tools, and intelligent analytics surfaces designed for the next decade of work.",
    tags: ["Next.js", "AI", "SaaS", "Agents"],
    comingSoon: true,
    accent: "blue",
    year: "2026",
    status: "build",
    category: "Product Suite · Roadmap",
    highlights: [
      "Agent dashboards and autonomous research tools",
      "Intelligent analytics surfaces for the next decade of work",
      "Shipping roadmap through 2026",
    ],
    metrics: [
      { label: "Status", value: "In Build" },
      { label: "Launch", value: "2026" },
    ],
  },
];

export const SHOWCASE_PROJECTS: Project[] = [
  {
    slug: "agentflow-ai",
    image: aiAutomationEngineImage,
    title: "AgentFlowAI",
    tagline: "Agentic workflows that plan, execute, and self-heal.",
    description:
      "An agentic AI automation platform designed to orchestrate intelligent workflows — chaining LLMs, tool calls, and triggers into resilient, multi-step pipelines with built-in observability. Currently in active development and not yet deployed.",
    tags: ["LangGraph", "Python", "FastAPI", "Redis", "OpenAI", "WebSockets"],
    github: "https://github.com/zaydhassan/automation-engine",
    accent: "cyan",
    year: "2026",
    status: "build",
    category: "AI Automation · Flagship",
    highlights: [
      "Visual graph editor for multi-agent workflow orchestration",
      "Self-healing pipelines with retry, fallback, and human-in-the-loop",
      "Run telemetry, traces, and per-step replay for observability",
    ],
    metrics: [
      { label: "Status", value: "In Development" },
      { label: "Type", value: "Agentic AI" },
      { label: "Phase", value: "Active Build" },
    ],
  },
  {
    slug: "novanest-ai",
    title: "NovaNest-AI",
    tagline: "An AI-powered career operating system.",
    description:
      "An AI-powered career operating system that turns your career journey into an intelligent, actionable workspace. NovaNest AI brings career insights, resume intelligence, interview preparation, application tracking, and an AI career companion into one personalized platform.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Stripe", "LLMs"],
    accent: "purple",
    year: "2026",
    status: "shipped",
    category: "AI SaaS · Career Tech",
    highlights: [
      "AI Career Twin that mirrors and models your career trajectory",
      "Career Command Center uniting insights, readiness, and applications",
      "Resume intelligence with scoring and tailored optimization",
      "Interview preparation powered by personalized AI coaching",
      "Application tracking across every role and stage",
      "AI Copilot and Smart Workspace for daily career actions",
    ],
    metrics: [
      { label: "Platform", value: "Career OS" },
      { label: "AI", value: "Twin + Copilot" },
      { label: "Modules", value: "8+" },
    ],
  },
  {
    slug: "inkwell",
    title: "Inkwell",
    tagline: "A full-stack publishing platform for modern web content.",
    description:
      "A full-stack web application for creating, managing, and discovering blog content — built on the MERN stack with authentication, a database-backed content model, and a responsive editorial interface that shows end-to-end product engineering beyond AI systems.",
    tags: ["React", "Node.js", "Express.js", "MongoDB"],
    accent: "orange",
    year: "2026",
    status: "shipped",
    category: "Full-Stack Web Application",
    highlights: [
      "Content creation and blog publishing over a database-backed model",
      "Authentication and user management for writers and readers",
      "Responsive, editorial-style UI built for reading and writing",
    ],
    metrics: [
      { label: "Stack", value: "MERN" },
      { label: "Type", value: "Full-Stack" },
      { label: "Status", value: "Live" },
    ],
  },
];

/* ============================================================
   Experience & Education
   ============================================================ */
export const EXPERIENCES: Experience[] = [
  {
    role: "Advanced Associate Software Engineer",
    company: "Accenture",
    logo: "/logos/accenture.svg",
    employmentType: "Full-Time",
    period: "May 2026 — Present",
    location: "Chennai, Tamil Nadu, India",
    current: true,
    description:
      "Full-stack and AI engineering for enterprise software at scale — shipping cloud-native features and modern development practices across global delivery teams.",
    highlights: [
      "Engineering full-stack features across enterprise platforms with cloud-native, AI-augmented workflows",
      "Applying modern development practices — CI/CD, code review, and test discipline — across distributed delivery",
      "Contributing to AI and automation workstreams that weave LLM capabilities into enterprise software",
      "Shipping production-grade features with performance, security, and observability as first-class concerns",
    ],
    stack: ["Full Stack", "AI Engineering", "Cloud", "Enterprise Software", "Agentic AI", "Multi-agent Systems"],
    accent: "purple",
  },
  {
    role: "Freelance Web Developer",
    company: "Independent / Freelance",
    logo: "/logos/freelance.svg",
    employmentType: "Freelance",
    period: "Sep 2025 — Dec 2025",
    location: "Remote",
    description:
      "Delivered a production-ready business website end-to-end — from responsive design and SEO to performance tuning and client handoff.",
    highlights: [
      "Built and delivered a production-ready WordPress business website for an Australian migration consultancy, improving online presence and lead credibility for international users.",
      "Optimized on-page SEO and Core Web Vitals, lifting search visibility and load performance",
      "Engineered the site for scalability and maintainability so the client could extend content without dev support",
      "Owned client collaboration end-to-end — scoping, iteration, and final handoff",
    ],
    stack: ["WordPress", "SEO", "Responsive Design", "Performance", "Client Collaboration"],
    accent: "cyan",
  },
  {
    role: "Software Developer",
    company: "Polysia Tech",
    logo: "/logos/polysia.jpg",
    employmentType: "Full-Time",
    period: "Sep 2024 — Mar 2025",
    location: "Noida, India",
    description:
      "Built React + Python features for a production web app — owning UI development, MongoDB data flows, and performance tuning across Agile sprints.",
    highlights: [
      "Developed responsive web applications using React, Python, and MongoDB, achieving 95%+ Lighthouse performance scores.",
      "Partnered with UI/UX designers & product managers in Agile sprints to deliver production-ready components ahead of deadlines.",
      "Resolved 30+ cross-browser compatibility issues, boosting mobile compatibility from 75% to 98%.",
      "Conducted code reviews ensuring maintainability, scalability, and best practices.",
    ],
    stack: ["React", "Python", "MongoDB", "REST APIs", "Agile"],
    accent: "blue",
  },
  {
    role: "Software Developer Intern",
    company: "Bluestock",
    logo: "/logos/bluestock.jpg",
    employmentType: "Internship",
    period: "Jul 2024 — Sep 2024",
    location: "Pune, India",
    description:
      "Contributed to a fintech web app across Python, Java, and React — fixing bugs, automating workflows, and shipping Tailwind-styled UI.",
    highlights: [
      "Developed an IPO-focused web app using Django and deployed RESTful APIs for real-time investor updates.",
      "Set up CI/CD pipelines via GitHub Actions, reducing deployment errors by 30%.",
      "Performed root cause analysis and implemented lasting fixes for production issues.",
      "Improved UI consistency with Tailwind CSS and responsive component work",
    ],
    stack: ["Python", "Java", "React", "Tailwind CSS", "REST APIs", "Automation"],
    accent: "cyan",
  },
  {
    role: "Software Developer Intern",
    company: "Afame Technologies",
    logo: "/logos/afame.jpg",
    employmentType: "Internship",
    period: "May 2024 — Jul 2024",
    location: "Bengaluru, India",
    description:
      "Built modular React components and Python automation — fixing bugs and accelerating delivery with reusable, well-structured code.",
    highlights: [
      "Engineered a modular automation framework with Python & Java, cutting manual QA time by 25%.",
      "Developed reusable UI components in React & Tailwind CSS, reducing duplicate code by 25%.",
      "Logged and resolved over 20+ critical bugs, ensuring seamless production without delays.",
      "Collaborated with the team on testing, review, and handoff",
    ],
    stack: ["Python", "React", "Automation", "REST APIs", "Git"],
    accent: "purple",
  },
  {
    role: "Frontend Developer Intern",
    company: "Origin Tech",
    logo: "/logos/origin.jpg",
    employmentType: "Internship",
    period: "Mar 2023 — May 2023",
    location: "Mumbai, India",
    description:
      "Built responsive React UIs in an Agile team — iterating on components, debugging with Chrome DevTools, and shipping clean frontend work.",
    highlights: [
      "Developed responsive React components and UI features within an Agile workflow",
      "Used Chrome DevTools to profile, debug, and optimize front-end performance",
      "Collaborated on UI development with designers and backend integration",
      "Shipped clean, accessible, cross-browser frontend work",
    ],
    stack: ["React", "JavaScript", "Tailwind CSS", "Chrome DevTools", "Agile"],
    accent: "blue",
  },
];

export const EDUCATION: EducationItem[] = [
  {
    title: "Bachelor of Technology, Computer Science and Engineering",
    org: "SRM Institute of Science and Technology, KTR, Chennai, TN",
    period: "2020 — 2024",
    description:
      "Foundations in algorithms, systems, and software engineering with a focus on applied AI.",
  },
];

export const CERTIFICATES: EducationItem[] = [
  {
    title: "AI Engineering Specialization",
    org: "DeepLearning.AI",
    period: "2024",
    description: "LLM application architecture, RAG, and agentic systems.",
  },
  {
    title: "Full-Stack Development",
    org: "Meta / Coursera",
    period: "2023",
    description: "Production front-end and back-end engineering practices.",
  },
  {
    title: "Cloud Foundations",
    org: "AWS Academy",
    period: "2023",
    description: "Core cloud infrastructure, deployment, and DevOps.",
  },
  {
    title: "Reinvention with Agentic AI",
    org: "Accenture",
    period: "2025",
    description: "Designing, building, and orchestrating autonomous AI agent systems.",
  },
];

export const ACHIEVEMENTS: string[] = [
  "Shipped a production AI SaaS with real users and Stripe billing",
  "Cut production query latency by 40% through schema + pooling work",
  "Automated 12+ business workflows end-to-end",
  "Self-taught across AI, full-stack, and cloud — 4+ years deep",
];

/* ============================================================
   About — narrative flow (Think → Architect → Build → Ship → Scale)
   ============================================================ */
export const STORY_STEPS = [
  {
    n: "01",
    title: "Think",
    line: "Frame the real problem before touching code.",
  },
  {
    n: "02",
    title: "Architect",
    line: "Design resilient systems, not just features.",
  },
  {
    n: "03",
    title: "Build",
    line: "Ship type-safe, tested, performant code.",
  },
  {
    n: "04",
    title: "Ship",
    line: "Deploy with CI/CD, monitoring, and observability.",
  },
  {
    n: "05",
    title: "Scale",
    line: "Harden, optimize, and grow with confidence.",
  },
] as const;

/* ============================================================
   About — interactive achievement cards
   ============================================================ */
export const ACHIEVEMENT_CARDS: AchievementCard[] = [
  {
    title: "Production AI SaaS with paying users",
    challenge:
      "Non-technical users needed natural-language access to SQL without learning syntax or risking bad queries.",
    solution:
      "Built a schema-aware LLM app with JWT auth, Stripe subscription billing, and a real-time explain-plan editor.",
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "Stripe", "LLMs"],
    outcome: "Real users, paid subscriptions, and a smooth live editor.",
    accent: "purple",
    projectSlug: "ai-sql-assistant",
  },
  {
    title: "Cut query latency by 40%",
    challenge:
      "Slow queries degraded the real-time editor UX under load.",
    solution:
      "Added schema caching, connection pooling, and explain-plan insights to surface bottlenecks.",
    technologies: ["PostgreSQL", "FastAPI", "Redis"],
    outcome: "−40% latency; the editor stayed fluid under concurrent use.",
    accent: "cyan",
    projectSlug: "ai-sql-assistant",
  },
  {
    title: "Automated 12+ business workflows",
    challenge:
      "Repetitive manual processes drained team time and invited human error.",
    solution:
      "Chained LLMs with tool-use into self-healing, event-driven pipelines via webhooks, n8n, and queues.",
    technologies: ["Python", "LangChain", "n8n", "Redis", "OpenAI"],
    outcome: "~80% reduction in manual workload across processes.",
    accent: "cyan",
    projectSlug: "ai-automation-engine",
  },
  {
    title: "4+ years self-taught across the stack",
    challenge:
      "No formal AI program — needed real depth, fast, across a wide surface area.",
    solution:
      "Structured self-study across AI engineering, full-stack delivery, and cloud infrastructure.",
    technologies: ["AI", "Full-Stack", "Cloud"],
    outcome: "Shipping production AI products end-to-end, independently.",
    accent: "purple",
  },
];

/* ============================================================
   About — engineering philosophy
   ============================================================ */
export const PHILOSOPHY: PhilosophyPrinciple[] = [
  {
    title: "Solve real problems",
    description: "Build products that matter, not demos.",
  },
  {
    title: "Automation over repetition",
    description: "If it's done twice, it should run itself.",
  },
  {
    title: "Performance over complexity",
    description: "Fast and simple beats clever and slow.",
  },
  {
    title: "AI should augment people",
    description: "Intelligence should empower, not replace.",
  },
  {
    title: "Elegant UX is engineering",
    description: "How it feels is part of how it works.",
  },
];

/* ============================================================
   About — currently building (rotating live status)
   ============================================================ */
export const CURRENTLY_BUILDING: CurrentStatus[] = [
  { emoji: "🚀", label: "AI Automation Platform" },
  { emoji: "📍", label: "Available for Freelance" },
];

/* ============================================================
   About — current focus (active focus-area chips)
   ============================================================ */
export const CURRENT_FOCUS: CurrentFocusItem[] = [
  { label: "Agentic AI", accent: "cyan" },
  { label: "LLM Engineering", accent: "violet" },
  { label: "Automation Systems", accent: "blue" },
  { label: "Next.js", accent: "purple" },
  { label: "FastAPI", accent: "cyan" },
  { label: "Cloud Architecture", accent: "violet" },
  { label: "AI SaaS", accent: "blue" },
  { label: "Developer Experience", accent: "purple" },
];

/* ============================================================
   Services
   ============================================================ */
export const SERVICES: Service[] = [
  {
    title: "Full-Stack Development",
    description:
      "End-to-end product engineering — from schema to deploy — with Next.js, FastAPI, and modern infrastructure.",
    icon: "code",
    features: ["Next.js + FastAPI", "Auth & billing", "Type-safe APIs", "CI/CD"],
  },
  {
    title: "AI Applications",
    description:
      "Production LLM apps: RAG, agents, natural-language interfaces, and intelligent features wired into your data.",
    icon: "brain",
    features: ["RAG pipelines", "Agent systems", "Tool-use", "Vector search"],
  },
  {
    title: "Automation",
    description:
      "Self-running workflows that combine LLMs, triggers, and tool calls to eliminate repetitive work.",
    icon: "workflow",
    features: ["LLM chains", "Event triggers", "n8n / queues", "Self-healing"],
  },
  {
    title: "Cloud & Backend APIs",
    description:
      "Scalable backends, infrastructure, and APIs designed for reliability, observability, and speed.",
    icon: "cloud",
    features: ["PostgreSQL", "Docker / Vercel", "Redis caching", "Observability"],
  },
  {
    title: "UI Engineering",
    description:
      "Cinematic, accessible interfaces with motion design and 3D that feel like flagship products.",
    icon: "sparkles",
    features: ["Motion design", "Three.js / R3F", "Design systems", "A11y"],
  },
  {
    title: "Backend APIs",
    description:
      "Clean, documented, type-safe REST and GraphQL APIs with caching, validation, and rate limiting.",
    icon: "server",
    features: ["REST / GraphQL", "Validation", "Rate limiting", "Docs"],
  },
];
