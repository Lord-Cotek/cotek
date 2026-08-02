"use client";

/*
  The threshold.

  He answers to eight names. The site's whole claim is that they are one
  person, and this is where that claim is made — not by asserting it in a
  sentence, but by showing it: the names arrive scattered, links draw between
  them until they are visibly one graph, the graph contracts, and the five
  letters of COTEK precipitate out of the collapse. Each letter comes from the
  name that gives it. Then the word is told what it means.

  Division of labour:
  - CSS owns the choreography of everything made of type (styles/threshold.css).
  - This file owns the canvas web, because that needs a frame loop, and the
    geometry, because that needs the viewport.
  - lib/threshold-timing owns the clock both of them read.

  The sequence is escapable three ways and they all land on the same finished
  frame: prefers-reduced-motion, a second visit within the session, and the
  skip button. Nobody is made to watch it twice.
*/

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Mark from "@/components/Mark";
import { TEMI } from "@/lib/identities";
import { T, T_END, timingVars } from "@/lib/threshold-timing";

/* ── The cast ────────────────────────────────────────────────────────────── */

interface Member {
  /** As it appears on the stage. */
  name: string;
  /** The letter of COTEK this name gives, if it gives one. */
  letter?: string;
}

/* The five that carry a letter come from the acronym itself, so the ceremony
   cannot claim an expansion the rest of the site does not. "Omogbolahan /
   Olayiwola" is one entry in the record and two words on the stage; only the
   first is shown here, and the full form appears in the expansion below. */
const LETTERED: Member[] = TEMI.acronym.expansion.map((e) => ({
  name: e.name.split(" / ")[0]!,
  letter: e.letter,
}));

/* Three of the compound forms stand as witnesses. They carry no letter and
   they do not survive the convergence — which is the point being made. */
const WITNESSES: Member[] = [
  { name: "Temi Cotek" },
  { name: "Cotek Temi" },
  { name: "Temitayo Ezekiel Olayiwola" },
];

/* Interleaved so the lettered names do not all arrive before the witnesses;
   the graph should look like a scatter of names, not two groups. */
const FULL_CAST: Member[] = [
  LETTERED[0]!,
  WITNESSES[0]!,
  LETTERED[1]!,
  LETTERED[2]!,
  WITNESSES[1]!,
  LETTERED[3]!,
  WITNESSES[2]!,
  LETTERED[4]!,
];

/* Under about 720px, eight names at a usable size overlap each other no
   matter how they are distributed. The witnesses step back and the five that
   build the word remain — the ceremony still says the same thing. */
const COMPACT_CAST: Member[] = LETTERED;

/* ── Geometry ────────────────────────────────────────────────────────────── */

interface Pt {
  x: number;
  y: number;
}

/**
 * Golden-angle placement on an ellipse.
 *
 * A ring puts every name the same distance out and lines them up in pairs
 * across the centre; a random scatter clusters. The golden angle does neither
 * — consecutive names land 137.5° apart and the radius climbs, so the result
 * reads as a constellation and no two labels stack.
 *
 * The radius floor of 0.44 keeps the innermost name clear of where the
 * wordmark will arrive.
 */
function layout(count: number, w: number, h: number): Pt[] {
  const rx = Math.min(w * 0.4, 430);
  const ry = Math.min(h * 0.36, 320);
  const GA = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const r = 0.44 + 0.56 * Math.sqrt(count < 2 ? 1 : i / (count - 1));
    const a = i * GA - Math.PI / 2;
    return { x: Math.cos(a) * r * rx, y: Math.sin(a) * r * ry };
  });
}

/** Each node linked to its two nearest neighbours, deduplicated. */
function weave(pts: Pt[]): Array<[number, number]> {
  const seen = new Set<string>();
  const edges: Array<[number, number]> = [];

  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 }))
      .filter((c) => c.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);

    for (const { j } of near) {
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  });

  // An edge must not draw before both of its ends exist.
  return edges.sort((a, b) => Math.max(...a) - Math.max(...b));
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Matches --ease-out closely enough for a canvas nobody is measuring. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ── Component ───────────────────────────────────────────────────────────── */

export default function Threshold() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ptsRef = useRef<Pt[]>([]);
  /* The graph is a function of the positions alone, so it is rebuilt when the
     stage is measured rather than on every frame. */
  const edgesRef = useRef<Array<[number, number]>>([]);

  const [compact, setCompact] = useState(false);
  const [pts, setPts] = useState<Pt[]>([]);
  /* Three states, not two. "play" is the sequence running; "still" is the
     finished frame rendered without ever animating; "done" is the sequence
     having finished on its own — visually identical to "still", but reached
     by CSS `forwards` rather than by the still-frame rules, so nothing is
     re-laid-out at the moment it lands. The distinction exists so the skip
     button can retire once there is nothing left to skip. */
  const [motion, setMotion] = useState<"play" | "still" | "done">("play");

  const cast = compact ? COMPACT_CAST : FULL_CAST;

  const skip = useCallback(() => setMotion("still"), []);

  /* ── Decide whether the sequence plays at all ──────────────────────────── */

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("cotek:threshold") === "1";
      if (!seen && !reduced) sessionStorage.setItem("cotek:threshold", "1");
    } catch {
      // Private mode, or storage disabled. The ceremony simply plays again.
    }
    if (reduced || seen) setMotion("still");
  }, []);

  /* ── Track the breakpoint that decides the cast ────────────────────────── */

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 720px)");
    const apply = () => setCompact(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  /* ── Measure ───────────────────────────────────────────────────────────── */

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const next = layout(cast.length, w, h);
      ptsRef.current = next;
      edgesRef.current = weave(next);
      setPts(next);

      const cvs = canvasRef.current;
      if (cvs) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cvs.width = Math.round(w * dpr);
        cvs.height = Math.round(h * dpr);
        cvs.style.width = `${w}px`;
        cvs.style.height = `${h}px`;
        const ctx = cvs.getContext("2d");
        // Origin at the centre of the stage: every position in this component
        // is an offset from the middle, in both CSS and canvas.
        ctx?.setTransform(dpr, 0, 0, dpr, (w * dpr) / 2, (h * dpr) / 2);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cast.length]);

  /* ── The web ───────────────────────────────────────────────────────────── */

  const letterIndices = useMemo(
    () => cast.map((m, i) => (m.letter ? i : -1)).filter((i) => i >= 0),
    [cast],
  );

  useEffect(() => {
    if (motion !== "play") {
      // The finished composition has no web in it — in both the skipped and
      // the played-through cases. Clear whatever the sequence had drawn and
      // do not start a loop.
      const cvs = canvasRef.current;
      const ctx = cvs?.getContext("2d");
      if (cvs && ctx) ctx.clearRect(-cvs.width, -cvs.height, cvs.width * 2, cvs.height * 2);
      return;
    }

    const cvs = canvasRef.current;
    const ctx = cvs?.getContext("2d");
    if (!cvs || !ctx) return;

    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2fdcb4";

    // The background field steps back while the web is on top of it, then
    // comes home. Two things drawing constellations at once is one too many.
    window.cotekField?.dim(0.45);

    let raf = 0;
    let t0 = 0;

    const draw = (now: number) => {
      if (!t0) t0 = now;
      const t = now - t0;
      const pts = ptsRef.current;
      const edges = edgesRef.current;

      const w = cvs.width;
      const h = cvs.height;
      ctx.clearRect(-w, -h, w * 2, h * 2);

      const conv = easeOut(clamp01((t - T.converge) / T.convergeDur));
      const pull = 1 - conv;

      /* Links. Each draws itself from one end to the other, then rides the
         collapse inward — the names travel down the links they made. */
      ctx.lineCap = "round";
      ctx.lineWidth = 1;
      edges.forEach(([i, j], k) => {
        const a = pts[i];
        const b = pts[j];
        if (!a || !b) return;
        const grow = easeOut(clamp01((t - (T.edge + k * T.edgeStep)) / T.edgeDraw));
        if (grow <= 0) return;

        const ax = a.x * pull;
        const ay = a.y * pull;
        const bx = b.x * pull;
        const by = b.y * pull;

        ctx.globalAlpha = 0.34 * pull;
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + (bx - ax) * grow, ay + (by - ay) * grow);
        ctx.stroke();

        // A spark rides each finished link, so the graph reads as carrying
        // something rather than merely being drawn.
        if (grow >= 1 && conv < 1) {
          const s = ((t / 1400 + k * 0.17) % 1);
          ctx.globalAlpha = 0.5 * pull;
          ctx.beginPath();
          ctx.arc(ax + (bx - ax) * s, ay + (by - ay) * s, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.fill();
        }
      });

      /* The spines. Only the five names that give a letter are joined to the
         centre, and only once the collapse has started: this is the moment
         the graph stops being a web of names and becomes one word. */
      if (conv > 0) {
        letterIndices.forEach((i) => {
          const p = pts[i];
          if (!p) return;
          ctx.globalAlpha = 0.5 * Math.sin(conv * Math.PI);
          ctx.strokeStyle = "#edf0f3";
          ctx.beginPath();
          ctx.moveTo(p.x * pull, p.y * pull);
          ctx.lineTo(0, 0);
          ctx.stroke();
        });
      }

      /* The nodes themselves — a dot under each name. */
      pts.forEach((p, i) => {
        const born = clamp01((t - (T.name + i * T.nameStep)) / 600);
        if (born <= 0) return;
        const lettered = cast[i]?.letter != null;
        ctx.globalAlpha = born * pull * (lettered ? 0.9 : 0.45);
        ctx.fillStyle = lettered ? "#edf0f3" : accent;
        ctx.beginPath();
        ctx.arc(p.x * pull, p.y * pull, lettered ? 2.4 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      /* The arrival. One ring, once, where the word is about to be. */
      const land = clamp01((t - T.converge - T.convergeDur * 0.7) / 900);
      if (land > 0 && land < 1) {
        ctx.globalAlpha = (1 - land) * 0.5;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, land * Math.min(w, h) * 0.42, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      if (t < T_END) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(-w, -h, w * 2, h * 2);
        window.cotekField?.dim(1);
        // Nothing left to skip. This also stops the loop: the effect re-runs
        // on the state change and takes the early return above.
        setMotion((m) => (m === "play" ? "done" : m));
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.cotekField?.dim(1);
    };
  }, [motion, cast, letterIndices]);

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <section
      ref={sectionRef}
      className="threshold"
      data-motion={motion}
      style={timingVars()}
      aria-labelledby="threshold-heading"
    >
      {/* The single most load-bearing element on the site for anyone
          searching one of his names. It is never hidden from the accessibility
          tree, only from sight. */}
      <h1 id="threshold-heading" className="sr-only">
        {TEMI.fullName} — also known as {TEMI.names.join(", ")}. COTEK means{" "}
        {TEMI.acronym.meaning.toLowerCase()}.
      </h1>

      <canvas ref={canvasRef} className="threshold-web" aria-hidden="true" />

      {/* The names are duplicated by the heading above, so they are scenery
          here rather than content. */}
      <div className="threshold-stage" aria-hidden="true">
        {cast.map((m, i) => (
          <span
            key={m.name}
            className="tname"
            data-letter={m.letter}
            style={
              {
                "--i": i,
                "--nx": `${pts[i]?.x ?? 0}px`,
                "--ny": `${pts[i]?.y ?? 0}px`,
              } as React.CSSProperties
            }
          >
            {m.name}
          </span>
        ))}
      </div>

      <div className="threshold-core">
        <div className="mark-ghost" aria-hidden="true">
          <Mark size={480} />
        </div>

        <div className="wordmark" aria-hidden="true">
          {TEMI.acronym.expansion.map((l, i) => (
            <span key={l.letter} className="letter" style={{ "--i": i } as React.CSSProperties}>
              {l.letter}
            </span>
          ))}
        </div>

        <dl className="expansion">
          {TEMI.acronym.expansion.map((l, i) => (
            <div key={l.letter} className="row" style={{ "--i": i } as React.CSSProperties}>
              <dt>{l.letter}</dt>
              <dd>{l.name}</dd>
            </div>
          ))}
        </dl>

        <p className="meaning">COTEK means {TEMI.acronym.meaning.toLowerCase()}.</p>
        <p className="subline">Same person. Many lives. One ledger.</p>

        <div className="threshold-actions">
          <Link className="btn btn-solid" href="/cathedral">
            Enter the cathedral
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link className="btn btn-ghost" href="/about">
            Read the letter instead
          </Link>
        </div>
      </div>

      {motion === "play" ? (
        <button type="button" className="threshold-skip" onClick={skip}>
          Skip
        </button>
      ) : null}

      <p className="threshold-cue" aria-hidden="true">
        <span className="stem" />
        The names
      </p>
    </section>
  );
}
