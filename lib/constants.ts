import type { NavItem, SocialLink } from "@/types";

export const SITE = {
  name: "Zayd Hassan",
  role: "AI Engineer · Full-Stack Developer",
  title: "Zayd Hassan — AI Engineer & Full-Stack Developer",
  description:
    "I build intelligent digital experiences — AI applications, automation systems, and production-grade SaaS products engineered with Next.js, FastAPI, and the modern AI stack.",
  url: "https://zaydhassan.dev",
  email: "zaydthirteen@gmail.com",
  resume: "/resume.pdf",
  locale: "en_US",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/**
 * Mobile "AI OS" navigation — the 8 items shown inside the AIMenu panel.
 * Mapped to existing in-page sections (Projects→#work, Journey→#about).
 * `assistant` items are highlighted CTAs that scroll to #contact.
 * `icon` is a key into the Icon.tsx MAP; `accent` picks the per-tile color.
 */
export type MobileNavAccent = "cyan" | "blue" | "purple" | "violet" | "electric";

export type MobileNavItem = NavItem & {
  icon: string;
  accent: MobileNavAccent;
  description: string;
  assistant?: boolean;
};

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "Home", href: "#home", icon: "home", accent: "cyan", description: "Start here" },
  { label: "Projects", href: "#work", icon: "rocket", accent: "blue", description: "AI products and SaaS" },
  { label: "Skills", href: "#skills", icon: "zap", accent: "electric", description: "Technologies I use" },
  { label: "Experience", href: "#experience", icon: "brain", accent: "purple", description: "Career timeline" },
  { label: "Journey", href: "#about", icon: "journey", accent: "violet", description: "My path so far" },
  { label: "Services", href: "#services", icon: "services", accent: "blue", description: "What I can build" },
  {
    label: "AI Assistant",
    href: "#contact",
    icon: "assistant",
    accent: "cyan",
    description: "Talk with my AI",
    assistant: true,
  },
  { label: "Contact", href: "#contact", icon: "send", accent: "violet", description: "Let's build together" },
];

/**
 * Quick Action chips — short cuts shown beneath the AI greeting. `href`
 * starting with `#` runs the in-page bloom-scroll; everything else opens
 * externally (resume PDF / GitHub) in a new tab.
 */
export const QUICK_ACTIONS: { label: string; href: string; icon: string; accent: MobileNavAccent }[] = [
  { label: "Resume", href: SITE.resume, icon: "resume", accent: "electric" },
  { label: "Projects", href: "#work", icon: "rocket", accent: "blue" },
  { label: "Hire Me", href: "#contact", icon: "send", accent: "violet" },
  { label: "GitHub", href: "https://github.com/zaydhassan", icon: "github", accent: "purple" },
  { label: "AI Assistant", href: "#contact", icon: "assistant", accent: "cyan" },
  { label: "Contact", href: "#contact", icon: "mail", accent: "violet" },
];

/** Rotating live-status lines shown above the CTA. */
export const LIVE_STATUS: string[] = [
  "Available for Freelance",
  "Building AI Products",
  "Currently shipping NeuralOS",
];

export const SOCIALS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/zaydhassan", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zayd-hassan-a06105213", icon: "linkedin" },
  { label: "Email", href: `mailto:${SITE.email}`, icon: "mail" },
  { label: "Resume", href: "/resume.pdf", icon: "resume" },
];

export const SECTIONS = [
  "home",
  "work",
  "about",
  "skills",
  "experience",
  "services",
  "contact",
] as const;