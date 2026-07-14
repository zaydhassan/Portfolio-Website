# Zayd Hassan — Personal Portfolio

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

## Customizing

- **Content** lives in `lib/data.ts` (projects, skills, experience, services, stats).
- **Site config / nav / socials** live in `lib/constants.ts`.
- **Design tokens** (colors, fonts, glows) live in `app/globals.css`.
- Replace `public/resume.pdf` with your real CV.
- Update `SITE.url` / `SITE.email` in `lib/constants.ts` and the JSON-LD in `app/layout.tsx`.

## Contact form — delivering to your inbox

The contact form posts to `app/api/contact/route.ts`, which sends the message
to `CONTACT_TO_EMAIL` (default `zaydthirteen@gmail.com`) over Gmail SMTP using
Nodemailer. If the Gmail credentials aren't configured, the form gracefully
falls back to opening the visitor's mail client with a prefilled message.

To enable real email delivery:

1. Copy `.env.example` to `.env.local`.
2. Turn on 2-Step Verification on the sending Google account:
   https://myaccount.google.com/security
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Put the 16-char password (no spaces) in `GMAIL_APP_PASSWORD`, and the
   sending address in `GMAIL_USER`.
5. Restart `npm run dev`.

Messages arrive in your inbox with the submitter's address set as `reply-to`,
so you can reply directly.

## Digital twin — AI chat assistant

The Contact section is a conversational **digital twin** — an assistant that
answers as Zayd, trained on the same `lib/data.ts` the rest of the site uses
(projects, skills, experience, education, services). It streams replies from
Google Gemini via `app/api/chat/route.ts`.

It's designed to answer questions like "Tell me about Zayd", "Why should I
hire you?", "Explain your AI SQL Assistant", "What technologies do you know?",
and "Show me your best project." It never invents credentials or projects —
its knowledge is generated from your real data, so it stays in sync with the
site automatically.

To enable live Gemini-powered answers:

1. Get an API key: https://aistudio.google.com/app/apikey
2. In `.env.local`, set `GEMINI_API_KEY=your-key`.
3. (Optional) Set `GEMINI_MODEL` to a specific model (defaults to
   `gemini-2.5-flash`).
4. Restart `npm run dev`.

Without a key, the assistant still works — it falls back to a local
keyword-retrieval layer built from the same data, so visitors always get a
useful answer (e.g. the example questions above all resolve to real answers).
The `@google/genai` SDK is only invoked when a key is present.

A visitor who wants to follow up can use the in-chat "Email me" button, which
opens a prefilled message to `zaydthirteen@gmail.com`.

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

## Performance & a11y

- GPU-accelerated transforms, `dpr` capped canvases, dynamic `ssr:false` 3D import
- Respects `prefers-reduced-motion`
- Semantic HTML, visible focus rings, ARIA labels on interactive controls
