// lib/anthropic.ts
// Server-only Anthropic client. Returns null when the API key is missing
// so callers can degrade gracefully without throwing.

import Anthropic from "@anthropic-ai/sdk";

let cached: Anthropic | null = null;

export function getAnthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (cached) return cached;
  cached = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return cached;
}

export const ANTHROPIC_MODEL =
  process.env.ANTHROPIC_MODEL || "claude-opus-4-7";

export async function complete(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string | null> {
  const client = getAnthropic();
  if (!client) return null;

  const res = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: opts.maxTokens ?? 512,
    temperature: opts.temperature ?? 0.85,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });

  const text = res.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();

  return text || null;
}
