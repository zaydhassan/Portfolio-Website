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
  PenLine,
  FileText,
  Clock,
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
  orange: "text-accent-orange",
};

const ACCENT_GLOW: Record<Accent, string> = {
  cyan: "bg-accent-cyan/40",
  purple: "bg-accent-violet/40",
  blue: "bg-accent-blue/40",
  orange: "bg-accent-orange/40",
};

const ACCENT_DOT: Record<Accent, string> = {
  cyan: "bg-accent-cyan",
  purple: "bg-accent-violet",
  blue: "bg-accent-blue",
  orange: "bg-accent-orange",
};

/** CSS variable used for the rotating conic border sweep + CTA glow. */
const ACCENT_VAR: Record<Accent, string> = {
  cyan: "var(--accent-cyan)",
  purple: "var(--accent-violet)",
  blue: "var(--accent-blue)",
  orange: "var(--accent-orange)",
};

const ACCENT_GRADIENT: Record<Accent, string> = {
  cyan: "from-accent-cyan/25 via-[#0b0b10] to-[#050505]",
  purple: "from-accent-violet/25 via-[#0b0b10] to-[#050505]",
  blue: "from-accent-blue/25 via-[#0b0b10] to-[#050505]",
  orange: "from-accent-orange/25 via-[#0b0b10] to-[#050505]",
};

/** Short domain pill per project — a clean "AI / Automation / SaaS / Web" tag. */
const KIND_LABEL: Record<string, string> = {
  "agentflow-ai": "AI Automation",
  "novanest-ai": "AI SaaS",
  inkwell: "Full-Stack Web App",
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
    label: "Building",
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
      className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:py-36"
    >
      {/* Ambient backdrop — faint grid only. The large blur blobs that were
          here were redundant with each card's own glow bloom and forced
          expensive large-radius rasterization; removed for compositor perf. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
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
            Products, built like{" "}
            <span className="gradient-text">launches</span>.
          </>
        }
        description="Three products engineered end-to-end and treated like launches — agentic AI automation, an intelligent platform, and a full-stack publishing application."
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
                ) : status === "build" && project.github ? (
                  <BuildCta href={project.github} accent={accent} />
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
   InkwellDashboard — a cinematic product-showcase mockup rendered as the
   visual for the Inkwell card (no real screenshot asset exists yet).
   A design representation of the real Inkwell interface — a warm,
   editorial publishing platform — NOT a literal screenshot and NOT an
   AI-dashboard aesthetic. Strictly the Inkwell palette: deep warm
   brown/near-black ground, burnt-orange accent, cream text, muted
   blue-gray support. Deliberately distinct from the portfolio's
   cyan/purple/electric-blue AI-project cards.
   ================================================================== */

// Warm Inkwell palette — kept local so the thumbnail owns its own
// identity and never drifts into the portfolio's cool AI accents.
const INK = {
  ground: "#15100c",
  panel: "#1c150e",
  panelHi: "#241a12",
  card: "#221a12",
  border: "rgba(255,220,190,0.12)",
  borderFaint: "rgba(255,220,190,0.08)",
  orange: "#e8833a",
  cream: "#f1e7d8",
  muted: "#b9a892",
  subtle: "#8a7a66",
};

// Film-grain noise overlay (inline SVG turbulence) — gives the warm
// ground a soft editorial atmosphere without any grid/particle effects.
const INK_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function InkwellDashboard() {
  const nav = ["Home", "About", "Blogs", "Leaderboard", "Contact"];
  const articles = [
    { tag: "Craft", title: "The shape of a good sentence", read: "6 min" },
    { tag: "Voices", title: "Interviews with first-time authors", read: "9 min" },
    { tag: "Guide", title: "Editing your own first draft", read: "4 min" },
  ];
  const leaders = [
    { n: "1", name: "Aisha K.", pts: "4.2k" },
    { n: "2", name: "Marco D.", pts: "3.8k" },
    { n: "3", name: "Lena P.", pts: "3.1k" },
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: INK.ground }}
    >
      {/* Warm ambient lighting — soft orange bloom behind the browser,
          plus a deeper brown wash bottom-left for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
        style={{ backgroundColor: "rgba(232,131,58,0.16)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-6%] left-[-4%] h-[44%] w-[44%] rounded-full blur-[60px]"
        style={{ backgroundColor: "rgba(122,60,30,0.22)" }}
      />
      {/* Vignette + grain for cinematic editorial atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: INK_GRAIN, backgroundSize: "120px 120px" }}
      />

      {/* Composition — angled browser centered slightly right, with two
          subtle secondary UI panels floating behind it for depth. */}
      <div
        className="absolute inset-0 flex items-center justify-center px-[5%]"
        style={{ perspective: "1100px" }}
      >
        <div className="relative h-full w-full max-w-[640px]">
          {/* Secondary panel — article preview, behind-left */}
          <div
            aria-hidden
            className="absolute left-[1%] top-1/2 z-0 w-[44%] opacity-[0.62] blur-[1.25px]"
            style={{
              transform:
                "translateY(-50%) rotateY(15deg) rotateZ(-5deg) translateZ(-60px)",
            }}
          >
            <div
              className="overflow-hidden rounded-lg shadow-2xl"
              style={{
                backgroundColor: INK.panel,
                border: `1px solid ${INK.border}`,
              }}
            >
              <div
                className="relative h-12 w-full sm:h-16"
                style={{
                  background:
                    "linear-gradient(135deg,#4a3422,#724a2c 58%,#2a1d12)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: INK_GRAIN, backgroundSize: "90px 90px" }}
                />
                <FileText
                  className="absolute right-1.5 top-1.5 h-3 w-3"
                  style={{ color: INK.orange, opacity: 0.7 }}
                />
              </div>
              <div className="p-2">
                <span
                  className="text-[6px] font-medium uppercase tracking-wider sm:text-[7px]"
                  style={{ color: INK.orange }}
                >
                  Craft
                </span>
                <div
                  className="mt-0.5 text-[8px] font-semibold leading-tight sm:text-[9px]"
                  style={{ color: INK.cream }}
                >
                  The shape of a good sentence
                </div>
                <div
                  className="mt-1 flex items-center gap-1 text-[6px] sm:text-[7px]"
                  style={{ color: INK.subtle }}
                >
                  <Clock className="h-2 w-2" />
                  6 min · Zayd H.
                </div>
              </div>
            </div>
          </div>

          {/* Secondary panel — leaderboard, behind-right-top */}
          <div
            aria-hidden
            className="absolute right-[2%] top-[7%] z-0 w-[33%] opacity-[0.5] blur-[1.25px]"
            style={{
              transform: "rotateY(-17deg) rotateZ(4deg) translateZ(-50px)",
            }}
          >
            <div
              className="rounded-lg p-2 shadow-2xl"
              style={{
                backgroundColor: INK.panel,
                border: `1px solid ${INK.border}`,
              }}
            >
              <div
                className="mb-1.5 text-[7px] font-semibold uppercase tracking-[0.18em] sm:text-[8px]"
                style={{ color: INK.muted }}
              >
                Leaderboard
              </div>
              {leaders.map((l) => (
                <div key={l.n} className="flex items-center gap-1.5 py-0.5">
                  <span
                    className="text-[7px] font-bold sm:text-[8px]"
                    style={{ color: INK.orange }}
                  >
                    {l.n}
                  </span>
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#5a3a22" }}
                  />
                  <span
                    className="flex-1 truncate text-[6px] sm:text-[7px]"
                    style={{ color: INK.muted }}
                  >
                    {l.name}
                  </span>
                  <span
                    className="text-[6px] sm:text-[7px]"
                    style={{ color: INK.subtle }}
                  >
                    {l.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main browser — the primary visual focus */}
          <div
            className="absolute left-1/2 top-1/2 z-10 w-[82%] max-w-[560px]"
            style={{
              transform:
                "translate(-48%, -50%) rotateY(-9deg) rotateX(2deg)",
            }}
          >
            <div
              className="overflow-hidden rounded-xl shadow-[0_30px_90px_-25px_rgba(0,0,0,0.9)]"
              style={{
                backgroundColor: INK.panel,
                border: `1px solid ${INK.border}`,
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-1.5 px-3 py-2"
                style={{
                  backgroundColor: INK.panelHi,
                  borderBottom: `1px solid ${INK.borderFaint}`,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "rgba(224,129,92,0.8)" }}
                />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "rgba(201,163,106,0.7)" }}
                />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "rgba(122,138,106,0.6)" }}
                />
                <div
                  className="mx-2 hidden flex-1 items-center gap-1.5 rounded-md px-2 py-1 sm:flex"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.3)",
                    border: `1px solid ${INK.borderFaint}`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "#7a8a6a" }}
                  />
                  <span
                    className="text-[9px]"
                    style={{ color: INK.muted }}
                  >
                    inkwell.app
                  </span>
                </div>
              </div>

              {/* Page body */}
              <div
                className="flex flex-col gap-3 p-3 sm:p-4 lg:p-5"
                style={{ backgroundColor: INK.panel }}
              >
                {/* Navbar row */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <PenLine
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      style={{ color: INK.orange }}
                    />
                    <span
                      className="font-display text-[12px] font-bold tracking-tight sm:text-[13px]"
                      style={{ color: INK.cream }}
                    >
                      Inkwell
                    </span>
                  </div>
                  <div className="ml-2 hidden items-center gap-2.5 sm:flex lg:gap-3.5">
                    {nav.map((item, i) => (
                      <span
                        key={item}
                        className="text-[9px] lg:text-[10px]"
                        style={{
                          color: i === 0 ? INK.orange : INK.muted,
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
                    <span
                      className="hidden text-[9px] sm:inline lg:text-[10px]"
                      style={{ color: INK.muted }}
                    >
                      Login
                    </span>
                    <span
                      className="rounded-md px-2 py-1 text-[8px] font-semibold sm:px-2.5 sm:text-[9px] lg:text-[10px]"
                      style={{ backgroundColor: INK.orange, color: "#1a1208" }}
                    >
                      Write
                    </span>
                  </div>
                </div>

                {/* Editorial hero */}
                <div className="mt-0.5">
                  <div
                    className="text-[8px] font-semibold uppercase tracking-[0.22em] sm:text-[9px]"
                    style={{ color: INK.orange }}
                  >
                    Featured
                  </div>
                  <div
                    className="mt-1 font-display font-bold leading-[1.05] sm:text-[19px] lg:text-[26px]"
                    style={{ color: INK.cream }}
                  >
                    Stories worth
                    <br />
                    reading.
                  </div>
                  <div
                    className="mt-1.5 max-w-[82%] text-[8px] leading-snug sm:text-[9px] lg:text-[11px]"
                    style={{ color: INK.muted }}
                  >
                    A modern home for writers and readers — publish, discover,
                    and climb the leaderboard.
                  </div>
                </div>

                {/* Article cards */}
                <div className="mt-1 grid grid-cols-3 gap-1.5 sm:gap-2">
                  {articles.map((a) => (
                    <div
                      key={a.title}
                      className="flex flex-col gap-1 rounded-lg p-1.5 sm:p-2"
                      style={{
                        backgroundColor: INK.card,
                        border: `1px solid ${INK.borderFaint}`,
                      }}
                    >
                      <div
                        className="relative h-6 overflow-hidden rounded-md sm:h-8"
                        style={{
                          background:
                            "linear-gradient(135deg,#3a2a1a,#5a3a22 60%,#2a1d12)",
                        }}
                      >
                        <FileText
                          className="absolute right-1 top-1 h-2.5 w-2.5"
                          style={{ color: INK.orange, opacity: 0.7 }}
                        />
                      </div>
                      <span
                        className="text-[6px] font-medium uppercase tracking-wider sm:text-[7px] lg:text-[8px]"
                        style={{ color: INK.orange }}
                      >
                        {a.tag}
                      </span>
                      <div
                        className="line-clamp-2 text-[7px] font-medium leading-tight sm:text-[8px] lg:text-[10px]"
                        style={{ color: INK.cream }}
                      >
                        {a.title}
                      </div>
                      <div
                        className="mt-auto flex items-center gap-0.5 text-[6px] sm:text-[7px] lg:text-[8px]"
                        style={{ color: INK.subtle }}
                      >
                        <Clock className="h-2 w-2" />
                        {a.read}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      {!hasImage &&
        (project.slug === "inkwell" ? (
          <InkwellDashboard />
        ) : (
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
        ))}

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
      className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-medium text-bg"
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

function BuildCta({ href, accent }: { href: string; accent: Accent }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      data-cursor-label="Build"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-medium text-fg"
      style={{
        background: `linear-gradient(110deg, ${ACCENT_VAR[accent]}, #0c0c12)`,
        boxShadow: `0 8px 40px -10px ${ACCENT_VAR[accent]}`,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
      />
      <Sparkles className="relative h-4 w-4" />
      <span className="relative">Explore Build</span>
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
      className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-1/60 px-5 py-3 text-sm font-medium text-fg backdrop-blur-sm transition-colors duration-300 hover:bg-overlay"
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