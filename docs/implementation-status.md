# EventGo — Implementation Status & Roadmap

_Last reviewed: 2026-06-13_

This document is the single source of truth for what is **done**, what is **partial**, and
what is **remaining**. Each remaining workstream is tracked as an `epic`-labelled GitHub
issue with task issues underneath it. See the
[issues board](https://github.com/mstomar698/eventgo/issues).

## Legend

- ✅ **Done** — implemented and working in production.
- 🟡 **Partial** — works but has known gaps or hardening needed.
- ⛔ **Missing** — not started.

## Current state (verified against code, 2026-06-13)

| Area                        | Status | Notes                                                                                    |
| --------------------------- | :----: | ---------------------------------------------------------------------------------------- |
| API response contract       |   ✅   | `{ success, data?, error? }` via `src/lib/api-utils.ts`; security headers set.           |
| Zod validation              |   ✅   | Inputs validated via `src/lib/schemas.ts`.                                               |
| Auth (NextAuth + Google)    |   ✅   | `src/pages/api/auth/[...nextauth].ts`; data scoped by `session.user.email`.              |
| Ownership checks            |   ✅   | Enforced on themes, templates, events, posts CRUD.                                       |
| Data models                 |   ✅   | 8 Mongoose models with timestamps + `createdBy`.                                         |
| Planner persistence         |   🟡   | Autosave works but fires on every change (no debounce), last-write-wins, no conflict UX. |
| AI endpoints (Gemini)       |   🟡   | 3 endpoints work; direct passthrough, no rate limit, inconsistent retry, no cost guard.  |
| Templates & themes          |   ✅   | Full CRUD + seeding + "use template" flow.                                               |
| Bookings                    |   🟡   | POST/GET + status tracking; **no edit/delete** API yet.                                  |
| Venue / nearby intelligence |   🟡   | Rule-based + AI text suggestions; no maps/places data, no geolocation.                   |
| Rate limiting               |   🟡   | Limiters defined in `src/lib/rate-limit.ts` but **applied to zero routes**.              |
| Logging (pino)              |   🟡   | Configured; used on only a few endpoints.                                                |
| Automated tests             |   ⛔   | No test runner, zero tests.                                                              |
| OSS governance              |   ✅   | LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue/PR templates.                    |

## Roadmap epics

These map to `epic` issues. Order reflects priority for the OSS release.

1. **OSS readiness & contributor lifecycle** — governance docs, issue/PR templates, branch
   protection, accurate roadmap. _(this change set)_
2. **Test foundation** — pick a runner (Vitest), test `api-utils`/`schemas`/`suggestions`,
   add a CI test gate. Unblocks confident contribution.
3. **Security & abuse hardening** — apply the existing rate limiters to AI + write routes,
   audit ownership checks, expand structured logging.
4. **Planner persistence hardening** — debounce autosave, save status indicator,
   last-write-wins safety / version field.
5. **Bookings completion** — edit/delete API + UI, link bookings to events.
6. **AI endpoint modernization** — consistent retry/timeout, input size limits, response
   caching/cost controls, shared client.
7. **Venue/nearby intelligence** — real places data source, fit scoring, map surface.
8. **Onboarding & template wizard polish** — guided first-run, template surfacing on the
   authenticated home.

## How we work

PR-based, no direct pushes to `main`. CI (lint + format + build + route smoke) and a passing
review are required before merge. See [CONTRIBUTING.md](../CONTRIBUTING.md).
