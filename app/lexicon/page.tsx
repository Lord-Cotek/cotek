// app/lexicon/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lexicon",
  description:
    "Words Temi Cotek actually uses, with definitions in his voice — stewardship, accountability, ledger, signal, threshold, harvest, water, treatment, reef, and more.",
};

const ENTRIES: Array<{ term: string; def: string; appears?: string }> = [
  { term: "Stewardship", def: "What you do with what is not yours.", appears: "his job description; also his sermon" },
  { term: "Accountability", def: "The courage to be checked.", appears: "every product he ships" },
  { term: "Ledger", def: "Every honest record is a moral object.", appears: "exp, pexp, the household" },
  { term: "Signal", def: "The line of language that survives the noise.", appears: "the daily Signal panel" },
  { term: "Threshold", def: "The place between rooms; where most life happens.", appears: "the door of this site" },
  { term: "Harvest", def: "You reap what you wrote down.", appears: "stewardship, examined" },
  { term: "Cathedral", def: "A long obedience built in stone.", appears: "the shape of the site" },
  { term: "Hope", def: "The meaning of my own name. Five names, one word.", appears: "COTEK" },
  { term: "Water", def: "The first ledger God ever kept.", appears: "the field; the reef; the plant" },
  { term: "Treatment", def: "What we do to what we damaged. Slowly. With instruments.", appears: "Mondays" },
  { term: "Reef", def: "A city of small obediences.", appears: "the dive log" },
  { term: "Desert", def: "The discipline of less.", appears: "the wadi after rain" },
  { term: "Chimera", def: "The part of me that is many things at once. The first letter.", appears: "C — Chimera" },
  { term: "Hand", def: "The only honest unit of work.", appears: "the household and the lab" },
];

export default function LexiconPage() {
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ lexicon</div>
        <h1 className="room-title">A glossary that doubles as a worldview.</h1>
        <p className="room-deck">
          Words he actually uses, with definitions in his voice. Read it
          slowly. The page should look like it was set in metal type.
        </p>
      </header>

      <dl style={{ margin: "32px 0 0" }}>
        {ENTRIES.map((e) => (
          <div key={e.term} className="folio">
            <dt>{e.term}</dt>
            <dd>
              {e.def}
              {e.appears ? (
                <div style={{ marginTop: 6, color: "var(--ink-faint)", fontSize: 12.5, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                  appears: {e.appears}
                </div>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
