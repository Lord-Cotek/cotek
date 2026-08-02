"use client";

import { useState } from "react";
import { TEMI } from "@/lib/identities";

interface Reply {
  reply: string | null;
  forwarded: boolean;
  forwardSkipped: boolean;
}

export default function LetterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Reply | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, note }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setResult((await res.json()) as Reply);
    } catch {
      /* The note has not been sent, and saying it plainly is the whole point of
         this site. The text stays in the textarea so nothing is lost. */
      setError("The letter did not get through. Nothing has been lost — try again, or write to him directly.");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <article className="panel" aria-live="polite">
        <p className="stamp stamp-rule">A reply</p>
        <p className="panel-body">
          {result.reply ??
            "The original note has been forwarded. There will be no reply composed this time, only the silence between letters. He reads what arrives.\n\n—T."}
        </p>
        <p className="panel-note">
          {result.forwarded
            ? "Forwarded to Temi."
            : result.forwardSkipped
              ? "Mail forwarding is not configured in this environment, so the note was not sent on."
              : "The note could not be forwarded. Write to him directly and it will arrive."}
        </p>
      </article>
    );
  }

  return (
    <form className="stack" style={{ "--stack": "1.4rem" } as React.CSSProperties} onSubmit={submit}>
      <div className="field-group">
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

      <div className="field-group">
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

      <div className="field-group">
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

      {error ? (
        <p className="panel-note" role="alert" style={{ borderTop: 0, paddingTop: 0, margin: 0 }}>
          {error}
        </p>
      ) : null}

      <div>
        <button className="btn btn-solid" type="submit" disabled={busy || !note.trim()}>
          {busy ? "Sending…" : "Send the letter"}
        </button>
      </div>

      <noscript>
        <p className="panel-note" style={{ borderTop: 0, paddingTop: 0 }}>
          JavaScript is off, so this form cannot send.{" "}
          <a href={`mailto:${TEMI.contact.letters}?subject=A letter`}>
            Write to {TEMI.contact.letters} instead →
          </a>
        </p>
      </noscript>
    </form>
  );
}
