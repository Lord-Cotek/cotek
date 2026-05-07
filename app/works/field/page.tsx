// app/works/field/page.tsx
// The field room. Environmental work — water, wastewater, reef, WWF.
// Half his life, half his theology.

import type { Metadata } from "next";
import { TEMI } from "@/lib/identities";
import RoomsStrip from "@/components/RoomsStrip";

export const metadata: Metadata = {
  title: "Field — water, wastewater, reef",
  description:
    "Temi Cotek — Environment Division Manager at AMRO; formerly Senior Water Quality Analyst at Action International Services. Water and wastewater treatment across the UAE and the GCC. Member, Emirates Nature–WWF. Certified diver.",
};

export default function FieldPage() {
  const wwf = TEMI.memberships.find((m) => m.name.startsWith("Emirates Nature"));
  const cert = TEMI.certifications[0];

  return (
    <div className="container container-narrow">
      <RoomsStrip current="field" />
      <header className="room-head">
        <div className="room-eyebrow">/ works / field</div>
        <h1 className="room-title">The other half of his life.</h1>
        <p className="room-deck">
          Water and wastewater treatment systems, environmental compliance,
          environmental management plans, water-quality analysis, ecosystem
          advisory across the UAE and the GCC. The reef on weekends. The
          ledger on Mondays.
        </p>
      </header>

      <section className="room-section">
        <div className="stamp">What he does, plainly</div>
        <h2 className="serif">A job description that became a sermon.</h2>
        <p>
          Most days he is reading water — the kind that arrives at a treatment
          plant carrying everything a city forgot, and the kind that returns
          to it after the work is done. He writes environmental management
          plans. He signs off on compliance. He visits sites where the
          numbers and the smell rarely agree, and decides which one to
          trust. Across the UAE and the GCC, the brief is the same: less
          harm, fewer assumptions, more written down.
        </p>
      </section>

      <section className="room-section">
        <div className="stamp">The career trail</div>
        <div className="cards-2">
          <article className="card">
            <div className="card-eyebrow">Current</div>
            <h3 className="card-title">AMRO — Environment Division Manager</h3>
            <div className="card-meta">UAE · GCC</div>
            <p className="card-body">
              Leads the environment division: water and wastewater treatment
              solutions, compliance, plans. The kind of work that becomes
              invisible when it goes well — and that is the point.
            </p>
          </article>
          <article className="card">
            <div className="card-eyebrow">Former</div>
            <h3 className="card-title">Action International Services — Senior Water Quality Analyst</h3>
            <div className="card-meta">UAE</div>
            <p className="card-body">
              Where he learned to read water like scripture. Treatment systems,
              sampling discipline, the patience required to wait for a result
              that does not lie.
            </p>
          </article>
        </div>
      </section>

      <section className="room-section">
        <div className="stamp">Memberships & certifications</div>
        <div className="cards-2">
          <article className="card">
            <div className="card-eyebrow">Member</div>
            <h3 className="card-title">{wwf?.name ?? "Emirates Nature–WWF"}</h3>
            <p className="card-body">
              The reef and the desert are not abstractions to a member. They
              are appointments.
            </p>
            {wwf?.url ? (
              <a href={wwf.url} className="card-tag" target="_blank" rel="noreferrer">
                Visit Emirates Nature–WWF →
              </a>
            ) : null}
          </article>
          <article className="card">
            <div className="card-eyebrow">Certified</div>
            <h3 className="card-title">{cert?.name ?? "Certified Diver"}</h3>
            <div className="card-meta">
              {cert?.body ? `${cert.body} ` : ""}
              {cert?.diverNumber ? `· No. ${cert.diverNumber} ` : ""}
              {cert?.issuedAt ? `· issued ${cert.issuedAt}` : ""}
            </div>
            <p className="card-body">
              {cert?.school ? <>Trained at <strong>{cert.school}</strong>{cert.instructor ? <> with instructor <strong>{cert.instructor}</strong></> : null}. </> : null}
              Diving is a discipline of less.
            </p>
          </article>
        </div>
      </section>

      <section className="room-section">
        <div className="stamp">Reef notes</div>
        <h2 className="serif">A small visual log.</h2>
        <ul className="reef-list">
          {TEMI.works.reef.map((r, i) => (
            <li key={i}>
              <div className="reef-when">
                {r.place} · {r.when}
              </div>
              <p className="reef-line">“{r.line}”</p>
            </li>
          ))}
        </ul>
      </section>

      <blockquote className="pull">
        Stewardship is not a metaphor for me. It is a job description. Then
        it became a sermon. Then it became a life.
      </blockquote>
    </div>
  );
}
