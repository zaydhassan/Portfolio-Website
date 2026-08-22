"use client";

import { motion } from "motion/react";
import { Lightbulb, Compass, Code2, Rocket, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { STORY_STEPS } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import PremiumCard from "@/components/ui/PremiumCard";

const ICONS: LucideIcon[] = [Lightbulb, Compass, Code2, Rocket, TrendingUp];

const ACCENT_TEXT: Record<string, string> = {
  Think: "text-accent-cyan",
  Architect: "text-accent-blue",
  Build: "text-accent-purple",
  Ship: "text-accent-violet",
  Scale: "text-accent-cyan",
};

/* ----------------------------------------------------------------
   StoryFlow — the narrative bridge above the two-column grid:
   Think → Architect → Build → Ship → Scale. Five compact cards on a
   horizontal rail (desktop) / vertical stack (mobile), connected by an
   animated gradient line that draws in on reveal.
   ---------------------------------------------------------------- */
export default function StoryFlow() {
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      className="relative mt-14"
    >
      {/* Horizontal connector (desktop) */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportReveal}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute left-[10%] right-[10%] top-[3.25rem] hidden h-px origin-left bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-violet opacity-40 lg:block"
      />
      {/* Vertical connector (mobile) */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={viewportReveal}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute bottom-4 left-[1.9rem] top-4 w-px origin-top bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-violet opacity-40 block sm:hidden"
      />

      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
        {STORY_STEPS.map((step, i) => {
          const Icon = ICONS[i] ?? Lightbulb;
          return (
            <motion.div key={step.n} variants={fadeUp}>
              <PremiumCard
                magnetic={false}
                glare
                className="h-full p-5"
                accent="purple"
              >
                <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-semibold gradient-text">
                      {step.n}
                    </span>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-bg/60 ${
                        ACCENT_TEXT[step.title] ?? "text-accent-cyan"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-fg">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-fg-subtle">
                      {step.line}
                    </p>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}