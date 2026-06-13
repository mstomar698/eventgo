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

## Current state (verified against code, 2026-06-13)

| Area                        | Status | Notes                                                                                    |
| --------------------------- | :----: | ---------------------------------------------------------------------------------------- |
| API response contract       |   ✅   | `{ success, data?, error? }` via `src/lib/api-utils.ts`; security headers set.           |
| Zod validation              |   ✅   | Inputs validated via `src/lib/schemas.ts`.                                               |
| Auth (NextAuth + Google)    |   ✅   | `src/pages/api/auth/[...nextauth].ts`; data scoped by `session.user.email`.              |
| Ownership checks            |   ✅   | Audited (#31); IDOR reads + a cross-tenant delete bug fixed. All routes scoped.          |
| Data models                 |   ✅   | 8 Mongoose models with timestamps + `createdBy`.                                         |
| Planner persistence         |   🟡   | Autosave debounced + save indicator (#26); flows rate-limited (#30). No version guard.   |
| AI endpoints (Gemini)       |   🟡   | Shared client w/ timeout + retry (#29); rate-limited (#25). No response caching yet.     |
| Templates & themes          |   ✅   | Full CRUD + seeding + "use template" flow.                                               |
| Bookings                    |   ✅   | Full CRUD incl. edit/delete (#27), ownership-checked.                                    |
| Venue / nearby intelligence |   🟡   | Rule-based + AI text suggestions; no maps/places data, no geolocation.                   |
| Rate limiting               |   ✅   | AI (#25), CRUD writes (#28), flows (#30). In-memory — see note on shared store.          |
| Logging (pino)              |   🟡   | Configured; used on several endpoints, not yet uniform.                                  |
| Automated tests             |   🟡   | Vitest + 54 unit tests (#24, #25, #29); CI gate. No route-handler/integration tests yet. |
| OSS governance              |   ✅   | LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue/PR templates, labels.            |

## Roadmap epics

These map to `epic` issues. Status reflects work through PR #31.

1. **OSS readiness & contributor lifecycle** (#9) — ✅ governance/templates/CI/roadmap
   merged (#23). ⛔ _Blocked:_ branch protection needs the repo public or GitHub Pro.
2. **Test foundation** (#10) — ✅ Vitest + 54 unit tests + CI gate (#24). 🟡 route-handler
   integration tests remain (stretch).
3. **Security & abuse hardening** (#11) — ✅ rate limiting (#25/#28/#30) + ownership audit &
   IDOR/cross-tenant fixes (#31). 🟡 uniform logging. ⛔ _Blocked:_ shared rate-limit store
   (Redis/Upstash) needs infra provisioning for true multi-instance limits.
4. **Planner persistence hardening** (#12) — ✅ debounce + save indicator (#26). 🟡 optional
   version/`updatedAt` conflict guard (low value: one flow doc per user).
5. **Bookings completion** (#13) — ✅ edit/delete + ownership (#27). 🟡 optional booking↔event link.
6. **AI endpoint modernization** (#14) — ✅ shared client w/ timeout+retry (#29), input cap
   (Zod 1000-char). 🟡 response caching for idempotent calls; per-route token/latency logs.
7. **Venue/nearby intelligence** (#15) — 🟡 rule-based + AI text today. ⛔ _Blocked:_ real
   places data needs a maps/places provider choice + API key.
8. **Onboarding & template wizard polish** (#16) — ✅ starter themes surfaced on the
   authenticated home. 🟡 template surfacing + first-run empty-state guidance.

### Blocked on a maintainer decision (manual intervention)

- **Branch protection** (#9): make the repo public (the OSS-release goal) or enable GitHub Pro.
- **Maps/places provider** (#15): pick a provider (Google Places, Mapbox, etc.) + supply a
  server-side API key before venue intelligence can use real data.
- **Shared rate-limit store** (#11): provision Redis/Upstash for exact multi-instance limits
  on serverless (current in-memory limiter is best-effort per instance).

## How we work

PR-based, no direct pushes to `main`. CI (lint + format + build + route smoke) and a passing
review are required before merge. See [CONTRIBUTING.md](../CONTRIBUTING.md).
