import type { Metadata } from "next";
import ChapelHead from "@/components/ChapelHead";
import FeedStamp from "@/components/FeedStamp";
import { getBooksFeed } from "@/lib/feeds";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "The Library — books",
  description:
    "Books by Temi Cotek (Temitayo Ezekiel Olayiwola): the Life vs Love trilogy — Orchids and Tamarind (2018), Infinity Wall (2020) — and The Cerulean Monster (2021).",
  alternates: { canonical: "/cathedral/books" },
};

function BookLd({ title, link }: { title: string; link: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    author: { "@type": "Person", name: TEMI.fullName },
    url: link,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

const ALSO_AT: Array<[string, string]> = [
  ["OpenLibrary", TEMI.handles.openlibrary],
  ["Amazon", TEMI.handles.amazon],
  ["Google Play Books", TEMI.handles.googleplay_books],
  ["Everand", TEMI.handles.everand],
  ["Bol", "https://www.bol.com/nl/nl/p/orchids-and-tamarind/9200000104076998/"],
];

export default async function BooksChapel() {
  const feed = await getBooksFeed();

  return (
    <div className="room">
      <div className="shell">
        <ChapelHead
          slug="books"
          title={
            <>
              Pages, with their own <em>weather</em>.
            </>
          }
          deck="The Life vs Love trilogy — Orchids and Tamarind, 2018; Infinity Wall, 2020 — and The Cerulean Monster, 2021, written across 113 days. The shelf grows as the OpenLibrary record does."
        >
          <FeedStamp source={feed.source} fetchedAt={feed.fetchedAt} />
        </ChapelHead>

        <section className="section reveal">
          <div className="cards">
            {feed.items.map((b) => (
              <a className="card" key={b.title} href={b.link} target="_blank" rel="noreferrer">
                <span className="card-eyebrow">Book</span>
                <h2 className="card-title">{b.title}</h2>
                {b.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.coverUrl}
                    alt={`Cover of ${b.title}`}
                    loading="lazy"
                    style={{ borderRadius: "var(--radius)", marginTop: "0.6rem" }}
                  />
                ) : null}
                <p className="card-body">By {TEMI.fullName}.</p>
                <span className="card-tag">Read →</span>
                <BookLd title={b.title} link={b.link} />
              </a>
            ))}
          </div>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule">Also listed at</p>
          <div className="prose" style={{ marginTop: "1.2rem" }}>
            <ul>
              {ALSO_AT.map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
