"use client";

import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { ABOUT } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import RotatingWord from "@/components/ui/RotatingWord";
import AboutBackground from "@/components/about/AboutBackground";
import StoryFlow from "@/components/about/StoryFlow";
import CurrentStatus from "@/components/about/CurrentStatus";
import StatGrid from "@/components/about/StatGrid";
import CurrentFocus from "@/components/about/CurrentFocus";
import PhilosophyCard from "@/components/about/PhilosophyCard";
import { useMediaQuery } from "@/hooks/use-media-query";

/* Living AI Core — desktop-only (>=768px), loaded in an isolated /about-core
   route via <iframe> so three.js is never in the main page's chunk graph
   (mobile never fetches it). The gradient "Z" fills the slot on phones. */
function CoreFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="font-display text-[8rem] font-semibold leading-none gradient-text">
        Z
      </span>
    </div>
  );
}

export default function About() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:py-36"
    >
      <AboutBackground />

      <SectionHeading
        eyebrow="About"
        title={
          <>
            Engineering at the edge of &amp;{" "}
            <RotatingWord
              words={[
                "Intelligence",
                "Automation",
                "AI",
                "Innovation",
                "Interfaces",
                "Products",
              ]}
            />
          </>
        }
        description={ABOUT.bio[0]}
      />

      <StoryFlow />

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12 lg:gap-16">
        {/* Profile — living AI Core */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportReveal}>
          <TiltCard className="group gradient-border rounded-3xl" intensity={6}>
            <div className="relative overflow-hidden rounded-3xl glass p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-bg-elevated">
                {/* Animated conic border avatar */}
                <div className="absolute inset-0 animate-spin-slow conic-ring opacity-40 blur-xl" />
                <div className="absolute inset-2 rounded-[1.1rem] bg-gradient-to-b from-bg-elevated to-bg" />
                <div className="absolute inset-4 overflow-hidden rounded-[1rem] border border-white/10 bg-[#0b0b10]">
                  {isDesktop ? (
                    <iframe
                      src="/about-core"
                      title="About AI core scene"
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full border-0 bg-[#0b0b10]"
                    />
                  ) : (
                    <CoreFallback />
                  )}
                </div>
                {/* Floating badges */}
                <motion.div
                  className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-bg/70 px-3 py-1.5 text-xs backdrop-blur-md"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="flex items-center gap-1.5 text-fg-muted">
                    <MapPin className="h-3 w-3 text-accent-cyan" />
                    {ABOUT.location}
                  </span>
                </motion.div>
                <motion.div
                  className="absolute bottom-4 right-4 z-10 rounded-full border border-white/10 bg-bg/70 px-3 py-1.5 text-xs backdrop-blur-md"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="flex items-center gap-1.5 text-fg-muted">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan/60 animate-pulse-glow" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
                    </span>
                    AI CORE · ONLINE
                  </span>
                </motion.div>
              </div>
            </div>
          </TiltCard>

          {/* Interactive stats under profile */}
          <div className="mt-6">
            <StatGrid />
          </div>
        </motion.div>

        {/* Bio + mission + achievements + philosophy */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="flex flex-col gap-6"
        >
          <motion.div variants={fadeUp}>
            <CurrentStatus />
          </motion.div>

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
              Current focus
            </h3>
            <CurrentFocus />
          </motion.div>

          <PhilosophyCard />
        </motion.div>
      </div>
    </section>
  );
}