// app/works/sermons/page.tsx
import type { Metadata } from "next";
import { getSermonsFeed, lastSeen } from "@/lib/feeds";

export const metadata: Metadata = {
  title: "Sermons — RAK Church",
  description:
    "Bible teaching by Temi Cotek at RAK Church, Ras Al Khaimah, UAE.",
};

export default async function SermonsPage() {
  const feed = await getSermonsFeed();
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ works / sermons</div>
        <h1 className="room-title">A long obedience built in stone.</h1>
        <p className="room-deck">
          Sundays at <a href="https://www.rakchurch.com/" target="_blank" rel="noreferrer">RAK Church</a>.
          Stewardship preached and stewardship practiced —
          a single line connects this room to the field.
        </p>
        <div className="stamp">
          {feed.source === "live" ? "Live" : "Cached fallback"} · last seen{" "}
          {lastSeen(feed.fetchedAt)}
        </div>
      </header>

      <section className="room-section">
        <div className="cards-2">
          {feed.items.map((s, i) => (
            <a key={i} className="card" href={s.link} target="_blank" rel="noreferrer">
              <div className="card-eyebrow">Sermon</div>
              <h3 className="card-title">{s.title}</h3>
              <div className="card-meta">{s.preacher}{s.date ? ` · ${s.date}` : ""}</div>
              <p className="card-body">Listen at RAK Church.</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
