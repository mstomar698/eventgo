# EventGo — Implementation Status & Roadmap

_Last reviewed: 2026-06-13 (after PRs #23–#31)_

This document is the single source of truth for what is **done**, what is **partial**, and
what is **remaining**. Each remaining workstream is tracked as an `epic`-labelled GitHub
issue with task issues underneath it. See the
[issues board](https://github.com/mstomar698/eventgo/issues).

## Legend

- ✅ **Done** — implemented and working in production.
- 🟡 **Partial** — works but has known gaps or hardening needed.
- ⛔ **Missing** — not started.

## Current state (verified against code, 2026-06-14)

| Area                        | Status | Notes                                                                                |
| --------------------------- | :----: | ------------------------------------------------------------------------------------ |
| API response contract       |   ✅   | `{ success, data?, error? }` via `src/lib/api-utils.ts`; security headers set.       |
| Zod validation              |   ✅   | Inputs validated via `src/lib/schemas.ts`.                                           |
| Auth (NextAuth + Google)    |   ✅   | `src/pages/api/auth/[...nextauth].ts`; data scoped by `session.user.email`.          |
| Ownership checks            |   ✅   | Audited (#31); IDOR reads + a cross-tenant delete bug fixed. All routes scoped.      |
| Data models                 |   ✅   | 8 Mongoose models with timestamps + `createdBy`.                                     |
| Planner persistence         |   ✅   | Debounced autosave + indicator (#26), flows limiter (#30), 409 conflict guard (#41). |
| AI endpoints (Gemini)       |   ✅   | Shared client w/ timeout + retry (#29); rate-limited (#25); response caching (#33).  |
| Templates & themes          |   ✅   | Full CRUD + seeding + "use template" flow; surfaced on home (#37).                   |
| Bookings                    |   ✅   | Full CRUD incl. edit/delete (#27) + event linking (#42); fixed broken create.        |
| Venue / nearby intelligence |   ✅   | Real Foursquare data (#35/#38), fit-scoring + map cards (#43); AI/rule fallback.     |
| Rate limiting               |   ✅   | AI (#25), CRUD writes (#28), flows (#30); optional shared Redis store (#39).         |
| Logging (pino)              |   ✅   | Uniform per-request logging on every route via `withApiLogging` (#34).               |
| Automated tests             |   ✅   | Vitest + 91 tests incl. route-handler integration (#24/#36/#41); CI gate.            |
| OSS governance              |   ✅   | LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue/PR templates, labels.        |

## Roadmap epics

All planned epics are addressed. The only open item is branch protection, which is deferred
pending the repo going public.

1. **OSS readiness & contributor lifecycle** (#9) — ✅ governance/templates/CI/roadmap (#23).
   ⛔ branch protection deferred (needs repo public or GitHub Pro).
2. **Test foundation** (#10) — ✅ Vitest + 91 tests + CI gate + route-handler integration tests.
3. **Security & abuse hardening** (#11) — ✅ rate limiting (#25/#28/#30), ownership audit +
   IDOR/cross-tenant fixes (#31), uniform logging (#34), optional shared Redis store (#39).
4. **Planner persistence hardening** (#12) — ✅ debounce + indicator (#26), 409 conflict guard (#41).
5. **Bookings completion** (#13) — ✅ edit/delete + ownership (#27), event linking + create fix (#42).
6. **AI endpoint modernization** (#14) — ✅ shared client w/ timeout+retry (#29), input cap,
   response caching (#33), per-request logging (#34).
7. **Venue/nearby intelligence** (#15) — ✅ Foursquare integration (#35/#38), fit-scoring + map
   cards (#43). Capacity/budget fit is limited by the data source (kept in the search query).
8. **Onboarding & template wizard polish** (#16) — ✅ themes + templates on home (#37), first-run
   guide (#44). Further refinements tracked as new issues.

### Optional / opt-in env activation (no code change needed)

- **`FOURSQUARE_API_KEY`** — real venue data (active in production).
- **`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`** — shared rate-limit + cache store
  across serverless instances (falls back to per-instance memory when unset).
- **Branch protection** (#9) — enable once the repo is public (the OSS-release goal) or on Pro.

## How we work

PR-based, no direct pushes to `main`. CI (lint + format + build + route smoke) and a passing
review are required before merge. See [CONTRIBUTING.md](../CONTRIBUTING.md).
