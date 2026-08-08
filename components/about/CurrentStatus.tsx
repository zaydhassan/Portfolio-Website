"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CURRENTLY_BUILDING } from "@/lib/data";

/* ----------------------------------------------------------------
   CurrentStatus — a compact "Currently Building" pill that crossfades
   through CURRENTLY_BUILDING every ~3.5s with a pulsing live dot.
   Modeled on mobile/LiveStatus but reads emoji + label pairs. Under
   reduced motion the first entry is shown statically and the pulse /
   rotation freeze (global CSS handles the ping animation).
   ---------------------------------------------------------------- */
export default function CurrentStatus() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setIndex((p) => (p + 1) % CURRENTLY_BUILDING.length),
      3500,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  const status = CURRENTLY_BUILDING[index] ?? CURRENTLY_BUILDING[0];

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface-1/80 px-3.5 py-1.5 backdrop-blur-md">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
        Now
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={status.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 text-xs font-medium text-fg"
        >
          <span aria-hidden>{status.emoji}</span>
          {status.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}