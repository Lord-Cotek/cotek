// lib/anthropic.ts
// Server-only Anthropic client. Returns null when the API key is missing so
// callers can degrade gracefully without throwing — every room on this site
// that uses it has a real composition to fall back on.

import Anthropic from "@anthropic-ai/sdk";

let cached: Anthropic | null = null;

export function getAnthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (cached) return cached;
  cached = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return cached;
}

export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

/**
 * One short completion.
 *
 * Two things here are not the obvious defaults, and both are load-bearing:
 *
 * - No `temperature`. Sampling parameters are rejected outright on Opus 4.7
 *   and later, and the previous version of this file paired `temperature:
 *   0.85` with an Opus 4.7 model id — a 400 on every call, which is why the
 *   Signal and the letter replies have only ever shown their fallbacks.
 *   Variation comes from the prompt now.
 *
 * - `max_tokens` is far larger than the visible output. Thinking is on by
 *   default on this model and `max_tokens` caps thinking *plus* the response,
 *   so a budget sized to a sixty-word poem truncates the poem. Effort is set
 *   low because none of these are reasoning tasks — they are short pieces of
 *   writing in a particular voice.
 */
export async function complete(opts: {
  system: string;
  user: string;
  /** Ceiling on thinking and output together, not on the visible text. */
  maxTokens?: number;
}): Promise<string | null> {
  const client = getAnthropic();
  if (!client) return null;

  const res = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: opts.maxTokens ?? 4096,
    output_config: { effort: "low" },
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });

  const text = res.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();

  return text || null;
}
