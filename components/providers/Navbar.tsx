"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu } from "lucide-react";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AIMenu from "@/components/mobile/AIMenu";

export default function Navbar({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#home");
  const [open, setOpen] = useState(false);
  // Stable identity so AIMenu's focus-effect doesn't re-run on every
  // Navbar re-render (the IntersectionObserver setActive fires often).
  const closeMenu = useCallback(() => setOpen(false), []);

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
    // Lock the page + pause Lenis while the mobile menu is open so its
    // internal nav list scrolls natively instead of fighting the smooth
    // scroller. Resume when it closes.
    const lenis = (window as unknown as {
      lenis?: { stop: () => void; start: () => void };
    }).lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
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
              ? "border border-hairline bg-bg/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
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
            className="grid h-11 w-11 place-items-center rounded-full text-fg md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </motion.header>

      {/* Mobile AI menu — a futuristic "AI OS" panel, not a drawer */}
      <AIMenu
        open={open}
        onClose={closeMenu}
        items={MOBILE_NAV_ITEMS}
        active={active}
      />
    </>
  );
}