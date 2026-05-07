// app/works/apps/page.tsx
import type { Metadata } from "next";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "Apps — Cotek App FZ-LLC",
  description:
    "Software studio output: PExP, ProMan, Sci-Cotek, BMS, Poems, exp.",
};

export default function AppsPage() {
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ works / apps</div>
        <h1 className="room-title">Tools, written down.</h1>
        <p className="room-deck">
          Cotek App FZ-LLC — registered at RAKEZ, Ras Al Khaimah. A small
          studio that builds tools around stewardship and accountability.
          Each one is a ledger of a kind.
        </p>
      </header>

      <section className="room-section">
        <div className="cards-2">
          {TEMI.works.apps.map((a) => (
            <a key={a.name} className="card" href={a.url} target="_blank" rel="noreferrer">
              <div className="card-eyebrow">App</div>
              <h3 className="card-title">{a.name}</h3>
              <div className="card-meta">{a.url.replace("https://", "")}</div>
              <p className="card-body">{a.what}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
