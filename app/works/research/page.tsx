// app/works/research/page.tsx
import type { Metadata } from "next";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Independent research by Temi Cotek — IISER alumnus; profiles on ResearchGate, Academia, and the OMICS biography listing.",
};

export default function ResearchPage() {
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ works / research</div>
        <h1 className="room-title">Independent research.</h1>
        <p className="room-deck">
          IISER (India) alumnus. Continuing work at the intersection of
          environmental science, water quality, and field practice.
        </p>
      </header>

      <section className="room-section">
        <div className="cards-2">
          <a className="card" href={TEMI.handles.researchgate} target="_blank" rel="noreferrer">
            <div className="card-eyebrow">Profile</div>
            <h3 className="card-title">ResearchGate</h3>
            <p className="card-body">Papers, citations, and ongoing project listings.</p>
          </a>
          <a className="card" href={TEMI.handles.academia} target="_blank" rel="noreferrer">
            <div className="card-eyebrow">Profile</div>
            <h3 className="card-title">Academia.edu</h3>
            <p className="card-body">Independent uploads.</p>
          </a>
          <a className="card" href={TEMI.handles.biography_omics} target="_blank" rel="noreferrer">
            <div className="card-eyebrow">Biography</div>
            <h3 className="card-title">IISER (OMICS)</h3>
            <p className="card-body">Indian Institute of Science Education and Research — alumni biography.</p>
          </a>
        </div>
      </section>

      <section className="room-section">
        <div className="stamp">A note</div>
        <p>
          ResearchGate, Academia, and similar networks are user-agent hostile;
          this room intentionally links out rather than scrapes. The papers
          live at the source. Follow the cards above.
        </p>
      </section>
    </div>
  );
}
