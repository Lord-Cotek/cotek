import type { Metadata } from "next";
import Link from "next/link";
import ChapelHead from "@/components/ChapelHead";
import FeedStamp from "@/components/FeedStamp";
import { getSermonsFeed } from "@/lib/feeds";

export const metadata: Metadata = {
  title: "The Pulpit — sermons",
  description: "Bible teaching by Temi Cotek at RAK Church, Ras Al Khaimah, UAE.",
  alternates: { canonical: "/cathedral/sermons" },
};

export default async function SermonsChapel() {
  const feed = await getSermonsFeed();

  return (
    <div className="room">
      <div className="shell">
        <ChapelHead
          slug="sermons"
          title={
            <>
              A long obedience built in <em>stone</em>.
            </>
          }
          deck={
            <>
              Sundays at{" "}
              <a href="https://www.rakchurch.com/" target="_blank" rel="noreferrer">
                RAK Church
              </a>
              . On the plan, the only lit line runs from this pulpit to the font at the
              west end — stewardship preached and stewardship practised, which is the
              same idea told twice.
            </>
          }
        >
          <FeedStamp source={feed.source} fetchedAt={feed.fetchedAt} />
        </ChapelHead>

        <section className="section reveal">
          <div className="cards">
            {feed.items.map((s) => (
              <a className="card" key={s.link + s.title} href={s.link} target="_blank" rel="noreferrer">
                <span className="card-eyebrow">Sermon</span>
                <h2 className="card-title">{s.title}</h2>
                <p className="card-meta">
                  {[s.preacher, s.date].filter(Boolean).join(" · ")}
                </p>
                <span className="card-tag">Listen at RAK Church →</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule">The other end of the line</p>
          <div className="prose" style={{ marginTop: "1.2rem" }}>
            <p>
              What is preached here is done on Mondays at{" "}
              <Link href="/cathedral/field">the Font</Link> — water and wastewater
              across the UAE and the GCC. The two rooms are the same argument standing
              at opposite ends of the building.
            </p>
          </div>

          <blockquote className="pull">
            Stewardship is what you do with what is not yours.
          </blockquote>
        </section>
      </div>
    </div>
  );
}
