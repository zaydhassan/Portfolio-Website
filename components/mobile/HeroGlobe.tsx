"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   HeroGlobe — a lightweight, CSS-only version of the desktop three.js
   hero scene, rendered on mobile (<768px) so the hero never ships the
   877KB three bundle to phones. Mirrors the AICore pattern (no WebGL):

     • drifting particle starfield (radial-gradient dots, slow spin)
     • a central glowing "globe" — radial-gradient sphere with halo
     • two counter-rotating orbital wire rings
     • three floating accent orbs (cyan / blue / violet)

   Everything sits behind the hero content (z-0) inside the section's
   overflow-hidden slot, placed toward the right so the left-aligned
   headline stays readable. Respects prefers-reduced-motion (static).
   ---------------------------------------------------------------- */
export default function HeroGlobe() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Particle starfield — slow drift */}
      <div
        className={cn("absolute inset-0 opacity-60", !reduce && "animate-spin-slow")}
        style={{
          backgroundImage:
            "radial-gradient(1.4px 1.4px at 20px 30px, rgba(155,184,255,0.55), transparent), radial-gradient(1.2px 1.2px at 80px 120px, rgba(196,181,253,0.45), transparent), radial-gradient(1.5px 1.5px at 160px 70px, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 240px 180px, rgba(34,211,238,0.4), transparent)",
          backgroundSize: "260px 260px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 65% 45%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 65% 45%, #000 30%, transparent 80%)",
        }}
      />

      {/* Orbital wire rings — peek from the right edge */}
      <div className="absolute right-[-22%] top-1/2 h-[28rem] w-[28rem] -translate-y-1/2">
        <div
          className={cn(
            "absolute inset-0 rounded-full border border-accent-cyan/15",
            !reduce && "animate-spin-slow",
          )}
        />
        <div
          className={cn(
            "absolute inset-8 rounded-full border border-dashed border-accent-violet/15",
            !reduce && "animate-spin-slow",
          )}
          style={{ animationDirection: "reverse" }}
        />
      </div>

      {/* Central globe — sphere with halo + emissive pulse */}
      <div className="absolute right-[-8%] top-1/2 h-44 w-44 -translate-y-1/2 sm:h-52 sm:w-52">
        {/* Outer halo */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.45),transparent_70%)] blur-2xl" />
        {/* Sphere body */}
        <div
          className={cn(
            "absolute inset-4 rounded-full",
            "bg-[radial-gradient(circle_at_32%_28%,#dcd6fe,#8b5cf6_48%,#3b1d8a_82%,#1e1b4b)]",
            "shadow-[inset_-12px_-16px_30px_rgba(0,0,0,0.45),0_0_90px_-14px_rgba(139,92,246,0.75)]",
            !reduce && "animate-pulse-glow",
          )}
        />
        {/* Inner highlight sheen */}
        <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.5),transparent_42%)]" />
        {/* Orbiting micro-dot */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2",
            !reduce && "animate-spin-slow",
          )}
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-cyan shadow-[0_0_12px_2px_var(--glow-cyan)]" />
        </div>
      </div>

      {/* Floating accent orbs */}
      <div
        className={cn(
          "absolute right-[10%] top-[26%] h-7 w-7 rounded-full",
          "bg-[radial-gradient(circle_at_30%_30%,#a5f3fc,#22d3ee_60%,#0e7490)]",
          "shadow-[0_0_26px_-5px_rgba(34,211,238,0.75)]",
          !reduce && "animate-float-slow",
        )}
      />
      <div
        className={cn(
          "absolute right-[30%] bottom-[22%] h-5 w-5 rounded-full",
          "bg-[radial-gradient(circle_at_30%_30%,#bfdbfe,#3b82f6_60%,#1e3a8a)]",
          "shadow-[0_0_22px_-5px_rgba(59,130,246,0.75)]",
          !reduce && "animate-float-medium",
        )}
      />
      <div
        className={cn(
          "absolute right-[24%] top-[18%] h-3.5 w-3.5 rounded-full",
          "bg-[radial-gradient(circle_at_30%_30%,#ddd6fe,#a855f7_60%,#6b21a8)]",
          "shadow-[0_0_18px_-4px_rgba(168,85,247,0.75)]",
          !reduce && "animate-float-slow",
        )}
      />

      {/* Right-edge fade so the globe settles into the page edge */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}