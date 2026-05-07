// components/RoomsStrip.tsx
// Small sibling-room nav rendered at the top of every /works/<slug> page.
// Lets visitors jump sideways without going back to the constellation.

import Link from "next/link";
import { ROOMS } from "@/lib/identities";

type Slug = (typeof ROOMS)[number]["slug"];

export default function RoomsStrip({ current }: { current: Slug }) {
  return (
    <nav className="rooms-strip" aria-label="Other rooms in works">
      <Link href="/works" className="rooms-strip-back">← Map</Link>
      <ul>
        {ROOMS.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/works/${r.slug}`}
              aria-current={r.slug === current ? "page" : undefined}
            >
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
