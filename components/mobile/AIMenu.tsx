"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { SITE, SOCIALS } from "@/lib/constants";
import type { MobileNavItem } from "@/lib/constants";
import type { SocialLink } from "@/types";
import { stagger, easeExpo } from "@/lib/animations/variants";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AICore from "@/components/mobile/AICore";
import MenuBackdrop from "@/components/mobile/MenuBackdrop";
import NavTile from "@/components/mobile/NavTile";
import QuickActions from "@/components/mobile/QuickActions";
import LiveStatus from "@/components/mobile/LiveStatus";
import LetsBuildCard from "@/components/mobile/LetsBuildCard";
import SocialButton from "@/components/mobile/SocialButton";
import BloomTransition from "@/components/mobile/BloomTransition";

/* Socials shown bottom-up in the user's requested order. */
const SOCIAL_ORDER = ["github", "linkedin", "resume", "mail"] as const;

// Minimal shape of the Lenis instance exposed on window by SmoothScroll.
type LenisLike = {
  scrollTo: (target: HTMLElement, opts?: { offset?: number; duration?: number }) => void;
};

export default function AIMenu({
  open,
  onClose,
  items,
  active,
}: {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
  active: string;
}) {
  const reduce = useReducedMotion();
  const [transitioning, setTransitioning] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Focus the close button on open, trap Tab, close on Escape, and
  // restore focus to the trigger when the menu closes.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  const scrollToTarget = useCallback((href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Bloom-timed navigation: flash the aurora bloom, close the menu, then
  // smooth-scroll to the target so it's revealed as the bloom clears.
  const onSelect = useCallback(
    (href: string) => {
      setTransitioning((cur) => cur ?? href);
      onClose();
      window.setTimeout(() => scrollToTarget(href), 70);
      window.setTimeout(() => setTransitioning(null), 640);
    },
    [onClose, scrollToTarget],
  );

  const socials = SOCIAL_ORDER.map((icon) =>
    SOCIALS.find((s) => s.icon === icon),
  ).filter((s): s is SocialLink => Boolean(s));

  // Phased reveal for the cinematic open sequence (~800ms). Under reduced
  // motion everything snaps to opacity-only with no delay/blur.
  const reveal = (delay: number) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.001 },
        }
      : {
          initial: { opacity: 0, y: 10, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay, duration: 0.5, ease: easeExpo },
        };

  const panelVariants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 30, scale: 0.96, filter: "blur(12px)" },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { type: "spring" as const, stiffness: 260, damping: 28 },
        },
        exit: {
          opacity: 0,
          y: 20,
          scale: 0.97,
          filter: "blur(10px)",
          transition: { duration: 0.25 },
        },
      };

  return (
    <>
      {/* Bloom overlay — a sibling of the panel so it can outlive the exit */}
      {transitioning && (
        <BloomTransition key={transitioning} href={transitioning} />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MenuBackdrop onClose={onClose} />

            {/* Floating glass panel (positioning wrapper + inner card) */}
            <div className="absolute inset-3 sm:inset-6">
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="gradient-border glass-strong flex h-full flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6"
              >
                {/* Layered-glass: top sheen + noise for reflections */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="pointer-events-none absolute inset-0 z-0 noise opacity-[0.04]" />

                {/* Header: brand · theme toggle · close */}
                <div className="relative z-20 flex items-center justify-between">
                  <a
                    href="#home"
                    data-cursor="link"
                    aria-label="Home"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect("#home");
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-accent-cyan to-accent-violet text-xs font-bold text-bg">
                      Z
                    </span>
                    <span className="font-display text-sm font-medium tracking-tight text-fg">
                      {SITE.name}
                    </span>
                  </a>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      ref={closeBtnRef}
                      aria-label="Close menu"
                      onClick={onClose}
                      className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-fg transition-colors hover:bg-surface-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* AI Hero — compact, side-by-side: AI Core + greeting */}
                <motion.div
                  {...reveal(0.15)}
                  className="relative z-20 mt-3 flex h-24 items-center gap-3 overflow-hidden rounded-2xl border border-hairline bg-bg/40 sm:h-28"
                >
                  <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                    <AICore open={open} />
                  </div>
                  <div className="relative z-10 flex flex-col gap-0.5 pr-2">
                    <p className="font-display text-base font-semibold tracking-tight text-fg">
                      👋 Hi, I&apos;m Zayd AI
                    </p>
                    <p className="text-xs leading-relaxed text-fg-muted">
                      Ask me anything about my projects, experience, skills or
                      services.
                    </p>
                  </div>
                </motion.div>

                {/* Quick Action chips */}
                <motion.div
                  {...reveal(0.32)}
                  className="relative z-20 mt-3"
                >
                  <QuickActions onActivate={onSelect} onClose={onClose} />
                </motion.div>

                {/* Navigation — sequential spring reveal */}
                <motion.nav
                  variants={stagger(reduce ? 0 : 0.05, reduce ? 0 : 0.42)}
                  initial="hidden"
                  animate="show"
                  className="relative z-20 mt-4 flex flex-1 flex-col gap-2 overflow-y-auto pr-1"
                >
                  {items.map((item) => (
                    <NavTile
                      key={item.label}
                      item={item}
                      active={item.href === active}
                      onActivate={onSelect}
                    />
                  ))}
                </motion.nav>

                {/* Footer: live status · CTA · socials */}
                <div className="relative z-20 mt-4 shrink-0 space-y-3">
                  <motion.div {...reveal(0.7)} className="px-1">
                    <LiveStatus />
                  </motion.div>

                  <motion.div {...reveal(0.78)}>
                    <LetsBuildCard onActivate={onSelect} />
                  </motion.div>

                  <motion.div
                    {...reveal(0.88)}
                    className="flex items-center justify-center gap-3 pt-1"
                  >
                    {socials.map((s, i) => (
                      <SocialButton key={s.label} social={s} index={i} />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}