import type {
  Experience,
  EducationItem,
  Project,
  Service,
  SkillCategory,
  Stat,
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
    { label: "Years Learning", value: 4, suffix: "+" },
    { label: "Projects Shipped", value: 20, suffix: "+" },
    { label: "GitHub Contributions", value: 900, suffix: "+" },
    { label: "Technologies", value: 30, suffix: "+" },
  ] as Stat[],
};

/* ============================================================
   Skills
   ============================================================ */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    icon: "layout",
    accent: "cyan",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Tailwind CSS", level: 94 },
      { name: "Framer Motion", level: 88 },
      { name: "Three.js / R3F", level: 80 },
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
      { name: "Vector Databases", level: 82 },
    ],
  },
  {
    title: "Backend",
    icon: "server",
    accent: "blue",
    skills: [
      { name: "Python / FastAPI", level: 92 },
      { name: "Node.js / Express", level: 88 },
      { name: "REST / GraphQL", level: 86 },
      { name: "PostgreSQL", level: 88 },
      { name: "Redis", level: 78 },
    ],
  },
  {
    title: "Cloud / DevOps",
    icon: "cloud",
    accent: "cyan",
    skills: [
      { name: "Docker", level: 85 },
      { name: "Vercel", level: 92 },
      { name: "AWS", level: 76 },
      { name: "CI/CD", level: 82 },
      { name: "Supabase", level: 84 },
    ],
  },
  {
    title: "Databases",
    icon: "database",
    accent: "blue",
    skills: [
      { name: "PostgreSQL", level: 88 },
      { name: "MongoDB", level: 80 },
      { name: "Pinecone / pgvector", level: 82 },
      { name: "Supabase", level: 84 },
      { name: "Prisma", level: 86 },
    ],
  },
  {
    title: "Tools & Languages",
    icon: "wrench",
    accent: "purple",
    skills: [
      { name: "Python", level: 92 },
      { name: "TypeScript", level: 92 },
      { name: "Git", level: 93 },
      { name: "Figma", level: 78 },
      { name: "n8n / Zapier", level: 85 },
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

/* ============================================================
   Experience & Education
   ============================================================ */
export const EXPERIENCES: Experience[] = [
  {
  
    role: "Software Developer Intern",
    company: "[Company name] · Remote",
    period: "[dates TBD]",
    description:
      "Built high-performance web applications and shipped production-ready components across Agile sprints, with automated cloud deployment and monitoring.",
    highlights: [
      "Created high-performance web applications, achieving 95%+ Lighthouse performance scores",
      "Delivered production-ready components across Agile sprints, accelerating feature releases by 20%",
      "Automated deployments and monitoring using AWS (Lambda, S3, CloudWatch) and CI/CD via GitHub Actions, increasing reliability",
    ],
    stack: ["AWS", "Lambda", "S3", "CloudWatch", "GitHub Actions"],
    accent: "purple",
  },
  {
    role: "Software Development Intern",
    company: "Bluestock Fintech · Remote",
    period: "July 2024 — September 2024",
    description:
      "Developed an IPO-focused web app with Django, deploying RESTful APIs for real-time investor updates and CI/CD-driven releases.",
    highlights: [
      "Developed an IPO-focused web app using Django and deployed RESTful APIs for real-time investor updates",
      "Set up CI/CD pipelines via GitHub Actions, reducing deployment errors by 30%",
    ],
    stack: ["Django", "REST", "GitHub Actions", "Python"],
    accent: "cyan",
  },
  {
    role: "Frontend Development Intern",
    company: "Afame Technologies · Remote",
    period: "May 2024 — July 2024",
    description:
      "Streamlined a Python-based QA framework and modular UI components to cut manual testing effort.",
    highlights: [
      "Streamlined a Python-based QA framework and modular UI components, cutting manual testing time by 25%",
    ],
    stack: ["Python", "QA Automation", "TypeScript"],
    accent: "blue",
  },
  {
    role: "Full-Stack Engineer",
    company: "Freelance / Independent",
    period: "2024 — Present",
    description:
      "Shipping end-to-end AI-powered SaaS products for clients — from auth and billing to natural-language features and deployment.",
    highlights: [
      "Built an AI SQL Assistant SaaS with JWT auth and Stripe subscriptions",
      "Designed REST APIs with FastAPI backed by PostgreSQL, cutting query latency 40%",
      "Owned delivery from schema design to CI/CD to production deploy",
    ],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Stripe", "Docker"],
    accent: "purple",
  },
  {
    role: "AI Automation Builder",
    company: "Personal Projects",
    period: "2024 — Present",
    description:
      "Designing autonomous workflows that combine LLMs, tool calls, and triggers into resilient pipelines.",
    highlights: [
      "Chained LLMs with tool-use into self-healing automation pipelines",
      "Integrated n8n, webhooks, and queues for event-driven execution",
      "Reduced manual workload on repetitive business processes by ~80%",
    ],
    stack: ["Python", "LangChain", "n8n", "Redis", "OpenAI"],
    accent: "cyan",
  },
  {
    role: "Backend Developer",
    company: "Personal Projects",
    period: "2023 — 2024",
    description:
      "Built and deployed a portfolio of full-stack applications focused on developer tooling and structured-data interfaces.",
    highlights: [
      "Developed natural-language interfaces over structured data",
      "Implemented CI/CD pipelines with automated testing",
      "Owned end-to-end delivery from schema design to deployment",
    ],
    stack: ["Python", "TypeScript", "PostgreSQL", "Redis"],
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
];

export const ACHIEVEMENTS: string[] = [
  "Shipped a production AI SaaS with real users and Stripe billing",
  "Cut production query latency by 40% through schema + pooling work",
  "Automated 12+ business workflows end-to-end",
  "Self-taught across AI, full-stack, and cloud — 4+ years deep",
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

export const STATS: Stat[] = [
  { label: "Projects Shipped", value: 20, suffix: "+" },
  { label: "GitHub Contributions", value: 940, suffix: "+" },
  { label: "Technologies", value: 30, suffix: "+" },
  { label: "Years Learning", value: 4, suffix: "+" },
];
