"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, Mail, ArrowUpRight, RotateCcw } from "lucide-react";
import { fadeUp, stagger, viewportReveal, easeExpo } from "@/lib/animations/variants";
import SectionHeading from "@/components/ui/SectionHeading";
import { SOCIALS, SITE } from "@/lib/constants";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Role = "user" | "twin";
type Msg = { id: number; role: Role; content: string; streaming?: boolean };

const SUGGESTIONS = [
  "Tell me about Zayd",
  "Why should I hire you?",
  "Explain your AI SQL Assistant",
  "What technologies do you know?",
  "Show me your best project",
];

const MAX_ROWS = 6;

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const nextId = () => ++idRef.current;

  // Auto-scroll to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Auto-grow the textarea.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, MAX_ROWS * 24 + 24)}px`;
  }, [input]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;

    setError(null);
    const userMsg: Msg = { id: nextId(), role: "user", content };
    const twinMsg: Msg = { id: nextId(), role: "twin", content: "", streaming: true };
    // Build the payload from current history + the new user message.
    const payload = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg, twinMsg]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let gotAny = false;
      const twinId = twinMsg.id;

      const append = (delta: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === twinId ? { ...m, content: m.content + delta, streaming: true } : m,
          ),
        );
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const raw = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 2);
          if (!raw.startsWith("data:")) continue;
          const data = raw.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (typeof parsed.delta === "string") {
              gotAny = true;
              append(parsed.delta);
            }
          } catch {
            /* ignore malformed event */
          }
        }
      }

      if (!gotAny) {
        append("I'm having trouble right now — please email me at " + SITE.email + ".");
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === twinId ? { ...m, streaming: false } : m)),
      );
    } catch (err) {
      console.error("chat stream error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === twinMsg.id
            ? {
                ...m,
                content:
                  "I couldn't reach my brain right now. Please email me at " +
                  SITE.email +
                  " — I'll get back to you within a day or two.",
                streaming: false,
              }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const reset = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  const emailHandoff = () => {
    const subject = encodeURIComponent("Following up from your portfolio");
    const body = encodeURIComponent(
      "Hi Zayd,\n\nI was chatting with your digital twin on your portfolio and wanted to reach out about a project.\n\nA bit about what I'm building:\n\n— ",
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        {/* ── Left: heading + socials + email hand-off ─────────────── */}
        <div>
          <SectionHeading
            eyebrow="Digital Twin / Talk to me"
            title={
              <>
                Don&apos;t read a résumé. <span className="gradient-text">Ask me anything.</span>
              </>
            }
            description="This is me — trained on my own projects, skills, and experience. Ask about my work, why you should hire me, or what I'd build for you. It answers like I would."
          />

          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportReveal}
            className="mt-10 flex flex-col gap-3"
          >
            <motion.button
              variants={fadeUp}
              onClick={emailHandoff}
              data-cursor="link"
              data-cursor-label="Email"
              className="group flex items-center justify-between rounded-2xl border border-hairline bg-surface-1 px-5 py-4 text-left transition-colors duration-300 hover:border-hairline-strong hover:bg-surface-2"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-hairline bg-surface-2 text-accent-cyan">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span className="font-medium text-fg">Email me directly</span>
                  <span className="text-xs text-fg-subtle">{SITE.email}</span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>

            {SOCIALS.filter((s) => s.label !== "Email").map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor="link"
                data-cursor-label="Open"
                variants={fadeUp}
                className="group flex items-center justify-between rounded-2xl border border-hairline bg-surface-1 px-5 py-4 transition-colors duration-300 hover:border-hairline-strong hover:bg-surface-2"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-hairline bg-surface-2 text-fg">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-fg">{s.label}</span>
                </span>
                <span className="font-mono text-xs text-fg-subtle transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* ── Right: chat panel ────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportReveal}
          className="relative"
        >
          <div className="gradient-border rounded-[1.75rem]">
            <div className="relative flex h-[36rem] flex-col overflow-hidden rounded-[1.75rem] border border-hairline glass sm:h-[34rem]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9">
                    <div className="conic-ring absolute inset-0 rounded-full opacity-80" />
                    <div className="absolute inset-[2px] grid place-items-center rounded-full bg-bg">
                      <span className="font-display text-sm font-semibold text-fg">Z</span>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg bg-emerald-400" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-fg">Zayd</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-fg-subtle">
                      <span className="h-1 w-1 animate-pulse-glow rounded-full bg-emerald-400" />
                      Digital twin · online
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={emailHandoff}
                    data-cursor="link"
                    aria-label="Email Zayd"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-hairline text-fg-muted transition-colors hover:bg-overlay hover:text-fg"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={reset}
                    data-cursor="link"
                    aria-label="Reset conversation"
                    disabled={messages.length === 0}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-hairline text-fg-muted transition-colors hover:bg-overlay hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
                role="log"
                aria-live="polite"
                aria-label="Conversation with Zayd's digital twin"
              >
                <AnimatePresence initial={false}>
                  {messages.length === 0 && (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: easeExpo }}
                      className="flex flex-col items-start gap-4 pt-2"
                    >
                      <Bubble>
                        Hey — I&apos;m Zayd&apos;s digital twin, trained on his projects, skills,
                        and experience. Ask me anything, or tap a prompt below to start.
                      </Bubble>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            data-cursor="link"
                            className="group flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-hairline-strong hover:bg-surface-3 hover:text-fg"
                          >
                            <Sparkles className="h-3 w-3 text-accent-violet" />
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {messages.map((m) =>
                    m.role === "user" ? (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: easeExpo }}
                        className="flex justify-end"
                      >
                        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-overlay px-4 py-2.5 text-sm leading-relaxed text-fg">
                          {m.content}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: easeExpo }}
                        className="flex justify-start"
                      >
                        <div className="flex max-w-[90%] gap-2.5">
                          <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-hairline bg-bg/60 text-[11px] font-semibold text-fg">
                            Z
                          </div>
                          <div className="rounded-2xl rounded-tl-md border border-hairline bg-surface-2 px-4 py-2.5 text-sm leading-relaxed text-fg">
                            {m.streaming && m.content.length === 0 ? (
                              <TypingDots />
                            ) : (
                              <RichText text={m.content} />
                            )}
                            {m.streaming && m.content.length > 0 && (
                              <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-accent-violet" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>
              </div>

              {/* Composer */}
              <form
                onSubmit={onSubmit}
                className="border-t border-hairline p-3"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-hairline bg-surface-1 px-3 py-2 transition-colors focus-within:border-accent-violet/50">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    aria-label="Ask Zayd's digital twin"
                    placeholder="Ask me anything…"
                    className="max-h-[144px] flex-1 resize-none bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
                  />
                  <button
                    type="submit"
                    disabled={busy || input.trim().length === 0}
                    data-cursor="link"
                    aria-label="Send message"
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300",
                      busy || input.trim().length === 0
                        ? "bg-surface-1 text-fg-subtle"
                        : "bg-invert text-bg hover:shadow-[0_6px_30px_-8px_rgba(255,255,255,0.4)]",
                    )}
                  >
                    {busy ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {error && <p className="mt-2 px-1 text-xs text-rose-400">{error}</p>}
              </form>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-fg-subtle">
            Trained on Zayd&apos;s real projects &amp; skills · Answers as Zayd ·{" "}
            <button onClick={emailHandoff} className="text-accent-cyan hover:underline" data-cursor="link">
              email me
            </button>{" "}
            to talk directly
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* -----------------------------------------------------------
   Message bubble (intro)
   ----------------------------------------------------------- */
function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-hairline bg-bg/60 text-[11px] font-semibold text-fg">
        Z
      </div>
      <div className="rounded-2xl rounded-tl-md border border-hairline bg-surface-2 px-4 py-2.5 text-sm leading-relaxed text-fg">
        {children}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   Typing indicator
   ----------------------------------------------------------- */
function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Zayd is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-fg-muted"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}

/* -----------------------------------------------------------
   Minimal markdown renderer: **bold**, bullet lines, line breaks
   ----------------------------------------------------------- */
function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const bullet = line.match(/^- (.+)/);
        if (bullet) {
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-violet" />
              <span>{renderInline(bullet[1])}</span>
            </div>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return <div key={i}>{renderInline(line)}</div>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <strong key={i} className="font-semibold text-fg">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}