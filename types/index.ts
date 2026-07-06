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
  accent: "blue" | "purple" | "cyan";
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
  period: string;
  description: string;
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
};

export type SocialLink = {
  label: string;
  href: string;
  icon: string;
};
