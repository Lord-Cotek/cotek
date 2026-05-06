// components/Constellation.tsx
"use client";

// A navigable star map of the works.
// - Each star is a domain. Star size = weight (per ROOMS in identities.ts).
// - Lines connect domains that overlap. The Sermons↔Field line is brighter:
//   stewardship preached, stewardship practiced.
// - Arrow keys cycle the focused star. Enter/Space activates it.
// - Mouse hover reveals a 1-line description.
// - Below the SVG, a list-view fallback for screen readers (and small viewports).

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ROOMS } from "@/lib/identities";

type Room = (typeof ROOMS)[number];

const DESCRIPTIONS: Record<Room["slug"], string> = {
  apps: "Software studio output — PExP, ProMan, Sci-Cotek, BMS, Poems, exp, iSignature.",
  books: "Published works, beginning with Orchids and Tamarind.",
  poems: "A library of his lines — live from poems.cotek.app.",
  research: "Independent and IISER-era papers; ResearchGate and Academia.",
  sermons: "Bible teaching at RAK Church.",
  photos: "Photography on Unsplash @cotek.",
  field: "Environmental work — water, wastewater, reef. The other half of his life.",
};

// Layout positions (percent of the SVG box). Hand-placed so adjacencies feel right.
const POS: Record<Room["slug"], { x: number; y: number }> = {
  apps:     { x: 18, y: 30 },
  books:    { x: 38, y: 16 },
  poems:    { x: 62, y: 22 },
  research: { x: 82, y: 36 },
  sermons:  { x: 76, y: 70 },
  photos:   { x: 24, y: 72 },
  field:    { x: 46, y: 56 },
};

// Pairs that overlap conceptually. Sermons↔Field is the bright one.
const EDGES: Array<[Room["slug"], Room["slug"], number]> = [
  ["sermons", "field", 1.0], // the bright line
  ["poems", "books", 0.55],
  ["poems", "sermons", 0.45],
  ["field", "research", 0.5],
  ["field", "photos", 0.45],
  ["apps", "field", 0.4],
  ["apps", "research", 0.35],
  ["photos", "poems", 0.4],
];

export default function Constellation() {
  const router = useRouter();
  const [focused, setFocused] = useState<Room["slug"]>("field");
  const [hover, setHover] = useState<Room["slug"] | null>(null);
  const groupRef = useRef<SVGSVGElement | null>(null);

  const order = useMemo(() => ROOMS.map((r) => r.slug), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const i = order.indexOf(focused);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocused(order[(i + 1) % order.length]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocused(order[(i - 1 + order.length) % order.length]);
      } else if (e.key === "Enter" || e.key === " ") {
        if (i >= 0) {
          e.preventDefault();
          router.push(`/works/${focused}`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, order, router]);

  return (
    <>
      <div className="constellation" role="region" aria-label="Map of works">
        <svg
          ref={groupRef}
          viewBox="0 0 100 90"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Edges */}
          {EDGES.map(([a, b, w], i) => {
            const pa = POS[a];
            const pb = POS[b];
            const bright = w >= 0.95;
            return (
              <line
                key={i}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke="white"
                strokeOpacity={bright ? 0.42 : 0.15 + w * 0.1}
                strokeWidth={bright ? 0.35 : 0.18}
                strokeLinecap="round"
              />
            );
          })}

          {/* Stars */}
          {ROOMS.map((r) => {
            const p = POS[r.slug];
            const size = 1.4 * r.weight;
            const isFocus = focused === r.slug;
            const isHover = hover === r.slug;
            return (
              <g
                key={r.slug}
                tabIndex={0}
                role="link"
                aria-label={`${r.title} — ${DESCRIPTIONS[r.slug]}`}
                className="star"
                onFocus={() => setFocused(r.slug)}
                onMouseEnter={() => setHover(r.slug)}
                onMouseLeave={() => setHover(null)}
                onClick={() => router.push(`/works/${r.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/works/${r.slug}`);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <circle
                  className="star-glow"
                  cx={p.x}
                  cy={p.y}
                  r={size * 2.4}
                  fill="white"
                  fillOpacity={isFocus ? 0.18 : isHover ? 0.12 : 0.06}
                />
                <circle
                  className="star-core"
                  cx={p.x}
                  cy={p.y}
                  r={size}
                  fill={isFocus || isHover ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.78)"}
                />
                <text
                  className="star-label"
                  x={p.x}
                  y={p.y + size * 2.6 + 1.2}
                  textAnchor="middle"
                >
                  {r.title}
                </text>
                {(isFocus || isHover) ? (
                  <text
                    className="star-cap"
                    x={p.x}
                    y={p.y + size * 2.6 + 4.2}
                    textAnchor="middle"
                  >
                    {DESCRIPTIONS[r.slug]}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        <div className="legend">Constellation · arrow keys to move · enter to open</div>
        <div className="hint">Bright line: sermons ↔ field</div>
      </div>

      {/* List-view fallback (always rendered; lives below the canvas). */}
      <ul className="const-list" aria-label="Works rooms (list view)">
        {ROOMS.map((r) => (
          <li key={r.slug}>
            <a href={`/works/${r.slug}`}>
              <div className="room-cap">{r.title}</div>
              <div className="room-title">{r.title}</div>
              <div className="room-desc">{DESCRIPTIONS[r.slug]}</div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
