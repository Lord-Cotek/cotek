// app/works/books/page.tsx
import type { Metadata } from "next";
import { getBooksFeed, lastSeen } from "@/lib/feeds";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "Books — Orchids and Tamarind",
  description:
    "Books by Temi Cotek (Temitayo Ezekiel Olayiwola), beginning with Orchids and Tamarind.",
};

function CreativeWorkLd({ title, link }: { title: string; link: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    author: { "@type": "Person", name: TEMI.fullName },
    url: link,
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default async function BooksPage() {
  const feed = await getBooksFeed();
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ works / books</div>
        <h1 className="room-title">Pages, with their own weather.</h1>
        <p className="room-deck">
          Beginning with <em>Orchids and Tamarind</em>. Augmented as the
          OpenLibrary feed grows.
        </p>
        <div className="stamp">
          {feed.source === "live" ? "Live" : "Cached fallback"} · last seen{" "}
          {lastSeen(feed.fetchedAt)}
        </div>
      </header>

      <section className="room-section">
        <div className="cards-2">
          {feed.items.map((b) => (
            <a key={b.title} className="card" href={b.link} target="_blank" rel="noreferrer">
              <div className="card-eyebrow">Book</div>
              <h3 className="card-title">{b.title}</h3>
              {b.coverUrl ? (
                <img
                  src={b.coverUrl}
                  alt={`Cover of ${b.title}`}
                  style={{ width: "100%", borderRadius: 8, marginTop: 12 }}
                />
              ) : null}
              <p className="card-body">By {TEMI.fullName}.</p>
              <CreativeWorkLd title={b.title} link={b.link} />
            </a>
          ))}
        </div>
      </section>

      <section className="room-section">
        <div className="stamp">Also listed at</div>
        <ul style={{ paddingLeft: 18 }}>
          <li><a href={TEMI.handles.openlibrary} target="_blank" rel="noreferrer">OpenLibrary</a></li>
          <li><a href={TEMI.handles.amazon} target="_blank" rel="noreferrer">Amazon</a></li>
          <li><a href="https://www.bol.com/nl/nl/p/orchids-and-tamarind/9200000104076998/" target="_blank" rel="noreferrer">Bol</a></li>
        </ul>
      </section>
    </div>
  );
}
