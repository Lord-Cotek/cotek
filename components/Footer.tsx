// components/Footer.tsx
import Link from "next/link";
import { TEMI } from "@/lib/identities";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div>
        © {year} {TEMI.fullName} · Ras Al Khaimah
      </div>
      <ul aria-label="Off-site profiles">
        <li><a href={TEMI.handles.linkedin} rel="me">LinkedIn</a></li>
        <li><a href={TEMI.handles.unsplash} rel="me">Unsplash</a></li>
        <li><a href={TEMI.handles.researchgate} rel="me">ResearchGate</a></li>
        <li><a href={TEMI.handles.allpoetry} rel="me">AllPoetry</a></li>
        <li><a href={TEMI.handles.openlibrary} rel="me">OpenLibrary</a></li>
      </ul>
      <div>
        <Link href="/names">All names →</Link>
      </div>
    </footer>
  );
}
