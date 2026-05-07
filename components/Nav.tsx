"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS: Array<{ href: string; label: string }> = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/signal", label: "Signal" },
  { href: "/letters", label: "Letters" },
  { href: "/lexicon", label: "Lexicon" },
  { href: "/names", label: "Names" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="nav" aria-label="Primary">
      <Link href="/" className="nav-brand" aria-label="Return to the threshold">
        <span className="nav-mark" aria-hidden="true">C</span>
        <span className="nav-name">cotek</span>
      </Link>

      <div className="nav-links" data-desktop>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname === l.href || pathname.startsWith(l.href + "/") ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>

      <div
        id="mobile-menu"
        className={`nav-sheet ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname === l.href || pathname.startsWith(l.href + "/") ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
