"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

/* ----------------------------------------------------------------
   AboutBackground — a lightweight, About-scoped backdrop layered
   above the global Background and below the section content.

   Pure CSS + SVG (no second canvas) so it stays at 60 FPS and
   doesn't cost a WebGL context:
     • aurora + gradient mesh + depth fog (existing utilities)
     • a tiled starfield with slow drift + SVG twinkle accents
     • a static neural-connection SVG with flowing dashes
     • a few floating particles (existing float utilities)

   Under reduced motion only the static gradient mesh renders.
   ---------------------------------------------------------------- */

// Deterministic pseudo-random starfield so SSR/CSR match (no hydration drift).
function makeStars(count: number, seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  return Array.from({ length: count }, () => ({
    cx: rand() * 100,
    cy: rand() * 100,
    r: rand() * 0.9 + 0.3,
    delay: rand() * 6,
  }));
}

export default function AboutBackground() {
  const reduce = useReducedMotion();

  const twinkles = useMemo(() => makeStars(14, 7), []);
  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        left: `${15 + i * 14}%`,
        top: `${10 + ((i * 37) % 80)}%`,
        size: 3 + (i % 3),
        delay: i * 1.6,
        cyan: i % 2 === 0,
      })),
    [],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden"
    >
      {/* Aurora wash + gradient mesh + depth fog */}
      <div className="absolute inset-0 aurora opacity-60" />
      <div className="absolute inset-0 gradient-mesh opacity-[0.18] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_80%)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 55%, transparent 40%, var(--bg) 100%)",
        }}
      />

      {!reduce && (
        <>
          {/* Tiled starfield with a slow drift */}
          <div
            className="absolute inset-0 animate-spin-slow opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 80px 120px, rgba(255,255,255,0.35), transparent), radial-gradient(1px 1px at 160px 70px, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 240px 180px, rgba(196,181,253,0.4), transparent)",
              backgroundSize: "300px 300px",
              maskImage:
                "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 85%)",
            }}
          />

          {/* SVG twinkle accents */}
          <svg
            className="absolute inset-0 h-full w-full opacity-70"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {twinkles.map((t, i) => (
              <circle
                key={i}
                cx={t.cx}
                cy={t.cy}
                r={t.r * 0.4}
                fill="white"
                className="animate-pulse-glow"
                style={{ animationDelay: `${t.delay}s`, opacity: 0.5 }}
              />
            ))}
          </svg>

          {/* Neural connections — static lines with flowing signal dashes */}
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.16]"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <g stroke="url(#about-neural-grad)" strokeWidth="0.12" fill="none">
              <line x1="12" y1="22" x2="34" y2="40" strokeDasharray="2 3">
                <animate
                  attributeName="stroke-dashoffset"
                  from="5"
                  to="0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="34" y1="40" x2="58" y2="30" strokeDasharray="2 3">
                <animate
                  attributeName="stroke-dashoffset"
                  from="5"
                  to="0"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="58" y1="30" x2="78" y2="52" strokeDasharray="2 3">
                <animate
                  attributeName="stroke-dashoffset"
                  from="5"
                  to="0"
                  dur="3.6s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="40" y1="66" x2="66" y2="78" strokeDasharray="2 3">
                <animate
                  attributeName="stroke-dashoffset"
                  from="5"
                  to="0"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="20" y1="74" x2="40" y2="66" strokeDasharray="2 3">
                <animate
                  attributeName="stroke-dashoffset"
                  from="5"
                  to="0"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </line>
              <line x1="78" y1="52" x2="88" y2="28" strokeDasharray="2 3">
                <animate
                  attributeName="stroke-dashoffset"
                  from="5"
                  to="0"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
            {[
              [12, 22],
              [34, 40],
              [58, 30],
              [78, 52],
              [40, 66],
              [66, 78],
              [20, 74],
              [88, 28],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="0.5" fill="#c4b5fd" />
            ))}
            <defs>
              <linearGradient id="about-neural-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating particles */}
          {particles.map((p, i) => (
            <span
              key={i}
              className={`absolute rounded-full ${
                p.cyan ? "animate-float-slow" : "animate-float-medium"
              }`}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                background: p.cyan
                  ? "radial-gradient(circle, rgba(34,211,238,0.9), transparent 70%)"
                  : "radial-gradient(circle, rgba(168,85,247,0.9), transparent 70%)",
                boxShadow: p.cyan
                  ? "0 0 12px 2px var(--glow-cyan)"
                  : "0 0 12px 2px var(--glow-purple)",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}