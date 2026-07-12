"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  AnimatePresence,
} from "motion/react";

type CursorVariant = "default" | "link" | "card" | "text";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Track the last hovered element so we only touch React state when the
  // interactive target actually changes — otherwise every pixel of mouse
  // movement re-renders this component (and its spring-driven subtree).
  const lastInteractive = useRef<HTMLElement | null>(null);
  const lastHidden = useRef(true);

  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  const velX = useVelocity(springX);
  const velY = useVelocity(springY);
  // Derive cursor speed from velocity via a derived motion value instead of a
  // perpetual requestAnimationFrame loop (which kept the main thread busy even
  // when the mouse was idle).
  const speedRaw = useTransform(
    [velX, velY],
    ([vx, vy]) => Math.hypot(vx as number, vy as number),
  );
  const speed = useSpring(speedRaw, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      // Position updates go straight to motion values (no React re-render).
      x.set(e.clientX);
      y.set(e.clientY);

      // Only flip `hidden` once, on the first move.
      if (lastHidden.current) {
        lastHidden.current = false;
        setHidden(false);
      }

      const el = e.target as HTMLElement;
      const interactive = el.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor]",
      ) as HTMLElement | null;

      // Skip the setState work entirely while hovering the same element.
      if (interactive === lastInteractive.current) return;
      lastInteractive.current = interactive;

      if (interactive) {
        const cursorAttr = interactive.getAttribute("data-cursor");
        const labelAttr = interactive.getAttribute("data-cursor-label");
        if (cursorAttr === "card") {
          setVariant("card");
          setLabel(labelAttr);
        } else if (cursorAttr === "text") {
          setVariant("text");
          setLabel(null);
        } else {
          setVariant("link");
          setLabel(labelAttr);
        }
      } else {
        setVariant("default");
        setLabel(null);
      }
    };

    const leave = () => {
      lastHidden.current = true;
      lastInteractive.current = null;
      setHidden(true);
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  // Only hide the native cursor while the custom one is actually on screen.
  // This guarantees a visible cursor (the OS one) as a fallback during the
  // loader, before first pointer movement, or if this component ever fails
  // to mount — instead of leaving the user with no cursor at all.
  useEffect(() => {
    const root = document.documentElement;
    if (enabled && !hidden) root.classList.add("custom-cursor-active");
    else root.classList.remove("custom-cursor-active");
    return () => root.classList.remove("custom-cursor-active");
  }, [enabled, hidden]);

  if (!enabled) return null;

  const size = variant === "card" ? 96 : variant === "link" ? 64 : 14;
  const skew = Math.min(speed.get() / 40, 0.4);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-10002 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Glow ring — trails the pointer via a spring for a smooth feel */}
          <motion.div
            className="absolute top-0 left-0 rounded-full"
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
              willChange: "transform",
            }}
          >
            <motion.div
              className="flex items-center justify-center rounded-full border border-white/30"
              style={{ willChange: "width, height, backgroundColor, borderColor" }}
              animate={{
                width: size,
                height: size,
                backgroundColor:
                  variant === "default"
                    ? "rgba(255,255,255,0)"
                    : variant === "card"
                      ? "rgba(139,92,246,0.12)"
                      : "rgba(34,211,238,0.10)",
                borderColor:
                  variant === "card"
                    ? "rgba(139,92,246,0.45)"
                    : "rgba(255,255,255,0.35)",
                rotate: variant === "card" ? 45 : 0,
                skewX: skew,
                skewY: skew,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {label && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="select-none px-2 text-center text-[10px] font-medium uppercase tracking-wider text-white"
                >
                  {label}
                </motion.span>
              )}
            </motion.div>
          </motion.div>

          {/* Core dot — follows the pointer 1:1 (raw motion values, no
              spring) so it stays perfectly aligned with the real mouse. */}
          <motion.div
            className="absolute top-0 left-0 rounded-full bg-white mix-blend-difference"
            style={{
              x,
              y,
              translateX: "-50%",
              translateY: "-50%",
              willChange: "transform",
            }}
            animate={{
              width: variant === "default" ? 6 : 4,
              height: variant === "default" ? 6 : 4,
              opacity: variant === "card" ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}