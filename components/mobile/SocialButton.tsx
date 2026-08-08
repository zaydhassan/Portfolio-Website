"use client";

import Icon from "@/components/ui/Icon";
import type { SocialLink } from "@/types";

/* ----------------------------------------------------------------
   Glass circular social button with a slowly rotating conic-gradient
   ring (masked to a 1.5px border by the inner glass circle), an accent
   glow on hover, and a gentle desynced float. Reduced motion freezes
   both the conic spin and the float via the global CSS rule.
   ---------------------------------------------------------------- */
export default function SocialButton({
  social,
  index,
}: {
  social: SocialLink;
  index: number;
}) {
  const external = social.href.startsWith("http");
  const ring =
    "conic-gradient(from 0deg, var(--accent-cyan), var(--accent-blue), var(--accent-violet), var(--accent-purple), var(--accent-cyan))";

  return (
    <a
      href={social.href}
      target={external ? "_blank" : undefined}
      rel="noreferrer"
      data-cursor="link"
      aria-label={social.label}
      className="group relative grid h-11 w-11 place-items-center rounded-full animate-float-slow"
      style={{ animationDelay: `${index * 0.4}s` }}
    >
      {/* Rotating conic ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-50 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: ring, animation: "conic-spin 6s linear infinite" }}
      />
      {/* Inner glass circle — masks the ring to a thin border */}
      <span
        aria-hidden
        className="absolute inset-[1.5px] rounded-full bg-bg/85 backdrop-blur-md"
      />
      {/* Hover glow */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
        style={{ background: ring }}
      />
      <Icon
        name={social.icon}
        className="relative z-10 h-4 w-4 text-fg-muted transition-colors duration-300 group-hover:text-fg"
      />
    </a>
  );
}