"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "@/components/Mark";
import CommandPalette from "@/components/CommandPalette";

export const NAV = [
  { href: "/cathedral", label: "Cathedral" },
  { href: "/about", label: "About" },
  { href: "/signal", label: "Signal" },
  { href: "/letters", label: "Letters" },
  { href: "/names", label: "Names" },
] as const;

export default function Masthead() {
  const ref = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [stuck, setStuck] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  /* Scroll behaviour: settle a background in once you leave the top, and get
     out of the way entirely on the way down. Read inside a rAF so a fast
     scroll cannot queue a layout read per event. */
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setStuck(y > 24);
      // Never tuck near the top, where hiding just reads as a glitch.
      setTucked(y > lastY && y > 320);
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Publish the bar's real height so the mobile sheet sits exactly beneath it.
     Measured rather than guessed — the bar grows with the user's font size and
     browser zoom, and a hardcoded offset shows a seam the moment it does. */
  useEffect(() => {
    const bar = barRef.current;
    const host = ref.current;
    if (!bar || !host) return;
    const publish = () => host.style.setProperty("--bar-h", `${bar.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  // Close the sheet on navigation, and let the page scroll again.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href + "/")) ? "page" : undefined;

  return (
    <header
      ref={ref}
      className="masthead"
      data-stuck={stuck}
      data-tucked={tucked && !open}
      data-open={open}
    >
      <div className="masthead-bar" ref={barRef}>
        <Link href="/" className="brand" aria-label="Cotek — the threshold">
          <Mark size={22} />
          <span className="brand-name">Cotek</span>
        </Link>

        <nav className="masthead-nav" aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="masthead-tail">
          <button
            type="button"
            className="palette-hint"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search the cathedral"
          >
            Search <kbd>⌘K</kbd>
          </button>

          <button
            type="button"
            className="burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="masthead-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="masthead-sheet" id="masthead-sheet" hidden={!open}>
        <nav aria-label="Primary, mobile">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <Link href={item.href} aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
