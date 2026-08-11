# Personal Portfolio

A cinematic, AI-engineer portfolio built with Next.js 16, React Three Fiber, Framer Motion, and Lenis. Dark, premium, motion-rich, and production-ready.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first design tokens)
- **Framer Motion** (`motion`) for animation
- **React Three Fiber + Drei + Three.js** for the hero 3D scene
- **Lenis** for smooth scroll
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Architecture

```
app/                      # App Router: layout, page, SEO (sitemap, robots, manifest, OG)
components/
  providers/              # SmoothScroll, Cursor, Loader, Navbar
  three/                  # HeroScene (glass orbs, neural net, particles, parallax camera)
  ui/                     # Reusable primitives (Reveal, TiltCard, MagneticButton, etc.)
  sections/               # Page sections (Hero, About, Skills, Projects, ...)
hooks/                    # use-magnetic, use-media-query
lib/                      # utils, constants, data, animations/variants
types/                    # Shared types
public/                   # icon.svg, resume.pdf
```

## Digital twin — AI chat assistant

The Contact section is a conversational **digital twin** — an assistant that
answers as Zayd, trained on the same `lib/data.ts` the rest of the site uses
(projects, skills, experience, education, services). It streams replies from
Google Gemini via `app/api/chat/route.ts`.

It's designed to answer questions like "Tell me about Zayd", "Why should I
hire you?", "What technologies do you know?",
and "Show me your best project." It never invents credentials or projects —
its knowledge is generated from your real data, so it stays in sync with the
site automatically.

Without a key, the assistant still works — it falls back to a local
keyword-retrieval layer built from the same data, so visitors always get a
useful answer (e.g. the example questions above all resolve to real answers).
The `@google/genai` SDK is only invoked when a key is present.

## Features

- Custom cursor with magnetic hover, glow, and contextual morphing
- Floating glass navbar with auto-hide, active-section indicator, and mobile drawer
- Animated loading screen
- Lenis smooth scrolling with anchor handling
- Mouse-reactive 3D hero (glass orbs, neural network, particle field)
- Scroll-driven timeline, animated counters, reveal-on-scroll everywhere
- Floating-label contact form with success animation
- **Digital twin** — conversational AI assistant (Gemini, streamed) trained on your data
- Reduced-motion support, keyboard focus states, ARIA labels
- SEO: metadata, OpenGraph (dynamic image), Twitter cards, JSON-LD, sitemap, robots, manifest
