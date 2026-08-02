import type { Metadata } from "next";
import ChapelHead from "@/components/ChapelHead";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "The Scriptorium — research",
  description:
    "Independent research by Temi Cotek — IISER alumnus; profiles on ResearchGate, Academia, and the OMICS biography listing.",
  alternates: { canonical: "/cathedral/research" },
};

const PROFILES = [
  {
    label: "Profile",
    title: "ResearchGate",
    body: "Papers, citations, and ongoing project listings.",
    href: TEMI.handles.researchgate,
  },
  {
    label: "Profile",
    title: "Academia.edu",
    body: "Independent uploads.",
    href: TEMI.handles.academia,
  },
  {
    label: "Biography",
    title: "IISER (OMICS)",
    body: "Indian Institute of Science Education and Research — alumni biography.",
    href: TEMI.handles.biography_omics,
  },
];

export default function ResearchChapel() {
  return (
    <div className="room">
      <div className="shell">
        <ChapelHead
          slug="research"
          title={
            <>
              Work kept where it was <em>published</em>.
            </>
          }
          deck="IISER (India) alumnus. Continuing work at the intersection of environmental science, water quality, and field practice."
        />

        <section className="section reveal">
          <div className="cards">
            {PROFILES.map((p) => (
              <a className="card" key={p.href} href={p.href} target="_blank" rel="noreferrer">
                <span className="card-eyebrow">{p.label}</span>
                <h2 className="card-title">{p.title}</h2>
                <p className="card-body">{p.body}</p>
                <span className="card-tag">Open →</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule">Why this room links out</p>
          <div className="prose" style={{ marginTop: "1.2rem" }}>
            <p>
              ResearchGate, Academia and the rest are hostile to automated readers, and
              a scrape of them would be a copy that quietly goes stale. This room links
              instead. The papers live at the source, where they can be corrected.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
