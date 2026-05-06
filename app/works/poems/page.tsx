// app/works/poems/page.tsx
import type { Metadata } from "next";
import { getPoemsFeed, lastSeen } from "@/lib/feeds";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "Poems",
  description:
    "Poetry by Temi Cotek — live from poems.cotek.app, plus the AllPoetry archive.",
};

export default async function PoemsPage() {
  const feed = await getPoemsFeed();
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ works / poems</div>
        <h1 className="room-title">A library of his lines.</h1>
        <p className="room-deck">
          The latest from <a href={TEMI.works.apps.find(a => a.name === "Poems")?.url}>poems.cotek.app</a>.
          The full archive lives at <a href={TEMI.handles.allpoetry} target="_blank" rel="noreferrer">AllPoetry</a>.
        </p>
        <div className="stamp">
          {feed.source === "live" ? "Live" : "Cached fallback"} · last seen{" "}
          {lastSeen(feed.fetchedAt)}
        </div>
      </header>

      <section className="room-section">
        {feed.items.map((p) => (
          <article key={p.link + p.title} className="card" style={{ marginBottom: 14 }}>
            <h3 className="card-title">{p.title}</h3>
            <p className="card-body" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.05rem" }}>
              {p.excerpt}
            </p>
            <a className="card-tag" href={p.link} target="_blank" rel="noreferrer">
              Read at poems.cotek.app →
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
