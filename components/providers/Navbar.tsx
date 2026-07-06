"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#home");
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  // Floating navbar: stays visible across all sections. We only track
  // whether the page is scrolled to switch in the glass pill styling.
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  useEffect(() => {
    const sections = items
      .map((i) => document.querySelector(i.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-3 z-[200] flex justify-center px-4"
      >
        <nav
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500",
            scrolled
              ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
              : "border border-transparent bg-transparent",
          )}
        >
          <a
            href="#home"
            className="group flex items-center gap-2 rounded-full px-3 py-1.5"
            data-cursor="link"
            data-cursor-label="Top"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet text-[11px] font-bold text-bg">
              Z
            </span>
            <span className="font-display text-sm font-medium tracking-tight text-fg">
              Zayd<span className="text-fg-subtle">.dev</span>
            </span>
          </a>

          <span className="mx-1 hidden h-5 w-px bg-hairline md:block" />

          <div className="hidden items-center md:flex">
            {items.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  data-cursor="link"
                  className="relative rounded-full px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10",
                      isActive && "text-fg",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>

          <a
            href="#contact"
            data-cursor="link"
            data-cursor-label="Hire"
            className="ml-1 hidden rounded-full bg-invert px-4 py-2 text-sm font-medium text-bg transition-transform hover:scale-[1.03] md:inline-block"
          >
            Let&apos;s talk
          </a>

          <ThemeToggle className="ml-1" />

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-full text-fg md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-bg/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[78%] max-w-xs flex-col gap-2 border-l border-hairline bg-bg-elevated p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg text-fg">Menu</span>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-fg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {items.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                  className="border-b border-hairline py-4 font-display text-2xl font-medium text-fg"
                >
                  {item.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-invert py-3 text-center text-sm font-medium text-bg"
              >
                Let&apos;s talk
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}