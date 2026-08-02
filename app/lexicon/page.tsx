import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Lectionary — lexicon",
  description:
    "Words Temi Cotek actually uses, defined in his own voice — stewardship, accountability, ledger, signal, threshold, harvest, water, treatment, reef, and more.",
  alternates: { canonical: "/lexicon" },
};

/*
  A lectionary is the book of readings a church works through in order. This
  one is a glossary that doubles as a worldview: every entry is a word he
  reaches for often enough that the definition is doing real work somewhere
  else on the site, and `appears` says where.
*/
const ENTRIES: Array<{ term: string; def: string; appears: string }> = [
  { term: "Stewardship", def: "What you do with what is not yours.", appears: "his job description; also his sermon" },
  { term: "Accountability", def: "The courage to be checked.", appears: "every product he ships" },
  { term: "Ledger", def: "Every honest record is a moral object.", appears: "exp, PExP, the household" },
  { term: "Signal", def: "The line of language that survives the noise.", appears: "the bell, rung daily" },
  { term: "Threshold", def: "The place between rooms; where most life happens.", appears: "the door of this site" },
  { term: "Harvest", def: "You reap what you wrote down.", appears: "stewardship, examined" },
  { term: "Cathedral", def: "A long obedience built in stone.", appears: "the shape of this site" },
  { term: "Hope", def: "The meaning of my own name. Five names, one word.", appears: "COTEK" },
  { term: "Water", def: "The first ledger God ever kept.", appears: "the font; the reef; the plant" },
  { term: "Treatment", def: "What we do to what we damaged. Slowly. With instruments.", appears: "Mondays" },
  { term: "Reef", def: "A city of small obediences.", appears: "the dive log" },
  { term: "Desert", def: "The discipline of less.", appears: "the wadi after rain" },
  { term: "Chimera", def: "The part of me that is many things at once. The first letter.", appears: "C — Chimera" },
  { term: "Hand", def: "The only honest unit of work.", appears: "the household and the lab" },
];

export default function LexiconPage() {
  return (
    <div className="room">
      <div className="shell-narrow">
        <header className="room-head">
          <p className="stamp">The Lectionary · Lexicon</p>
          <h1 className="room-title">
            A glossary that doubles as a <em>worldview</em>.
          </h1>
          <p className="room-deck">
            Words he actually uses, defined in his own voice. Read it slowly. It is set
            to look like it was set in metal.
          </p>
        </header>

        <section className="section reveal">
          <dl>
            {ENTRIES.map((e) => (
              <div key={e.term} className="folio">
                <dt>{e.term}</dt>
                <dd>
                  {e.def}
                  <p className="appears">appears: {e.appears}</p>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
