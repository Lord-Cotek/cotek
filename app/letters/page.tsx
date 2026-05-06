// app/letters/page.tsx
"use client";

import { useState } from "react";
import { TEMI } from "@/lib/identities";

export default function LettersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [forwarded, setForwarded] = useState<boolean | null>(null);
  const [skipped, setSkipped] = useState<boolean>(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, note }),
      });
      const data = (await res.json()) as {
        reply: string | null;
        forwarded: boolean;
        forwardSkipped: boolean;
      };
      setReply(data.reply);
      setForwarded(data.forwarded);
      setSkipped(data.forwardSkipped);
    } catch {
      setReply(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ letters</div>
        <h1 className="room-title">Leave a note. Receive a reply.</h1>
        <p className="room-deck">
          Write a short letter. An assistant will compose a brief reply in
          Temi's voice, and (when configured) the original note is
          forwarded to him. He reads what arrives.
        </p>
      </header>

      {reply === null ? (
        <form className="letter-form" onSubmit={submit}>
          <div>
            <label htmlFor="letter-name">Your name (optional)</label>
            <input
              id="letter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="letter-email">Your email (optional)</label>
            <input
              id="letter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="letter-note">Your letter</label>
            <textarea
              id="letter-note"
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={4000}
              placeholder="A few sentences. He reads what arrives."
            />
          </div>
          <button className="submit" type="submit" disabled={busy || !note.trim()}>
            {busy ? "Sending…" : "Send the letter"}
          </button>
          <noscript>
            <p style={{ marginTop: 16, color: "var(--ink-mute)", fontSize: 13 }}>
              JavaScript is disabled.{" "}
              <a href={`mailto:${TEMI.contact.letters}?subject=letter`}>
                Email Temi directly →
              </a>
            </p>
          </noscript>
        </form>
      ) : (
        <article className="letter-reply" aria-live="polite">
          <span className="stamp">a reply</span>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {reply
              ? reply
              : "The original note has been forwarded. There will be no AI reply this time, only the silence between letters. He reads what arrives.\n\n—T."}
          </p>
          <div style={{ marginTop: 18, fontSize: 12, color: "var(--ink-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            {forwarded
              ? "Forwarded to Temi."
              : skipped
              ? "Mail forwarding is not configured in this environment."
              : "Could not forward the note (it has not been lost — try again, or write directly)."}
          </div>
        </article>
      )}
    </div>
  );
}
