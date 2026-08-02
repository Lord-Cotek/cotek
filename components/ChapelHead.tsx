import ChapelStrip from "@/components/ChapelStrip";
import { chapel, type ChapelSlug } from "@/lib/cathedral";

interface Props {
  slug: ChapelSlug;
  /** The page's own headline. The chapel's architectural name is set above it
      by the stamp, so this line is free to say something. */
  title: React.ReactNode;
  deck: React.ReactNode;
  children?: React.ReactNode;
}

/** The standard opening of a chapel: the sibling strip, then the head. */
export default function ChapelHead({ slug, title, deck, children }: Props) {
  const c = chapel(slug);
  return (
    <>
      <ChapelStrip current={slug} />
      <header className="room-head">
        <p className="stamp">
          {c.title} · {c.room}
        </p>
        <h1 className="room-title">{title}</h1>
        <p className="room-deck">{deck}</p>
        {children}
      </header>
    </>
  );
}
