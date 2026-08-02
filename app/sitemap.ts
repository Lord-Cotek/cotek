import type { MetadataRoute } from "next";
import { STATIONS } from "@/lib/cathedral";

const SITE_URL = process.env.SITE_URL || "https://cotek.me";

/**
 * Derived from the cathedral rather than written down, so a chapel cannot be
 * added to the building and left out of the index.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/cathedral`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...STATIONS.map((s) => ({
      url: new URL(s.href, SITE_URL).href,
      lastModified: now,
      // The Bell is composed daily; everything else changes when he does.
      changeFrequency: (s.slug === "signal" ? "daily" : "monthly") as "daily" | "monthly",
      priority: s.kind === "chapel" ? 0.8 : 0.6,
    })),
  ];
}
