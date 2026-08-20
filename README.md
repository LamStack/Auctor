# AUCTOR

**Bahrain's first gamified assessments platform.**

AUCTOR helps companies hire on real ability, not just CVs. Companies buy assessment packages,
send candidates a link, and candidates play through a role-specific engine — a real coding IDE, a
real SQL sandbox, a branching sales scenario, or adaptive soft-skill mini-games — that AUCTOR
turns into a skill report covering technical skill, problem-solving, and soft skills, plus the
candidate's rank against others on the same track.

This is the product MVP (candidate game + employer dashboard + APIs). The public marketing site
is a separate project (`Auctor-Website`).

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS, dark navy/cyan theme matching the logo
- Framer Motion for the free-roam candidate game world
- Prisma + PostgreSQL (works locally and on Vercel with the same free Neon database)
- Monaco editor (`@monaco-editor/react`) for the coding IDE and SQL editor
- [Piston](https://github.com/engineer-man/piston) (free, public, no API key) for real code
  execution in the coding track
- sql.js (SQLite compiled to WebAssembly) for the real, sandboxed SQL database
- Anthropic Claude API for AI-generated skill report narratives and the coding station's help
  chat (optional — both fall back gracefully if no API key is set)
- Resend for the candidate results email (optional — skipped gracefully if no API key is set)

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

`ANTHROPIC_API_KEY` and `RESEND_API_KEY` are both optional locally — see `.env.example` for what
each one enables and what happens (gracefully) without them.

## How it works

1. An employer signs up, buys a package (simulated payment for MVP — grants credits instantly),
   picks an assessment track, and generates a shareable link.
2. The candidate opens `/play/[token]`, enters their name/email/9-digit ID, then plays the
   track in `/play/[token]/game` — a character walks a free-roam world and each station opens a
   themed challenge when reached.
3. On completion, AUCTOR scores the run (rule-based correctness + an AI-written explainability
   narrative), computes the candidate's rank against others on that company's same track, emails
   the candidate their result, deducts one credit, and the employer sees the full skill report on
   `/dashboard/candidates/[id]`.

### Tracks

| Track | Engine |
|---|---|
| Software Development | Real coding IDE (Monaco + Piston execution + AI help chat) |
| Database & Information Systems | Real SQL sandbox (sql.js), schema browser, data tasks |
| Sales & Business Development | Branching, multi-step negotiation/objection scenarios |
| Cybersecurity & IT Support | Mini-game stations (quiz, bug-hunt, sequencing, timed match) |
| Soft Skills Assessment | Adaptive difficulty decision games (gets harder as you do well) |

## Deploying (Vercel)

GitHub Pages **cannot** host this app — it only serves static files, and AUCTOR needs a live
server, database, and API routes. Vercel is the standard host for Next.js and deploys straight
from this GitHub repo:

1. Push this repo to GitHub (already done if you're reading this from there).
2. At [vercel.com](https://vercel.com), sign in with GitHub and import this repository as a new
   project. Vercel auto-detects Next.js — no config needed.
3. Before deploying, add environment variables in the Vercel project settings (same names as
   `.env.example`): `DATABASE_URL`, `SESSION_SECRET`, and optionally `ANTHROPIC_API_KEY` /
   `RESEND_API_KEY`.
4. Deploy. The build command (`prisma migrate deploy && next build`, already set in
   `package.json`) applies any pending database migrations automatically on every deploy.
5. Run `npm run seed` once locally with `DATABASE_URL` pointed at the production database (or
   temporarily paste the production connection string into your local `.env`) to seed tracks and
   a demo company — seeding isn't part of the build step since it should only run once.

## Project structure

- `src/app` — pages and API routes (App Router)
- `src/components/game` — the candidate-facing game world and station types
- `src/components/dashboard` / `src/components/ui` — employer dashboard UI
- `src/lib/tracks` — seeded assessment content per track
- `src/lib/scoring` — rule-based scorers (incl. the async Piston/sql.js scorers) + Claude AI
  narrative generator
- `src/lib/email.ts` — Resend results-email wrapper
- `prisma/schema.prisma` — data model
