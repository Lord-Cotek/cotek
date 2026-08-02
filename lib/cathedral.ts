/**
 * The cathedral.
 *
 * cotek.me is not a portfolio with a metaphor bolted on the front — the
 * building *is* the information architecture. Every room on the site is a
 * station in a cruciform plan, and this file is the plan: its geometry, its
 * glass, and what is kept in each part of it.
 *
 * Every surface reads from here — the floor plan at /cathedral, the chapel
 * strip on each room, the background field's anchors, the command palette,
 * the sitemap and the structured data. Move a chapel here and it moves
 * everywhere, including in the background of the page you are standing on.
 *
 * ── The plan ──────────────────────────────────────────────────────────────
 *
 * Drawn west (the door) at the left to east (the apse) at the right, which is
 * how cathedral plans have been drawn since people started drawing them, and
 * also how a left-to-right reader walks a page.
 *
 *   narthex   nave + aisles          crossing        choir     apse
 *   ┌──┐      ┌────────────────┐        ┌──┐       ┌──────┐     ╮
 *   │  │══════╡                ╞════════╡  ╞═══════╡      │      )
 *   └──┘      └────────────────┘        └──┘       └──────┘     ╯
 *                                     ╪ transepts ╪
 *
 * Coordinates are in the SVG user space defined by PLAN.viewBox. They are
 * written as literals rather than computed because a floor plan is a drawing,
 * and drawings are laid out by eye.
 */

/** SVG user-space geometry for the drawn building. */
export const PLAN = {
  viewBox: "0 0 1000 460",
  width: 1000,
  height: 460,

  /* The vessel, west to east. Keys are `width`/`height` rather than `w`/`h`
     because each of these is spread straight onto an SVG <rect>, and SVG has
     no `w` attribute — the abbreviated form draws nothing at all, silently. */
  narthex: { x: 38, y: 152, width: 74, height: 156 },
  nave: { x: 112, y: 152, width: 448, height: 156 },
  aisleN: { x: 112, y: 106, width: 448, height: 46 },
  aisleS: { x: 112, y: 308, width: 448, height: 46 },
  crossing: { x: 560, y: 152, width: 120, height: 156 },
  transeptN: { x: 572, y: 36, width: 96, height: 116 },
  transeptS: { x: 572, y: 308, width: 96, height: 116 },
  choir: { x: 680, y: 172, width: 178, height: 116 },
  /** The apse is a half-round drawn as an arc from the choir's east wall. */
  apse: { cx: 858, cy: 230, r: 58 },

  /* The nave arcade — the two rows of columns that separate nave from aisle.
     Purely architectural; they carry no links, they carry the eye. */
  columns: { from: 150, to: 540, step: 55, yN: 152, yS: 308 },
} as const;

export type StationKind = "chapel" | "station";

export interface Station {
  /** Stable id. Chapels use it as their URL segment under /cathedral. */
  slug: string;
  /** Where the station lives on the site. */
  href: string;
  /** The architectural name. What the plan calls it. */
  title: string;
  /** The plain name. What a person searching for it would type. */
  room: string;
  /** One line, in his register, about what is kept here. */
  deck: string;
  /** The station's stained glass, as a hex the field engine can parse. */
  glass: string;
  /** Chapels are the seven rooms of work; stations are everything else. */
  kind: StationKind;
  /** Position in PLAN's user space. */
  x: number;
  y: number;
  /** Which way the label runs, so it never crosses the wall it names. */
  label: "n" | "s" | "e" | "w";
}

/*
  Placement notes, since they are decisions rather than arbitrary numbers:

  - The Font sits at the west end of the nave because that is where fonts sit.
    You are baptised on the way in. That the water room is also the first room
    is not a pun the plan is making; it is where the building put it.
  - The Pulpit is in the north transept and the Font at the west end, and the
    line drawn between them on the plan is lit. Stewardship preached and
    stewardship practised are the same idea told twice, and the plan is the
    only place on the site where you can see both at once.
  - The Signal hangs in the crossing, under the tower, because that is where
    the bell hangs and the bell is rung daily.
  - The Lady Chapel is behind the altar at the east end — the furthest room
    from the door, and the quietest. The poems are there.
*/
export const STATIONS: Station[] = [
  {
    slug: "names",
    href: "/names",
    title: "The Rose Window",
    room: "Names",
    deck: "Every form of the name, set as a colophon. One person, refracted.",
    glass: "#c9d3dd",
    kind: "station",
    x: 75,
    y: 178,
    label: "n",
  },
  {
    slug: "letters",
    href: "/letters",
    title: "The Letter Box",
    room: "Letters",
    deck: "Leave a note in the porch. He reads what arrives.",
    glass: "#c9d3dd",
    kind: "station",
    x: 75,
    y: 282,
    label: "s",
  },
  {
    slug: "field",
    href: "/cathedral/field",
    title: "The Font",
    room: "Field",
    deck: "Water and wastewater across the UAE and the GCC. The reef on weekends.",
    glass: "#3ba0e8",
    kind: "chapel",
    x: 158,
    y: 230,
    label: "s",
  },
  {
    slug: "apps",
    href: "/cathedral/apps",
    title: "The Workshop",
    room: "Apps",
    deck: "Cotek App FZ-LLC. Small tools, each one a ledger of a kind.",
    glass: "#2fdcb4",
    kind: "chapel",
    x: 272,
    y: 129,
    label: "n",
  },
  {
    slug: "books",
    href: "/cathedral/books",
    title: "The Library",
    room: "Books",
    deck: "The Life vs Love trilogy, and The Cerulean Monster.",
    glass: "#dc7444",
    kind: "chapel",
    x: 272,
    y: 331,
    label: "s",
  },
  {
    slug: "about",
    href: "/about",
    title: "The Nave",
    room: "About",
    deck: "The long walk. One letter, from the door to the crossing.",
    glass: "#c9d3dd",
    kind: "station",
    x: 400,
    y: 230,
    label: "n",
  },
  {
    slug: "photos",
    href: "/cathedral/photos",
    title: "The Clerestory",
    room: "Photos",
    deck: "Where the light comes in. Photographs, on Unsplash.",
    glass: "#4fd1d9",
    kind: "chapel",
    x: 468,
    y: 129,
    label: "n",
  },
  {
    slug: "lexicon",
    href: "/lexicon",
    title: "The Lectionary",
    room: "Lexicon",
    deck: "The words he actually uses, defined in his own voice.",
    glass: "#c9d3dd",
    kind: "station",
    x: 468,
    y: 331,
    label: "s",
  },
  {
    slug: "sermons",
    href: "/cathedral/sermons",
    title: "The Pulpit",
    room: "Sermons",
    deck: "Sundays at RAK Church. A long obedience, built in stone.",
    glass: "#e0a93b",
    kind: "chapel",
    x: 620,
    y: 88,
    label: "n",
  },
  {
    slug: "signal",
    href: "/signal",
    title: "The Bell",
    room: "Signal",
    deck: "Rung once a day. Sixty words, then silence.",
    glass: "#c9d3dd",
    kind: "station",
    x: 620,
    y: 230,
    label: "e",
  },
  {
    slug: "research",
    href: "/cathedral/research",
    title: "The Scriptorium",
    room: "Research",
    deck: "IISER, ResearchGate, Academia. Work kept where it was published.",
    glass: "#63c283",
    kind: "chapel",
    x: 620,
    y: 372,
    label: "s",
  },
  {
    slug: "poems",
    href: "/cathedral/poems",
    title: "The Lady Chapel",
    room: "Poems",
    deck: "The furthest room from the door, and the quietest. His lines.",
    glass: "#9d80e6",
    kind: "chapel",
    x: 862,
    y: 230,
    label: "e",
  },
];

/** The seven rooms of work, in the order you meet them walking east. */
export const CHAPELS = STATIONS.filter((s) => s.kind === "chapel");

/** Chapel slugs, for typing the sibling strip and the route params. */
export type ChapelSlug = "field" | "apps" | "books" | "photos" | "sermons" | "research" | "poems";

const BY_SLUG = new Map(STATIONS.map((s) => [s.slug, s]));

export function station(slug: string): Station | undefined {
  return BY_SLUG.get(slug);
}

/** Throws rather than returning undefined — every call site is a static page
    naming a station that exists, so a miss is a build-time bug, not a 404. */
export function chapel(slug: ChapelSlug): Station {
  const s = BY_SLUG.get(slug);
  if (!s) throw new Error(`[cathedral] no station "${slug}"`);
  return s;
}

/**
 * The lit line across the plan.
 *
 * Drawn between the Pulpit and the Font: stewardship preached and stewardship
 * practised. It is the only line on the plan that is not a wall.
 */
export const LEY = { from: "sermons", to: "field" } as const;

/** What the background field is anchored on, wherever it is rendered. */
export const FIELD_ANCHORS = STATIONS.map((s) => ({ slug: s.slug, color: s.glass }));
