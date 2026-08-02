"use client";

/*
  The verger.

  ⌘K anywhere, or the button in the masthead for anyone without a keyboard
  shortcut in their hands. It searches the stations of the cathedral by both
  names they have — the architectural one on the plan and the plain one a
  stranger would actually type — so "poems" and "lady chapel" both find the
  same room.
*/

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { STATIONS } from "@/lib/cathedral";

interface Item {
  href: string;
  label: string;
  sub: string;
  glass: string;
  /** Everything this item can be found by, lowercased at build of the list. */
  terms: string;
}

const ITEMS: Item[] = [
  {
    href: "/",
    label: "The Threshold",
    sub: "Home",
    glass: "#c9d3dd",
    terms: "threshold home names cotek doorway start",
  },
  {
    href: "/cathedral",
    label: "The Cathedral",
    sub: "Plan",
    glass: "#c9d3dd",
    terms: "cathedral plan map works rooms chapels index",
  },
  ...STATIONS.map((s) => ({
    href: s.href,
    label: s.title,
    sub: s.room,
    glass: s.glass,
    terms: `${s.title} ${s.room} ${s.deck}`.toLowerCase(),
  })),
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((i) => i.terms.includes(q) || i.label.toLowerCase().includes(q));
  }, [query]);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery("");
    setCursor(0);
    // Put focus back where it came from, or a keyboard user is dropped at the
    // top of the document every time they change their mind.
    restoreTo.current?.focus();
  }, [onOpenChange]);

  /* The global shortcut. Registered once whether or not the palette is open,
     which is the only way ⌘K can be what opens it. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        restoreTo.current = document.activeElement as HTMLElement;
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the cursor inside the result set as it shrinks under the query.
  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(0, results.length - 1)));
  }, [results.length]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % Math.max(1, results.length));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % Math.max(1, results.length));
      return;
    }
    if (e.key === "Enter") {
      const hit = results[cursor];
      if (hit) {
        e.preventDefault();
        close();
        router.push(hit.href);
      }
    }
  };

  return (
    <div
      className="palette-scrim"
      role="presentation"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search the cathedral">
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Go to a room…"
          aria-label="Search rooms"
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
        />

        {results.length ? (
          <ul>
            {results.map((item, i) => (
              <li
                key={item.href}
                data-active={i === cursor}
                style={{ "--glass": item.glass } as React.CSSProperties}
                onPointerEnter={() => setCursor(i)}
              >
                <Link href={item.href} onClick={close}>
                  <span className="dot" />
                  <span className="label">{item.label}</span>
                  <span className="sub">{item.sub}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="palette-empty">Nothing under that name.</p>
        )}

        <div className="palette-foot">
          <span>↑↓ move</span>
          <span>↵ enter</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
