import type { StaticImageData } from "next/image";

export type NavItem = {
  label: string;
  href: string;
};

export type Skill = {
  name: string;
  level: number; // 0 - 100
  icon?: string;
};

export type SkillCategory = {
  title: string;
  icon: string;
  accent: "blue" | "purple" | "cyan";
  skills: Skill[];
};

export type ProjectStatus = "live" | "shipped" | "build";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Optional screenshot shown in the launch card visual. */
  image?: string | StaticImageData;
  github?: string;
  demo?: string;
  comingSoon?: boolean;
  accent: "blue" | "purple" | "cyan" | "orange";
  year: string;
  /** Launch narrative fields — used by the cinematic showcase. */
  status?: ProjectStatus;
  category?: string;
  highlights?: string[];
  metrics?: { label: string; value: string }[];
};

export type Experience = {
  role: string;
  company: string;
  /** Path (served from /public) to the company logo — lazy-loaded, animated on scroll. */
  logo: string;
  /** Employment type label — "Full-Time" | "Internship" | "Freelance" … */
  employmentType: string;
  period: string;
  location: string;
  /** Whether this role is ongoing — drives the live "Present" indicator. */
  current?: boolean;
  /** Short impact summary shown on the collapsed card. */
  description: string;
  /** Key Contributions — revealed inside the expandable section. */
  highlights: string[];
  stack: string[];
  accent: "blue" | "purple" | "cyan";
};

export type EducationItem = {
  title: string;
  org: string;
  period: string;
  description: string;
};

export type Service = {
  title: string;
  description: string;
  icon: string;
  features: string[];
};

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  /** Optional accent for interactive stat tiles. */
  accent?: "blue" | "purple" | "cyan";
  /** Optional one-line tooltip revealed on hover. */
  tooltip?: string;
  /** Optional slug of a linked project (resolves against PROJECTS). */
  projectSlug?: string;
};

/** A rich, expandable achievement card (replaces the plain bullet list). */
export type AchievementCard = {
  title: string;
  challenge: string;
  solution: string;
  technologies: string[];
  outcome: string;
  accent: "blue" | "purple" | "cyan";
  /** Optional slug of a related project. */
  projectSlug?: string;
};

/** A single engineering-philosophy principle. */
export type PhilosophyPrinciple = {
  title: string;
  description: string;
};

/** A rotating "currently building" status line. */
export type CurrentStatus = {
  emoji: string;
  label: string;
};

/** A focus-area chip for the "Current focus" block. */
export type CurrentFocusItem = {
  label: string;
  accent: "blue" | "purple" | "cyan" | "violet";
};

export type SocialLink = {
  label: string;
  href: string;
  icon: string;
};
