"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import LazySection from "@/components/ui/LazySection";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SocialRail from "@/components/ui/SocialRail";
import BackToTop from "@/components/ui/BackToTop";

// Below-the-fold sections are dynamically imported (ssr: false) and only
// mounted by <LazySection> when scrolled near. This keeps their JS — each
// section pulls in Framer Motion, icons, and its own logic — out of the
// initial parse/execute path, so the first viewport and LCP don't compete
// with Projects/Skills/Experience/.../Footer for main-thread time on slow
// mobile CPUs. Every section already animates itself in with `whileInView`,
// so there's no flash when a section mounts just before it's visible.

const Marquee = dynamic(() => import("@/components/ui/Marquee"), {
  ssr: false,
  loading: () => null,
});
const Projects = dynamic(() => import("@/components/sections/Projects"), {
  ssr: false,
  loading: () => null,
});
const Skills = dynamic(() => import("@/components/sections/Skills"), {
  ssr: false,
  loading: () => null,
});
const Experience = dynamic(() => import("@/components/sections/Experience"), {
  ssr: false,
  loading: () => null,
});
const Services = dynamic(() => import("@/components/sections/Services"), {
  ssr: false,
  loading: () => null,
});
const Assistant = dynamic(() => import("@/components/sections/Assistant"), {
  ssr: false,
  loading: () => null,
});
const Footer = dynamic(() => import("@/components/sections/Footer"), {
  ssr: false,
  loading: () => null,
});
const Divider = dynamic(() => import("@/components/ui/Divider"), {
  ssr: false,
  loading: () => null,
});

const TECH = [
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "OpenAI",
  "LangChain",
  "RAG",
  "Docker",
  "AWS",
  "Three.js",
  "Framer Motion",
];

// Rough pre-mount heights to reserve space (avoids CLS before each section's
// own layout runs). These are conservative mobile estimates; the real layout
// replaces them once the section mounts.
const H = {
  marquee: 80,
  projects: 1800,
  skills: 1200,
  experience: 1400,
  services: 1100,
  assistant: 900,
  footer: 420,
} as const;

export default function Home() {
  return (
    <main id="main" className="relative flex w-full flex-col">
      <ScrollProgress />
      <SocialRail />
      <BackToTop />
      <Hero />
      <LazySection minHeight={H.marquee}>
        <Marquee items={TECH} className="border-y border-hairline py-6" duration={45} />
      </LazySection>
      <LazySection minHeight={H.projects}>
        <Projects />
      </LazySection>
      <LazySection minHeight={1}>
        <Divider />
      </LazySection>
      <LazySection minHeight={H.skills}>
        <Skills />
      </LazySection>
      <LazySection minHeight={1}>
        <Divider />
      </LazySection>
      <LazySection minHeight={H.experience}>
        <Experience />
      </LazySection>
      <LazySection minHeight={1}>
        <Divider />
      </LazySection>
      <LazySection minHeight={H.services}>
        <Services />
      </LazySection>
      <LazySection minHeight={H.assistant}>
        <Assistant />
      </LazySection>
      <LazySection minHeight={H.footer}>
        <Footer />
      </LazySection>
    </main>
  );
}