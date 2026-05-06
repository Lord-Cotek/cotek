// app/works/photos/page.tsx
import type { Metadata } from "next";
import { getUnsplashFeed, lastSeen } from "@/lib/feeds";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "Photos — Unsplash @cotek",
  description: "Photographs by Temi Cotek, on Unsplash.",
};

export default async function PhotosPage() {
  const feed = await getUnsplashFeed();
  return (
    <div className="container">
      <header className="room-head">
        <div className="room-eyebrow">/ works / photos</div>
        <h1 className="room-title">Photographs.</h1>
        <p className="room-deck">
          Live from <a href={TEMI.handles.unsplash} target="_blank" rel="noreferrer">unsplash.com/@cotek</a>.
        </p>
        <div className="stamp">
          {feed.source === "live" ? "Live" : "Cached fallback"} · last seen{" "}
          {lastSeen(feed.fetchedAt)}
        </div>
      </header>

      <div className="photo-grid">
        {feed.items.map((p) => (
          <a key={p.id} href={p.link} target="_blank" rel="noreferrer" aria-label={p.alt}>
            {p.urlSmall ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.urlSmall} alt={p.alt} loading="lazy" />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                {p.alt}
              </div>
            )}
          </a>
        ))}
      </div>

      <p style={{ marginTop: 32, color: "var(--ink-mute)", fontSize: 13 }}>
        See the full archive at{" "}
        <a href={TEMI.handles.unsplash} target="_blank" rel="noreferrer">
          unsplash.com/@cotek
        </a>.
      </p>
    </div>
  );
}
