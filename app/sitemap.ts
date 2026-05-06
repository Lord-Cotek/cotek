// app/sitemap.ts
import type { MetadataRoute } from "next";
import { ROOMS } from "@/lib/identities";

const SITE = process.env.SITE_URL || "https://cotek.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/about",
    "/works",
    "/signal",
    "/letters",
    "/lexicon",
    "/names",
    ...ROOMS.map((r) => `/works/${r.slug}`),
  ];
  return routes.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "/signal" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
