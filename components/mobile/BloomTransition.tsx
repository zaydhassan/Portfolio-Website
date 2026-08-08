"use client";

import { motion, useReducedMotion } from "motion/react";

/* ----------------------------------------------------------------
   Aurora light-bloom overlay — the sweep that covers the viewport when
   a mobile nav item is tapped, then fades to reveal the target section
   already scrolled into place. Theme-tinted via --accent-* / .aurora.
   Disabled entirely under prefers-reduced-motion (instant scroll).
   ---------------------------------------------------------------- */
export default function BloomTransition({ href }: { href: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <motion.div
      key={href}
      className="pointer-events-none fixed inset-0 z-[320] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.42, 1] }}
    >
      {/* Aurora wash scaling outward */}
      <motion.div
        className="absolute inset-0 aurora"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.25, opacity: [0, 0.95, 0] }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.42, 1] }}
      />
      {/* Central light bloom */}
      <motion.div
        className="h-44 w-44 rounded-full bg-white blur-3xl"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 2.2, opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.45, 1] }}
      />
    </motion.div>
  );
}