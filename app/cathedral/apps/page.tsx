import type { Metadata } from "next";
import ChapelHead from "@/components/ChapelHead";
import { TEMI } from "@/lib/identities";
import { Spell } from "@/lib/numbers";

export const metadata: Metadata = {
  title: "The Workshop — Cotek App FZ-LLC",
  description:
    "Software from Cotek App FZ-LLC, registered at RAKEZ in Ras Al Khaimah: PExP, ProMan, Sci-Cotek, BMS, Poems and exp.",
  alternates: { canonical: "/cathedral/apps" },
};

export default function AppsChapel() {
  const apps = TEMI.works.apps;

  return (
    <div className="room">
      <div className="shell">
        <ChapelHead
          slug="apps"
          title={
            <>
              Tools, <em>written down</em>.
            </>
          }
          deck={`Cotek App FZ-LLC — registered at RAKEZ, Ras Al Khaimah. ${Spell(apps.length)} small products built around stewardship and accountability. Each one is a ledger of a kind.`}
        />

        <section className="section reveal">
          <div className="cards">
            {apps.map((a) => (
              <a className="card" key={a.name} href={a.url} target="_blank" rel="noreferrer">
                <span className="card-eyebrow">App</span>
                <h2 className="card-title">{a.name}</h2>
                <p className="card-meta">{a.url.replace("https://", "")}</p>
                <p className="card-body">{a.what}</p>
                <span className="card-tag">Open →</span>
              </a>
            ))}
          </div>

          <blockquote className="pull">
            Each one is narrow on purpose, and each one can show its working.
          </blockquote>
        </section>
      </div>
    </div>
  );
}
