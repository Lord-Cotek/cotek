import type { Metadata } from "next";
import Mark from "@/components/Mark";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "The Rose Window — names",
  description:
    "Cotek Temi · Temi Cotek · Temitayo Cotek · Cotek Temitayo · Temitayo Ezekiel Olayiwola · Omogbolahan · Kadiri · Cotek. Every form of the name, every profile, set as a colophon.",
  alternates: { canonical: "/names" },
};

const HANDLE_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  unsplash: "Unsplash",
  instagram_personal: "Instagram (personal)",
  instagram_creative: "Instagram (creative)",
  facebook: "Facebook",
  researchgate: "ResearchGate",
  academia: "Academia.edu",
  openlibrary: "OpenLibrary",
  amazon: "Amazon",
  allpoetry: "AllPoetry",
  biography_omics: "OMICS biography (IISER)",
  googleplay_books: "Google Play Books",
  everand: "Everand",
};

export default function NamesPage() {
  return (
    <div className="room">
      <div className="shell-narrow">
        <header className="room-head">
          <p className="stamp">The Rose Window · Names</p>
          <h1 className="room-title">
            One person, <em>refracted</em>.
          </h1>
          <p className="room-deck">
            A printed book often closes with a colophon — a small, carefully set record
            of who made it and how. A rose window does the same thing with light. This
            page is both.
          </p>
        </header>

        <section
          className="section reveal"
          style={{ textAlign: "center", position: "relative" }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "var(--bone)",
              opacity: 0.045,
              pointerEvents: "none",
            }}
          >
            <Mark size={300} />
          </div>

          <p
            style={{
              fontSize: "var(--t-4xl)",
              fontWeight: 600,
              letterSpacing: "0.14em",
              lineHeight: 1,
              paddingLeft: "0.14em",
            }}
          >
            {TEMI.acronym.word}
          </p>
          <p
            className="serif"
            style={{ fontStyle: "italic", fontSize: "var(--t-xl)", marginTop: "0.8rem" }}
          >
            means {TEMI.acronym.meaning.toLowerCase()}.
          </p>

          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "0 clamp(0.3rem, 1.5vw, 1.2rem)",
              maxWidth: "38rem",
              margin: "2.4rem auto 0",
              paddingTop: "1.4rem",
              borderTop: "1px solid var(--line)",
            }}
          >
            {TEMI.acronym.expansion.map((l) => (
              <div key={l.letter}>
                <dt className="serif" style={{ fontSize: "var(--t-xl)", color: "var(--accent)" }}>
                  {l.letter}
                </dt>
                <dd
                  className="mono"
                  style={{
                    margin: "0.4rem 0 0",
                    fontSize: "0.5rem",
                    color: "var(--bone-30)",
                    overflowWrap: "anywhere",
                  }}
                >
                  {l.name}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <dl>
            <div className="folio">
              <dt>Names he answers to</dt>
              <dd>
                {TEMI.names.join(" · ")}
                <p className="appears">Full given name: {TEMI.fullName}</p>
              </dd>
            </div>

            <div className="folio">
              <dt>Lives</dt>
              <dd>{TEMI.roles.join(" · ")}</dd>
            </div>

            <div className="folio">
              <dt>Career</dt>
              <dd>
                <ul style={{ display: "grid", gap: "0.9rem" }}>
                  {TEMI.career.map((c) => (
                    <li key={c.org}>
                      <strong style={{ color: "var(--bone)" }}>{c.org}</strong> — {c.role}{" "}
                      <span className="dim">({c.tenure})</span>
                      <p className="appears">{c.what}</p>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="folio">
              <dt>Memberships</dt>
              <dd>
                {TEMI.memberships.map((m) => (
                  <a key={m.name} href={m.url} target="_blank" rel="noreferrer">
                    {m.name}
                  </a>
                ))}
              </dd>
            </div>

            <div className="folio">
              <dt>Certifications</dt>
              <dd>
                {TEMI.certifications.map((c) => (
                  <div key={c.name}>
                    {c.name} — {c.body}
                    <p className="appears">
                      No. {c.diverNumber} · issued {c.issuedAt} · {c.school}
                    </p>
                  </div>
                ))}
              </dd>
            </div>

            <div className="folio">
              <dt>Affiliations</dt>
              <dd>
                <ul style={{ display: "grid", gap: "0.4rem" }}>
                  {TEMI.affiliations.map((a) => (
                    <li key={a.name}>
                      {"url" in a && a.url ? (
                        <a href={a.url} target="_blank" rel="noreferrer">
                          {a.name}
                        </a>
                      ) : (
                        a.name
                      )}
                      {"role" in a && a.role ? <span className="dim"> · {a.role}</span> : null}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="folio">
              <dt>Profiles</dt>
              <dd>
                <ul style={{ display: "grid", gap: "0.4rem" }}>
                  {Object.entries(TEMI.handles).map(([k, url]) => (
                    <li key={k}>
                      {/* rel="me" is what lets these profiles and this page
                          verify each other as the same person. */}
                      <a href={url} target="_blank" rel="me noreferrer">
                        {HANDLE_LABELS[k] ?? k}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="folio">
              <dt>Where he is</dt>
              <dd>{TEMI.location}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
