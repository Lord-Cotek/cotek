/**
 * Spelled-out numbers for body copy.
 *
 * The site states counts — books, chapels, names — in several places at once.
 * Hardcoding the word means the fourth book ships with the page still saying
 * three, which is exactly the kind of quiet inaccuracy this whole site is
 * against. Everything counts from the data and passes through here.
 */

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
] as const;

/** `spell(7)` → "seven". Falls back to digits past twenty, which reads fine. */
export function spell(n: number): string {
  return WORDS[n] ?? String(n);
}

/** Sentence-initial form: `Spell(7)` → "Seven". */
export function Spell(n: number): string {
  const w = spell(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
}

/** Zero-padded to two digits, for the monospace index columns. */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
