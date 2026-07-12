"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Loader() {
  const [done, setDone] = useState(false);

  // Drive the progress bar + percentage text via direct DOM writes instead
  // of per-frame `setProgress`. The old version re-rendered React ~96 times
  // during the load window — exactly when Lighthouse measures Total Blocking
  // Time. Visually identical, far cheaper on the main thread.
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);

      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (pctRef.current) pctRef.current.textContent = `${pct}%`;

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 260);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 aurora opacity-60"
          />
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <Logo />
            </motion.div>

            <div className="flex w-55 flex-col gap-3">
              <div className="h-px w-full overflow-hidden bg-hairline">
                <div
                  ref={barRef}
                  className="h-full w-0 bg-linear-to-r from-accent-cyan via-accent-blue to-accent-violet"
                />
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
                <span>Loading</span>
                <span ref={pctRef} className="tabular-nums text-fg-muted">0%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Logo() {
  return (
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 animate-spin-slow conic-ring rounded-full opacity-80 blur-[2px]" />
      <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-bg">
        <span className="font-display text-2xl font-semibold tracking-tight text-fg">
          Z
        </span>
      </div>
      <motion.div
        className="absolute -inset-3 rounded-full"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 60px -8px rgba(139,92,246,0.6)" }}
      />
    </div>
  );
}