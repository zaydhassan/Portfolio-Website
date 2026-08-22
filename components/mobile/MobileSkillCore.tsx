"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   MobileSkillCore — a lightweight, CSS-only stand-in for the desktop
   three.js SkillCore scene, rendered on mobile (<768px) so the Skills
   section keeps its signature "core + orbiting planets" visual without
   shipping the 877KB three bundle to phones. Mirrors the HeroGlobe /
   AICore pattern (no WebGL):

     • drifting particle dust (radial-gradient dots, slow spin)
     • a central glowing core orb — radial-gradient sphere with halo
     • an outer wireframe shell — counter-rotating tilted rings
     • two tilted orbit rings of emissive nodes (the "planets")

   Recolors live with the active category `accent` — inline styles swap
   without remounting, so the CSS spin animations keep running across a
   category switch (mirrors the desktop "recolor without WebGL re-init").
   Respects prefers-reduced-motion (renders static). Plugs into the same
   absolute inset-0 slot the desktop iframe occupies in Skills.tsx.
   ---------------------------------------------------------------- */

type Accent = "cyan" | "purple" | "blue";

const HEX: Record<Accent, string> = {
  cyan: "#22d3ee",
  purple: "#a855f7",
  blue: "#3b82f6",
};

const HEX_DEEP: Record<Accent, string> = {
  cyan: "#0e7490",
  purple: "#6b21a8",
  blue: "#1e3a8a",
};

const HEX_GLOW: Record<Accent, string> = {
  cyan: "rgba(34,211,238,0.5)",
  purple: "rgba(168,85,247,0.5)",
  blue: "rgba(59,130,246,0.5)",
};

/* Points evenly spaced around a circle, as % left/top of a container. */
function ringDots(count: number, radius: number) {
  return Array.from({ length: count }).map((_, i) => {
    const a = (i / count) * Math.PI * 2;
    return {
      x: 50 + Math.cos(a) * radius,
      y: 50 + Math.sin(a) * radius,
    };
  });
}

export default function MobileSkillCore({ accent }: { accent: Accent }) {
  const reduce = useReducedMotion();
  const c = HEX[accent];
  const deep = HEX_DEEP[accent];
  const glow = HEX_GLOW[accent];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ background: "#07070b" }}
    >
      {/* ── Dust particle field — slow spin ─────────────────────── */}
      <div
        className={cn("absolute inset-0 opacity-50", !reduce && "animate-spin-slow")}
        style={{
          backgroundImage: `radial-gradient(1px 1px at 30px 40px, ${c}cc, transparent), radial-gradient(1px 1px at 120px 90px, rgba(255,255,255,0.4), transparent), radial-gradient(1.2px 1.2px at 200px 160px, ${c}99, transparent), radial-gradient(1px 1px at 90px 200px, ${c}77, transparent)`,
          backgroundSize: "240px 240px",
          maskImage: "radial-gradient(circle at 50% 50%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 20%, transparent 75%)",
        }}
      />

      {/* ── Outer wireframe shell — two tilted rings, counter-rotating ── */}
      <div
        className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: 800 }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: "rotateX(72deg)", transformStyle: "preserve-3d" }}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full border opacity-25",
              !reduce && "animate-spin-slow",
            )}
            style={{ borderColor: c }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ transform: "rotateY(72deg)", transformStyle: "preserve-3d" }}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full border border-dashed opacity-20",
              !reduce && "animate-spin-slow",
            )}
            style={{ borderColor: c, animationDirection: "reverse" }}
          />
        </div>
      </div>

      {/* ── Orbit ring 1 — tilted, 6 nodes (the "planets") ────────── */}
      <div
        className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: 700 }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: "rotateX(68deg) rotateY(12deg)", transformStyle: "preserve-3d" }}
        >
          <div
            className={cn(
              "absolute inset-0",
              !reduce && "animate-spin-slow",
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {ringDots(6, 47).map((p, i) => (
              <span
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                  background: c,
                  boxShadow: `0 0 10px 2px ${glow}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Orbit ring 2 — opposite tilt, 9 smaller nodes, counter-rotate ── */}
      <div
        className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: 700 }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: "rotateX(74deg) rotateY(-18deg)", transformStyle: "preserve-3d" }}
        >
          <div
            className={cn(
              "absolute inset-0",
              !reduce && "animate-spin-slow",
            )}
            style={{ transformStyle: "preserve-3d", animationDirection: "reverse" }}
          >
            {ringDots(9, 47).map((p, i) => (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                  background: c,
                  boxShadow: `0 0 8px 2px ${glow}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Central core orb — distorted sphere with halo + pulse ─── */}
      <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2">
        {/* Outer halo */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: `radial-gradient(circle, ${glow}, transparent 70%)` }}
        />
        {/* Sphere body */}
        <div
          className={cn("absolute inset-0 rounded-full", !reduce && "animate-pulse-glow")}
          style={{
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), ${c} 48%, ${deep} 82%, #1a1a2e)`,
            boxShadow: `inset -10px -14px 26px rgba(0,0,0,0.45), 0 0 80px -16px ${glow}`,
          }}
        />
        {/* Specular sheen */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.5), transparent 42%)",
          }}
        />
      </div>
    </div>
  );
}