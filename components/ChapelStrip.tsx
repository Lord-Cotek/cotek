import Link from "next/link";
import { CHAPELS, type ChapelSlug } from "@/lib/cathedral";

/**
 * Sibling navigation, rendered at the top of every chapel.
 *
 * It lets a visitor move sideways through the cathedral without walking back
 * to the plan each time. Each entry carries its own glass, so the strip is
 * also a legend for the colour the page they are on is currently wearing.
 */
export default function ChapelStrip({ current }: { current: ChapelSlug }) {
  return (
    <nav className="chapel-strip" aria-label="The other chapels">
      <Link href="/cathedral" className="back">
        ← The plan
      </Link>
      <ul>
        {CHAPELS.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.href}
              data-station={c.slug}
              style={{ "--glass": c.glass } as React.CSSProperties}
              aria-current={c.slug === current ? "page" : undefined}
            >
              {c.room}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
