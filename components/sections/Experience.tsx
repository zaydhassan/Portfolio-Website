"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Briefcase, GraduationCap, Award } from "lucide-react";
import {
  EXPERIENCES,
  EDUCATION,
  CERTIFICATES,
} from "@/lib/data";
import { fadeUp, stagger, viewportReveal, easeExpo } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const accentDot = {
  cyan: "bg-accent-cyan",
  purple: "bg-accent-violet",
  blue: "bg-accent-blue",
} as const;

const accentGlow = {
  cyan: "shadow-[0_0_24px_-2px_rgba(34,211,238,0.7)]",
  purple: "shadow-[0_0_24px_-2px_rgba(168,85,247,0.7)]",
  blue: "shadow-[0_0_24px_-2px_rgba(59,130,246,0.7)]",
} as const;

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 80%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="experience"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading
        eyebrow="Experience"
        title={
          <>
            A path of <span className="gradient-text">building</span>, shipping & learning.
          </>
        }
        description="Roles, education, and certifications — the foundation beneath the work."
      />

      <div ref={containerRef} className="relative mt-16 pl-8 sm:pl-12">
        {/* Track */}
        <div className="absolute left-0 top-0 h-full w-px bg-hairline sm:left-4">
          <motion.div
            className="absolute left-0 top-0 h-full w-full origin-top bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-violet"
            style={{ scaleY: lineScale }}
          />
        </div>

        {/* Roles */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="flex flex-col gap-12"
        >
          {EXPERIENCES.map((exp) => (
            <motion.div key={exp.role + exp.company} variants={fadeUp} className="relative">
              <span
                className={cn(
                  "absolute -left-8 top-1.5 grid h-4 w-4 place-items-center rounded-full sm:-left-12",
                  accentDot[exp.accent],
                  accentGlow[exp.accent],
                )}
              >
                <Briefcase className="h-2.5 w-2.5 text-bg" />
              </span>
              <TimelineItem
                title={exp.role}
                org={exp.company}
                period={exp.period}
                description={exp.description}
                highlights={exp.highlights}
                stack={exp.stack}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Education */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="mt-12 flex flex-col gap-8"
        >
          {EDUCATION.map((ed) => (
            <motion.div key={ed.title} variants={fadeUp} className="relative">
              <span className="absolute -left-8 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-accent-blue shadow-[0_0_24px_-2px_rgba(59,130,246,0.7)] sm:-left-12">
                <GraduationCap className="h-2.5 w-2.5 text-bg" />
              </span>
              <TimelineItem
                title={ed.title}
                org={ed.org}
                period={ed.period}
                description={ed.description}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Certificates */}
        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="relative mt-14 mb-6 text-sm font-medium uppercase tracking-[0.2em] text-fg-subtle"
        >
          <span className="absolute -left-8 top-0 grid h-4 w-4 place-items-center rounded-full bg-accent-violet shadow-[0_0_24px_-2px_rgba(168,85,247,0.7)] sm:-left-12">
            <Award className="h-2.5 w-2.5 text-bg" />
          </span>
          Certifications
        </motion.h3>
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {CERTIFICATES.map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              className="rounded-2xl border border-hairline bg-surface-1 p-5 transition-colors duration-300 hover:border-hairline-strong"
            >
              <div className="text-xs text-fg-subtle">{c.period}</div>
              <div className="mt-2 font-display text-base font-medium text-fg">
                {c.title}
              </div>
              <div className="text-sm text-fg-muted">{c.org}</div>
              <p className="mt-3 text-sm leading-relaxed text-fg-subtle">
                {c.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TimelineItem({
  title,
  org,
  period,
  description,
  highlights,
  stack,
}: {
  title: string;
  org: string;
  period: string;
  description: string;
  highlights?: string[];
  stack?: string[];
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group rounded-2xl border border-hairline bg-surface-1 p-6 transition-colors duration-300 hover:border-hairline-strong sm:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-semibold text-fg sm:text-2xl">
          {title}
        </h3>
        <span className="font-mono text-xs text-fg-subtle">{period}</span>
      </div>
      <div className="mt-1 text-sm text-accent-cyan">{org}</div>
      <p className="mt-3 text-pretty leading-relaxed text-fg-muted">{description}</p>

      {highlights && (
        <ul className="mt-4 flex flex-col gap-2">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-fg-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-violet" />
              {h}
            </li>
          ))}
        </ul>
      )}

      {stack && (
        <div className="mt-5 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] text-fg-muted"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}