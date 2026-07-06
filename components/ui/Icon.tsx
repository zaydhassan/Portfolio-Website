"use client";

import {
  Layout,
  Brain,
  Server,
  Cloud,
  Database,
  Wrench,
  Code,
  Workflow,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  FileText,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  layout: Layout,
  brain: Brain,
  server: Server,
  cloud: Cloud,
  database: Database,
  wrench: Wrench,
  code: Code,
  workflow: Workflow,
  sparkles: Sparkles,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  resume: FileText,
};

export default function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp className={className} />;
}