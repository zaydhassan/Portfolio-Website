"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is both on-screen *and* in a visible tab.
 *
 * Used to switch a react-three-fiber `<Canvas>` `frameloop` between
 * `"always"` and `"never"` so the WebGL render loop only runs while the
 * canvas is actually being looked at. This is a pure perf optimization:
 * the scene is visually identical — it simply stops animating while
 * off-screen or while the tab is in the background, then resumes seamlessly.
 *
 * Returns a `ref` to attach to the canvas wrapper and an `active` boolean.
 */
export function useRenderActive<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Start active so first paint runs immediately; the observers correct
    // it on the next tick.
    let inView = true;
    let tabVisible = !document.hidden;

    const update = () => setActive(inView && tabVisible);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? inView;
        update();
      },
      { threshold: 0 },
    );
    io.observe(el);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { ref, active };
}