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

Each project carries `status: "public" | "draft"` and an internal `notes` field. Both are
editorial metadata: only `public` rows render, and `notes` never renders. Copy follows the
no-numbers rule (DESIGN.md): no metrics, counts or figures anywhere; years are fine.

### Components

**Routes (`app/`):**

There is **no nav bar**. The home tiles are the menu, and every inner page starts with one
`BackLink` (`← home`, or `← projects` on a detail page).

- `/` — home. A centred hero filling the viewport: the greeting, then `TypedLine`, which
  starts on `home.lines[0]` and types through the rest. Then four `Tile`s: projects,
  experience, about, elsewhere. No footer.
- `/projects` — `IndexTable` of all public projects (`# · THING · STACK · YEAR · IN ONE
  SENTENCE`). Every name links to its own detail page, never straight to a repo or demo.
- `/projects/[slug]` — a page for every public project (`generateStaticParams`). Any other slug
  calls `notFound()`. Uses `FeatureLayout`; beats without copy are skipped. The left column
  stacks the name (with the stack as `StackIcons`) and, straight under it, a blue box that fills
  the rest of the column with the GitHub / live site links (or
  "nothing public"), so the links are in the first screen (`FeatureLayout`'s `side` prop).
  Under it, one last row on the same two columns (`.proj-foot`): an empty cell, and the
  previous / next nav under the body. Then
  `SiteFooter`, with no gap (`.section-flush`).
- `/experience` — `SectionHead` plus four `ExperienceBlock`s (work, pro bono, involvement, hacks).
  YSB appears only in the body of the Accenture OCCP pro bono entry, never as a row or headline.
- `/about` — `SectionHead`, lead paragraphs, a facts row, and the contact `BlueFooter`.
- `/elsewhere` — intentionally empty: a heading and one line. Don't add content.

**Components (`components/`):** `BackLink`, `SiteFooter` (plain row: © + back to top),
`BlueFooter` (blue block: big links + the © row; replaces `SiteFooter` on the about page), `SectionHead`, `IndexTable` (generic table: `columns`, `rows`), `Tile`, `FeatureLayout`
(detail page shell), `ExperienceBlock`, `StackIcons` (a stack as monochrome logos; names with no logo, such as AWS
Lambda, Recharts and API-Football, fall back to small text; add new stack names to its
`ICONS` map), `TypedLine` (the hero's typed line). All are server
components except `TypedLine`. It retypes only the words that differ between consecutive
lines (a word-level LCS), reserves the height of the longest line so nothing moves, stays
still under reduced motion, pauses in a hidden tab, and gives screen readers `lines[0]` only.

`app/layout.tsx` holds metadata only (title template `%s · Marc Tchetchenigbo`). Each page
renders its own `<main id="content">` and its own ending: `SiteFooter`, `BlueFooter`, or nothing
(home).

### Styling

Tailwind v4 with an `@theme` block in `app/globals.css`. Tokens: `--color-paper` (#fbfbfa),
`--color-ink` (#151515), `--color-line` (#b6b6b3), `--color-blue` (#2437ec), `--color-wash`
(#f0f0ee), and `--font-sans: Arial, Helvetica, sans-serif`. Blue is for links and interaction only.

Alongside the utilities, `globals.css` has a small set of plain CSS component classes ported
from `inspo/06-reference.html`: `.display-hero`, `.display-title`, `.display-name`, `.hero`,
`.tiles`/`.tile`, `.section`, `.index`, `.exp`, `.feature`, `.contact`/`.contact-foot`,
`.site-footer`. Those are the reference's values; don't re-derive them. One deliberate
departure: the reference's `.wrap { max-width: 1540px }` container is gone. Everything runs
full width with a `--gutter` of 24px, or 14px under 800px (paragraphs keep their own reading widths).

**Rules run edge to edge, and they meet.** The gutter is for text, not lines. A ruled block
inside `.section` or `.contact` carries `.bleed`, which cancels the gutter, and its rows or cells
put `var(--gutter)` back on the text. Vertical rules run from the rule above to the rule below:
the project page's divider ends on the `.proj-nav` rule, and `.tiny-grid`'s rule starts at the
divider. A new ruled block follows the same pattern.

The mobile breakpoint is 800px: the table collapses to stacked rows, and tiles go 2×2.
Lines are 1px. No radius, no shadows. The only motion is colour hovers and the hero's typed
line, which stays still under reduced motion.

### Dependencies

Runtime dependencies are `next`, `react`, `react-dom` and `simple-icons` (logo SVG paths for
`StackIcons`, no runtime cost: the pages are server-rendered). Marc plans to add React Bits
components per project later; until then, don't add motion or styling libraries.

## Reference material

`inspo/` holds the three references behind `DIRECTION.md`, Marc's two mockups (`04`, `05`), and
`06-reference.html`, the mockups as a static page. The older `.refs/` set was scrapped.
