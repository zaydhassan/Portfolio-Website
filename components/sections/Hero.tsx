"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowDown, FolderGit2, Download, Send } from "lucide-react";
import { HERO_HEADLINE, HERO_ROLES, HERO_SUMMARY } from "@/lib/data";
import { wordReveal, stagger, easeExpo } from "@/lib/animations/variants";
import MagneticButton from "@/components/ui/MagneticButton";
import RoleCycle from "@/components/ui/RoleCycle";
import { SITE } from "@/lib/constants";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const words = HERO_HEADLINE.split(" ");

  // Parallax: headline drifts slightly with pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });
  const headlineX = useTransform(px, (v) => v * -12);
  const headlineY = useTransform(py, (v) => v * -8);

  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section
      id="home"
      onMouseMove={onMove}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-bg"
    >
      {/* 3D scene */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Top fade for navbar legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-bg to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 sm:px-10">
        <motion.div
          variants={stagger(0.08, 0.2)}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7"
        >
          {/* Eyebrow */}
          <motion.div
            variants={wordReveal}
            className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-fg-subtle"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
            </span>
            Available for new work · 2026
          </motion.div>

          {/* Headline */}
          <motion.h1
            style={{ x: headlineX, y: headlineY }}
            className="max-w-5xl font-display text-[clamp(2.6rem,8vw,7rem)] font-semibold leading-[0.95] tracking-tight text-fg"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordReveal}
                className="mr-[0.28em] inline-block"
              >
                {word === "Intelligent" || word === "Experiences." ? (
                  <span className="gradient-text">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          {/* Role cycler */}
          <motion.div variants={wordReveal}>
            <RoleCycle roles={HERO_ROLES} />
          </motion.div>

          {/* Summary */}
          <motion.p
            variants={wordReveal}
            className="max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted sm:text-xl"
          >
            {HERO_SUMMARY}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={wordReveal}
            className="mt-2 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#work" variant="primary">
              <FolderGit2 className="h-4 w-4" />
              View Projects
            </MagneticButton>
            <MagneticButton href={SITE.resume} variant="ghost">
              <Download className="h-4 w-4" />
              Download Resume
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