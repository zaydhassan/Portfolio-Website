"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { SKILL_CATEGORIES } from "@/lib/data";
import { fadeUp, stagger, viewportReveal, easeExpo } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import RadialProgress from "@/components/ui/RadialProgress";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const SkillCore = dynamic(() => import("@/components/three/SkillCore"), {
  ssr: false,
  loading: () => null,
});

const ACCENT_TEXT = {
  cyan: "text-accent-cyan",
  purple: "text-accent-violet",
  blue: "text-accent-blue",
} as const;

const ACCENT_GLOW = {
  cyan: "shadow-[0_0_60px_-12px_rgba(34,211,238,0.55)]",
  purple: "shadow-[0_0_60px_-12px_rgba(168,85,247,0.55)]",
  blue: "shadow-[0_0_60px_-12px_rgba(59,130,246,0.55)]",
} as const;

export default function Skills() {
  const [active, setActive] = useState(0);
  const category = SKILL_CATEGORIES[active];

  // Don't create the second WebGL context (and its Three.js chunk work) at
  // page load — the Skills section is far below the fold. Mount the canvas
  // only once it nears the viewport. Visually identical: it appears as you
  // scroll to it, and the 200px rootMargin means it's ready before visible.
  const coreWrapRef = useRef<HTMLDivElement>(null);
  const [coreMounted, setCoreMounted] = useState(false);
  useEffect(() => {
    const el = coreWrapRef.current;
    if (!el) return;
    if (coreMounted) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCoreMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [coreMounted]);

  return (
    <section id="skills" className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 sm:py-36">
      <SectionHeading
        eyebrow="Capabilities"
        title={
          <>
            A full <span className="gradient-text">AI-native</span> toolchain.
          </>
        }
        description="From cinematic front-ends to production LLM back-ends and the automation that ties it together — one engineer, the whole stack."
      />

      {/* Category pills */}
      <motion.div
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportReveal}
        className="mt-12 flex flex-wrap gap-2"
      >
        {SKILL_CATEGORIES.map((cat, i) => {
          const isActive = i === active;
          return (
            <motion.button
              key={cat.title}
              variants={fadeUp}
              onClick={() => setActive(i)}
              data-cursor="link"
              className={cn(
                "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                isActive ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="skill-pill"
                  className={cn(
                    "absolute inset-0 rounded-full border border-hairline bg-surface-3",
                    ACCENT_GLOW[cat.accent],
                  )}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon name={cat.icon} className={cn("h-4 w-4", isActive && ACCENT_TEXT[cat.accent])} />
                {cat.title}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Showcase grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* 3D skill core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportReveal}
          transition={{ duration: 0.9, ease: easeExpo }}
          className="group relative aspect-square overflow-hidden rounded-3xl border border-hairline bg-bg-elevated/40 lg:aspect-auto"
        >
          <div ref={coreWrapRef} className="absolute inset-0">
            {coreMounted && <SkillCore accent={category.accent} />}
          </div>

          {/* Soft vignette */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl [box-shadow:inset_0_0_120px_40px_rgba(0,0,0,0.65)]" />

          {/* Overlay label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-6">
            <div className="flex w-full items-center justify-between text-xs uppercase tracking-[0.25em] text-fg-subtle">
              <span className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                </span>
                Skill Core
              </span>
              <span className="font-mono">{String(active + 1).padStart(2, "0")} / {String(SKILL_CATEGORIES.length).padStart(2, "0")}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: easeExpo }}
                className="text-center"
              >
                <div className={cn("font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl")}>
                  {category.title}
                </div>
                <div className={cn("mt-1 text-sm", ACCENT_TEXT[category.accent])}>
                  {category.skills.length} core skills
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bento skill rings */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={category.title}
              variants={stagger(0.07)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3"
            >
              {category.skills.map((skill, i) => {
                const featured = i === 0;
                return (
                  <motion.div
                    key={skill.name}
                    variants={fadeUp}
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-hairline bg-surface-1 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-hairline-strong",
                      featured && "sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-7 lg:col-span-1 lg:flex-col",
                    )}
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                        category.accent === "cyan" && "bg-accent-cyan/20",
                        category.accent === "purple" && "bg-accent-violet/20",
                        category.accent === "blue" && "bg-accent-blue/20",
                      )}
                    />
                    <RadialProgress
                      value={skill.level}
                      accent={category.accent}
                      size={featured ? 84 : 64}
                    />
                    <div className="relative">
                      <div className={cn("text-sm font-medium text-fg", featured && "sm:text-base")}>
                        {skill.name}
                      </div>
                      <div className="mt-0.5 text-[11px] uppercase tracking-wider text-fg-subtle">
                        {skill.level >= 90 ? "Expert" : skill.level >= 80 ? "Advanced" : "Proficient"}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer note */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportReveal}
        className="mt-8 text-center text-sm text-fg-subtle"
      >
        Tap a category to reconfigure the core · proficiency self-assessed
      </motion.p>
    </section>
  );
}