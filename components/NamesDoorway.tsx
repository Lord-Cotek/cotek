// components/NamesDoorway.tsx
"use client";

// The threshold ceremony.
//
// Three acts:
//  1. Drift (~5s)        — eight names rotate, one fading as the next emerges.
//  2. Convergence (~3s)  — names dim and the wordmark COTEK assembles letter
//                          by letter, each landing softly.
//  3. Unfolding (~4s)    — under each letter, its expansion. Then the meaning,
//                          the subline, and the "enter the cathedral" prompt.
//
// prefers-reduced-motion: render the final state immediately.

import { useEffect, useState } from "react";
import Link from "next/link";
import { TEMI } from "@/lib/identities";

const NAMES = TEMI.names;
const LETTERS = TEMI.acronym.expansion;

const TIMING = {
  perName: 700,    // ms each drifting name holds
  driftEnd: 5600,  // ms — start convergence
  perLetter: 220,  // ms between letters landing
  expandStart: 8200,
  perRow: 180,
  meaningAt: 9800,
  sublineAt: 10600,
  enterAt: 11400,
};

export default function NamesDoorway() {
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState<"drift" | "converge" | "unfold">("drift");
  const [driftIdx, setDriftIdx] = useState(0);
  const [letters, setLetters] = useState<boolean[]>(() => LETTERS.map(() => false));
  const [rowsIn, setRowsIn] = useState<boolean[]>(() => LETTERS.map(() => false));
  const [meaningIn, setMeaningIn] = useState(false);
  const [sublineIn, setSublineIn] = useState(false);
  const [enterIn, setEnterIn] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
  }, []);

  // Snap to final state if reduced motion.
  useEffect(() => {
    if (!reduced) return;
    setPhase("unfold");
    setLetters(LETTERS.map(() => true));
    setRowsIn(LETTERS.map(() => true));
    setMeaningIn(true);
    setSublineIn(true);
    setEnterIn(true);
  }, [reduced]);

  // Drift loop.
  useEffect(() => {
    if (reduced) return;
    if (phase !== "drift") return;
    const t = setInterval(() => {
      setDriftIdx((i) => (i + 1) % NAMES.length);
    }, TIMING.perName);
    const end = setTimeout(() => setPhase("converge"), TIMING.driftEnd);
    return () => {
      clearInterval(t);
      clearTimeout(end);
    };
  }, [phase, reduced]);

  // Convergence — stagger letters.
  useEffect(() => {
    if (reduced) return;
    if (phase !== "converge") return;
    const ts: number[] = [];
    LETTERS.forEach((_l, i) => {
      ts.push(
        window.setTimeout(() => {
          setLetters((arr) => arr.map((v, j) => (j === i ? true : v)));
        }, i * TIMING.perLetter + 80),
      );
    });
    ts.push(window.setTimeout(() => setPhase("unfold"), LETTERS.length * TIMING.perLetter + 600));
    return () => ts.forEach((h) => clearTimeout(h));
  }, [phase, reduced]);

  // Unfolding rows + closing lines.
  useEffect(() => {
    if (reduced) return;
    if (phase !== "unfold") return;
    const ts: number[] = [];
    LETTERS.forEach((_l, i) => {
      ts.push(
        window.setTimeout(() => {
          setRowsIn((arr) => arr.map((v, j) => (j === i ? true : v)));
        }, i * TIMING.perRow + 100),
      );
    });
    ts.push(window.setTimeout(() => setMeaningIn(true), 1100));
    ts.push(window.setTimeout(() => setSublineIn(true), 1900));
    ts.push(window.setTimeout(() => setEnterIn(true), 2700));
    return () => ts.forEach((h) => clearTimeout(h));
  }, [phase, reduced]);

  return (
    <section className="threshold" aria-labelledby="threshold-heading">
      <h1 id="threshold-heading" className="sr-only">
        {TEMI.fullName} — also known as {TEMI.names.join(", ")}. COTEK means hope.
      </h1>

      <div className="drift" aria-hidden="true">
        {NAMES.map((n, i) => (
          <span key={n} className={i === driftIdx && phase === "drift" ? "now" : ""}>
            {n}
          </span>
        ))}
        {phase !== "drift" ? (
          <span className="now" style={{ opacity: 0.18 }}>
            {NAMES[driftIdx]}
          </span>
        ) : null}
      </div>

      <div className="wordmark" aria-label="COTEK">
        {LETTERS.map((l, i) => (
          <span key={l.letter} className={`letter ${letters[i] ? "in" : ""}`}>
            {l.letter}
          </span>
        ))}
      </div>

      <dl className="expansion" aria-label="What COTEK stands for">
        {LETTERS.map((l, i) => (
          <div key={l.letter} className={`row ${rowsIn[i] ? "in" : ""}`}>
            <dt className="letter">{l.letter}</dt>
            <dd className="name">{l.name}</dd>
          </div>
        ))}
      </dl>

      <p className={`meaning ${meaningIn ? "in" : ""}`}>
        “COTEK means hope.”
      </p>
      <p className={`subline ${sublineIn ? "in" : ""}`}>
        Same person. Many lives. One ledger.
      </p>

      <Link
        href="/works"
        className={`enter ${enterIn ? "in" : ""}`}
        aria-label="Enter the cathedral — go to the works"
      >
        Enter the cathedral
        <span className="arrow" aria-hidden="true">↓</span>
      </Link>
    </section>
  );
}
