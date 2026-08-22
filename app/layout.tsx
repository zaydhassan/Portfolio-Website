import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import ThemeProvider from "@/components/providers/ThemeProvider";

// `display: "optional"` (not "swap") is deliberate for LCP. With "swap", the
// Geist web font downloads in the background and re-paints the headline (the
// page's LCP element) when ready — but on throttled mobile that swap is
// delayed until the main thread frees up from JS execution (~3.4s), so LCP
// landed at the swap time instead of FCP. "optional" uses the web font only
// if it's already loaded within the first ~100ms (no late swap); otherwise
// it keeps the fallback for that load. Either way the largest contentful
// paint is recorded at first paint, not after a delayed font swap.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "AI Engineer",
    "Full-Stack Developer",
    "Next.js",
    "FastAPI",
    "LLM Applications",
    "Automation",
    "Software Engineer",
    "Zayd Hassan",
    "Three.js",
    "TypeScript",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    creator: "@zaydhassan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: "AI Engineer & Full-Stack Developer",
  email: `mailto:${SITE.email}`,
  sameAs: [
    "https://github.com/zaydhassan",
    "https://www.linkedin.com/in/zayd-hassan-a06105213",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Full-Stack Development",
    "Large Language Models",
    "Next.js",
    "Python",
    "Automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Minimal root layout: fonts, globals, theme bootstrap, and the theme
  // provider only. The heavy chrome (SmoothScroll, Loader, Background,
  // Navbar) lives in (site)/layout.tsx so the lightweight (scenes) routes —
  // loaded inside <iframe>s — don't pull any of it (or three.js) into the
  // main page's chunk graph.
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="relative min-h-screen bg-bg text-fg"
      >
        {/* No-FOUC theme script — runs before paint to apply the saved/system theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
        {/* Silence three.js r183+ Clock deprecation warning (fired by R3F's internal
            state.clock on Canvas mount) until R3F migrates to THREE.Timer. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var w=console.warn;console.warn=function(){try{var m=Array.prototype.join.call(arguments,' ');if(m&&m.indexOf('Clock: This module has been deprecated')!==-1)return;}catch(e){}return w.apply(console,arguments);};}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}