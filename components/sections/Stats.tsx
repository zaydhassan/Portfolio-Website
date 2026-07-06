"use client";

import { motion } from "motion/react";
import { STATS } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function Stats() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportReveal}
        className="grid grid-cols-2 gap-4 rounded-3xl border border-hairline bg-surface-1 p-8 sm:gap-8 sm:p-12 lg:grid-cols-4"
      >
        {STATS.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="group relative text-center sm:text-left"
          >
            <div className="font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm text-fg-subtle">{s.label}</div>
            <div className="mx-auto mt-4 h-px w-full bg-gradient-to-r from-transparent via-hairline-strong to-transparent sm:mx-0" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}