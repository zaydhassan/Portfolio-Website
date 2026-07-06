"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setShow(y > window.innerHeight * 0.9);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#home"
          data-cursor="link"
          data-cursor-label="Top"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 right-6 z-250 grid h-12 w-12 place-items-center rounded-full border border-hairline bg-bg-elevated/80 text-fg backdrop-blur-md transition-colors hover:border-hairline-strong"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}