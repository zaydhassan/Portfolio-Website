"use client";

import { motion } from "motion/react";
import { Sparkles, MapPin } from "lucide-react";
import { ABOUT, ACHIEVEMENTS } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TiltCard from "@/components/ui/TiltCard";

export default function About() {
  return (
    <section id="about" className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 sm:py-36">
      <SectionHeading
        eyebrow="About"
        title={
          <>
            Engineering at the edge of <span className="gradient-text">intelligence</span> &amp; interface.
          </>
        }
        description={ABOUT.bio[0]}
      />

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Profile */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportReveal}>
          <TiltCard className="group gradient-border rounded-3xl" intensity={6}>
            <div className="relative overflow-hidden rounded-3xl glass p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-bg-elevated">
                {/* Animated conic border avatar */}
                <div className="absolute inset-0 animate-spin-slow conic-ring opacity-40 blur-xl" />
                <div className="absolute inset-2 rounded-[1.1rem] bg-gradient-to-b from-bg-elevated to-bg" />
                <div className="absolute inset-4 flex items-center justify-center rounded-[1rem] border border-white/10 bg-[#0b0b10]">
                  <span className="font-display text-[8rem] font-semibold leading-none gradient-text">
                    Z
                  </span>
                </div>
                {/* Floating badges */}
                <motion.div
                  className="absolute left-4 top-4 rounded-full border border-white/10 bg-bg/70 px-3 py-1.5 text-xs backdrop-blur-md"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="flex items-center gap-1.5 text-fg-muted">
                    <MapPin className="h-3 w-3 text-accent-cyan" />
                    {ABOUT.location}
                  </span>
                </motion.div>
                <motion.div
                  className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-bg/70 px-3 py-1.5 text-xs backdrop-blur-md"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="flex items-center gap-1.5 text-fg-muted">
                    <Sparkles className="h-3 w-3 text-accent-violet" />
                    AI · Full-Stack
                  </span>
                </motion.div>
              </div>
            </div>
          </TiltCard>

          {/* Stats under profile */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {ABOUT.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-hairline bg-surface-1 p-4"
              >
                <div className="font-display text-3xl font-semibold text-fg">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-fg-subtle">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bio + mission + achievements */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="flex flex-col gap-6"
        >
          {ABOUT.bio.slice(1).map((p, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="text-pretty text-lg leading-relaxed text-fg-muted"
            >
              {p}
            </motion.p>
          ))}

          <motion.blockquote
            variants={fadeUp}
            className="relative rounded-2xl border border-hairline bg-surface-1 p-6"
          >
            <span className="absolute -top-3 left-6 font-display text-5xl text-accent-violet/40">
              &ldquo;
            </span>
            <p className="text-xl font-medium leading-relaxed text-fg">
              {ABOUT.mission}
            </p>
          </motion.blockquote>

          <motion.div variants={fadeUp}>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-fg-subtle">
              Selected achievements
            </h3>
            <ul className="flex flex-col gap-3">
              {ACHIEVEMENTS.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-fg-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet" />
                  <span className="text-pretty">{a}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}