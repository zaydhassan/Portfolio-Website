"use client";

import { motion } from "motion/react";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-fg-subtle"
        >
          <span className="h-px w-8 bg-gradient-to-r from-accent-cyan to-accent-violet" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}