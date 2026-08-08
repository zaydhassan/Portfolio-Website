"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { QUICK_ACTIONS } from "@/lib/constants";
import type { MobileNavAccent } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useRipple, RippleSpans } from "@/components/mobile/Ripple";

const CHIP_ACCENT: Record<
  MobileNavAccent,
  { chip: string; glow: string; ripple: string }
> = {
  cyan: {
    chip: "bg-accent-cyan/15 text-accent-cyan",
    glow: "hover:shadow-[0_0_24px_-8px_var(--accent-cyan)]",
    ripple: "bg-accent-cyan/30",
  },
  blue: {
    chip: "bg-accent-blue/15 text-accent-blue",
    glow: "hover:shadow-[0_0_24px_-8px_var(--accent-blue)]",
    ripple: "bg-accent-blue/30",
  },
  purple: {
    chip: "bg-accent-purple/15 text-accent-purple",
    glow: "hover:shadow-[0_0_24px_-8px_var(--accent-purple)]",
    ripple: "bg-accent-purple/30",
  },
  violet: {
    chip: "bg-accent-violet/15 text-accent-violet",
    glow: "hover:shadow-[0_0_24px_-8px_var(--accent-violet)]",
    ripple: "bg-accent-violet/30",
  },
  electric: {
    chip: "bg-accent-electric/15 text-accent-electric",
    glow: "hover:shadow-[0_0_24px_-8px_var(--accent-electric)]",
    ripple: "bg-accent-electric/30",
  },
};

function QuickChip({
  action,
  onActivate,
  onClose,
}: {
  action: (typeof QUICK_ACTIONS)[number];
  onActivate: (href: string) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const { x, y } = useMagnetic(ref, 0.3);
  const { ripples, onPointerDown } = useRipple();
  const a = CHIP_ACCENT[action.accent];
  const external = !action.href.startsWith("#");

  return (
    <motion.a
      ref={ref}
      href={action.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-cursor="link"
      data-cursor-label={action.label}
      style={{ x, y }}
      onPointerDown={onPointerDown}
      onClick={(e) => {
        if (external) {
          // Let the browser open the resume / GitHub in a new tab.
          onClose();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        onActivate(action.href);
      }}
      whileHover={reduce ? undefined : { scale: 1.05 }}
      whileTap={
        reduce
          ? undefined
          : { scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 18 } }
      }
      className={cn(
        "group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border border-hairline-strong bg-surface-1/70 px-3.5 py-2 text-xs font-medium text-fg backdrop-blur-md backdrop-saturate-150 transition-colors duration-300",
        a.glow,
      )}
    >
      <RippleSpans ripples={ripples} className={a.ripple} />
      <span
        className={cn(
          "relative z-10 grid h-5 w-5 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110",
          a.chip,
        )}
      >
        <Icon name={action.icon} className="h-3 w-3" />
      </span>
      <span className="relative z-10 whitespace-nowrap">{action.label}</span>
    </motion.a>
  );
}

export default function QuickActions({
  onActivate,
  onClose,
}: {
  onActivate: (href: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {QUICK_ACTIONS.map((action) => (
        <QuickChip
          key={action.label}
          action={action}
          onActivate={onActivate}
          onClose={onClose}
        />
      ))}
    </div>
  );
}