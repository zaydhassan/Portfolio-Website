"use client";

import dynamic from "next/dynamic";

// Loaded only inside an <iframe> on desktop. See /hero for the rationale:
// isolating three.js in its own route keeps it out of the main page's
// preload graph, so mobile never fetches it.
const AboutCore = dynamic(() => import("@/components/three/AboutCore"), {
  ssr: false,
  loading: () => null,
});

export default function AboutCorePage() {
  return (
    <div className="fixed inset-0 bg-[#0b0b10]">
      <AboutCore />
    </div>
  );
}