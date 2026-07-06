"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  animate,
} from "motion/react";
import { ArrowUpRight, Github, ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import { fadeUp, viewportReveal, easeExpo } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/types";

const ACCENT_GRAD = {
  cyan: "from-accent-cyan/25 via-[#0b0b10] to-[#050505]",
  purple: "from-accent-violet/25 via-[#0b0b10] to-[#050505]",
  blue: "from-accent-blue/25 via-[#0b0b10] to-[#050505]",
} as const;

const ACCENT_TEXT = {
  cyan: "text-accent-cyan",
  purple: "text-accent-violet",
  blue: "text-accent-blue",
} as const;

const ACCENT_GLOW = {
  cyan: "bg-accent-cyan/40",
  purple: "bg-accent-violet/40",
  blue: "bg-accent-blue/40",
} as const;

const ACCENT_DOT = {
  cyan: "bg-accent-cyan",
  purple: "bg-accent-violet",
  blue: "bg-accent-blue",
} as const;

type Accent = Project["accent"];

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
    label: "In Build",
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

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 sm:py-36"
    >
    
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-blue"
      />

      <SectionHeading
        eyebrow="Launch Log / Selected Work"
        title={
          <>
            Products, shipped like <span className="gradient-text">launches</span>.
          </>
        }
        description="Three AI-native products, tracked end-to-end — from first commit to live deployment. Each one treated like a launch: status, telemetry, and a record of what shipped."
      />

      <div className="mt-16 flex flex-col gap-10 sm:gap-14">
        {PROJECTS.map((project, index) => (
          <LaunchSlide
            key={project.slug}
            project={project}
            index={index}
            total={PROJECTS.length}
          />
        ))}
      </div>
    </section>
  );
}

function LaunchSlide({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const ghostY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.15, 0.35, 0.15],
  );

  const status = deriveStatus(project);
  const accent = project.accent;

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-gradient-to-br from-surface-2 to-surface-1 p-6 sm:p-9 lg:p-10">
       
        <motion.span
          aria-hidden
          style={{
            y: ghostY,
            WebkitTextStroke: "1.5px var(--hairline)",
          }}
          className="pointer-events-none absolute -right-2 -top-10 select-none font-display text-[9rem] font-bold leading-none text-transparent sm:text-[14rem] lg:text-[16rem]"
        >
          {pad(index + 1)}
        </motion.span>

        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity }}
          className={cn(
            "pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl",
            ACCENT_GLOW[accent],
          )}
        />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        
          <div className="relative">
          
            <div className="flex flex-wrap items-center gap-3">
              <StatusChip status={status} />
              <span className="text-xs uppercase tracking-[0.2em] text-fg-subtle">
                {project.category}
              </span>
              <span className="ml-auto font-mono text-xs text-fg-subtle">
                {pad(index + 1)} / {pad(total)}
              </span>
            </div>

            <h3 className="mt-5 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
              {project.title}
            </h3>
            <p className="gradient-text mt-2 text-lg font-medium sm:text-xl">
              {project.tagline}
            </p>
            <p className="mt-5 max-w-xl text-pretty leading-relaxed text-fg-muted">
              {project.description}
            </p>

            {project.highlights && (
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

            {project.metrics && (
              <div className="mt-7 grid grid-cols-3 gap-3">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-hairline bg-surface-1 px-3 py-3"
                  >
                    <div
                      className={cn(
                        "font-display text-xl font-semibold text-fg sm:text-2xl",
                      )}
                    >
                      <MetricValue raw={m.value} accent={accent} />
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-fg-subtle">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-hairline bg-surface-2 px-3 py-1 text-xs text-fg-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.demo && !project.comingSoon && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  data-cursor-label="Live"
                  className="group/cta inline-flex items-center gap-2 rounded-full bg-invert px-5 py-2.5 text-sm font-medium text-bg transition-all duration-300 hover:shadow-[0_8px_40px_-8px_rgba(255,255,255,0.45)]"
                >
                  <ExternalLink className="h-4 w-4" />
                  View live
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  data-cursor-label="Code"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-sm text-fg transition-colors duration-300 hover:bg-overlay"
                >
                  <Github className="h-4 w-4" />
                  Source
                </a>
              )}
              {project.comingSoon && (
                <span className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-sm text-fg-muted">
                  <Sparkles className="h-4 w-4 text-accent-violet" />
                  In active development
                </span>
              )}
            </div>
          </div>

          <LaunchVisual project={project} status={status} accent={accent} />
        </div>

        <div className="relative mt-8 border-t border-hairline pt-4">
          <LaunchMarquee project={project} status={status} />
        </div>
      </div>
    </motion.div>
  );
}

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
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            cfg.dot,
          )}
        />
      </span>
      {cfg.label}
    </span>
  );
}

function LaunchVisual({
  project,
  status,
  accent,
}: {
  project: Project;
  status: ProjectStatus;
  accent: Accent;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgError(false);
  }, [project.image]);

  const hasImage = Boolean(project.image) && !imgError;

  return (
    <TiltCard intensity={6} glare={false} className="relative aspect-[4/3] w-full">
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10">
        {/* Layered gradient backdrop — base in both modes */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            ACCENT_GRAD[accent],
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e0e0e]/40 to-[#050505]/85" />

        
        {hasImage && (
          <Image
            src={project.image!}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            onError={() => setImgError(true)}
            className="object-cover"
          />
        )}
        
        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e0e0e]/30 via-transparent to-[#050505]/75" />
        )}

        
        {!hasImage && (
          <>
            <div className="absolute inset-0 grid-bg-dark opacity-30" />

           
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full conic-ring opacity-20 blur-[1px]" />

            {/* Center glass tile */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative grid place-items-center">
                <div
                  className={cn(
                    "absolute h-32 w-32 rounded-full blur-2xl",
                    ACCENT_GLOW[accent],
                  )}
                />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-[#050505]/60 backdrop-blur-md sm:h-28 sm:w-28">
                  <span
                    className={cn(
                      "font-display text-4xl font-semibold sm:text-5xl",
                      ACCENT_TEXT[accent],
                    )}
                  >
                    {project.title.charAt(0)}
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[0, 120, 240].map((deg) => (
                <span
                  key={deg}
                  className={cn(
                    "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                    ACCENT_DOT[accent],
                  )}
                  style={{
                    transform: `rotate(${deg}deg) translateY(-92px)`,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/12 to-transparent"
          animate={{ y: ["-15%", "125%"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

  
        <motion.div
          className="absolute left-4 top-4 rounded-lg border border-white/10 bg-[#050505]/70 px-2.5 py-1 font-mono text-[10px] text-white/70 backdrop-blur"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
           status: {status}
        </motion.div>
        <motion.div
          className={cn(
            "absolute right-4 bottom-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#050505]/70 px-2.5 py-1 font-mono text-[10px] backdrop-blur",
            ACCENT_TEXT[accent],
          )}
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
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
    </TiltCard>
  );
}

function LaunchMarquee({
  project,
  status,
}: {
  project: Project;
  status: ProjectStatus;
}) {
  const label = STATUS_CFG[status].label;
  const text = `● ${label} — ${project.year} — BUILT WITH ${project.tags
    .join(" · ")
    .toUpperCase()}`;
  const items = Array.from({ length: 4 }, () => text);

  return (
    <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: "30s" }}
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="mx-4 inline-flex font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function parseMetric(raw: string): {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
} | null {
  const m = raw.match(/^([^0-9]*?)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!m) return null;
  const value = parseFloat(m[2]);
  if (!Number.isFinite(value)) return null;
  const decimals = m[2].split(".")[1]?.length ?? 0;
  return { prefix: m[1], value, suffix: m[3], decimals };
}

function MetricValue({ raw, accent }: { raw: string; accent: Accent }) {
  const parsed = useMemo(() => parseMetric(raw), [raw]);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || !parsed) return;
    const controls = animate(0, parsed.value, {
      duration: 1.6,
      ease: easeExpo,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, parsed]);

  if (!parsed) {
    return <span className={ACCENT_TEXT[accent]}>{raw}</span>;
  }

  return (
    <span ref={ref} className={ACCENT_TEXT[accent]}>
      {parsed.prefix}
      {display.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}