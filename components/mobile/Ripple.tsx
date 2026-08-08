"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Reusable tap-ripple. `useRipple` returns a stable `onPointerDown`
   handler + the current ripple list; render `<RippleSpans>` inside the
   interactive element (which must be `relative overflow-hidden`).
   State is mutated in an event handler (not an effect) so it never trips
   the react-hooks/set-state-in-effect rule.
   ---------------------------------------------------------------- */
export type Ripple = { id: number; x: number; y: number; size: number };

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple: Ripple = {
      id: ++idRef.current,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size,
    };
    setRipples((r) => [...r, ripple]);
    window.setTimeout(
      () => setRipples((r) => r.filter((rp) => rp.id !== ripple.id)),
      650,
    );
  };

  return { ripples, onPointerDown };
}

export function RippleSpans({
  ripples,
  className,
}: {
  ripples: Ripple[];
  className?: string;
}) {
  return (
    <AnimatePresence>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.45, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            marginLeft: -r.size / 2,
            marginTop: -r.size / 2,
          }}
          className={cn("pointer-events-none absolute rounded-full", className)}
        />
      ))}
    </AnimatePresence>
  );
}