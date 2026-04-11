# EventGo

EventGo is a Next.js event planning platform that combines planning boards, notes + calendar workflows, reusable themes, and AI-assisted ideation.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)

EventGo is aimed at small teams and independent planners who need a lightweight, repeatable planning workflow with optional AI-assisted ideation.

## Current code snapshot

- App-router driven workspace with authenticated dashboard at `/`.
- Public product landing route at `/home`.
- Google-authenticated experience via NextAuth.
- Gemini-backed AI endpoints for development/testing flows.

## Serviceability roadmap

1. **Architecture cleanup:** continue route/component consolidation and stabilize domain contracts.
2. **AI/API modernization:** add model routing, request controls, and deterministic fallbacks around Gemini.
3. **Collaboration features:** shared event boards, comments, and team invitations.
4. **Commercial readiness:** organization plans, template packs, and audit logs.

## Client-ready enhancement scope

- Event budget planner with vendor comparison workflow.
- Task dependency and timeline automation.
- Export packs (PDF brief + schedule + assets).
- Integrations (calendar, email, Slack/Teams).

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
npm run build
```

Quick verification I ran locally (build + start):

```bash
# from repository root
cd eventgo
npm install
npm run build
npm run start # serves at http://localhost:3000
```

Required env for full API flow:

- `MONGODB_URI` (planner/posts/themes/events persistence)
- `NEXTAUTH_SECRET`
- Google auth: `GOOGLE_ID` + `GOOGLE_SECRET` (or `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`)
- `GEMINI_API_KEY` (AI recommendation endpoints)

## Continuous integration

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on pushes and PRs to `main`.

- Steps: install, lint, build, and basic route checks against a locally started Next.js server.
- To run the same checks locally, from the `eventgo` directory run:

```bash
npm ci
npm run lint
npm run build
# start the production server in background for the checks
npm run start &
sleep 2
# then curl key routes to verify they return 2xx/3xx
curl -I http://localhost:3000/home
curl -I http://localhost:3000/templates
curl -I http://localhost:3000/posts
kill %1 || true
```

CI will fail if any monitored route returns a non-2xx/3xx status.

## Route behavior

- `/home` is the public marketing/product overview route.
- `/` is the authenticated workspace root.
- Unauthenticated users hitting `/` are redirected to `/home`.

Build & runtime verification: production build and basic route checks were performed and key routes return HTTP 200 for `/home`, `/posts`, `/templates`, `/profile` (local verification).

## Engineering standards

- Next.js app-router is the primary UI structure (`src/app`), while `src/pages` is reserved for API routes.
- Pre-commit quality gate is enabled via **husky + lint-staged**.
- Pull requests run CI checks for lint, formatting, and build.

Useful scripts:

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Detailed execution plan

See [plan.md](./plan.md) for phased tasks.
