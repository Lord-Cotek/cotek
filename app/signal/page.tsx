// app/signal/page.tsx
// Daily Signal — read server-side, rendered as a single panel of typography.

import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Signal — today",
  description:
    "A 60–80 word reflection in Temi Cotek's voice. Composed once a day.",
};

export const revalidate = 3600;

async function fetchSignal() {
  const h = headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const url = `${proto}://${host}/api/signal`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as {
      date: string;
      theme: string;
      verse: string;
      text: string;
      source: "live" | "fallback";
    };
  } catch {
    return null;
  }
}

export default async function SignalPage() {
  const signal = await fetchSignal();
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ signal</div>
        <h1 className="room-title">Today, in his voice.</h1>
        <p className="room-deck">
          A small daily dispatch. Composed once, then left alone.
        </p>
      </header>

      {signal ? (
        <article className="signal-panel">
          <div className="signal-stamp">
            {signal.date} · theme: {signal.theme} ·{" "}
            {signal.source === "live" ? "live" : "fallback"}
          </div>
          <p style={{ margin: 0 }}>{signal.text}</p>
        </article>
      ) : (
        <article className="signal-panel">
          <div className="signal-stamp">today</div>
          <p style={{ margin: 0, color: "var(--ink-mute)" }}>
            (the well is quiet just now — try again later.)
          </p>
        </article>
      )}

      <p style={{ marginTop: 32, color: "var(--ink-mute)", fontSize: 13 }}>
        An archive of prior days will grow beneath this panel.
      </p>
    </div>
  );
}
