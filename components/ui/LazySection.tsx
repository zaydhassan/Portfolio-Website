"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Defers mounting of below-the-fold sections until they're about to scroll
   into view. Combined with `next/dynamic({ ssr: false })` children, this moves
   a section's JS chunk out of the initial parse/execute path: the code is only
   fetched and evaluated when the user scrolls near it, so the first
   viewport (and LCP) isn't competing with Projects/Skills/Experience/...
   for main-thread time on slow mobile CPUs.

   `minHeight` reserves space (avoids CLS) before the section mounts. The
   400px rootMargin pre-loads the section just before it's visible, so the
   reveal is seamless — and every section already animates itself in with
   `whileInView`, so there's no flash. */
export default function LazySection({
  children,
  minHeight,
  className,
  rootMargin = "400px",
}: {
  children: ReactNode;
  minHeight?: number;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? children : null}
    </div>
  );
}