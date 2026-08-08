"use client";

import { useMemo } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Backdrop behind the AI menu. Heavy blur + layered dark glass so the
   page completely disappears, with animated gradient noise, tiny glowing
   stars, a central light bloom, a pointer/touch-reactive spotlight, and
   a few drifting ambient particles. Clicking the backdrop closes.
   ---------------------------------------------------------------- */
export default function MenuBackdrop({ onClose }: { onClose: () => void }) {
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, var(--glow-purple), transparent 45%)`;

  const track = (clientX: number, clientY: number) => {
    x.set((clientX / window.innerWidth) * 100);
    y.set((clientY / window.innerHeight) * 100);
  };

  const stars = useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: 14 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 1.6,
      delay: Math.random() * 4,
      accent: Math.random() > 0.5,
    }));
    /* eslint-enable react-hooks/purity */
  }, []);

  return (
    <motion.div
      className="absolute inset-0"
      onClick={onClose}
      onPointerMove={(e) => track(e.clientX, e.clientY)}
      onPointerDown={(e) => track(e.clientX, e.clientY)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Heavy blur base — the page disappears behind this */}
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-3xl" />
      {/* Layered dark glass for depth */}
      <div className="absolute inset-0 bg-bg/40" />

      {/* Subtle aurora wash */}
      <div className="absolute inset-0 aurora opacity-40" />

      {/* Animated gradient noise — drifting aurora tint + grain */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, var(--aurora-purple), transparent 40%), radial-gradient(circle at 70% 80%, var(--aurora-cyan), transparent 40%)",
          backgroundSize: "200% 200%",
          animation: "bg-drift 18s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-0 noise opacity-[0.05]" />

      {/* Tiny glowing stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className={cn(
            "absolute rounded-full blur-[1px] animate-pulse-glow",
            s.accent ? "bg-accent-cyan" : "bg-white",
          )}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}

      {/* Central light bloom */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-purple/20 blur-3xl animate-pulse-glow" />

      {/* Pointer/touch-reactive spotlight */}
      <motion.div
        style={{ background: spotlight }}
        className="absolute inset-0 opacity-60 mix-blend-screen"
      />

      {/* Ambient floating particles in the negative space */}
      <div className="absolute left-[12%] top-[18%] h-1.5 w-1.5 rounded-full bg-accent-cyan opacity-80 blur-[2px] animate-float-slow" />
      <div className="absolute right-[16%] top-[28%] h-1 w-1 rounded-full bg-accent-violet opacity-80 blur-[2px] animate-float-medium" />
      <div className="absolute left-[22%] bottom-[22%] h-1.5 w-1.5 rounded-full bg-accent-blue opacity-80 blur-[2px] animate-float-slow" />
      <div className="absolute right-[24%] bottom-[16%] h-1 w-1 rounded-full bg-accent-purple opacity-80 blur-[2px] animate-float-medium" />
    </motion.div>
  );
}