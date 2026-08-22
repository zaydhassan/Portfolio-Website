"use client";

import dynamic from "next/dynamic";

// Loaded only inside an <iframe> on desktop. Because this is a separate
// route, its three.js chunk is NOT part of the main page's chunk graph —
// so the main page never preloads three.js (mobile never fetches it).
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroScenePage() {
  return (
    <div className="fixed inset-0 bg-bg">
      <HeroScene />
    </div>
  );
}