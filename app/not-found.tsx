// app/not-found.tsx
// 404 as a poem. Five quatrains; one is shown at random. At least one
// references water, per the brief.

import Link from "next/link";

const POEMS = [
  `The well is not where the bucket left it.
The path remembers, but does not say.
You walked past a door that was a window;
the window was open. Try again.`,

  `Ask the water where the page went.
It will not answer. It rarely does.
Return to the room with the names in it
and we will find what you came for.`,

  `Some signals arrive late, and full of salt.
Some pages arrive not at all.
Stand still a moment. The cathedral is large.
We will both hear the bell.`,

  `A reef is a city of small obediences.
This page was not one of them.
Forgiveness, like current, is plural.
Step back into it and try once more.`,

  `What the desert keeps, it keeps in writing.
What the page did not, it could not.
Walk back to the threshold. Begin again,
slowly, by hand.`,
];

function pick(): string {
  // Stable per-request randomness; on the client this is fine.
  return POEMS[Math.floor(Math.random() * POEMS.length)];
}

export default function NotFound() {
  const poem = pick();
  return (
    <div className="notfound">
      <div className="poem">{poem}</div>
      <Link href="/">Return to the threshold</Link>
    </div>
  );
}
