// app/names/page.tsx
import type { Metadata } from "next";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "Names",
  description:
    "Cotek Temi · Temi Cotek · Temitayo Cotek · Cotek Temitayo · Temitayo Ezekiel Olayiwola · Omogbolahan · Kadiri · Cotek. Every form of the name, every profile, set as a colophon.",
};

const HANDLE_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  unsplash: "Unsplash",
  instagram_personal: "Instagram (personal)",
  instagram_creative: "Instagram (creative)",
  facebook: "Facebook",
  researchgate: "ResearchGate",
  academia: "Academia.edu",
  openlibrary: "OpenLibrary",
  amazon: "Amazon",
  allpoetry: "AllPoetry",
  biography_omics: "OMICS biography (IISER)",
  googleplay_books: "Google Play Books",
  everand: "Everand",
};

export default function NamesPage() {
  return (
    <div className="container container-narrow">
      <header className="room-head">
        <div className="room-eyebrow">/ names</div>
        <h1 className="room-title">A colophon.</h1>
        <p className="room-deck">
          A printed book often closes with a colophon — a small,
          carefully-set record of who made it and how. This page is that.
          Every name. Every profile. One person.
        </p>
      </header>

      <section className="colophon">
        <div className="word">{TEMI.acronym.word}</div>
        <div className="meaning">means {TEMI.acronym.meaning.toLowerCase()}.</div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, maxWidth: 600, margin: "18px auto 0" }}>
          {TEMI.acronym.expansion.map((l) => (
            <div key={l.letter}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>{l.letter}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                {l.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="names-grid">
        <h3>Names he answers to</h3>
        <ul>
          {TEMI.names.map((n) => (
            <li key={n}>{n}</li>
          ))}
          <li style={{ color: "var(--ink-mute)", fontStyle: "italic", marginTop: 8 }}>
            Full given name: {TEMI.fullName}.
          </li>
        </ul>

        <h3>Roles</h3>
        <ul>
          {TEMI.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <h3>Career</h3>
        <ul>
          {TEMI.career.map((c) => (
            <li key={c.org}>
              <strong>{c.org}</strong> — {c.role}{" "}
              <span style={{ color: "var(--ink-mute)" }}>({c.tenure})</span>
              <div style={{ color: "var(--ink-mute)", fontSize: 14, marginTop: 2 }}>{c.what}</div>
            </li>
          ))}
        </ul>

        <h3>Memberships</h3>
        <ul>
          {TEMI.memberships.map((m) => (
            <li key={m.name}>
              <a href={m.url} target="_blank" rel="noreferrer">{m.name}</a>
            </li>
          ))}
        </ul>

        <h3>Affiliations</h3>
        <ul>
          {TEMI.affiliations.map((a) => (
            <li key={a.name}>
              {"url" in a && a.url ? (
                <a href={a.url} target="_blank" rel="noreferrer">{a.name}</a>
              ) : a.name}
              {"role" in a && a.role ? (
                <span style={{ color: "var(--ink-mute)" }}> · {a.role}</span>
              ) : null}
            </li>
          ))}
        </ul>

        <h3>Profiles</h3>
        <ul>
          {Object.entries(TEMI.handles).map(([k, url]) => (
            <li key={k}>
              <a href={url} target="_blank" rel="me noreferrer">
                {HANDLE_LABELS[k] ?? k}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
