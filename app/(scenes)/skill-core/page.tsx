"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Loaded only inside an <iframe> on desktop. The accent is set initially
// via the ?accent= query param, then updated live via postMessage from the
// parent Skills section (so switching category recolors the scene without
// reloading the iframe / re-initializing WebGL).
const SkillCore = dynamic(() => import("@/components/three/SkillCore"), {
  ssr: false,
  loading: () => null,
});

type Accent = "cyan" | "purple" | "blue";
const isAccent = (v: unknown): v is Accent =>
  v === "cyan" || v === "purple" || v === "blue";

export default function SkillCorePage() {
  const [accent, setAccent] = useState<Accent>("cyan");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = params.get("accent");
    if (isAccent(a)) setAccent(a);

    const onMessage = (e: MessageEvent) => {
      if (e.source !== window.parent) return;
      if (isAccent((e.data as { accent?: unknown })?.accent)) {
        setAccent((e.data as { accent: Accent }).accent);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#07070b]">
      <SkillCore accent={accent} />
    </div>
  );
}