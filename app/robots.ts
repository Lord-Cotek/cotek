// app/robots.ts
import type { MetadataRoute } from "next";

const SITE = process.env.SITE_URL || "https://cotek.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
