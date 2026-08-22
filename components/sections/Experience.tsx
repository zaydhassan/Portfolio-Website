"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Clock,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import {
  EXPERIENCES,
  EDUCATION,
  CERTIFICATES,
} from "@/lib/data";
import {
  fadeUp,
  stagger,
  viewportReveal,
} from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types";

/* ------------------------------------------------------------------ *
   Accent maps — keep "purple" aligned to the violet token, matching
   the rest of the site (see Projects / About sections).
   ------------------------------------------------------------------ */
type Accent = Experience["accent"];

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "text-accent-cyan",
  purple: "text-accent-violet",
  blue: "text-accent-blue",
};

const ACCENT_GLOW: Record<Accent, string> = {
  cyan: "bg-accent-cyan/40",
  purple: "bg-accent-violet/40",
  blue: "bg-accent-blue/40",
};

const ACCENT_DOT: Record<Accent, string> = {
  cyan: "bg-accent-cyan",
  purple: "bg-accent-violet",
  blue: "bg-accent-blue",
};

const ACCENT_RING: Record<Accent, string> = {
  cyan: "shadow-[0_0_22px_-2px_rgba(34,211,238,0.75)]",
  purple: "shadow-[0_0_22px_-2px_rgba(168,85,247,0.75)]",
  blue: "shadow-[0_0_22px_-2px_rgba(59,130,246,0.75)]",
};

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-accent-cyan/45",
  purple: "border-accent-violet/45",
  blue: "border-accent-blue/45",
};

/* Per-chip spring reveal for the tech badge row. */
const chipUp: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

/* Logo scroll reveal — fade + scale, spring. */
const logoReveal: Variants = {
  hidden: { opacity: 0, scale: 0.55, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 220, damping: 20 },
  },
};

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
      className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:py-36"
    >
      <SectionHeading
        eyebrow="Experience"
        title={
          <>
            A path of <span className="gradient-text">building</span>, shipping &amp; learning.
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
          className="flex flex-col gap-10 sm:gap-12"
        >
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={`${exp.company}-${exp.role}`} exp={exp} index={i} />
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
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
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

/* ================================================================== *
   ExperienceCard — premium glass timeline card.

   • Official-style logo chip (lazy-loaded, fade+scale reveal, hover glow)
   • Company · title · employment type · duration · location
   • Live "Present" indicator for the current role
   • Animated tech-badge row (per-chip spring reveal)
   • Short impact summary
   • Expandable "Key Contributions" with spring height animation
   • Glassmorphism + gradient border + animated glow + hover lift +
     cursor-tracking spotlight + active-in-viewport timeline indicator
   ================================================================== */
function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Active-in-viewport indicator — highlights the timeline dot + card
  // for the experience currently centered in the viewport.
  const active = useInView(ref, { amount: 0.55 });

  // Cursor-tracking spotlight (no-op on touch / reduced motion).
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(260px circle at ${x}% ${y}%, rgba(255,255,255,0.07), transparent 60%)`,
  );

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div ref={ref} variants={fadeUp} className="relative">
      {/* Timeline node — enlarges + glows when this card is active */}
      <motion.span
        aria-hidden
        animate={reduce ? {} : { scale: active ? 1.25 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={cn(
          "absolute -left-8 top-2 grid h-4 w-4 place-items-center rounded-full transition-colors duration-300 sm:-left-12",
          ACCENT_DOT[exp.accent],
          active ? ACCENT_RING[exp.accent] : "shadow-none",
        )}
      >
        <Briefcase className="h-2.5 w-2.5 text-bg" />
      </motion.span>

      {/* Glow bloom behind the card — intensifies on hover + when active */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-3 -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70",
          ACCENT_GLOW[exp.accent],
          active && "opacity-30",
        )}
      />

      <motion.div
        onMouseMove={onMove}
        whileHover={reduce ? undefined : { y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        data-cursor="card"
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-surface-1/60 backdrop-blur-md transition-colors duration-300",
          "gradient-border",
          active ? ACCENT_BORDER[exp.accent] : "border-hairline hover:border-hairline-strong",
        )}
      >
        {/* Cursor spotlight */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        <div className="relative flex flex-col gap-5 p-6 sm:p-7">
          {/* ---------------- Header ---------------- */}
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Logo chip */}
            <motion.div
              variants={logoReveal}
              initial="hidden"
              whileInView="show"
              viewport={viewportReveal}
              className="relative shrink-0"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl sm:h-16 sm:w-16">
                <Image
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  width={64}
                  height={64}
                  unoptimized
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Hover glow ring around the logo */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -inset-1 -z-10 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100",
                  ACCENT_GLOW[exp.accent],
                )}
              />
            </motion.div>

            {/* Title block */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h3 className="font-display text-lg font-semibold leading-snug text-fg sm:text-xl">
                  {exp.role}
                </h3>
                {exp.current && <PresentBadge />}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className={cn("font-medium", ACCENT_TEXT[exp.accent])}>
                  {exp.company}
                </span>
                <span className="text-fg-subtle">·</span>
                <span className="inline-flex items-center gap-1.5 text-fg-muted">
                  <Briefcase className="h-3.5 w-3.5 text-fg-subtle" />
                  {exp.employmentType}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-fg-subtle">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {exp.period}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {exp.location}
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- Impact summary ---------------- */}
          <p className="text-pretty text-sm leading-relaxed text-fg-muted sm:text-[0.95rem]">
            {exp.description}
          </p>

          {/* ---------------- Tech badges ---------------- */}
          <motion.div
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={viewportReveal}
            className="flex flex-wrap gap-2"
          >
            {exp.stack.map((s) => (
              <motion.span
                key={s}
                variants={chipUp}
                className="rounded-full border border-hairline bg-surface-2/80 px-2.5 py-1 text-[11px] font-medium text-fg-muted backdrop-blur-sm transition-colors duration-300 hover:border-hairline-strong hover:text-fg"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          {/* ---------------- Expandable Key Contributions ---------------- */}
          <div className="mt-1 border-t border-hairline pt-4">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={`contrib-${index}`}
              className="group/btn flex w-full items-center justify-between text-left"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-fg">
                <Sparkles className={cn("h-4 w-4", ACCENT_TEXT[exp.accent])} />
                Key Contributions
                <span className="text-xs font-normal text-fg-subtle">
                  ({exp.highlights.length})
                </span>
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="grid h-6 w-6 place-items-center rounded-full border border-hairline bg-surface-2 text-fg-subtle transition-colors duration-300 group-hover/btn:border-hairline-strong group-hover/btn:text-fg"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`contrib-${index}`}
                  key="contributions"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {exp.highlights.map((h, k) => (
                      <li
                        key={k}
                        className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted"
                      >
                        <span
                          className={cn(
                            "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full",
                            ACCENT_DOT[exp.accent],
                          )}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PresentBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      Present
    </span>
  );
}

function TimelineItem({
  title,
  org,
  period,
  description,
}: {
  title: string;
  org: string;
  period: string;
  description: string;
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
    </motion.div>
  );
}