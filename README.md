# EventGo

EventGo is a Next.js event planning platform that combines notes, planner/flowchart tools, themed suggestions, and AI-assisted interactions.

## Current code snapshot

- Functional app routes for planner, posts, events/themes, and recommendation pages.
- Authentication with NextAuth and multiple API routes.
- Flowchart/notes UI is feature-rich.
- AI endpoints currently use legacy completion patterns and need modernization.

## Serviceability roadmap

1. **Architecture cleanup:** remove dual app/pages overlap where possible and standardize data contracts.
2. **AI/API modernization:** migrate to current OpenAI API style, add request limits, and robust error handling.
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
- One auth provider: `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` **or** `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- `OPENAI_API_KEY` (AI recommendation endpoints)

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
