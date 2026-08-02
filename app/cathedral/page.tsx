import type { Metadata } from "next";
import Link from "next/link";
import CathedralPlan from "@/components/CathedralPlan";
import { CHAPELS, STATIONS } from "@/lib/cathedral";
import { TEMI } from "@/lib/identities";
import { Spell, spell } from "@/lib/numbers";

export const metadata: Metadata = {
  title: "The Cathedral",
  description: `The plan of ${TEMI.fullName}'s work — apps, books, poems, research, sermons, photographs, and the environmental field practice, each standing in its own part of the building.`,
  alternates: { canonical: "/cathedral" },
};

const OTHERS = STATIONS.filter((s) => s.kind === "station");

export default function CathedralPage() {
  return (
    <div className="room">
      <div className="shell">
        <header className="room-head">
          <p className="stamp">The plan</p>
          <h1 className="room-title">
            A building, not a <em>portfolio</em>.
          </h1>
          <p className="room-deck">
            {Spell(CHAPELS.length)} chapels and {spell(OTHERS.length)} rooms besides, laid
            out west to east. Point at any of them. The line that runs from the Pulpit to
            the Font is the only one on the plan that is not a wall.
          </p>
        </header>
      </div>

      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <CathedralPlan />
        </div>
      </div>

      <div className="section">
        <div className="shell">
          <p className="stamp stamp-rule" style={{ marginBottom: "1.6rem" }}>
            The chapels — the rooms of work
          </p>
          <div className="chapel-grid reveal">
            {CHAPELS.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="chapel-card"
                data-station={c.slug}
                style={{ "--glass": c.glass } as React.CSSProperties}
              >
                <span className="arch">
                  <span className="ttl">{c.title}</span>
                  <span className="room">{c.room}</span>
                </span>
                <span className="deck">{c.deck}</span>
              </Link>
            ))}
          </div>

          <p
            className="stamp stamp-rule"
            style={{ margin: "clamp(3rem, 7vw, 5rem) 0 1.6rem" }}
          >
            The rest of the building
          </p>
          <div className="chapel-grid reveal">
            {OTHERS.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="chapel-card"
                data-station={c.slug}
                style={{ "--glass": c.glass } as React.CSSProperties}
              >
                <span className="arch">
                  <span className="ttl">{c.title}</span>
                  <span className="room">{c.room}</span>
                </span>
                <span className="deck">{c.deck}</span>
              </Link>
            ))}
          </div>

          <blockquote className="pull reveal">
            A cathedral is a long obedience built in stone. It is also, usefully, a
            filing system.
          </blockquote>
        </div>
      </div>
    </div>
  );
}
