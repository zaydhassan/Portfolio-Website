"use client";

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-bg" />

      {/* Aurora mesh — static. Previously animated opacity on a full-viewport
          gradient layer (animate-pulse-glow) and a mousemove-driven
          transform via --px/--py; both forced continuous repainting/style
          recalc of a huge layer. Removed for main-thread/compositor perf. */}
      <div className="absolute inset-0 aurora" />

      {/* Floating glow blobs */}
      <div className="absolute -left-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-accent-purple/10 blur-[80px] animate-float-slow" />
      <div className="absolute -right-40 top-2/3 h-[32rem] w-[32rem] rounded-full bg-accent-cyan/10 blur-[80px] animate-float-medium" />
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[80px] animate-float-slow" />

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