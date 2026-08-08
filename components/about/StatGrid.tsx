"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ABOUT, PROJECTS } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import { useMediaQuery } from "@/hooks/use-media-query";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import PremiumCard from "@/components/ui/PremiumCard";

/* ----------------------------------------------------------------
   StatGrid — the 2×2 interactive stat tiles. Each tile is a
   PremiumCard with an animated counter; on hover (desktop) or always
   (touch, where hover is unavailable) it reveals a one-line tooltip
   and, when a stat links to a project, a "→ {project}" affordance.
   ---------------------------------------------------------------- */
export default function StatGrid() {
  const coarse = useMediaQuery("(pointer: coarse)");

  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      className="grid grid-cols-2 gap-3"
    >
      {ABOUT.stats.map((s) => {
        const project = s.projectSlug
          ? PROJECTS.find((p) => p.slug === s.projectSlug)
          : undefined;
        return (
          <motion.div key={s.label} variants={fadeUp}>
            <PremiumCard
              accent={s.accent ?? "purple"}
              magnetic={false}
              glare
              className="h-full p-4"
            >
              <div className="font-display text-3xl font-semibold gradient-text">
                <AnimatedCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </div>
              <div className="mt-1 text-xs text-fg-subtle">{s.label}</div>

              {/* Tooltip + linked project: hover on desktop, always on touch */}
              {(s.tooltip || project) && (
                <div
                  className={`mt-2 ${
                    coarse ? "opacity-100" : "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  }`}
                >
                  {s.tooltip && (
                    <p className="text-[11px] leading-snug text-fg-subtle">
                      {s.tooltip}
                    </p>
                  )}
                  {project && (
                    <a
                      href="#work"
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-accent-cyan transition-colors hover:text-accent-violet"
                    >
                      {project.title}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </PremiumCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}