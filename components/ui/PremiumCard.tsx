"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useRipple, RippleSpans } from "@/components/mobile/Ripple";

/* ----------------------------------------------------------------
   PremiumCard — the shared container that gives every About card
   its layered micro-interactions:

     • magnetic hover     (useMagnetic, pointer:fine only)
     • soft 3D tilt+glare (inline TiltCard pattern, low intensity)
     • animated border    (.gradient-border masked gradient)
     • moving light sweep (a diagonal gradient that pans on hover)
     • soft glow on hover (accent box-shadow)
     • spring lift        (subtle -6px rise)
     • ripple on click    (useRipple + RippleSpans)

   Reduced motion disables magnetic / tilt / sweep (keeps ripple as
   a click confirmation). Touch is safe — useMagnetic is pointer:fine
   gated, and tilt/sweep are hover-driven so they no-op on touch.
   ---------------------------------------------------------------- */

const GLOW = {
  blue: "0 0 40px -10px var(--glow-blue)",
  purple: "0 0 40px -10px var(--glow-purple)",
  cyan: "0 0 40px -10px var(--glow-cyan)",
} as const;

type Accent = "blue" | "purple" | "cyan";

export default function PremiumCard({
  children,
  className,
  accent = "purple",
  magnetic = true,
  glare = true,
  ripple = true,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  accent?: Accent;
  magnetic?: boolean;
  glare?: boolean;
  ripple?: boolean;
  as?: "div" | "article" | "li";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Magnetic drift toward the cursor (no-op on touch / reduced motion).
  const mag = useMagnetic(ref, magnetic && !reduce ? 0.3 : 0);

  // Light 3D tilt + glare (mirrors TiltCard at a calm intensity).
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });
  const glareX = useSpring(gx, { stiffness: 150, damping: 20 });
  const glareY = useSpring(gy, { stiffness: 150, damping: 20 });

  // Hover lift — combined with the magnetic y so both can act at once.
  const lift = useMotionValue(0);
  const liftY = useSpring(lift, { stiffness: 250, damping: 22 });
  const y = useTransform([mag.y, liftY], ([a, b]) => (a as number) + (b as number));

  // Light sweep pans across the card on hover.
  const sweep = useMotionValue(0);
  const sweepX = useSpring(sweep, { stiffness: 120, damping: 30 });

  // Glow ramps with the lift.
  const boxShadow = useTransform(
    liftY,
    [-6, 0],
    [GLOW[accent], "0 0 0px rgba(0,0,0,0)"],
  );

  const glareBg = useTransform(
    [glareX, glareY],
    ([x, yy]) =>
      `radial-gradient(circle at ${x}% ${yy}%, rgba(255,255,255,0.16), transparent 45%)`,
  );

  const { ripples, onPointerDown } = useRipple();

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rx.set((0.5 - py) * 4);
    ry.set((px - 0.5) * 4);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const onEnter = () => {
    if (reduce) return;
    lift.set(-6);
    sweep.set(250);
  };

  const onLeave = () => {
    lift.set(0);
    sweep.set(0);
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  };

  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onPointerDown={ripple ? onPointerDown : undefined}
      style={{
        x: mag.x,
        y,
        rotateX,
        rotateY,
        boxShadow,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      data-cursor="card"
      className={cn(
        "group gradient-border relative overflow-hidden rounded-2xl border border-hairline bg-surface-1/60 backdrop-blur-md transition-colors duration-300 hover:border-hairline-strong",
        className,
      )}
    >
      {/* Moving light sweep */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)",
            backgroundSize: "250% 250%",
            backgroundPositionX: sweepX,
          }}
        />
      )}

      {/* Cursor-tracking glare */}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
          style={{ background: glareBg }}
        />
      )}

      {/* Content sits above the overlays + ripples */}
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>

      {ripple && (
        <RippleSpans
          ripples={ripples}
          className="bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_60%)]"
        />
      )}
    </Tag>
  );
}