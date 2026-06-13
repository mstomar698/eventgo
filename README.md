# EventGo

**EventGo** is a full-stack AI-powered event planning workspace built with Next.js 14, MongoDB, Tailwind CSS, ReactFlow, and Google Gemini. It helps individuals and small teams plan events from concept to execution — creating themes, visual flowcharts, checklists, budgets, and exporting everything in multiple formats.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)

> For the full project encyclopedia (architecture, all routes, data models, components, AI details, UI system) see **[docs/README.md](./docs/README.md)**.

---

## What it does

| Feature              | Description                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Theme Library**    | Create event themes with colors, mood, activities, decor, music, food, budget, checklist, and timeline phases. Starter themes included.            |
| **AI Studio**        | Generate full themes from a text description (returns structured JSON). Also: 3-idea event suggestions and planning Q&A. Powered by Google Gemini. |
| **Visual Planner**   | ReactFlow canvas — add/edit/connect nodes, resize them, lock the board, export as PNG/PDF/JSON/Markdown/TXT.                                       |
| **Notes & Calendar** | Capture planning notes linked to dates. Month-view calendar shows notes and events. No timezone drift.                                             |
| **Vendor Bookings**  | Track vendors from "to contact" through "confirmed" with quote and due date.                                                                       |
| **Planning Themes**  | Structured planning templates with timeline phases, budget categories, vendor needs, checklist.                                                    |

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
FOURSQUARE_API_KEY=...          # optional — enables real venue data (else AI-text fallback)
```

---

## Key routes

| Route          | Access | Description                           |
| -------------- | ------ | ------------------------------------- |
| `/home`        | Public | Landing page, starter themes preview  |
| `/`            | Auth   | Workspace dashboard                   |
| `/themes`      | Auth   | Theme library (starter + your themes) |
| `/templates`   | Auth   | Planning themes                       |
| `/planner`     | Auth   | ReactFlow planning board              |
| `/posts`       | Auth   | Notes + calendar                      |
| `/bookings`    | Auth   | Vendor pipeline                       |
| `/themerecomm` | Auth   | AI Studio — Theme Ideation (default)  |
| `/eventrecomm` | Auth   | AI Studio — Event Ideas               |
| `/info`        | Auth   | AI Studio — Research Assistant        |
| `/profile`     | Auth   | UI settings, delete data / account    |
| `/privacy`     | Public | Privacy policy                        |
| `/terms`       | Public | Terms of use                          |
| `/cookies`     | Public | Cookie policy                         |

---

## Tech stack

- **Framework**: Next.js 14 (App Router + Pages Router for API)
- **Database**: MongoDB via Mongoose
- **Auth**: NextAuth v4 — Google OAuth
- **AI**: Google Gemini API (`gemini-2.0-flash`)
- **Planner**: ReactFlow v11 with custom editable node types
- **Styling**: Tailwind CSS + CSS custom properties (dark/light themes)
- **Validation**: Zod
- **Export**: html-to-image + jsPDF + Canvas API

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
