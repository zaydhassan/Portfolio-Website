"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useRipple, RippleSpans } from "@/components/mobile/Ripple";

/* ----------------------------------------------------------------
   Premium CTA card. Glass + gradient-border wrapper holds a title,
   a short description, and a "Start Conversation" button that has an
   animated gradient field, a recurring light sweep, magnetic hover,
   ripple on tap, and an accent glow. Tapping runs the bloom+scroll
   flow to #contact (via onActivate).
   ---------------------------------------------------------------- */
export default function LetsBuildCard({
  onActivate,
}: {
  onActivate: (href: string) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const { x, y } = useMagnetic(ref, 0.25);
  const { ripples, onPointerDown } = useRipple();

  const gradient =
    "linear-gradient(110deg, var(--accent-cyan), var(--accent-blue), var(--accent-violet), var(--accent-cyan))";

  return (
    <div className="gradient-border glass relative overflow-hidden rounded-2xl p-4">
      {/* Subtle animated tint behind the content */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: gradient,
          backgroundSize: "200% 100%",
          animation: "gradient-pan 6s linear infinite",
          opacity: 0.08,
        }}
      />

      <div className="relative">
        <p className="font-display text-base font-semibold tracking-tight text-fg">
          Let&apos;s Build Something Amazing
        </p>
        <p className="mt-1 text-xs text-fg-muted">
          Transform your ideas into intelligent digital products.
        </p>

        <motion.button
          ref={ref}
          type="button"
          data-cursor="link"
          data-cursor-label="Start Conversation"
          style={{ x, y }}
          onPointerDown={onPointerDown}
          onClick={() => onActivate("#contact")}
          whileTap={
            reduce
              ? undefined
              : { scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 18 } }
          }
          className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-[#080a14]"
        >
          {/* Animated gradient field */}
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: gradient,
              backgroundSize: "200% 100%",
              animation: "gradient-pan 5s linear infinite",
            }}
          />
          {/* Recurring light sweep (skew handled by the keyframe) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md"
            style={{ animation: "light-sweep 3.5s ease-in-out infinite" }}
          />
          {/* Accent glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-70 blur-lg"
            style={{
              background:
                "linear-gradient(110deg, var(--accent-cyan), var(--accent-violet))",
            }}
          />
          {/* Ripple */}
          <RippleSpans ripples={ripples} className="bg-white/40" />

          <span className="relative z-10">Start Conversation</span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>
    </div>
  );
}