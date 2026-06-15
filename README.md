# EventGo

**EventGo** is a full-stack, AI-powered event planning workspace built with Next.js 16, MongoDB, Tailwind CSS, ReactFlow, and Google Gemini. It helps individuals and small teams plan events from concept to execution — designing themes, visual flowcharts, checklists, budgets, and real venue suggestions, then exporting everything in multiple formats.

### 🔗 Live demo: **[eventgo.vercel.app](https://eventgo.vercel.app)**

[![Live](https://img.shields.io/badge/demo-eventgo.vercel.app-14b8a6)](https://eventgo.vercel.app)
[![CI](https://github.com/mstomar698/eventgo/actions/workflows/ci.yml/badge.svg)](https://github.com/mstomar698/eventgo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> The public landing is open; the planning workspace is behind Google sign-in.
> New contributor? Start with **[CONTRIBUTING.md](./CONTRIBUTING.md)** and the
> **[good first issues](https://github.com/mstomar698/eventgo/labels/good%20first%20issue)**.
> For the full encyclopedia (architecture, every route, data models, AI details) see
> **[docs/README.md](./docs/README.md)**; for current status & roadmap see
> **[docs/implementation-status.md](./docs/implementation-status.md)**.

---

## What it does

| Feature                   | Description                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Theme Library**         | The single library of reusable event blueprints — colors, mood, activities, decor, music, food, budget, checklist, and timeline phases. Starter themes included. |
| **AI Studio**             | Four Gemini-powered surfaces: generate a full structured theme, 3-idea event suggestions, a planning Q&A research assistant, and venue recommendations.          |
| **Venue Recommendations** | Real nearby venues via the Foursquare Places API, ranked by a fit score (proximity + category), each with a "View on map" link. Falls back to AI text.           |
| **Visual Planner**        | ReactFlow canvas — add/edit/connect/resize nodes, lock the board, debounced autosave with a save-status indicator + conflict guard, export PNG/PDF/JSON/MD/TXT.  |
| **Notes & Calendar**      | Capture planning notes linked to dates. Month-view calendar shows notes and events. No timezone drift.                                                           |
| **Vendor Bookings**       | Track vendors from "to contact" through "confirmed" with quote, due date, and an optional linked event.                                                          |

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the variables below
npm run dev                   # http://localhost:3000
```

### Required environment variables

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash   # optional
FOURSQUARE_API_KEY=...          # optional — real venue data (else AI-text fallback)
UPSTASH_REDIS_REST_URL=...      # optional — shared rate-limit + cache store across instances
UPSTASH_REDIS_REST_TOKEN=...    # optional — (both falls back to per-instance memory if unset)
```

> **Deploying?** Env vars live in your host's dashboard, not in git (`.env*` is ignored).
> On Vercel, add them under **Project → Settings → Environment Variables**; changes apply on
> the next deployment. The optional keys above are inactive (with graceful fallback) until set.

---

## Key routes

| Route          | Access | Description                           |
| -------------- | ------ | ------------------------------------- |
| `/home`        | Public | Landing page, starter themes preview  |
| `/`            | Auth   | Workspace dashboard                   |
| `/themes`      | Auth   | Theme library (starter + your themes) |
| `/planner`     | Auth   | ReactFlow planning board              |
| `/posts`       | Auth   | Notes + calendar                      |
| `/bookings`    | Auth   | Vendor pipeline                       |
| `/themerecomm` | Auth   | AI Studio — Theme Ideation (default)  |
| `/eventrecomm` | Auth   | AI Studio — Event Ideas               |
| `/venuerecomm` | Auth   | AI Studio — Venue Recommendations     |
| `/info`        | Auth   | AI Studio — Research Assistant        |
| `/profile`     | Auth   | UI settings, delete data / account    |
| `/privacy`     | Public | Privacy policy                        |
| `/terms`       | Public | Terms of use                          |
| `/cookies`     | Public | Cookie policy                         |

---

## Tech stack

- **Framework**: Next.js 16 (App Router + Pages Router for API)
- **Database**: MongoDB via Mongoose
- **Auth**: NextAuth v4 — Google OAuth
- **AI**: Google Gemini API (shared client with timeout + retry + response cache)
- **Venues**: Foursquare Places API (optional, with rule-based/AI fallback)
- **Planner**: ReactFlow v11 with custom editable node types
- **Styling**: Tailwind CSS + CSS custom properties (light/dark themes)
- **Validation**: Zod
- **Tests**: Vitest (unit + route-handler integration), enforced in CI
- **Rate limiting / cache**: in-process by default, optional shared Upstash Redis store
- **Export**: html-to-image + jsPDF + Canvas API
- **Hosting**: Vercel ([eventgo.vercel.app](https://eventgo.vercel.app))

---

## Engineering standards

- Pre-commit hooks via **husky + lint-staged** run ESLint + Prettier on staged files
- TypeScript throughout (strict)
- Zod schema validation on all API inputs
- No `window.alert/confirm/prompt` — all dialogs use the Modal component

```bash
npm run lint        # ESLint check
npm run lint:fix    # Auto-fix
npm run format      # Prettier
npm run build       # Production build
```

---

## SEO & discoverability

- `/sitemap.xml` — auto-generated via `src/app/sitemap.ts`
- `/robots.txt` — allows public pages, blocks `/api/`, AI-crawler friendly
- `/llms.txt` — plain-text description for LLM crawlers
- Full OpenGraph + Twitter card metadata in `layout.tsx`

---

## Docs

See **[docs/README.md](./docs/README.md)** for the complete project encyclopedia including architecture diagram, every API endpoint, all data models, component documentation, AI prompt details, and the UI system.
