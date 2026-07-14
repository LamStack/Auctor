# AUCTOR

**Bahrain's first gamified assessments platform.**

AUCTOR helps Bahrain tech companies hire based on real ability, not just CVs. Companies buy
assessment packages, send candidates a link, and candidates play through a short interactive
world — quizzes, logic puzzles, bug hunts, creative coding challenges, and decision scenarios —
that AUCTOR turns into a skill report covering technical skill, problem-solving, and soft skills.

This is the product MVP (candidate game + employer dashboard + APIs). The public marketing site
is a separate project.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Framer Motion for the game scene
- Prisma + PostgreSQL (works locally and on Vercel with the same free Neon database)
- Anthropic Claude API for AI-generated skill report narratives (optional — falls back to a
  rule-based narrative if no API key is set)

## Setup

1. Create a free Postgres database at [neon.tech](https://neon.tech) (no credit card, ~1 minute)
   and copy its connection string.
2. Create `.env` from the example and fill in `DATABASE_URL` with that connection string:
   ```bash
   cp .env.example .env
   ```
3. Install, migrate, seed, run:
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   ```

Open http://localhost:3000. A demo employer account is seeded:

- Email: `demo@auctor.bh`
- Password: `auctor-demo`

To enable real AI-generated skill reports, set `ANTHROPIC_API_KEY` in `.env` and restart the dev
server. Without it, reports still generate using the deterministic rule-based scorer, clearly
labeled as such in the dashboard.

## How it works

1. An employer signs up, buys a package (simulated payment for MVP — grants credits instantly),
   picks an assessment track, and generates a candidate link.
2. The candidate opens `/play/[token]`, then plays through the track's stations in
   `/play/[token]/game` — a character walks a path between stations, each opening a themed
   challenge (MCQ kiosk, drag-to-reorder logic, bug hunt, "patch the machine" code fragment,
   branching decision scenario, timed matching round).
3. On completion, AUCTOR scores the run (rule-based correctness/timing + an AI-written
   explainability narrative), deducts one credit from the company, and the employer sees a full
   skill report on `/dashboard/candidates/[id]`.

Three seeded tracks: Junior Software Developer, QA / Software Testing, and
Cybersecurity / IT Support Analyst.

## Deploying (Vercel)

GitHub Pages **cannot** host this app — it only serves static files, and AUCTOR needs a live
server, database, and API routes. Vercel is the standard host for Next.js and deploys straight
from this GitHub repo:

1. Push this repo to GitHub (already done if you're reading this from there).
2. At [vercel.com](https://vercel.com), sign in with GitHub and import this repository as a new
   project. Vercel auto-detects Next.js — no config needed.
3. Before deploying, add environment variables in the Vercel project settings (same names as
   `.env.example`): `DATABASE_URL` (your Neon connection string — can be the same one you use
   locally, or a separate database for production), `SESSION_SECRET` (a long random string), and
   optionally `ANTHROPIC_API_KEY`.
4. Deploy. The build command (`prisma migrate deploy && next build`, already set in
   `package.json`) applies any pending database migrations automatically on every deploy.
5. Run `npm run seed` once locally with `DATABASE_URL` pointed at the production database (or
   temporarily paste the production connection string into your local `.env`) to seed the three
   tracks and a demo company — seeding isn't part of the build step since it should only run once.

## Project structure

- `src/app` — pages and API routes (App Router)
- `src/components/game` — the candidate-facing game scene and station types
- `src/components/dashboard` / `src/components/ui` — employer dashboard UI
- `src/lib/tracks` — seeded assessment content per track
- `src/lib/scoring` — rule-based scorer + Claude AI narrative generator
- `prisma/schema.prisma` — data model
