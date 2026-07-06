"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";

export default function Services() {
  return (
    <section
      id="services"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading
        eyebrow="Services"
        title={
          <>
            What I <span className="gradient-text">build</span> for teams.
          </>
        }
        description="End-to-end engineering across AI, full-stack, automation, and interface craft — delivered as production-ready products."
      />

      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={viewportReveal}
        className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface-1 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-hairline-strong"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-accent-violet/20 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-hairline bg-surface-2 text-accent-violet">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="relative mt-6 font-display text-xl font-medium text-fg">
              {s.title}
            </h3>
            <p className="relative mt-3 text-pretty leading-relaxed text-fg-muted">
              {s.description}
            </p>

            <ul className="relative mt-6 flex flex-wrap gap-2">
              {s.features.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-hairline bg-surface-2 px-3 py-1 text-[11px] text-fg-muted"
                >
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              data-cursor="link"
              className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-fg/70 transition-colors group-hover:text-fg"
            >
              Request
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}