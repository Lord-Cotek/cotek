// app/api/verse/route.ts
// POST { prompt: string } -> { verse: string }
// Without ANTHROPIC_API_KEY, returns a static curated verse from voice.ts.

import { NextResponse } from "next/server";
import { complete } from "@/lib/anthropic";
import { VERSE_FEW_SHOTS, VERSE_SYSTEM_PROMPT } from "@/lib/voice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const prompt = (body.prompt || "").trim().slice(0, 200);
  if (!prompt) {
    return NextResponse.json({ error: "Give me a name, or a feeling." }, { status: 400 });
  }

  const live = await complete({
    system: VERSE_SYSTEM_PROMPT,
    user: prompt,
    maxTokens: 320,
    temperature: 0.92,
  }).catch(() => null);

  if (live) {
    return NextResponse.json({ verse: live, source: "live" });
  }

  // Graceful fallback — pick the closest curated few-shot by simple keyword
  // overlap, or return the default.
  const lower = prompt.toLowerCase();
  const match = VERSE_FEW_SHOTS.find((s) => lower.includes(s.prompt));
  const fallback = match?.output ?? VERSE_FEW_SHOTS[0].output;
  return NextResponse.json({ verse: fallback, source: "fallback" });
}
