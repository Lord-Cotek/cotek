// components/KeyboardConsole.tsx
"use client";

// Keyboard culture: 1–7 jump to constellation rooms, P opens the verse engine,
// L letters, S signal, N names, X lexicon, G G random, ? overlay, Esc close.
// Ignore keys when typing into inputs/textareas.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROOMS } from "@/lib/identities";
import VerseModal from "@/components/VerseModal";

const ROOMS_INDEX = ROOMS.map((r) => `/works/${r.slug}`);

export default function KeyboardConsole() {
  const router = useRouter();
  const [hintsOpen, setHintsOpen] = useState(false);
  const [verseOpen, setVerseOpen] = useState(false);
  const [lastG, setLastG] = useState(0);

  const closeAll = useCallback(() => {
    setHintsOpen(false);
    setVerseOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName?.toLowerCase();
        if (
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          t.isContentEditable
        ) {
          if (e.key === "Escape") (t as HTMLElement).blur();
          return;
        }
      }

      if (e.key === "Escape") {
        closeAll();
        return;
      }

      if (e.key === "?") {
        setHintsOpen((v) => !v);
        return;
      }

      if (/^[1-7]$/.test(e.key)) {
        const i = parseInt(e.key, 10) - 1;
        if (ROOMS_INDEX[i]) router.push(ROOMS_INDEX[i]);
        return;
      }

      const k = e.key.toLowerCase();
      if (k === "p") {
        setVerseOpen(true);
      } else if (k === "l") {
        router.push("/letters");
      } else if (k === "s") {
        router.push("/signal");
      } else if (k === "n") {
        router.push("/names");
      } else if (k === "x") {
        router.push("/lexicon");
      } else if (k === "h") {
        router.push("/");
      } else if (k === "g") {
        const now = Date.now();
        if (now - lastG < 700) {
          const all = [
            "/",
            "/about",
            "/works",
            "/signal",
            "/letters",
            "/lexicon",
            "/names",
            ...ROOMS_INDEX,
          ];
          const dest = all[Math.floor(Math.random() * all.length)];
          router.push(dest);
          setLastG(0);
        } else {
          setLastG(now);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll, lastG, router]);

  return (
    <>
      <button
        type="button"
        className="console-toggle"
        aria-label="Open keyboard shortcuts"
        onClick={() => setHintsOpen((v) => !v)}
      >
        ?
      </button>

      {hintsOpen ? (
        <div
          className="console-overlay"
          onClick={() => setHintsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div className="console-card" onClick={(e) => e.stopPropagation()}>
            <h3>Keyboard</h3>
            <dl>
              <dt><span className="kbd">1</span>–<span className="kbd">7</span></dt>
              <dd>jump to a constellation room (apps · books · poems · research · sermons · photos · field)</dd>
              <dt><span className="kbd">P</span></dt><dd>verse engine</dd>
              <dt><span className="kbd">L</span></dt><dd>letters</dd>
              <dt><span className="kbd">S</span></dt><dd>signal</dd>
              <dt><span className="kbd">N</span></dt><dd>names</dd>
              <dt><span className="kbd">X</span></dt><dd>lexicon</dd>
              <dt><span className="kbd">H</span></dt><dd>threshold (home)</dd>
              <dt><span className="kbd">G</span> <span className="kbd">G</span></dt><dd>random destination</dd>
              <dt><span className="kbd">?</span></dt><dd>this overlay</dd>
              <dt><span className="kbd">Esc</span></dt><dd>close anything</dd>
            </dl>
          </div>
        </div>
      ) : null}

      <VerseModal open={verseOpen} onClose={() => setVerseOpen(false)} />
    </>
  );
}
