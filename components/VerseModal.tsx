// components/VerseModal.tsx
"use client";

// Pressing P anywhere opens this. Visitor types a name or a feeling;
// /api/verse returns 6–12 lines in Temi's voice. Without an API key,
// the API returns a static curated example.

import { useEffect, useRef, useState } from "react";

type Props = { open: boolean; onClose: () => void };

export default function VerseModal({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [verse, setVerse] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setPrompt("");
      setVerse("");
      setBusy(false);
    }
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json()) as { verse?: string; error?: string };
      setVerse(data.verse ?? "");
    } catch {
      setVerse("(the well is quiet just now — try again later.)");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(verse);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="verse-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Verse engine"
      onClick={onClose}
    >
      <div className="verse-card" onClick={(e) => e.stopPropagation()}>
        <label htmlFor="verse-prompt">Give me a name, or a feeling.</label>
        <input
          id="verse-prompt"
          ref={inputRef}
          type="text"
          value={prompt}
          placeholder="e.g. my daughter's name · the reef in March · waiting"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          maxLength={120}
          autoComplete="off"
        />
        <div className="actions">
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Close
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            {verse ? (
              <button className="btn btn-ghost" type="button" onClick={copy}>
                Copy
              </button>
            ) : null}
            <button className="btn" type="button" onClick={submit} disabled={busy}>
              {busy ? "Listening…" : "Write"}
            </button>
          </div>
        </div>
        {verse ? <div className="out">{verse}</div> : null}
      </div>
    </div>
  );
}
