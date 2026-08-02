// app/api/reply/route.ts
// POST { name, email, note } -> { reply: string }
// If RESEND_API_KEY + LETTERS_TO are configured, the original note is forwarded.
// If ANTHROPIC_API_KEY is missing, no AI reply — the visitor is told plainly.

import { NextResponse } from "next/server";
import { complete } from "@/lib/anthropic";
import { LETTER_SYSTEM_PROMPT } from "@/lib/voice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function forwardToTemi(opts: {
  name: string;
  email: string;
  note: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LETTERS_TO;
  if (!key || !to) return { ok: false, skipped: true as const };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Letters · cotek.me <letters@cotek.me>",
        to,
        reply_to: opts.email || undefined,
        subject: `Letter from ${opts.name || "a stranger"}`,
        text: `From: ${opts.name || "(no name)"} <${opts.email || "no email"}>\n\n${opts.note}`,
      }),
    });
    return { ok: res.ok, skipped: false as const };
  } catch {
    return { ok: false, skipped: false as const };
  }
}

export async function POST(req: Request) {
  let body: { name?: string; email?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim().slice(0, 80);
  const email = (body.email || "").trim().slice(0, 200);
  const note = (body.note || "").trim().slice(0, 4000);

  if (!note) {
    return NextResponse.json({ error: "Please write a note." }, { status: 400 });
  }

  // Forward (best effort).
  const forward = await forwardToTemi({ name, email, note });

  // AI reply (if configured).
  const reply = await complete({
    system: LETTER_SYSTEM_PROMPT,
    user: `From: ${name || "(unsigned)"}\n\n${note}`,
  }).catch(() => null);

  return NextResponse.json({
    reply,
    forwarded: forward.ok,
    forwardSkipped: forward.skipped,
  });
}
