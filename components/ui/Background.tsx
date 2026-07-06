"use client";

import { useEffect, useRef } from "react";

export default function Background() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--px", `${x * 12}px`);
      el.style.setProperty("--py", `${y * 12}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Base */}
      <div className="absolute inset-0 bg-bg" />

      {/* Aurora mesh */}
      <div
        className="absolute inset-0 aurora animate-pulse-glow"
        style={{
          transform:
            "translate3d(var(--px,0), var(--py,0), 0)",
          transition: "transform 0.6s ease-out",
        }}
      />

      {/* Floating glow blobs */}
      <div className="absolute -left-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-accent-purple/10 blur-[140px] animate-float-slow" />
      <div className="absolute -right-40 top-2/3 h-[32rem] w-[32rem] rounded-full bg-accent-cyan/10 blur-[150px] animate-float-medium" />
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[150px] animate-float-slow" />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-70" />

      {/* Noise */}
      <div className="absolute inset-0 noise" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 40%, transparent 40%, var(--vignette) 100%)",
        }}
      />
    </div>
  );
}