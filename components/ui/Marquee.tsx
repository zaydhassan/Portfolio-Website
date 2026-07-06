"use client";

import { cn } from "@/lib/utils";

export default function Marquee({
  items,
  className,
  duration = 38,
}: {
  items: string[];
  className?: string;
  duration?: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]",
        className,
      )}
    >
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-3 font-display text-2xl font-medium text-fg-subtle sm:text-3xl"
          >
            {item}
            <span className="text-accent-violet/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}