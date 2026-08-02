import { MARK_PATHS, MARK_RATIO, MARK_VIEWBOX } from "@/lib/mark";

interface Props {
  /** Height in pixels; width follows the mark's own ratio. */
  size?: number;
  className?: string;
  /** Supply only when the mark is the sole carrier of the name. Everywhere it
      sits beside the word "Cotek" it is decorative, and announcing it twice is
      worse than not announcing it at all. */
  title?: string;
}

/**
 * The Cotek shield.
 *
 * Two filled paths taking their colour from `currentColor`, under a kilobyte,
 * and sharp at any size. It replaces a 389×240 raster that was previously
 * inlined as a base64 data URI — roughly 14KB of markup carrying a baked-in
 * dark background that could not sit on any other surface.
 */
export default function Mark({ size = 24, className, title }: Props) {
  return (
    <svg
      width={Math.round(size * MARK_RATIO * 100) / 100}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill="currentColor"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : "true"}
    >
      {title ? <title>{title}</title> : null}
      {MARK_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}
