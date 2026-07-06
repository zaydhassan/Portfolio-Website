"use client";

import { motion } from "motion/react";
import { easeExpo } from "@/lib/animations/variants";

const ACCENT: Record<string, [string, string]> = {
  cyan: ["#22d3ee", "#3b82f6"],
  purple: ["#a855f7", "#8b5cf6"],
  blue: ["#3b82f6", "#22d3ee"],
};

export default function RadialProgress({
  value,
  accent = "purple",
  size = 64,
  stroke = 5,
  showLabel = true,
}: {
  value: number;
  accent?: "cyan" | "purple" | "blue";
  size?: number;
  stroke?: number;
  showLabel?: boolean;
}) {
  const [from, to] = ACCENT[accent] ?? ACCENT.purple;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `ring-${accent}-${size}`;
  const offset = c * (1 - value / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.3, ease: easeExpo }}
          style={{ filter: `drop-shadow(0 0 6px ${from}55)` }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xs font-medium text-fg">
            {value}
            <span className="text-fg-subtle">%</span>
          </span>
        </div>
      )}
    </div>
  );
}