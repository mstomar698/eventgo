# EventGo

EventGo is a Next.js event planning platform that combines planning boards, notes + calendar workflows, reusable themes, and AI-assisted ideation.

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

Required env for full API flow:

- `MONGODB_URI` (planner/posts/themes/events persistence)
- `NEXTAUTH_SECRET`
- Google auth: `GOOGLE_ID` + `GOOGLE_SECRET` (or `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`)
- `GEMINI_API_KEY` (AI recommendation endpoints)

## Route behavior

- `/home` is the public marketing/product overview route.
- `/` is the authenticated workspace root.
- Unauthenticated users hitting `/` are redirected to `/home`.

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
