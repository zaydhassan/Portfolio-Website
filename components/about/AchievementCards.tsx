"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowUpRight } from "lucide-react";
import { ACHIEVEMENT_CARDS, PROJECTS } from "@/lib/data";
import { fadeUp, stagger, viewportReveal } from "@/lib/animations/variants";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import PremiumCard from "@/components/ui/PremiumCard";

const ACCENT_TEXT: Record<string, string> = {
  cyan: "text-accent-cyan",
  purple: "text-accent-purple",
  blue: "text-accent-blue",
};

/* ----------------------------------------------------------------
   AchievementCards — replaces the plain bullet list. Each card expands
   on hover (desktop) or tap (touch) to reveal Challenge → Solution →
   Technologies → Outcome, animated with a spring. A `+` affordance
   rotates to `×` when open; aria-expanded keeps it accessible.
   ---------------------------------------------------------------- */
function AchievementItem({
  index,
}: {
  index: number;
}) {
  const coarse = useMediaQuery("(pointer: coarse)");
  const a = ACHIEVEMENT_CARDS[index];
  const [open, setOpen] = useState(false);
  const project = a.projectSlug
    ? PROJECTS.find((p) => p.slug === a.projectSlug)
    : undefined;

  // Desktop: hover drives expansion. Touch: tap toggles. The two paths
  // share the same `open` state so the spring animation is identical.
  const hoverProps =
    coarse
      ? {}
      : {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        };

  return (
    <motion.div variants={fadeUp}>
      <PremiumCard
        accent={a.accent}
        magnetic={false}
        glare
        ripple={coarse}
        className="p-5"
      >
        <button
          type="button"
          onClick={() => coarse && setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 text-left"
          {...hoverProps}
        >
          <span className="font-display text-base font-medium text-fg">
            {a.title}
          </span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline bg-bg/60",
              ACCENT_TEXT[a.accent],
            )}
          >
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-4 text-sm">
                <DetailRow label="Challenge" value={a.challenge} />
                <DetailRow label="Solution" value={a.solution} />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
                    Technologies
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {a.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-hairline bg-bg/50 px-2 py-0.5 text-[11px] text-fg-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <DetailRow
                  label="Outcome"
                  value={a.outcome}
                  accent={ACCENT_TEXT[a.accent]}
                />
                {project && (
                  <a
                    href="#work"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent-cyan transition-colors hover:text-accent-violet"
                  >
                    View {project.title}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PremiumCard>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-pretty leading-relaxed text-fg-muted",
          accent,
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default function AchievementCards() {
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={viewportReveal}
      className="flex flex-col gap-3"
    >
      {ACHIEVEMENT_CARDS.map((_, i) => (
        <AchievementItem key={i} index={i} />
      ))}
    </motion.div>
  );
}