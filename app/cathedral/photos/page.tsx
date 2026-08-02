import type { Metadata } from "next";
import ChapelHead from "@/components/ChapelHead";
import FeedStamp from "@/components/FeedStamp";
import { getUnsplashFeed } from "@/lib/feeds";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "The Clerestory — photographs",
  description: "Photographs by Temi Cotek, on Unsplash as @cotek.",
  alternates: { canonical: "/cathedral/photos" },
};

export default async function PhotosChapel() {
  const feed = await getUnsplashFeed();

  return (
    <div className="room">
      <div className="shell">
        <ChapelHead
          slug="photos"
          title={
            <>
              Where the <em>light</em> comes in.
            </>
          }
          deck={
            <>
              A clerestory is the row of windows above the arcade — the whole reason a
              nave is not a tunnel. Live from{" "}
              <a href={TEMI.handles.unsplash} target="_blank" rel="noreferrer">
                unsplash.com/@cotek
              </a>
              .
            </>
          }
        >
          <FeedStamp source={feed.source} fetchedAt={feed.fetchedAt} />
        </ChapelHead>

        <section className="section reveal">
          <div className="photo-grid">
            {feed.items.map((p) => (
              <a key={p.id} href={p.link} target="_blank" rel="noreferrer" aria-label={p.alt}>
                {p.urlSmall ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.urlSmall} alt={p.alt} loading="lazy" />
                ) : (
                  /* No API key configured, so the feed is describing photographs
                     it cannot show. Saying which ones is more honest than a grey
                     rectangle. */
                  <span className="photo-empty">{p.alt}</span>
                )}
              </a>
            ))}
          </div>

          <p className="prose" style={{ marginTop: "2rem" }}>
            The full archive is at{" "}
            <a href={TEMI.handles.unsplash} target="_blank" rel="noreferrer">
              unsplash.com/@cotek
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
