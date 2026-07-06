"use client";

import { motion } from "motion/react";
import { SOCIALS } from "@/lib/constants";
import Icon from "@/components/ui/Icon";

export default function SocialRail() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-6 top-1/2 z-200 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex"
    >
      {SOCIALS.filter((s) => s.icon !== "resume").map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          aria-label={s.label}
          data-cursor="link"
          data-cursor-label={s.label}
          className="group relative grid h-9 w-9 place-items-center rounded-full border border-hairline text-fg-subtle transition-all duration-300 hover:border-accent-violet/40 hover:text-fg"
        >
          <Icon name={s.icon} className="h-4 w-4" />
          <span className="pointer-events-none absolute left-12 whitespace-nowrap rounded-full border border-hairline bg-bg-elevated/90 px-3 py-1 text-xs text-fg opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
            {s.label}
          </span>
        </a>
      ))}

      <span className="mt-2 h-16 w-px bg-gradient-to-b from-hairline-strong to-transparent" />
    </motion.div>
  );
}