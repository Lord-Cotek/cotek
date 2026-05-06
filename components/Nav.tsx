// components/Nav.tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <Link href="/" className="nav-brand" aria-label="Return to the threshold">
        <span className="nav-mark" aria-hidden="true">C</span>
        <span className="nav-name">cotek</span>
      </Link>
      <div className="nav-links">
        <Link href="/about">About</Link>
        <Link href="/works">Works</Link>
        <Link href="/signal">Signal</Link>
        <Link href="/letters">Letters</Link>
        <Link href="/lexicon">Lexicon</Link>
        <Link href="/names">Names</Link>
      </div>
    </nav>
  );
}
