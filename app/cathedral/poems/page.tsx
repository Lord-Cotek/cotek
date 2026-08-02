import type { Metadata } from "next";
import ChapelHead from "@/components/ChapelHead";
import FeedStamp from "@/components/FeedStamp";
import { getPoemsFeed } from "@/lib/feeds";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "The Lady Chapel — poems",
  description:
    "Poetry by Temi Cotek — live from poems.cotek.app, with the full archive at AllPoetry.",
  alternates: { canonical: "/cathedral/poems" },
};

export default async function PoemsChapel() {
  const feed = await getPoemsFeed();
  const app = TEMI.works.apps.find((a) => a.name === "Poems");

  return (
    <div className="room">
      <div className="shell-narrow">
        <ChapelHead
          slug="poems"
          title={
            <>
              A library of his <em>lines</em>.
            </>
          }
          deck="The furthest room from the door, and the quietest. The latest arrive from poems.cotek.app; the full archive lives at AllPoetry."
        >
          <FeedStamp source={feed.source} fetchedAt={feed.fetchedAt} />
        </ChapelHead>

        <section className="section reveal">
          <div style={{ display: "grid", gap: "1px", background: "var(--line)" }}>
            {feed.items.map((p) => (
              <article
                key={p.link + p.title}
                style={{ background: "var(--ink)", padding: "clamp(1.4rem, 4vw, 2.2rem) 0" }}
              >
                <h2 className="card-title" style={{ fontSize: "var(--t-xl)" }}>
                  {p.title}
                </h2>
                <p
                  className="serif"
                  style={{
                    marginTop: "0.9rem",
                    fontStyle: "italic",
                    fontSize: "var(--t-lg)",
                    color: "var(--bone-70)",
                  }}
                >
                  {p.excerpt}
                </p>
                <a className="card-tag" href={p.link} target="_blank" rel="noreferrer">
                  Read in full →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal" style={{ paddingTop: 0 }}>
          <p className="stamp stamp-rule">The whole shelf</p>
          <div className="prose" style={{ marginTop: "1.2rem" }}>
            <ul>
              {app ? (
                <li>
                  <a href={app.url} target="_blank" rel="noreferrer">
                    poems.cotek.app
                  </a>{" "}
                  — his own library.
                </li>
              ) : null}
              <li>
                <a href={TEMI.handles.allpoetry} target="_blank" rel="noreferrer">
                  AllPoetry
                </a>{" "}
                — the archive.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
