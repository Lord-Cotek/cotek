"use client";

/*
  The plan.

  A drawing of the building with every room on the site standing somewhere in
  it. Pointing at a station names it in the readout underneath and blooms its
  anchor in the background field; clicking walks you there.

  The drawing is one inert SVG. The stations are HTML anchors laid over it in
  percentages of the same coordinate space — see styles/cathedral.css for why
  the two layers are separate. Everything the drawing depicts is repeated as
  text in the index below it, so the SVG can be hidden from assistive tech
  entirely rather than narrated badly.
*/

import { useState } from "react";
import Link from "next/link";
import { LEY, PLAN, STATIONS, station } from "@/lib/cathedral";

const { narthex, nave, aisleN, aisleS, crossing, transeptN, transeptS, choir, apse, columns } =
  PLAN;

/** The arcade: two rows of piers between the nave and its aisles. */
const PIERS: Array<{ x: number; y: number }> = [];
for (let x = columns.from; x <= columns.to; x += columns.step) {
  PIERS.push({ x, y: columns.yN }, { x, y: columns.yS });
}

const from = station(LEY.from)!;
const to = station(LEY.to)!;

export default function CathedralPlan() {
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? station(active) : null;

  return (
    <div>
      <div className="plan-scroll">
        <div className="plan">
          <svg viewBox={PLAN.viewBox} aria-hidden="true" focusable="false">
            {/* The long axis, west door to high altar. */}
            <line
              className="plan-axis"
              x1={narthex.x}
              y1={230}
              x2={apse.cx + apse.r + 24}
              y2={230}
            />

            {/* The fabric, west to east. */}
            <rect className="plan-fabric" {...narthex} />
            <rect className="plan-fabric" {...aisleN} />
            <rect className="plan-fabric" {...aisleS} />
            <rect className="plan-vessel" {...nave} />
            <rect className="plan-fabric" {...transeptN} />
            <rect className="plan-fabric" {...transeptS} />
            <rect className="plan-vessel" {...crossing} />
            <rect className="plan-vessel" {...choir} />

            {/* The apse: a half-round closing the east end. */}
            <path
              className="plan-vessel"
              d={`M ${apse.cx} ${apse.cy - apse.r}
                  A ${apse.r} ${apse.r} 0 0 1 ${apse.cx} ${apse.cy + apse.r} Z`}
            />

            {PIERS.map((p) => (
              <circle className="plan-column" key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={2.5} />
            ))}

            <line
              className="plan-ley"
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
            />

            <text className="plan-compass" x={narthex.x} y={26} textAnchor="start">
              West · the door
            </text>
            <text className="plan-compass" x={apse.cx + apse.r} y={26} textAnchor="end">
              East · the apse
            </text>
          </svg>

          {STATIONS.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              className="plan-station"
              data-station={s.slug}
              data-kind={s.kind}
              data-label={s.label}
              data-active={active === s.slug}
              style={
                {
                  "--px": (s.x / PLAN.width) * 100,
                  "--py": (s.y / PLAN.height) * 100,
                  "--glass": s.glass,
                } as React.CSSProperties
              }
              onPointerEnter={() => setActive(s.slug)}
              onPointerLeave={() => setActive((a) => (a === s.slug ? null : a))}
              onFocus={() => setActive(s.slug)}
              onBlur={() => setActive((a) => (a === s.slug ? null : a))}
            >
              <span className="plan-dot" />
              <span className="plan-label">
                <span className="ttl">{s.title}</span>
                <span className="sub">{s.room}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* aria-live so a keyboard user tabbing the plan hears each station
          described as they arrive on it, which is the whole content of the
          hover state they cannot otherwise reach. */}
      <div
        className="plan-readout"
        aria-live="polite"
        style={shown ? ({ "--glass": shown.glass } as React.CSSProperties) : undefined}
      >
        {shown ? (
          <>
            <span className="ttl">{shown.title}</span>
            <span className="deck">{shown.deck}</span>
          </>
        ) : (
          <>
            <span className="plan-hint">Twelve stations · point at one</span>
            <span className="deck">
              The lit line runs from the Pulpit to the Font — stewardship preached and
              stewardship practised, which is the same idea told twice.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
