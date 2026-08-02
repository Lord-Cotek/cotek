"use client";

/*
  Scroll reveal, as one observer for the whole document rather than one per
  element. Elements opt in by carrying `.reveal`; the class only hides them
  under `html.js`, which the field sets once it has booted — so a script that
  never arrives cannot leave the page blank.

  Reveal is a one-shot. Re-animating on the way back up is the single most
  common way scroll animation turns into seasickness.
*/

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");
    if (!targets.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
