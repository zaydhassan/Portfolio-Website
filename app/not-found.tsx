import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aurora opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" />

      <div className="relative font-display text-[clamp(6rem,28vw,18rem)] font-semibold leading-none tracking-tight">
        <span className="gradient-text">404</span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold text-fg sm:text-4xl">
        This page drifted off-grid.
      </h1>
      <p className="mt-4 max-w-md text-pretty text-fg-muted">
        The page you&apos;re looking for doesn&apos;t exist — or it was never
        built. Let&apos;s get you back to something real.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full bg-invert px-6 py-3 text-sm font-medium text-bg transition-transform hover:scale-[1.03]"
        >
          <Home className="h-4 w-4" />
          Back home
        </Link>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface-1"
        >
          <ArrowLeft className="h-4 w-4" />
          View work
        </Link>
      </div>
    </main>
  );
}