"use client";

import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { SITE, NAV_ITEMS, SOCIALS } from "@/lib/constants";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative mt-12 border-t border-hairline">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="grid grid-cols-2 gap-x-6 gap-y-12 lg:flex lg:flex-row lg:items-start lg:justify-between"
        >
          <motion.div variants={fadeUp} className="col-span-2 max-w-md lg:col-span-1">
            <a
              href="#home"
              data-cursor="link"
              className="flex items-center gap-2"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-accent-cyan to-accent-violet text-xs font-bold text-bg">
                Z
              </span>
              <span className="font-display text-lg font-medium text-fg">
                {SITE.name}
              </span>
            </a>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-fg-muted">
              {SITE.role}. Building intelligent digital experiences — AI applications,
              automation, and production software.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
              Navigate
            </h3>
            <ul className="flex flex-col gap-2">
              {NAV_ITEMS.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    data-cursor="link"
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
              Connect
            </h3>
            <ul className="flex flex-col gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    data-cursor="link"
                    className="flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <Icon name={s.icon} className="h-3.5 w-3.5" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Giant name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportReveal}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 overflow-hidden"
        >
          <div className="bg-gradient-to-b from-fg/10 to-fg/0 bg-clip-text text-center font-display text-[clamp(3rem,16vw,12rem)] font-semibold leading-none tracking-tight text-transparent">
            {SITE.name}
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="text-xs text-fg-subtle">
            © {year} {SITE.name}. Crafted with intent.
          </p>
          <a
            href="#home"
            data-cursor="link"
            data-cursor-label="Top"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-xs text-fg-muted transition-colors hover:text-fg"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}