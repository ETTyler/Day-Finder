# Day Finder

Find the quietest days to visit any theme park. Search from hundreds of parks worldwide, set your date range and filters, and get a ranked list of the least crowded days to visit — pulled from live crowd calendar data.

## Features

- **Park search** — search by name or country across hundreds of parks
- **Flexible date range** — pick a custom window or use a rolling "days ahead" slider
- **Day of week filter** — exclude weekends, or any days you can't travel
- **Crowd cap** — hide days above a crowd percentage threshold
- **Ranked results** — open days sorted by crowd level, with a visual bar, status label, and opening hours

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)

Crowd data is sourced from [queue-times.com](https://queue-times.com) via server-side scraping in Next.js API routes, so no separate backend is needed.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Push to GitHub and import the repo into Vercel. It will detect Next.js automatically — no additional configuration required.

## Notes

Crowd data accuracy depends on queue-times.com. Days marked with `*` are predicted rather than historical figures. If the site changes its HTML structure, the scraper patterns in `src/lib/scraper.ts` may need updating.
