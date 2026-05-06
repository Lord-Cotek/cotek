// app/about/page.tsx
import type { Metadata } from "next";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "About",
  description: `${TEMI.fullName} — long-form biography. Environmentalist by trade, software founder by night, author and poet, Bible teacher, certified diver. Ras Al Khaimah, UAE.`,
};

export default function AboutPage() {
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ about</div>
        <h1 className="room-title">A long letter, in one room.</h1>
        <p className="room-deck">
          He has answered to many names. The letter below is for whoever
          arrived here looking for any of them.
        </p>
      </header>

      <section className="room-section">
        <p>
          Temitayo Ezekiel Olayiwola — also Cotek Temi, Temi Cotek,
          Temitayo Cotek, Cotek Temitayo, Omogbolahan, Kadiri, and simply
          Cotek — was born under more names than most men keep, and chose
          to keep all of them. The fact has been useful. It has also been
          honest. He grew up where the same man could be addressed, in one
          afternoon, by his given name, his family name, his praise name,
          and his nickname; and learned early that plurality was not the
          opposite of integrity.
        </p>
        <p>
          By trade he is an environmentalist. He spent years at Action
          International Services as a Senior Water Quality Analyst,
          studying water and wastewater treatment systems — the kind of
          work where the numbers and the smell rarely agree, and you
          learn which one to trust. He now leads the environment division
          at <strong>AMRO</strong>, providing environmental solutions across
          the UAE and the GCC: management plans, compliance, advisory.
          He is a member of <strong>Emirates Nature–WWF</strong>, and a
          certified diver. The reef on weekends. The ledger on Mondays.
          The same hand on both.
        </p>
        <p>
          He is also the founder of <strong>Cotek App FZ-LLC</strong>,
          registered at RAKEZ in Ras Al Khaimah — a small software
          studio that builds tools around stewardship and accountability:
          PExP, ProMan, Sci-Cotek, BMS, exp, Poems, iSignature. Each one
          is a ledger of a kind.
        </p>
        <p>
          He is a published author (<em>Orchids and Tamarind</em>, on
          Bol, Amazon, and OpenLibrary), a poet (AllPoetry, and his own
          <a href="https://poems.cotek.app" target="_blank" rel="noreferrer"> poems.cotek.app</a>),
          a researcher (ResearchGate, Academia, IISER alumnus), a
          photographer (Unsplash, where he posts as @cotek), and a
          Bible teacher at <strong>RAK Church</strong>. He is a husband.
        </p>
        <p>
          The five letters of <strong>COTEK</strong> are five of his
          names — <em>Chimera, Omogbolahan / Olayiwola, Temitayo, Ezekiel,
          Kadiri</em> — and the word, in the language he was given, means
          <em> hope</em>. The site you are reading is built around that
          fact.
        </p>
        <blockquote className="pull">
          Same person. Many lives. One ledger.
        </blockquote>
      </section>

      <section className="room-section">
        <div className="stamp">Where to look next</div>
        <ul style={{ paddingLeft: 18 }}>
          <li><a href="/works/field">/works/field</a> — the environmental career, the reef, WWF.</li>
          <li><a href="/works">/works</a> — the constellation of everything else.</li>
          <li><a href="/names">/names</a> — every form of his name, every profile.</li>
          <li><a href="/lexicon">/lexicon</a> — his vocabulary as a worldview.</li>
          <li><a href="/letters">/letters</a> — leave a note; receive a brief reply.</li>
        </ul>
      </section>
    </div>
  );
}
