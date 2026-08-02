"use client";

/*
  The field's host, and the one place the page and the background agree.

  Three jobs, all of them progressive enhancement:

    1. Boot the engine into #field and tear it down on unmount.
    2. Tint the document — and the field — to the current room's glass, so
       walking from the Font to the Pulpit changes the temperature of the page
       as well as its contents.
    3. Bind [data-station] to the field, so pointing at a chapel anywhere on
       the site blooms its anchor in the background.

  The binding is delegated at the document rather than attached per element.
  Under client-side navigation the elements carrying [data-station] are
  replaced on every route change, and per-element listeners would have to be
  re-attached each time — the delegated version simply keeps working, and
  costs four listeners instead of one per row.
*/

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createField, type FieldAPI } from "./engine";
import { FIELD_ANCHORS, STATIONS } from "@/lib/cathedral";

/** The colour the shell falls back to outside any room: the mark's own. */
const COTEK = "#2fdcb4";

function glassFor(pathname: string): string {
  if (!pathname || pathname === "/") return COTEK;
  // Longest href wins, so /cathedral/field beats /cathedral.
  const hit = STATIONS.filter((s) => pathname === s.href || pathname.startsWith(s.href + "/")).sort(
    (a, b) => b.href.length - a.href.length,
  )[0];
  return hit?.glass ?? COTEK;
}

export default function Field() {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<FieldAPI | null>(null);
  const pathname = usePathname();

  // Boot once. The engine owns its own resize, visibility and pointer wiring.
  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    document.documentElement.classList.add("js");
    const field = createField(host, FIELD_ANCHORS);
    api.current = field;
    window.cotekField = field;

    /* Hover and focus both count: the constellation has to be reachable from
       the keyboard, or it is decoration for mouse users only. */
    let release: number | undefined;

    const stationOf = (t: EventTarget | null) =>
      t instanceof Element ? (t.closest("[data-station]") as HTMLElement | null) : null;

    const hold = (e: Event) => {
      const el = stationOf(e.target);
      if (!el?.dataset.station) return;
      window.clearTimeout(release);
      field.focus(el.dataset.station);
    };

    const let_go = (e: Event) => {
      if (!stationOf(e.target)) return;
      window.clearTimeout(release);
      // A grace period stops the constellation collapsing while the pointer
      // travels between two adjacent rows in an index.
      release = window.setTimeout(() => field.focus(null), 140);
    };

    document.addEventListener("pointerover", hold);
    document.addEventListener("pointerout", let_go);
    document.addEventListener("focusin", hold);
    document.addEventListener("focusout", let_go);

    return () => {
      window.clearTimeout(release);
      document.removeEventListener("pointerover", hold);
      document.removeEventListener("pointerout", let_go);
      document.removeEventListener("focusin", hold);
      document.removeEventListener("focusout", let_go);
      field.destroy();
      api.current = null;
      delete window.cotekField;
    };
  }, []);

  // Retint on every route change. The CSS variable drives the page, the
  // engine call drives the background; they are set together so they can
  // never disagree about which room you are standing in.
  useEffect(() => {
    const glass = glassFor(pathname ?? "/");
    document.documentElement.style.setProperty("--accent", glass);
    api.current?.tint(glass);
    // Release any anchor held by a link on the page we just left.
    api.current?.focus(null);
  }, [pathname]);

  return <div id="field" ref={ref} aria-hidden="true" />;
}
