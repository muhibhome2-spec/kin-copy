# Barakah · New Beginnings CRM

A frontend example for an internal donor CRM tailored to **New Beginnings UK** (charity 1195427). Working name: *Barakah*. Frontend-only demo with mock data — no DB, no auth.

> bright beginnings have bright endings.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (with `@theme` tokens)
- Recharts, Lucide icons, date-fns
- Mock data generated deterministically in `/lib/data.ts`

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 → redirects to `/dashboard`.

## What's here

- **Dashboard** — KPI cards, stacked monthly raised chart, action queue, campaign progress
- **Donors** — list with engagement rings, profile page (timeline, AI summary mock, gift-aid panel)
- **Gifts** — ledger view with zakah / gift-aid flags
- **Campaigns** — progress vs goal across all 8 active programmes
- **Communications** — thank-you queue with template preview
- **Gift Aid** — UK-specific HMRC R68(i)-style claim builder
- **Reports / Segments / Settings** — surface stubs

## Brand notes baked in

- Lowercase nav typography, warm earth-tones, soft serif accents (Source Serif 4 + Inter)
- Hijri date alongside Gregorian on dashboard hero
- Gift-aid eligibility surfaced everywhere; zakah flag visible on flagged gifts
- Engagement score uses a transparent RFM formula (`/lib/engagement.ts`)
- Dark mode peer-of-light (toggle in topbar)

## Not built (out of scope for this demo)

Auth, persistence, CSV import, real LLM call, PDF reports, automation engine. The full spec lives in the project brief.
