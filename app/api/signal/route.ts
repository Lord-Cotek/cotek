// app/api/signal/route.ts
// Daily Signal — 60–80 words in Temi's voice. Cached 24h.
// Inputs: day of week, rotating theme, paraphrased recent poem, sermon verse.

import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { complete } from "@/lib/anthropic";
import { SIGNAL_SYSTEM_PROMPT, SIGNAL_THEMES, SERMON_VERSES } from "@/lib/voice";
import { getPoemsFeed } from "@/lib/feeds";

export const runtime = "nodejs";
export const revalidate = 3600;

const FALLBACK_SIGNAL =
  "The kettle ticks down. Outside, a heron stands in the water that I tested at sunrise — the numbers were boring; the bird is not. There is a kind of obedience that does not look like obedience until later, when the page is full and the day is honest. I will write that down. I will not say more.";

function isoDay() {
  return new Date().toISOString().slice(0, 10);
}

const todaysSignal = unstable_cache(
  async () => {
    const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const idx = new Date().getDate() % SIGNAL_THEMES.length;
    const theme = SIGNAL_THEMES[idx];
    const verse = SERMON_VERSES[new Date().getDate() % SERMON_VERSES.length];

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
      maxTokens: 280,
      temperature: 0.9,
    }).catch(() => null);

    return {
      date: isoDay(),
      theme,
      verse,
      text: live ?? FALLBACK_SIGNAL,
      source: live ? ("live" as const) : ("fallback" as const),
    };
  },
  ["signal-today"],
  { revalidate: 60 * 60 * 24, tags: ["signal"] },
);

export async function GET() {
  const data = await todaysSignal();
  return NextResponse.json(data);
}
