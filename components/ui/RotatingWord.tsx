"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { easeExpo } from "@/lib/animations/variants";

/* ----------------------------------------------------------------
   RotatingWord — the final keyword of the About headline morphs
   through a list with blur + opacity + vertical-slide transitions.

   - `aria-live="polite"` announces the change without spamming.
   - Each word is `white-space: nowrap` and the container reserves
     a min-width sized to the longest word so the headline never
     reflows (CLS-safe).
   - Under reduced motion the first word is rendered statically and
     the rotation interval is skipped entirely.
   ---------------------------------------------------------------- */
export default function RotatingWord({
  words,
  interval = 2200,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  // setState lives inside the interval callback (not the effect body)
  // so it never trips the set-state-in-effect rule.
  useEffect(() => {
    if (reduce || words.length <= 1) return;
    const id = window.setInterval(
      () => setIndex((p) => (p + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [reduce, interval, words.length]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const word = words[index] ?? words[0];

  return (
    <span
      className={`relative inline-block align-bottom ${className ?? ""}`}
      // Reserve space for the longest word so the headline never reflows.
      style={{ minWidth: `${longest.length}ch` }}
      aria-live="polite"
    >
      {/* Invisible sizer keeps the box width stable across rotations. */}
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <span className="absolute inset-0 flex items-baseline justify-center">
        {reduce ? (
          <span className="gradient-text whitespace-nowrap">{word}</span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: easeExpo }}
              className="gradient-text whitespace-nowrap"
            >
              {word}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </span>
  );
}