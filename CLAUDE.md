# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marc Tchetchenigbo's personal portfolio: a multi-page site built with Next.js 15 (App Router),
React 19, TypeScript, and Tailwind v4. Built 2026-11-11 following `DIRECTION.md` and Marc's
mockups (`inspo/04–05`); the CSS values come from `inspo/06-reference.html`.

**The visual direction is in `DIRECTION.md`** (set 2026-11-11): browser-default, system fonts,
white ground, black ink, at most one web-native colour, work presented as a text index (list or
table). It replaces every earlier direction. Don't revive the dark/chartreuse build or the
light-serif editorial set.

**Read `BRIEF.md`, `DESIGN.md` and `DIRECTION.md` first.** BRIEF.md is Marc's master brief:
IA, content boundaries, a background inventory (context only, not approved copy) and the
agreed working process (content strategy before any implementation). DESIGN.md holds the hard rules (no job-seeking
signals, content lives in `lib/content.ts`) and the rejected list. Running state is in
`LOGBOOK.md`.

## Commands

```bash
npm run dev     # dev server at localhost:3000
npm run build   # production build
npm run start   # serve the production build
```

`npm run lint` is scripted but **eslint is not installed** — it drops into Next's setup prompt
rather than linting. There is no test suite.

## Architecture

### Content lives in one file

`lib/content.ts` is the single source of truth for all site copy: profile and links, site title,
`home` (the greeting, the typed hero `lines`, and the four tiles), `projects[]` (every project has a `detail` block),
`projectLinks` (the project-page blue footer), `experience` (work, pro bono, involvement, hacks),
`about`, and `pages` (section heads, including the elsewhere copy).
Components are presentational and import from it — **copy edits go there, not into JSX**.

Each project carries `status: "public" | "draft"` and an internal `notes` field. Project page
titles are lowercased; `keepCase: true` keeps a name's capitals as written (rePlay). rePlay was
Ma Bibliothèque: `next.config.mjs` 308-redirects `/projects/ma-bibliotheque` to `/projects/replay`. Both are
editorial metadata: only `public` rows render, and `notes` never renders. Copy follows the
no-numbers rule (DESIGN.md): no metrics, counts or figures anywhere; years are fine.

### Components

**Routes (`app/`):**

There is **no nav bar**. The home tiles are the menu, and every inner page starts with one
`BackLink` (`← home`, or `← projects` on a detail page).

- `/` — home. A centred hero filling the viewport: the greeting, then `TypedLine`, which
  starts on `home.lines[0]` and types through the rest. Then four `Tile`s: projects,
  experience, about, elsewhere. No footer.
- `/projects` — fits one desktop screen (1280×800 and up). `IndexTable` of all public projects (`# THING STACK YEAR IN ONE
  SENTENCE` columns). Every name links to its own detail page, never straight to a repo or demo. No note and no footer: the page ends on the table.
- `/projects/[slug]` — a page for every public project (`generateStaticParams`). Any other slug
  calls `notFound()`. On desktop (≥801px) the page is exactly one screen: `body:has(.section-flush)`
  is locked to `100dvh`, and if the copy is taller the text column (`.feature-body`) scrolls on
  its own. Phones scroll normally. Uses `FeatureLayout`; beats without copy are skipped. The left column
  stacks the name (with the stack as `StackIcons`) and, straight under it, a blue box that fills
  the rest of the column with the GitHub / live site links (or
  "nothing public"), so the links are in the first screen (`FeatureLayout`'s `side` prop).
  Under it, one last row on the same two columns (`.proj-foot`): an empty cell, and the
  previous / next nav under the body. Then
  `SiteFooter`, with no gap (`.section-flush`).
- `/experience` — `SectionHead`, then `ExperienceIndex` (client): an index left and a detail
  panel right, on the project pages' `1fr 2fr` grid. Left: every entry, grouped (work,
  involvement, hackathons; the Accenture pro bono entry leads involvement, there is no pro bono
  heading), as name, role and year (no dot separators anywhere on the site). Right: the selected entry's year, name,
  role, one-liner and body (in two columns). It opens on BDO Canada, so
  that's on screen at once. On a switch the year, name and role glitch into place (`Scramble`) while
  the summary and paragraphs are re-typed, each by its own blue cursor, all at once (`TypeText`;
  fixed paragraph slots, so a new paragraph is typed in too). Under 800px the detail opens inline under the selected row. The
  index fills down to the footer so the divider meets its rule. Fits one screen at 1280×800 and
  up. The Accenture pro bono entry never names its client; it's described only as a nonprofit employment services organization.
- `/about` — `SectionHead`, lead paragraphs (no facts row), and the contact `BlueFooter`.
- `/elsewhere` — intentionally empty: a heading and one line. Don't add content.

**Components (`components/`):** `BackLink`, `SiteFooter` (plain row: © + back to top),
`BlueFooter` (blue block: big links + the © row; replaces `SiteFooter` on the about page), `SectionHead` (title + intro in the right two-thirds, left third empty; the tabs have no eyebrow label), `IndexTable` (generic table: `columns`, `rows`), `Tile`, `FeatureLayout`
(detail page shell), `ExperienceIndex` (experience index + detail panel), `Scramble` (text that glitches into place on change), `TypeText` (text re-typed by its own cursor on change), `ScrambleIn` (in `app/layout.tsx`: every inner page's text arrives as it opens, first load and each tab click: headings and short standalone text glitch; paragraphs, sentences (text ending in . ? !) and anything over 60 characters are typed by many cursors at once, with the untyped part hidden in place by a CSS highlight (`::highlight(typing)`) and each cursor an overlay on <body>, so React's text and the layout never change; skips `/`, `.sr-only`, svg and `[data-no-scramble]`; restores the exact text and yields any node React rewrites mid-glitch), `StackIcons` (a stack as brand-colour logos: devicon SVGs in `public/stack/`, plus
simple-icons paths in their brand hex for the few devicon lacks; names with no logo, such as AWS
Lambda, Recharts and API-Football, fall back to small text; add new stack names to its `ICONS`
map), `TypedLine` (the hero's typed line). All are server
components except `TypedLine`, `ExperienceIndex`, `Scramble`, `TypeText` and `ScrambleIn`. The glitch
and typing maths (`noise`, `typedCount`, about a second either way) is shared in `lib/scramble.ts`. It retypes only the words that differ between consecutive
lines (a word-level LCS), backspacing them. `home.lineLink` turns one word of one line into a
link as soon as the word is typed, while the "!" are still typing ("projects" → `/projects`); the
word glitches into place in blue (and again on hover), the "!" are deleted the moment they're all typed,
the bare line holds briefly (`BARE_HOLD`) so the link stays clickable, and the loop waits while it's hovered. It
leaves with a select-and-delete: the run of "!" first, in one fast drag (`BANG_SELECT`), then its words (highlight, then gone at once). It
reserves the height of the longest line so nothing moves, stays
still under reduced motion, pauses in a hidden tab, and gives screen readers `lines[0]` only.

`app/layout.tsx` holds metadata, `ScrambleIn` and `<Analytics />` only (title template `%s | Marc Tchetchenigbo`). Each page
renders its own `<main id="content">` and its own ending: `SiteFooter`, `BlueFooter`, or nothing
(home).

### Styling

Tailwind v4 with an `@theme` block in `app/globals.css`. Tokens: `--color-paper` (#fbfbfa),
`--color-ink` (#151515), `--color-line` (#b6b6b3), `--color-blue` (#2437ec), `--color-wash`
(#f0f0ee), and `--font-sans: Arial, Helvetica, sans-serif`. Blue is for links and interaction only.

Alongside the utilities, `globals.css` has a small set of plain CSS component classes ported
from `inspo/06-reference.html`: `.display-hero`, `.display-title`, `.display-name`, `.hero`,
`.tiles`/`.tile`, `.section`, `.index`, `.xp`, `.feature`, `.contact`/`.contact-foot`,
`.site-footer`. Those are the reference's values; don't re-derive them. One deliberate
departure: the reference's `.wrap { max-width: 1540px }` container is gone. Everything runs
full width with a `--gutter` of 24px, or 14px under 800px (paragraphs keep their own reading widths).

**Rules run edge to edge, and they meet.** The gutter is for text, not lines. A ruled block
inside `.section` or `.contact` carries `.bleed`, which cancels the gutter, and its rows or cells
put `var(--gutter)` back on the text. Vertical rules run from the rule above to the rule below:
the project page's divider ends on the `.proj-nav` rule, and `.tiny-grid`'s rule starts at the
divider. A new ruled block follows the same pattern.

The mobile breakpoint is 800px: the table collapses to stacked rows, and tiles go 2×2.
Lines are 1px and all one colour (`--color-line`); no ink rules. No radius, no shadows. The only motion is colour hovers, the hero's typed
line, and text arriving: glitch for headings and short text, multi-cursor typing for sentences and paragraphs (pages opening, experience switches); all stay still under reduced motion.

### Dependencies

Runtime dependencies are `next`, `react`, `react-dom`, `simple-icons` (logo paths for the
few `StackIcons` that devicon lacks, no runtime cost: the pages are server-rendered) and
`@vercel/analytics` (`<Analytics />` in `app/layout.tsx`; Web Analytics must be enabled on the
Vercel project). Animated project graphics were tried
and rejected on 2026-11-12 (see LOGBOOK): don't add motion or styling libraries, or graphics,
without Marc asking.

## Reference material

`inspo/` holds the three references behind `DIRECTION.md`, Marc's two mockups (`04`, `05`), and
`06-reference.html`, the mockups as a static page. The older `.refs/` set was scrapped.
