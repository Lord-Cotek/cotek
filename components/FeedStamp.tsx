import { lastSeen } from "@/lib/feeds";

/**
 * Where a room's contents came from, and when.
 *
 * Every feed on this site degrades to a static fallback rather than to an
 * error, which is the right behaviour and also a way of quietly lying about
 * freshness. This stamp is the correction: it says plainly whether what you
 * are reading came off the wire just now or out of the repository, and a site
 * whose whole argument is accountability does not get to skip it.
 */
export default function FeedStamp({ source, fetchedAt }: { source: "live" | "fallback"; fetchedAt: string }) {
  const live = source === "live";
  return (
    <p className="feed-stamp" data-live={live}>
      <span className="led" aria-hidden="true" />
      {live ? "Live" : "Cached"} · last seen {lastSeen(fetchedAt)}
    </p>
  );
}
