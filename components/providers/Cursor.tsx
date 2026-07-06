"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
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

  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  const velX = useVelocity(springX);
  const velY = useVelocity(springY);
  const speed = useSpring(
    Math.hypot(velX.get(), velY.get()),
    { stiffness: 120, damping: 20 },
  );

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);

      const el = e.target as HTMLElement;
      const interactive = el.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor]",
      ) as HTMLElement | null;

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

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  useEffect(() => {
    const updateSpeed = () => {
      speed.set(Math.hypot(velX.get(), velY.get()));
      raf = requestAnimationFrame(updateSpeed);
    };
    let raf = requestAnimationFrame(updateSpeed);
    return () => cancelAnimationFrame(raf);
  }, [speed, velX, velY]);

  if (!enabled) return null;

  const size = variant === "card" ? 96 : variant === "link" ? 64 : 14;
  const skew = Math.min(speed.get() / 40, 0.4);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-9999 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute top-0 left-0 rounded-full"
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <motion.div
              className="flex items-center justify-center rounded-full border border-white/30 backdrop-blur-md"
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

          {/* Core dot */}
          <motion.div
            className="absolute top-0 left-0 rounded-full bg-white mix-blend-difference"
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
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