"use client";

import { useRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

type Props = Omit<HTMLMotionProps<"a">, "ref" | "children"> & {
  children?: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
};

const styles = {
  primary:
    "bg-invert text-bg hover:shadow-[0_8px_40px_-8px_rgba(255,255,255,0.4)]",
  ghost:
    "border border-hairline-strong bg-surface-1 text-fg backdrop-blur-md hover:bg-overlay",
  outline: "border border-hairline-strong text-fg hover:bg-surface-1",
};

export default function MagneticButton({
  children,
  className,
  variant = "primary",
  href,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { x, y } = useMagnetic(ref, 0.3);

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      data-cursor="link"
      data-variant={variant}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300",
        styles[variant],
        className,
      )}
      {...rest}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-accent-cyan via-accent-blue to-accent-violet opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.a>
  );
}