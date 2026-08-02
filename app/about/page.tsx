import type { Metadata } from "next";
import Link from "next/link";
import { TEMI } from "@/lib/identities";
import { STATIONS } from "@/lib/cathedral";

export const metadata: Metadata = {
  title: "The Nave — about",
  description: `${TEMI.fullName} — the long biography. Environmentalist by trade, software founder by night, author and poet, Bible teacher, certified diver. Ras Al Khaimah, UAE.`,
  alternates: { canonical: "/about" },
};

const NEXT = ["field", "poems", "names", "lexicon", "letters"];

export default function AboutPage() {
  const onward = NEXT.map((slug) => STATIONS.find((s) => s.slug === slug)!).filter(Boolean);

  return (
    <div className="room">
      <div className="shell-narrow">
        <header className="room-head">
          <p className="stamp">The Nave · About</p>
          <h1 className="room-title">
            One letter, from the door to the <em>crossing</em>.
          </h1>
          <p className="room-deck">
            He has answered to many names. What follows is for whoever arrived here
            looking for any of them.
          </p>
        </header>

        <section className="section prose reveal" style={{ maxWidth: "none" }}>
          <p>
            Temitayo Ezekiel Olayiwola — also Cotek Temi, Temi Cotek, Temitayo Cotek,
            Cotek Temitayo, Omogbolahan, Kadiri, and simply Cotek — was born under more
            names than most men keep, and chose to keep all of them. The fact has been
            useful. It has also been honest. He grew up Nigerian; studied in Bangalore,
            India; and made a home in Ras Al Khaimah, in the United Arab Emirates. He
            learned early, and across three continents, that plurality was not the
            opposite of integrity.
          </p>
          <p>
            By trade he is an environmentalist. He spent years at{" "}
            <strong>Action International Services</strong> as a Senior Water Quality
            Analyst, studying water and wastewater treatment systems — the kind of work
            where the numbers and the smell rarely agree, and you learn which one to
            trust. He now leads the environment division at <strong>AMRO</strong>,
            providing environmental solutions across the UAE and the GCC: management
            plans, compliance, advisory. He is a member of{" "}
            <strong>Emirates Nature–WWF</strong>, and a certified diver. The reef on
            weekends. The ledger on Mondays. The same hand on both.
          </p>
          <p>
            He is also the founder of <strong>Cotek App FZ-LLC</strong>, registered at
            RAKEZ in Ras Al Khaimah — a small software studio that builds tools around
            stewardship and accountability: PExP, ProMan, Sci-Cotek, BMS, exp and
            Poems. Each one is a ledger of a kind.
          </p>
          <p>
            He is a published author of three books — the <em>Life vs Love</em> trilogy
            (<em>Orchids and Tamarind</em>, 2018; <em>Infinity Wall</em>, 2020) and{" "}
            <em>The Cerulean Monster</em> (2021, written across 113 days in early 2021).
            They live on Amazon, Bol, Google Play, Everand and OpenLibrary. He is a poet
            (AllPoetry, and his own{" "}
            <a href="https://poems.cotek.app" target="_blank" rel="noreferrer">
              poems.cotek.app
            </a>
            ); a researcher (ResearchGate, Academia); a photographer (
            <a href={TEMI.handles.unsplash} target="_blank" rel="noreferrer">
              Unsplash, where he posts as @cotek
            </a>
            ); and a Bible teacher at <strong>RAK Church</strong>. He is a husband. On
            Instagram, the handle <code>life_vs_love_</code> is named for the trilogy.
          </p>
          <p>
            The five letters of <strong>COTEK</strong> are five of his names —{" "}
            <em>
              {TEMI.acronym.expansion.map((l) => l.name).join(", ")}
            </em>{" "}
            — and the word, in the language he was given, means{" "}
            <em>{TEMI.acronym.meaning.toLowerCase()}</em>. The building you are standing
            in is built around that fact.
          </p>

          <blockquote className="pull">Same person. Many lives. One ledger.</blockquote>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule" style={{ marginBottom: "1.4rem" }}>
            Where to look next
          </p>
          <ul className="index">
            {onward.map((s, i) => (
              <li key={s.slug} style={{ "--glass": s.glass } as React.CSSProperties}>
                <Link href={s.href} data-station={s.slug}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nm">{s.title}</span>
                  <span className="meta">{s.room}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
