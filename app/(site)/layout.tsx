import { NAV_ITEMS } from "@/lib/constants";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/providers/Navbar";
import Background from "@/components/ui/Background";

/* The site chrome — SmoothScroll, the ambient Background, and the Navbar —
   wraps only the main portfolio page group. The (scenes) routes (rendered
   inside <iframe>s) inherit only the minimal root layout, so they stay tiny
   and don't drag this chrome — or three.js — into the main page.

   The intro Loader overlay was removed: it was a fake progress bar (it
   tracks nothing real) that held an opaque full-screen layer over the hero
   for ~900ms — exactly when Lighthouse measures LCP — pushing LCP to ~3.4s
   on mobile. The hero now paints immediately. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-400 rounded-full bg-invert px-4 py-2 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SmoothScroll>
        <Background />
        <Navbar items={NAV_ITEMS} />
        {children}
      </SmoothScroll>
    </>
  );
}