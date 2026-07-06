"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { formatNumber } from "@/lib/utils";

export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(Math.round(display))}
      {suffix}
    </span>
  );
}