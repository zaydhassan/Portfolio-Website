"use client";

import { motion } from "motion/react";
import { CURRENT_FOCUS } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

const ACCENT_TEXT: Record<string, string> = {
  cyan: "text-accent-cyan",
  purple: "text-accent-purple",
  blue: "text-accent-blue",
  violet: "text-accent-violet",
};

const ACCENT_BORDER: Record<string, string> = {
  cyan: "hover:border-accent-cyan/50",
  purple: "hover:border-accent-purple/50",
  blue: "hover:border-accent-blue/50",
  violet: "hover:border-accent-violet/50",
};

/* ----------------------------------------------------------------
   CurrentFocus — the active focus-area chips, replacing the old
   "Selected achievements" block. Each chip is a hoverable glass pill
   that lifts its accent color on interaction.
   ---------------------------------------------------------------- */
export default function CurrentFocus() {
  return (
    <motion.div
      variants={stagger(0.06)}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      className="flex flex-wrap gap-2.5"
    >
      {CURRENT_FOCUS.map((item) => (
        <motion.span
          key={item.label}
          variants={fadeUp}
          className={cn(
            "rounded-full border border-hairline bg-surface-1/80 px-3.5 py-1.5 text-sm font-medium text-fg backdrop-blur-md transition-colors",
            ACCENT_BORDER[item.accent],
          )}
        >
          <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle", `bg-current ${ACCENT_TEXT[item.accent]}`)} />
          {item.label}
        </motion.span>
      ))}
    </motion.div>
  );
}