"use client";

import { motion } from "motion/react";
import { viewportReveal } from "@/lib/animations/variants";

export default function Divider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={viewportReveal}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto my-2 h-px w-full max-w-7xl origin-center bg-gradient-to-r from-transparent via-hairline to-transparent"
    />
  );
}