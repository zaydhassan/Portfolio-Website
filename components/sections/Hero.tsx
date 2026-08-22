"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { ArrowDown, FolderGit2, Send } from "lucide-react";
import { HERO_HEADLINE, HERO_ROLES, HERO_SUMMARY } from "@/lib/data";
import { stagger, easeExpo } from "@/lib/animations/variants";
import MagneticButton from "@/components/ui/MagneticButton";
import RoleCycle from "@/components/ui/RoleCycle";
import HeroGlobe from "@/components/mobile/HeroGlobe";
import { useMediaQuery } from "@/hooks/use-media-query";

// Every above-the-fold hero element must be visible at first paint. The old
// wordReveal variant started at opacity:0, so the summary paragraph (the
// page's LCP element — larger than the headline) was invisible in the SSR
// HTML and only painted after hydration (~3.3s, when the framework chunk
// ran), pinning LCP to that late time. This variant keeps opacity at 1 so
// each element paints at FCP, and only slides it up a little for the
// entrance — the cinematic feel stays, LCP moves to first paint.
const revealVisible: Variants = {
  hidden: { opacity: 1, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeExpo } },
};

export default function Hero() {
  const words = HERO_HEADLINE.split(" ");

  // Desktop-only (>=768px). The 3D scene runs in a separate /hero route
  // loaded inside an <iframe>. Because the main page only references
  // "/hero" as a string — it never imports the scene — three.js is NOT in
  // the main page's chunk graph, so mobile never fetches/parses it. The
  // iframe is a separate document whose three.js load can't block this
  // page's first paint. The gradient fills the slot on mobile (and briefly
  // on desktop before the iframe scene paints) with zero layout shift.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-bg"
    >
      {/* 3D scene — desktop only, in an isolated route. On mobile a
          lightweight CSS-only globe fills the slot (see HeroGlobe) so the
          hero still has its signature visual without shipping three.js. */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-bg via-bg-elevated to-bg">
        {isDesktop ? (
          <iframe
            src="/hero"
            title="Hero 3D scene"
            aria-hidden="true"
            loading="eager"
            className="absolute inset-0 h-full w-full border-0 bg-bg"
          />
        ) : (
          <HeroGlobe />
        )}
      </div>

      {/* Top fade for navbar legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-bg to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-20 sm:px-10 sm:pt-28">
        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7"
        >
          {/* Headline — visible at first paint */}
          <motion.h1
            variants={revealVisible}
            className="max-w-5xl font-display text-[clamp(2.2rem,8vw,7rem)] font-semibold leading-[0.95] tracking-tight text-fg"
          >
            {words.map((word, i) => (
              <span key={i} className="mr-[0.28em] inline-block">
                {word === "Intelligent" || word === "Experiences." ? (
                  <span className="gradient-text">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </motion.h1>

          {/* Role cycler */}
          <motion.div variants={revealVisible}>
            <RoleCycle roles={HERO_ROLES} />
          </motion.div>

          {/* Summary — the page's LCP element, visible at first paint */}
          <motion.p
            variants={revealVisible}
            className="max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted sm:text-xl"
          >
            {HERO_SUMMARY}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={revealVisible}
            className="mt-2 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#work" variant="primary">
              <FolderGit2 className="h-4 w-4" />
              View Projects
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              <Send className="h-4 w-4" />
              Contact
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#work"
        data-cursor="link"
        data-cursor-label="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-fg-subtle md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/15">
          <motion.span
            className="mt-1.5 h-1.5 w-1 rounded-full bg-white"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: easeExpo }}
          />
        </span>
        <ArrowDown className="h-3 w-3 animate-bounce" />
      </motion.a>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
    </section>
  );
}