"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import { SHOWCASE_PROJECTS } from "@/lib/data";
import { stagger, viewportReveal, easeExpo } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/types";

/* ------------------------------------------------------------------ *
   Accent maps — keep "purple" aligned to the violet token, matching
   the rest of the site (see About / original Projects section).
   ------------------------------------------------------------------ */
type Accent = Project["accent"];

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

/** CSS variable used for the rotating conic border sweep + CTA glow. */
const ACCENT_VAR: Record<Accent, string> = {
  cyan: "var(--accent-cyan)",
  purple: "var(--accent-violet)",
  blue: "var(--accent-blue)",
};

const ACCENT_GRADIENT: Record<Accent, string> = {
  cyan: "from-accent-cyan/25 via-[#0b0b10] to-[#050505]",
  purple: "from-accent-violet/25 via-[#0b0b10] to-[#050505]",
  blue: "from-accent-blue/25 via-[#0b0b10] to-[#050505]",
};

/** Short domain pill per project — a clean "AI / Automation / SaaS" tag. */
const KIND_LABEL: Record<string, string> = {
  "agentflow-ai": "AI Automation",
  "novanest-ai": "AI SaaS",
  "neural-ops-studio": "AI Operations",
};

const STATUS_CFG: Record<
  ProjectStatus,
  { label: string; chip: string; dot: string; ping: boolean }
> = {
  live: {
    label: "Live",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
    ping: true,
  },
  shipped: {
    label: "Shipped",
    chip: "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan",
    dot: "bg-accent-cyan",
    ping: false,
  },
  build: {
    label: "In Progress",
    chip: "border-accent-violet/30 bg-accent-violet/10 text-accent-violet",
    dot: "bg-accent-violet",
    ping: true,
  },
};

function deriveStatus(p: Project): ProjectStatus {
  if (p.status) return p.status;
  if (p.comingSoon) return "build";
  if (p.demo) return "live";
  return "shipped";
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [flagship, ...rest] = SHOWCASE_PROJECTS;

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 sm:py-36"
    >
      {/* Ambient backdrop — soft accent lighting + faint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-accent-cyan/10 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-accent-violet/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-blue/10 blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-[0.12]" />
      </div>

      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-blue"
      />

      <SectionHeading
        eyebrow="Selected Work / Product Showcase"
        title={
          <>
            AI products, shipped like{" "}
            <span className="gradient-text">launches</span>.
          </>
        }
        description="Three AI-native products, engineered end-to-end and treated like launches — agentic automation, an intelligent platform, and a next-generation operations console."
      />

      {/* Staggered entrance for the whole showcase */}
      <motion.div
        variants={stagger(0.14, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportReveal}
        className="mt-16 flex flex-col gap-8 sm:mt-20 sm:gap-10"
      >
        {/* Flagship — full-width hero launch card */}
        <ProjectCard project={flagship} index={0} total={SHOWCASE_PROJECTS.length} featured />

        {/* Secondary launches — 2-up grid */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2">
          {rest.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i + 1}
              total={SHOWCASE_PROJECTS.length}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ================================================================== *
   ProjectCard — premium glass launch card with an animated border
   sweep, hover tilt, neon glow, image zoom, and CTA micro-interactions.
   `featured` switches the flagship to a wide two-column hero layout.
   ================================================================== */
function ProjectCard({
  project,
  index,
  total,
  featured = false,
}: {
  project: Project;
  index: number;
  total: number;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax on the visual's glow + telemetry chips.
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.2, 0.4, 0.2],
  );

  const status = deriveStatus(project);
  const accent = project.accent;
  const kind = KIND_LABEL[project.slug] ?? "AI Product";

  return (
    <motion.div
      ref={ref}
      variants={cardVariant}
      className="group relative"
      style={{ perspective: 1200 }}
    >
      {/* Neon glow bloom behind the card */}
      <motion.div
        aria-hidden
        style={{ opacity: glowOpacity }}
        className={cn(
          "pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] blur-3xl transition-opacity duration-500 group-hover:opacity-70",
          ACCENT_GLOW[accent],
        )}
      />

      <TiltCard
        intensity={featured ? 5 : 6}
        glare
        className="relative h-full"
      >
        {/* Animated border sweep — a rotating conic arc masked to a 1px ring.
            Opacity lifts on hover for an "active" feel. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-40 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${ACCENT_VAR[accent]} 18%, transparent 36%, transparent 100%)`,
            padding: "1px",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <div
          className={cn(
            "relative h-full overflow-hidden rounded-[2rem] border border-hairline bg-gradient-to-br from-surface-2 to-surface-1",
            featured ? "p-6 sm:p-9 lg:p-10" : "p-5 sm:p-6",
          )}
        >
          {/* Interior grid + ghost index */}
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.08]" />
          <span
            aria-hidden
            style={{ WebkitTextStroke: "1.5px var(--hairline)" }}
            className={cn(
              "pointer-events-none absolute select-none font-display font-bold leading-none text-transparent",
              featured
                ? "-right-2 -top-12 text-[10rem] sm:text-[16rem]"
                : "-right-1 -top-8 text-[7rem] sm:text-[9rem]",
            )}
          >
            {pad(index + 1)}
          </span>

          <div
            className={cn(
              "relative flex h-full flex-col gap-8",
              featured && "lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12",
            )}
          >
            {/* ---------------- Content ---------------- */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusChip status={status} />
                <KindPill label={kind} accent={accent} />
                {featured && <FeaturedBadge />}
                <span className="ml-auto font-mono text-xs text-fg-subtle">
                  {pad(index + 1)} / {pad(total)}
                </span>
              </div>

              <h3
                className={cn(
                  "mt-5 font-display font-semibold tracking-tight text-fg",
                  featured ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
                )}
              >
                {project.title}
              </h3>
              <p
                className={cn(
                  "gradient-text mt-2 font-medium",
                  featured ? "text-lg sm:text-xl" : "text-base sm:text-lg",
                )}
              >
                {project.tagline}
              </p>
              <p
                className={cn(
                  "mt-4 text-pretty leading-relaxed text-fg-muted",
                  featured ? "max-w-xl text-base sm:text-[1.05rem]" : "text-sm sm:text-[0.95rem]",
                )}
              >
                {project.description}
              </p>

              {featured && project.highlights && (
                <ul className="mt-6 flex flex-col gap-2.5">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm text-fg-muted"
                    >
                      <span
                        className={cn(
                          "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full",
                          ACCENT_DOT[accent],
                        )}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech stack chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-hairline bg-surface-2/80 px-3 py-1 text-xs font-medium text-fg-muted backdrop-blur-sm transition-colors duration-300 group-hover:border-hairline-strong"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {project.demo && !project.comingSoon ? (
                  <DemoCta href={project.demo} accent={accent} />
                ) : project.comingSoon ? (
                  <ComingSoonCta />
                ) : null}
                {project.github && <SourceCta href={project.github} />}
              </div>
            </div>

            {/* ---------------- Visual ---------------- */}
            <ProjectVisual
              project={project}
              status={status}
              accent={accent}
              featured={featured}
              parallaxY={parallaxY}
            />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ================================================================== *
   ProjectVisual — the "live preview" panel: image with hover zoom,
   layered gradients, a scanning light sweep, and floating telemetry
   chips with subtle parallax.
   ================================================================== */
function ProjectVisual({
  project,
  status,
  accent,
  featured,
  parallaxY,
}: {
  project: Project;
  status: ProjectStatus;
  accent: Accent;
  featured: boolean;
  parallaxY: ReturnType<typeof useTransform<number, number>>;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgError(false);
  }, [project.image]);

  const hasImage = Boolean(project.image) && !imgError;

  // Counter-parallax for the bottom chip — moves opposite to the top one.
  const chipY = useTransform(parallaxY, (v) => -v * 0.5);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10",
        featured ? "aspect-[4/3] lg:aspect-auto lg:h-[26rem]" : "aspect-[16/11]",
      )}
    >
      {/* Layered gradient backdrop */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", ACCENT_GRADIENT[accent])} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e0e0e]/40 to-[#050505]/85" />
      <div className="absolute inset-0 grid-bg-dark opacity-30" />

      {/* Image with hover zoom */}
      {hasImage && (
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          <Image
            src={project.image!}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            onError={() => setImgError(true)}
            className="object-cover"
          />
        </motion.div>
      )}

      {/* Glass overlay frame on the image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0e0e0e]/20 via-transparent to-[#050505]/75" />

      {/* Fallback mark when there is no screenshot */}
      {!hasImage && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid place-items-center">
            <div className={cn("absolute h-32 w-32 rounded-full blur-2xl", ACCENT_GLOW[accent])} />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-[#050505]/60 backdrop-blur-md sm:h-28 sm:w-28">
              <span className={cn("font-display text-4xl font-semibold sm:text-5xl", ACCENT_TEXT[accent])}>
                {project.title.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scanning light sweep */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/12 to-transparent"
        animate={{ y: ["-15%", "125%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating telemetry chips with parallax */}
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/10 bg-[#050505]/70 px-2.5 py-1 font-mono text-[10px] text-white/70 backdrop-blur"
      >
        status: {status}
      </motion.div>
      <motion.div
        style={{ y: chipY }}
        className={cn(
          "pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#050505]/70 px-2.5 py-1 font-mono text-[10px] backdrop-blur",
          ACCENT_TEXT[accent],
        )}
      >
        <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-current" />
        {project.year}
      </motion.div>

      {project.comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/40 backdrop-blur-[1px]">
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-[#050505]/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white">
            <Sparkles className="h-3.5 w-3.5 text-accent-violet" />
            In Build
          </span>
        </div>
      )}
    </div>
  );
}

/* ================================================================== *
   Bits — status chip, kind pill, featured badge, CTAs.
   ================================================================== */
function StatusChip({ status }: { status: ProjectStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
        cfg.chip,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {cfg.ping && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              cfg.dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", cfg.dot)} />
      </span>
      {cfg.label}
    </span>
  );
}

function KindPill({ label, accent }: { label: string; accent: Accent }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-hairline bg-surface-1/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm",
        ACCENT_TEXT[accent],
      )}
    >
      {label}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200">
      <Star className="h-3 w-3 fill-current" />
      Featured
    </span>
  );
}

function DemoCta({ href, accent }: { href: string; accent: Accent }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      data-cursor-label="Live"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-bg"
      style={{
        background: `linear-gradient(110deg, ${ACCENT_VAR[accent]}, #ffffff)`,
        boxShadow: `0 8px 40px -10px ${ACCENT_VAR[accent]}`,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
      />
      <ExternalLink className="relative h-4 w-4" />
      <span className="relative">Live Demo</span>
      <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
    </motion.a>
  );
}

function SourceCta({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      data-cursor-label="Code"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-1/60 px-5 py-2.5 text-sm font-medium text-fg backdrop-blur-sm transition-colors duration-300 hover:bg-overlay"
    >
      <Github className="h-4 w-4" />
      Source Code
    </motion.a>
  );
}

function ComingSoonCta() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-fg-muted">
      <Sparkles className="h-4 w-4 text-accent-violet" />
      In active development
    </span>
  );
}

/* ================================================================== *
   Card entrance variant — fade + rise + blur, with a gentle scale.
   ================================================================== */
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.985, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeExpo },
  },
};