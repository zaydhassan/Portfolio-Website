"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { LIVE_STATUS } from "@/lib/constants";

/* ----------------------------------------------------------------
   Rotating live-status line with a pulsing green dot. Crossfades
   through LIVE_STATUS every ~3.5s. Under reduced motion the line is
   static and the pulse freezes (global CSS) — the interval also stops.
   ---------------------------------------------------------------- */
export default function LiveStatus() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  // setState inside the interval callback (not in the effect body) so
  // this never trips the set-state-in-effect rule.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setIndex((p) => (p + 1) % LIVE_STATUS.length),
      3500,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
        Live
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-medium text-fg"
        >
          {LIVE_STATUS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}