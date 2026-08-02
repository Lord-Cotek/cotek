import Link from "next/link";
import Mark from "@/components/Mark";
import { CHAPELS } from "@/lib/cathedral";
import { TEMI } from "@/lib/identities";

const ELSEWHERE: Array<[string, string]> = [
  ["LinkedIn", TEMI.handles.linkedin],
  ["Unsplash", TEMI.handles.unsplash],
  ["ResearchGate", TEMI.handles.researchgate],
  ["AllPoetry", TEMI.handles.allpoetry],
  ["OpenLibrary", TEMI.handles.openlibrary],
  ["Amazon", TEMI.handles.amazon],
];

const ROOMS: Array<[string, string]> = [
  ["The plan", "/cathedral"],
  ["About", "/about"],
  ["Signal", "/signal"],
  ["Letters", "/letters"],
  ["Lexicon", "/lexicon"],
  ["Names", "/names"],
];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/" className="brand" aria-label="Cotek — the threshold">
              <Mark size={20} />
              <span className="brand-name">Cotek</span>
            </Link>
            <p className="foot-line">Same person. Many lives. One ledger.</p>
            <p className="foot-legal">
              {TEMI.fullName}
              <br />
              {TEMI.location}
              <br />
              <a href={`mailto:${TEMI.contact.letters}`}>{TEMI.contact.letters}</a>
            </p>
          </div>

          <div>
            <h2>Chapels</h2>
            <ul>
              {CHAPELS.map((c) => (
                <li key={c.slug} data-station={c.slug}>
                  <Link href={c.href}>{c.room}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Rooms</h2>
            <ul>
              {ROOMS.map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Elsewhere</h2>
            <ul>
              {ELSEWHERE.map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="me noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot-base">
          {/* Rendered on the server at build; a cached page still claiming
              last year in January is the exact failure this site is against. */}
          <span>
            © {new Date().getFullYear()} {TEMI.fullName}
          </span>
          <span>COTEK — {TEMI.acronym.expansion.map((l) => l.letter).join(" · ")}</span>
        </div>
      </div>
    </footer>
  );
}
