"use client";

import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { PHILOSOPHY } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import PremiumCard from "@/components/ui/PremiumCard";

/* ----------------------------------------------------------------
   PhilosophyCard — a highlighted card listing the engineering
   principles. Each principle reveals in sequence with a fadeUp +
   stagger, anchored by a small gradient marker.
   ---------------------------------------------------------------- */
export default function PhilosophyCard() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
    >
      <PremiumCard accent="cyan" magnetic={false} glare className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-bg/60 text-accent-cyan">
            <Brain className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-fg">
              Engineering Philosophy
            </h3>
            <p className="text-xs text-fg-subtle">
              The principles behind everything I build.
            </p>
          </div>
        </div>

        <motion.ul
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="flex flex-col gap-3"
        >
          {PHILOSOPHY.map((p) => (
            <motion.li
              key={p.title}
              variants={fadeUp}
              className="flex items-start gap-3"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet" />
              <div>
                <p className="text-sm font-medium text-fg">{p.title}</p>
                <p className="text-xs leading-relaxed text-fg-subtle">
                  {p.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </PremiumCard>
    </motion.div>
  );
}