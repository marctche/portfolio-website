# portfolio-website

My personal portfolio. A small multi-page site: a home page whose tiles are the menu, a
project index with a page for each project, experience, about, and elsewhere.

Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind v4. The pages are
static: every route, including each project page, is prerendered at build time.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
```

## Where things are

- `lib/content.ts`: all of the site's copy. Edit text here, not in the components.
  A project shows up only when its `status` is `"public"`.
- `app/`: the routes (`/`, `/projects`, `/projects/[slug]`, `/experience`, `/about`,
  `/elsewhere`).
- `components/`: presentational components.
- `app/globals.css`: the Tailwind theme tokens and the plain CSS component classes.
