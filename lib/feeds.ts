// lib/feeds.ts
// External fetchers with cache + graceful degradation.
// Each feed exposes: a real fetcher, a static fallback, and a stamped result.

import { unstable_cache } from "next/cache";

export type FeedResult<T> = {
  ok: boolean;
  source: "live" | "fallback";
  fetchedAt: string;
  items: T[];
};

const stamp = () => new Date().toISOString();

// ------- Unsplash @cotek -------
export type UnsplashPhoto = {
  id: string;
  alt: string;
  urlSmall: string;
  urlRegular: string;
  link: string;
  width: number;
  height: number;
};

const UNSPLASH_FALLBACK: UnsplashPhoto[] = [
  // Curated still-life placeholders. Replace once UNSPLASH_ACCESS_KEY is set.
  {
    id: "fallback-1",
    alt: "Reef seen from below, light striking the surface.",
    urlSmall: "",
    urlRegular: "",
    link: "https://unsplash.com/@cotek",
    width: 1600,
    height: 1067,
  },
  {
    id: "fallback-2",
    alt: "Wadi after rain.",
    urlSmall: "",
    urlRegular: "",
    link: "https://unsplash.com/@cotek",
    width: 1600,
    height: 1067,
  },
];

async function fetchUnsplashLive(): Promise<UnsplashPhoto[] | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const url =
    "https://api.unsplash.com/users/cotek/photos?per_page=30&order_by=latest";
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as Array<{
    id: string;
    alt_description: string | null;
    urls: { small: string; regular: string };
    links: { html: string };
    width: number;
    height: number;
  }>;
  return json.map((p) => ({
    id: p.id,
    alt: p.alt_description ?? "Photograph by Temi Cotek",
    urlSmall: p.urls.small,
    urlRegular: p.urls.regular,
    link: p.links.html,
    width: p.width,
    height: p.height,
  }));
}

export const getUnsplashFeed = unstable_cache(
  async (): Promise<FeedResult<UnsplashPhoto>> => {
    try {
      const live = await fetchUnsplashLive();
      if (live && live.length) {
        return { ok: true, source: "live", fetchedAt: stamp(), items: live };
      }
    } catch {
      // fall through
    }
    return {
      ok: false,
      source: "fallback",
      fetchedAt: stamp(),
      items: UNSPLASH_FALLBACK,
    };
  },
  ["feed-unsplash"],
  { revalidate: 60 * 60 * 6, tags: ["feed-unsplash"] },
);

// ------- OpenLibrary author -------
export type Book = {
  title: string;
  key?: string;
  coverUrl?: string;
  link: string;
};

const BOOKS_FALLBACK: Book[] = [
  {
    title: "Orchids and Tamarind",
    link: "https://www.bol.com/nl/nl/p/orchids-and-tamarind/9200000104076998/",
  },
];

async function fetchOpenLibraryLive(): Promise<Book[] | null> {
  const url = "https://openlibrary.org/authors/OL11313996A/works.json?limit=50";
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    entries: Array<{
      title: string;
      key: string;
      covers?: number[];
    }>;
  };
  return (json.entries || []).map((e) => ({
    title: e.title,
    key: e.key,
    coverUrl: e.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${e.covers[0]}-L.jpg`
      : undefined,
    link: `https://openlibrary.org${e.key}`,
  }));
}

export const getBooksFeed = unstable_cache(
  async (): Promise<FeedResult<Book>> => {
    try {
      const live = await fetchOpenLibraryLive();
      if (live && live.length) {
        return { ok: true, source: "live", fetchedAt: stamp(), items: live };
      }
    } catch {
      // fall through
    }
    return {
      ok: false,
      source: "fallback",
      fetchedAt: stamp(),
      items: BOOKS_FALLBACK,
    };
  },
  ["feed-books"],
  { revalidate: 60 * 60 * 24, tags: ["feed-books"] },
);

// ------- Poems (poems.cotek.app) -------
export type Poem = {
  title: string;
  excerpt: string;
  link: string;
  publishedAt?: string;
};

const POEMS_FALLBACK: Poem[] = [
  {
    title: "First ledger",
    excerpt:
      "What does the well know that the bucket has forgotten? Light, when it arrives, arrives slowly, by hand.",
    link: "https://poems.cotek.app",
  },
  {
    title: "Reef notes",
    excerpt: "A city of small obediences, and the current that polices them.",
    link: "https://poems.cotek.app",
  },
];

async function fetchPoemsLive(): Promise<Poem[] | null> {
  // Best-effort: try a JSON endpoint first; fall back to a tiny scrape.
  try {
    const j = await fetch("https://poems.cotek.app/api/poems", {
      next: { revalidate: 60 * 60 },
    });
    if (j.ok) {
      const data = (await j.json()) as Array<{
        title: string;
        excerpt?: string;
        body?: string;
        slug: string;
        publishedAt?: string;
      }>;
      return data.slice(0, 30).map((p) => ({
        title: p.title,
        excerpt: (p.excerpt || (p.body ? p.body.slice(0, 180) : "")) ?? "",
        link: `https://poems.cotek.app/${p.slug}`,
        publishedAt: p.publishedAt,
      }));
    }
  } catch {
    // ignore
  }
  return null;
}

export const getPoemsFeed = unstable_cache(
  async (): Promise<FeedResult<Poem>> => {
    try {
      const live = await fetchPoemsLive();
      if (live && live.length) {
        return { ok: true, source: "live", fetchedAt: stamp(), items: live };
      }
    } catch {
      // fall through
    }
    return {
      ok: false,
      source: "fallback",
      fetchedAt: stamp(),
      items: POEMS_FALLBACK,
    };
  },
  ["feed-poems"],
  { revalidate: 60 * 60, tags: ["feed-poems"] },
);

// ------- RAK Church sermons -------
export type Sermon = {
  title: string;
  preacher: string;
  date?: string;
  link: string;
};

const SERMONS_FALLBACK: Sermon[] = [
  // TODO(temi): seed with the most recent two or three sermon titles you preached.
  {
    title: "Stewardship is a job description",
    preacher: "Temi Cotek",
    link: "https://www.rakchurch.com/sermons/",
  },
];

async function fetchSermonsLive(): Promise<Sermon[] | null> {
  try {
    const res = await fetch("https://www.rakchurch.com/sermons/", {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Light, defensive parse — only keep entries whose surrounding text mentions Temi/Cotek.
    const cheerio = await import("cheerio");
    const $ = cheerio.load(html);
    const items: Sermon[] = [];
    $("article, .sermon, .post, li").each((_i, el) => {
      const block = $(el);
      const text = block.text();
      if (!/temi|cotek/i.test(text)) return;
      const a = block.find("a").first();
      const title = (a.text() || block.find("h2,h3,h4").first().text() || "")
        .trim()
        .slice(0, 140);
      const link = a.attr("href") || "";
      if (title && link) {
        items.push({
          title,
          preacher: "Temi Cotek",
          link: link.startsWith("http")
            ? link
            : `https://www.rakchurch.com${link}`,
        });
      }
    });
    return items.length ? items.slice(0, 12) : null;
  } catch {
    return null;
  }
}

export const getSermonsFeed = unstable_cache(
  async (): Promise<FeedResult<Sermon>> => {
    try {
      const live = await fetchSermonsLive();
      if (live && live.length) {
        return { ok: true, source: "live", fetchedAt: stamp(), items: live };
      }
    } catch {
      // fall through
    }
    return {
      ok: false,
      source: "fallback",
      fetchedAt: stamp(),
      items: SERMONS_FALLBACK,
    };
  },
  ["feed-sermons"],
  { revalidate: 60 * 60 * 24, tags: ["feed-sermons"] },
);

// Friendly "last seen" stamp.
export function lastSeen(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "unknown";
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
