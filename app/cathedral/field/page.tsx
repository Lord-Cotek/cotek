import type { Metadata } from "next";
import ChapelHead from "@/components/ChapelHead";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "The Font — water, wastewater, reef",
  description:
    "Temi Cotek — Environment Division Manager at AMRO; formerly Senior Water Quality Analyst at Action International Services. Water and wastewater treatment across the UAE and the GCC. Member, Emirates Nature–WWF. Certified diver.",
  alternates: { canonical: "/cathedral/field" },
};

export default function FieldChapel() {
  const wwf = TEMI.memberships.find((m) => m.name.startsWith("Emirates Nature"));
  const cert = TEMI.certifications[0];

  return (
    <div className="room">
      <div className="shell">
        <ChapelHead
          slug="field"
          title={
            <>
              The other half of his <em>life</em>.
            </>
          }
          deck="Water and wastewater treatment systems, environmental compliance, management plans, water-quality analysis, ecosystem advisory across the UAE and the GCC. The reef on weekends. The ledger on Mondays."
        />

        <section className="section reveal">
          <p className="stamp stamp-rule">What he does, plainly</p>
          <h2 className="serif" style={{ margin: "1.4rem 0", fontSize: "var(--t-2xl)" }}>
            A job description that became a sermon.
          </h2>
          <div className="prose">
            <p>
              Most days he is reading water — the kind that arrives at a treatment plant
              carrying everything a city forgot, and the kind that returns to it after
              the work is done. He writes environmental management plans. He signs off
              on compliance. He visits sites where the numbers and the smell rarely
              agree, and decides which one to trust. Across the UAE and the GCC the
              brief is the same: less harm, fewer assumptions, more written down.
            </p>
          </div>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule" style={{ marginBottom: "1.6rem" }}>
            The career trail
          </p>
          <div className="cards">
            {TEMI.career
              .filter((c) => c.org !== "Cotek App FZ-LLC")
              .map((c) => (
                <article className="card" key={c.org}>
                  <span className="card-eyebrow">
                    {c.tenure === "current" ? "Current" : "Former"}
                  </span>
                  <h3 className="card-title">
                    {c.org} — {c.role}
                  </h3>
                  <p className="card-body">{c.what}</p>
                </article>
              ))}
          </div>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule" style={{ marginBottom: "1.6rem" }}>
            Memberships and certifications
          </p>
          <div className="cards">
            <a
              className="card"
              href={wwf?.url ?? "https://www.emiratesnaturewwf.ae/"}
              target="_blank"
              rel="noreferrer"
            >
              <span className="card-eyebrow">Member</span>
              <h3 className="card-title">{wwf?.name ?? "Emirates Nature–WWF"}</h3>
              <p className="card-body">
                The reef and the desert are not abstractions to a member. They are
                appointments.
              </p>
              <span className="card-tag">Visit →</span>
            </a>

            <article className="card">
              <span className="card-eyebrow">Certified</span>
              <h3 className="card-title">{cert?.name ?? "Certified diver"}</h3>
              <p className="card-meta">
                {[
                  cert?.body,
                  cert?.diverNumber ? `No. ${cert.diverNumber}` : null,
                  cert?.issuedAt ? `issued ${cert.issuedAt}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="card-body">
                {cert?.school ? (
                  <>
                    Trained at <strong>{cert.school}</strong>
                    {cert.instructor ? (
                      <>
                        {" "}
                        with instructor <strong>{cert.instructor}</strong>
                      </>
                    ) : null}
                    .{" "}
                  </>
                ) : null}
                Diving is a discipline of less.
              </p>
            </article>
          </div>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule" style={{ marginBottom: "1.6rem" }}>
            Reef notes
          </p>
          <ul className="reef">
            {TEMI.works.reef.map((r) => (
              <li key={`${r.place}-${r.when}`}>
                <p className="when">
                  {r.place} · {r.when}
                </p>
                <p className="line">“{r.line}”</p>
              </li>
            ))}
          </ul>

          <blockquote className="pull">
            Stewardship is not a metaphor for me. It is a job description. Then it
            became a sermon. Then it became a life.
          </blockquote>
        </section>
      </div>
    </div>
  );
}
