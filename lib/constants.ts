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

export const SOCIALS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/zaydhassan", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zaydhassan", icon: "linkedin" },
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