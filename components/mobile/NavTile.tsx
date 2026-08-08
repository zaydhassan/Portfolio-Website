"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { MobileNavItem, MobileNavAccent } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import { useRipple, RippleSpans } from "@/components/mobile/Ripple";

/* Per-accent class + value bundles. `--color-accent-*` is mapped in
   globals.css `@theme inline`, so the `text-accent-*` / `bg-accent-*`
   utilities resolve to the active theme's color. `varColor` feeds the
   active-indicator glow; `spotlight` follows the cursor inside the tile;
   `ripple` tints the tap ripple. */
const ACCENT: Record<
  MobileNavAccent,
  {
    chip: string;
    underline: string;
    glow: string;
    varColor: string;
    spotlight: string;
    ripple: string;
  }
> = {
  cyan: {
    chip: "bg-accent-cyan/15 text-accent-cyan",
    underline: "bg-accent-cyan",
    glow: "hover:shadow-[0_0_34px_-10px_var(--accent-cyan)]",
    varColor: "var(--accent-cyan)",
    spotlight:
      "radial-gradient(circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent-cyan) 22%, transparent), transparent 45%)",
    ripple: "bg-accent-cyan/30",
  },
  blue: {
    chip: "bg-accent-blue/15 text-accent-blue",
    underline: "bg-accent-blue",
    glow: "hover:shadow-[0_0_34px_-10px_var(--accent-blue)]",
    varColor: "var(--accent-blue)",
    spotlight:
      "radial-gradient(circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent-blue) 22%, transparent), transparent 45%)",
    ripple: "bg-accent-blue/30",
  },
  purple: {
    chip: "bg-accent-purple/15 text-accent-purple",
    underline: "bg-accent-purple",
    glow: "hover:shadow-[0_0_34px_-10px_var(--accent-purple)]",
    varColor: "var(--accent-purple)",
    spotlight:
      "radial-gradient(circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent-purple) 22%, transparent), transparent 45%)",
    ripple: "bg-accent-purple/30",
  },
  violet: {
    chip: "bg-accent-violet/15 text-accent-violet",
    underline: "bg-accent-violet",
    glow: "hover:shadow-[0_0_34px_-10px_var(--accent-violet)]",
    varColor: "var(--accent-violet)",
    spotlight:
      "radial-gradient(circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent-violet) 22%, transparent), transparent 45%)",
    ripple: "bg-accent-violet/30",
  },
  electric: {
    chip: "bg-accent-electric/15 text-accent-electric",
    underline: "bg-accent-electric",
    glow: "hover:shadow-[0_0_34px_-10px_var(--accent-electric)]",
    varColor: "var(--accent-electric)",
    spotlight:
      "radial-gradient(circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent-electric) 22%, transparent), transparent 45%)",
    ripple: "bg-accent-electric/30",
  },
};

export default function NavTile({
  item,
  active,
  onActivate,
}: {
  item: MobileNavItem;
  active: boolean;
  onActivate: (href: string) => void;
}) {
  const reduce = useReducedMotion();
  const a = ACCENT[item.accent];
  const { ripples, onPointerDown } = useRipple();

  const tileVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
        hover: {},
      }
    : {
        hidden: { opacity: 0, x: 36, filter: "blur(8px)" },
        show: {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: { type: "spring", stiffness: 300, damping: 26 },
        },
        hover: { y: -2, scale: 1.02 },
      };

  // The active vertical indicator only renders on real-section tiles
  // (never on the assistant CTA) so the shared layoutId stays unique even
  // though AI Assistant + Contact both map to #contact.
  const showIndicator = active && !item.assistant;

  // Cursor/touch lighting — write CSS vars directly to the tile (no rerender).
  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  // Own the navigation: prevent the default anchor jump and stop the
  // event bubbling to the document-level Lenis handler (AIMenu drives
  // the bloom-timed scroll itself via window.lenis).
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onActivate(item.href);
  };

  return (
    <motion.a
      href={item.href}
      data-cursor="link"
      data-cursor-label={item.label}
      onClick={handleClick}
      onPointerDown={onPointerDown}
      onMouseMove={onMouseMove}
      variants={tileVariants}
      whileHover="hover"
      whileTap={reduce ? undefined : { scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 18 } }}
      className={cn(
        "group gradient-border relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-3 transition-colors duration-300",
        item.assistant
          ? // AI Assistant — always-lit highlighted CTA tile
            "bg-accent-cyan/10 shadow-[0_0_40px_-14px_var(--accent-cyan)]"
          : "bg-surface-1/60 hover:bg-surface-2",
        a.glow,
      )}
    >
      {/* Cursor/touch lighting overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: a.spotlight }}
      />

      {/* Glass reflection — diagonal sheen sweeps across on hover */}
      <motion.span
        aria-hidden
        variants={
          reduce
            ? { hidden: { x: "-100%", opacity: 0 }, show: { x: "-100%", opacity: 0 }, hover: {} }
            : {
                hidden: { x: "-100%", opacity: 0 },
                show: { x: "-100%", opacity: 0 },
                hover: {
                  x: "100%",
                  opacity: 1,
                  transition: { duration: 0.8, ease: "easeInOut" },
                },
              }
        }
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* Active vertical indicator (animates between tiles via layoutId) */}
      {showIndicator && (
        <motion.span
          layoutId="ai-nav-active"
          className={cn(
            "absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-full",
            a.underline,
          )}
          style={{ boxShadow: `0 0 16px ${a.varColor}` }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      {/* Animated left glow (hover, non-active tiles only) */}
      {!active && (
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full opacity-0 shadow-[0_0_12px_currentColor] transition-opacity duration-300 group-hover:opacity-100",
            a.underline,
          )}
        />
      )}

      {/* Ripple */}
      <RippleSpans ripples={ripples} className={a.ripple} />

      {/* Icon chip */}
      <span
        className={cn(
          "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-90",
          a.chip,
        )}
      >
        <Icon name={item.icon} className="h-4 w-4" />
      </span>

      {/* Title + description */}
      <span className="relative z-10 flex flex-1 flex-col">
        <span className="flex items-center font-display text-base font-medium tracking-tight text-fg">
          {item.label}
          {item.assistant && (
            <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-cyan">
              AI
            </span>
          )}
        </span>
        <span className="text-xs text-fg-subtle">{item.description}</span>
      </span>

      {/* Trailing arrow — slides in on hover */}
      <ArrowRight className="relative z-10 h-4 w-4 shrink-0 translate-x-1 text-fg-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-fg group-hover:opacity-100" />
    </motion.a>
  );
}