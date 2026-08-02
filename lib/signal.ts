/*
  Today's Signal.

  Sixty to eighty words, composed once a day and then left alone.

  This used to live inside app/api/signal/route.ts, and the page that rendered
  it fetched its own API over HTTP — which meant reading the request headers to
  reconstruct the site's own origin, and that in turn opted the page out of
  static rendering entirely. Calling the composer directly costs one import and
  gets the page back.

  The route still exists, and still returns exactly this, because the Signal is
  worth having as JSON.
*/

import { unstable_cache } from "next/cache";
import { complete } from "@/lib/anthropic";
import { SERMON_VERSES, SIGNAL_SYSTEM_PROMPT, SIGNAL_THEMES } from "@/lib/voice";
import { getPoemsFeed } from "@/lib/feeds";

export interface Signal {
  date: string;
  theme: string;
  verse: string;
  text: string;
  source: "live" | "fallback";
}

/* Used when no API key is configured, and when the model call fails. It is a
   real composition rather than an error string, because a quiet day should
   look like a quiet day and not like a broken page. */
const FALLBACK =
  "The kettle ticks down. Outside, a heron stands in the water that I tested at sunrise — the numbers were boring; the bird is not. There is a kind of obedience that does not look like obedience until later, when the page is full and the day is honest. I will write that down. I will not say more.";

export const todaysSignal = unstable_cache(
  async (): Promise<Signal> => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const theme = SIGNAL_THEMES[now.getDate() % SIGNAL_THEMES.length]!;
    const verse = SERMON_VERSES[now.getDate() % SERMON_VERSES.length]!;

    let recent = "";
    try {
      const feed = await getPoemsFeed();
      recent = feed.items[0]?.excerpt ?? "";
    } catch {
      recent = "";
    }

    const user = `Day: ${day}
Theme: ${theme}
Recent poem (paraphrase, not quote): ${recent || "(none today)"}
Sermon verse to allude to but not quote: ${verse}

Write today's Signal.`;

    const live = await complete({
      system: SIGNAL_SYSTEM_PROMPT,
      user,
    }).catch(() => null);

    return {
      date: now.toISOString().slice(0, 10),
      theme,
      verse,
      text: live ?? FALLBACK,
      source: live ? "live" : "fallback",
    };
  },
  ["signal-today"],
  { revalidate: 60 * 60 * 24, tags: ["signal"] },
);
