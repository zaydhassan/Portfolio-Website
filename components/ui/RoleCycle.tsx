"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function RoleCycle({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [roles.length]);

  return (
    <div className="flex items-center gap-3 font-mono text-sm sm:text-base">
      <span className="text-accent-violet">$</span>
      <div className="relative h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: 24, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -24, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block bg-gradient-to-r from-fg to-fg/70 bg-clip-text text-transparent"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.span
        className="inline-block h-5 w-[2px] bg-accent-cyan"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}