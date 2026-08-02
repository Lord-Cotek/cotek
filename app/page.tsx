import type { Metadata } from "next";
import Link from "next/link";
import Threshold from "@/components/Threshold";
import { TEMI } from "@/lib/identities";
import { CHAPELS } from "@/lib/cathedral";
import { Spell } from "@/lib/numbers";

export const metadata: Metadata = {
  title: `${TEMI.fullName} — same person, many lives`,
  description:
    "Cotek Temi · Temi Cotek · Temitayo Cotek · Temitayo Ezekiel Olayiwola · Omogbolahan · Kadiri. Environmentalist, software founder, author, poet, Bible teacher. COTEK means hope.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      <Threshold />

      {/* The ceremony argues that the names are one person. Everything below
          is the evidence, and it is plain text whether or not anything above
          it ever animated. */}
      <section className="beats" aria-label="Four beats">
        <div>Author.</div>
        <div>Builder.</div>
        <div>Steward of water.</div>
        <div>Bible teacher.</div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="ledger reveal">
            <div>
              <h2>Names he answers to</h2>
              <ul>
                {TEMI.names.map((n) => (
                  <li key={n}>{n}</li>
                ))}
                <li className="dim">{TEMI.fullName}</li>
              </ul>
            </div>

            <div>
              <h2>Lives</h2>
              <ul>
                {TEMI.roles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Chapels</h2>
              <ul>
                {CHAPELS.map((c) => (
                  <li key={c.slug} data-station={c.slug}>
                    <Link href={c.href}>
                      {c.title} <span className="dim">· {c.room}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal" style={{ marginTop: "clamp(3rem, 8vw, 6rem)" }}>
            <p className="lede">
              {Spell(CHAPELS.length)} chapels, and five rooms besides. The building is
              the index — walk the plan and every part of the work is standing
              somewhere in it.
            </p>
            <div className="threshold-actions" style={{ justifyContent: "flex-start" }}>
              <Link className="btn btn-solid" href="/cathedral">
                See the plan
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
              <Link className="btn btn-ghost" href="/names">
                Every name, and where it came from
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
