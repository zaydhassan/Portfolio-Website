"use client";

import { motion } from "motion/react";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variants = fadeUp,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span" | "p" | "h2" | "h3" | "li" | "section";
  variants?: typeof fadeUp;
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({
  children,
  className,
  staggerAmount = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerAmount?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={stagger(staggerAmount)}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
    >
      {children}
    </motion.div>
  );
}