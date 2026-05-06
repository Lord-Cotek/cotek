# cotek.me

The personal site of **Temitayo Ezekiel Olayiwola** — also Cotek Temi, Temi Cotek, Temitayo Cotek, Cotek Temitayo, Omogbolahan, Kadiri, and simply Cotek. Environmentalist (AMRO; formerly Action International Services), software founder (Cotek App FZ-LLC), author, poet, Bible teacher (RAK Church), photographer, certified diver, member of Emirates Nature–WWF, husband.

**COTEK is an acronym.** It unfolds as Chimera · Omogbolahan / Olayiwola · Temitayo · Ezekiel · Kadiri. The word means *hope*.

This is not a developer portfolio. It is the digital equivalent of one man's cathedral: a continuous canvas that pans between rooms, with one source of truth (`lib/identities.ts`) feeding every page, every schema block, and every keyboard shortcut.

## Architecture

```
app/
  layout.tsx              shared cosmos canvas + nav + footer + Person JSON-LD
  page.tsx                / — Threshold (drift → COTEK reveal → unfolding)
  about/page.tsx          long-form bio in his voice
  works/
    page.tsx              constellation map (SVG; arrow keys; list fallback)
    apps/page.tsx
    books/page.tsx        OpenLibrary feed + fallback
    poems/page.tsx        poems.cotek.app feed + fallback
    research/page.tsx     curated outbound links
    sermons/page.tsx      RAK Church sermons (cheerio scrape) + fallback
    photos/page.tsx       Unsplash @cotek + fallback
    field/page.tsx        environmental career, WWF, reef notes — the surprise room
  signal/page.tsx         daily Signal panel (24h cache)
  letters/page.tsx        write a note; receive an AI-drafted reply in his voice
  lexicon/page.tsx        14-entry glossary as a worldview
  names/page.tsx          a colophon of every name + every profile
  not-found.tsx           404 as a poem (one of five)
  api/
    status/route.ts       pings every cotek subdomain
    signal/route.ts       Anthropic-composed dispatch (24h)
    verse/route.ts        POST { prompt } → 6–12 lines in his voice
    reply/route.ts        POST letter → AI reply + Resend forward (best-effort)
    feed/{unsplash,books,poems,sermons}/route.ts
  opengraph-image.tsx     shared OG template (@vercel/og, edge)
  sitemap.ts, robots.ts
components/
  Cosmos.tsx              continuous orbs, particles, cursor ink
  RoomTint.tsx            sets data-room on <html> per route
  NamesDoorway.tsx        the threshold ceremony
  Constellation.tsx       SVG star map + list-view fallback
  KeyboardConsole.tsx     1–7, P, L, S, N, X, GG, ?, Esc + the verse modal
  VerseModal.tsx, Nav.tsx, Footer.tsx
lib/
  identities.ts           THE source of truth (names, handles, career, works)
  voice.ts                voice profiles + system prompts + few-shots
  anthropic.ts            server-only client (returns null without API key)
  feeds.ts                external fetchers + caches + fallbacks
```

### Continuous canvas

`<Cosmos />` is rendered once in the root layout. Three drifting orbs, a faint grid, sparse particles, and an ink trail follow the cursor. Each route sets `data-room` on `<html>` — CSS variables (`--orb-a`, `--orb-b`, `--orb-c`, `--orb-tint`, `--paper`) shift the cosmos tint accordingly. The Field room drifts toward teal. Sermons drifts toward warm gold. Poems drifts toward soft rose. Letters drifts toward ink-blue. Signal drifts toward bone-white.

### The threshold (`/`)

Three acts, ~12s total. Names drift one by one, converge into the **COTEK** wordmark letter by letter, then unfold beneath each letter (Chimera, Omogbolahan / Olayiwola, Temitayo, Ezekiel, Kadiri). A single line resolves: *"COTEK means hope."* `prefers-reduced-motion` snaps to the final state.

### Constellation (`/works`)

SVG star map. Stars sized by domain weight. Edges drawn between concepts that overlap; the **sermons ↔ field** edge is brightened. Arrow keys cycle the focused star; Enter opens it. A list-view fallback below it is always rendered for screen readers and small viewports.

### AI features (Anthropic SDK)

- `/api/verse` — Press `P` anywhere; the visitor types a name or feeling; Claude returns 6–12 lines in his voice. System prompt + few-shots in `lib/voice.ts`.
- `/api/signal` — One 60–80 word reflection per day, cached via `unstable_cache`, fed by the day, a rotating theme, the most recent poem, and a curated sermon verse.
- `/api/reply` — Visitor letters get a brief reply in his epistolary voice. Always ends with the disclaimer line. The original is forwarded to `LETTERS_TO` via Resend when configured.

**Without `ANTHROPIC_API_KEY`** every feature degrades gracefully: `/api/verse` returns a curated example, `/api/signal` returns a static fallback, `/api/reply` returns nothing AI but still forwards (or invites a `mailto:`).

### SEO

- `<Person>` JSON-LD in the root layout listing `alternateName: [...]` for every form of the name and `sameAs: [...]` for every profile.
- `<Book>` JSON-LD per book on `/works/books`.
- Per-route `<title>` and `<meta name="description">` naming Temi.
- `sitemap.xml` and `robots.txt` generated from the route tree.
- Shared `/opengraph-image` (1200×630).

### Accessibility

- Every canvas/SVG decoration is `aria-hidden`.
- The constellation has both an SVG view and a list view; the list is rendered, not hidden.
- A skip link appears on first focus.
- Keyboard-navigable in full (`?` reveals the cheat sheet).
- `prefers-reduced-motion`: the threshold snaps; particles freeze; the cursor ink disables.
- Color contrast WCAG AA minimum.

## Run locally

```bash
cp .env.example .env.local   # then fill in the keys you have
npm install
npm run dev
```

Open http://localhost:3000

The site works without any keys — the threshold renders, the constellation works, every room renders with its fallback content. Add keys to wake the AI features and live feeds.

## Environment

| var | what it does | without it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Verse, Signal, Letters | curated/static fallbacks |
| `ANTHROPIC_MODEL` | model override | `claude-opus-4-7` |
| `UNSPLASH_ACCESS_KEY` | photo gallery | shipped placeholders |
| `RESEND_API_KEY` | mail forwarding for letters | letters still saved server-side; no forward |
| `LETTERS_TO` | inbox for forwarded letters | as above |
| `SITE_URL` | absolute URLs in metadata | `https://cotek.me` |

## Deploy

1. Vercel → New Project → import this repo.
2. Add the env vars under Project Settings → Environment Variables.
3. Add domain: `cotek.me`. Apex via A record (or ALIAS/ANAME) per Vercel's instructions.

Existing subdomains (`bms.cotek.app`, `poems.cotek.app`, `sci.cotek.app`, etc.) stay where they are — `/api/status` only pings them from this site, it does not own them.

## A note on copy

If you find a `// TODO(temi):` in the source, that's a place where his hand should land. Never add lorem ipsum; either write it in his voice or leave the marker.

> *"Stewardship is not a metaphor for me. It is a job description. Then it became a sermon. Then it became a life."*
