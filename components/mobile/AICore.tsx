"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   CSS-only AI Core — the mobile-menu centerpiece.

   Replaces the previous three.js Canvas so the 877KB three bundle is no
   longer statically imported anywhere in the main page's component graph
   (Navbar → AIMenu → AICore was the last leak). Same visual role as the
   old scene: a distorted violet core with an emissive pulse, two
   counter-rotating energy rings (violet + cyan), an additive halo, and a
   one-shot activation flare when the menu opens. Zero JS, no WebGL.

   `open` is accepted to preserve AIMenu's call site; the panel only mounts
   this component while the menu is open, so the burst plays on each open.
   ---------------------------------------------------------------- */
export default function AICore({ open: _open }: { open: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Activation burst — one-shot flare on mount */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-10 w-10 rounded-full bg-accent-violet/40",
          !reduce && "ai-burst",
        )}
        style={{ transform: "translate(-50%,-50%)" }}
      />

      {/* Additive halo — soft radial glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[4.5rem] w-[4.5rem] rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.45),transparent_70%)]"
        style={{ transform: "translate(-50%,-50%)" }}
      />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-[4.5rem] w-[4.5rem] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_70%)]",
          !reduce && "ai-halo",
        )}
        style={{ transform: "translate(-50%,-50%)" }}
      />

      {/* Energy rings — tilted, counter-rotating */}
      <div
        className="absolute left-1/2 top-1/2 h-14 w-14"
        style={{ transform: "translate(-50%,-50%) rotateX(72deg)" }}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full border border-accent-violet/45",
            !reduce && "ai-ring-cw",
          )}
        />
        <div
          className={cn(
            "absolute -inset-1.5 rounded-full border border-accent-cyan/30",
            !reduce && "ai-ring-ccw",
          )}
        />
      </div>

      {/* Core — distorted violet orb with emissive pulse */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-9 w-9 rounded-full",
          "bg-[radial-gradient(circle_at_35%_30%,#c4b5fd,#7c3aed_55%,#4c1d95)]",
          "shadow-[0_0_22px_-2px_rgba(147,51,234,0.75)]",
          !reduce && "ai-core",
        )}
        style={{ transform: "translate(-50%,-50%)" }}
      />
    </div>
  );
}