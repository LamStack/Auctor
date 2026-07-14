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
- Prisma + SQLite (swap to Postgres later via `DATABASE_URL`)
- Anthropic Claude API for AI-generated skill report narratives (optional — falls back to a
  rule-based narrative if no API key is set)

## Setup

```bash
npm install
cp .env.example .env   # already created for local dev; edit as needed
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

## Project structure

- `src/app` — pages and API routes (App Router)
- `src/components/game` — the candidate-facing game scene and station types
- `src/components/dashboard` / `src/components/ui` — employer dashboard UI
- `src/lib/tracks` — seeded assessment content per track
- `src/lib/scoring` — rule-based scorer + Claude AI narrative generator
- `prisma/schema.prisma` — data model
