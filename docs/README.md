# EventGo — Project Encyclopedia

EventGo is a full-stack event planning workspace built with **Next.js 14 (App Router)**, **MongoDB/Mongoose**, **NextAuth (Google OAuth)**, **Tailwind CSS**, and **Google Gemini AI**. It helps individuals and small teams plan events from concept to execution — creating themes, timelines, budgets, and visual flowcharts.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Pages & Routes](#pages--routes)
4. [API Routes](#api-routes)
5. [Data Models](#data-models)
6. [Key Components](#key-components)
7. [AI Integration](#ai-integration)
8. [Auth & Sessions](#auth--sessions)
9. [UI System](#ui-system)
10. [Export System (Planner)](#export-system-planner)
11. [Environment Variables](#environment-variables)
12. [Running Locally](#running-locally)

---

## Tech Stack

| Layer        | Technology                                          |
| ------------ | --------------------------------------------------- |
| Framework    | Next.js 14 (App Router + Pages Router hybrid)       |
| Language     | TypeScript                                          |
| Database     | MongoDB via Mongoose                                |
| Auth         | NextAuth v4 with Google OAuth                       |
| Styling      | Tailwind CSS with CSS custom properties for theming |
| AI           | Google Gemini API (`gemini-2.0-flash`)              |
| Planner      | ReactFlow v11 with custom node types                |
| Image export | html-to-image + jsPDF                               |
| PDF export   | jsPDF                                               |
| Validation   | Zod                                                 |
| HTTP client  | http-react (useFetch with base URL `/api`)          |

---

## Architecture Overview

```
src/
├── app/                  # Next.js App Router pages + API-less routes
│   ├── layout.tsx        # Root layout: providers, metadata, favicon
│   ├── page.tsx          # Workspace root (authenticated home)
│   ├── home/             # Public landing page (/home)
│   ├── themes/           # Theme library (list, create, edit, view)
│   ├── templates/        # Planning themes list + create + use
│   ├── planner/          # ReactFlow planning board
│   ├── posts/            # Notes + calendar (/posts)
│   ├── bookings/         # Vendor booking pipeline
│   ├── eventrecomm/      # AI Studio — Event Ideas
│   ├── themerecomm/      # AI Studio — Theme Ideation (default)
│   ├── info/             # AI Studio — Research Assistant
│   ├── venuerecomm/      # AI Studio — Venue suggestions
│   ├── profile/          # Profile settings + data deletion
│   ├── privacy/          # Privacy policy (static)
│   ├── terms/            # Terms of use (static)
│   └── cookies/          # Cookie policy (static)
│
├── pages/api/            # Next.js Pages Router API routes
│   ├── auth/[...nextauth].ts  # NextAuth handler
│   ├── themes/           # CRUD for Theme model
│   ├── templates/        # CRUD for EventTemplate model
│   ├── posts/            # CRUD for Post (notes) model
│   ├── events/           # CRUD for calendar Event model
│   ├── bookings/         # CRUD for Booking model
│   ├── flows/            # Save/load planner flow (nodes + edges)
│   ├── chatgpt/          # AI: Research Assistant
│   ├── chatgpt2/         # AI: Event Ideas (structured 3-idea format)
│   ├── chatgpt3/         # AI: Theme Ideation (returns JSON theme)
│   ├── account/          # DELETE: user data + account
│   └── theme/            # Theme search by title
│
├── components/
│   ├── ai/query-workspace.tsx   # Shared AI Studio UI component
│   ├── footer/footer.tsx        # Footer with legal links
│   ├── homepage/index.tsx       # Authenticated workspace home
│   ├── layout/app-shell.tsx     # Authenticated page shell (navbar + footer)
│   └── navbar/navbar.tsx        # Top nav with auth state
│
├── features/
│   ├── auth/sign-in-required.tsx
│   ├── planner/
│   │   ├── calendar.tsx         # Custom month-view calendar
│   │   └── flowchart.tsx        # ReactFlow planner board
│   └── settings/ui-settings-provider.tsx  # Theme/font context
│
└── lib/
    ├── models/            # Mongoose models (theme, template, post, event, booking, flow)
    ├── schemas.ts         # Zod validation schemas
    ├── templates.ts       # Starter theme/template seed data
    ├── starter-themes.ts  # Starter themes seed data
    ├── gemini.ts          # Gemini API wrapper
    └── mongodb.ts         # DB connection helper
```

---

## Pages & Routes

### Public (no auth required)

| Route      | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
| `/home`    | Landing page — product overview, starter themes preview, how it works |
| `/privacy` | Privacy policy                                                        |
| `/terms`   | Terms of use                                                          |
| `/cookies` | Cookie policy                                                         |

### Authenticated (requires Google sign-in)

| Route                    | Description                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `/`                      | Workspace home — quick links, AI studio cards, starter themes                                                               |
| `/themes`                | Theme library — Starter Themes (seeded) + Your Themes (user-created)                                                        |
| `/themes/create`         | Create a new theme (all fields: title, occasion, colors, mood, activities, decor, music, food, budget, checklist, timeline) |
| `/themes/[id]/view`      | Full read-only view of a theme; "Save as My Theme" copies starter themes                                                    |
| `/themes/[id]/edit`      | Edit all fields of a user-owned theme                                                                                       |
| `/templates`             | Planning themes — Starter Themes + My Themes                                                                                |
| `/templates/create`      | Create a planning theme (same fields + vendor needs, budget categories)                                                     |
| `/templates/[id]/use`    | Use a planning theme: fill event basics, view checklist/timeline/budget, "Save as My Event"                                 |
| `/planner`               | ReactFlow planning board — add/edit/connect nodes, export PNG/PDF/JSON/MD/TXT                                               |
| `/planner?theme=[id]`    | Opens planner pre-loaded with theme nodes                                                                                   |
| `/planner?template=[id]` | Opens planner pre-loaded with template nodes                                                                                |
| `/posts`                 | Notes workspace + month-view calendar                                                                                       |
| `/bookings`              | Vendor booking pipeline (to_contact → confirmed)                                                                            |
| `/themerecomm`           | AI Studio: Theme Ideation — generates full theme JSON from description                                                      |
| `/eventrecomm`           | AI Studio: Event Ideas — 3 structured event suggestions                                                                     |
| `/info`                  | AI Studio: Research Assistant — expert planning Q&A                                                                         |
| `/venuerecomm`           | AI Studio: Venue suggestions                                                                                                |
| `/profile`               | UI settings (dark/light, font), data deletion, account deletion                                                             |

---

## API Routes

All under `src/pages/api/`. Auth uses `getServerSession(req, res, authOptions)`.

| Endpoint                  | Methods                            | Description                                                                          |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| `/api/themes`             | GET, POST, PUT(?id=), DELETE(?id=) | Theme CRUD; GET seeds starter themes if DB is empty                                  |
| `/api/templates`          | GET, POST                          | List (with user filter) + create; seeds starter themes if empty                      |
| `/api/templates/[id]`     | GET, PUT, DELETE                   | Get detail, update, delete (ownership check)                                         |
| `/api/posts`              | GET, POST, PATCH, DELETE(?id=)     | Notes CRUD                                                                           |
| `/api/events`             | GET, POST, DELETE(?id=)            | Calendar events CRUD                                                                 |
| `/api/bookings`           | GET, POST                          | Vendor bookings list + create                                                        |
| `/api/flows`              | GET, POST                          | Save/load the current planner board (nodes + edges) per session                      |
| `/api/account`            | DELETE                             | Deletes user's templates + non-public themes; sign-out handled client-side           |
| `/api/chatgpt`            | GET(?query=)                       | Research assistant — structured text response                                        |
| `/api/chatgpt2`           | GET(?query=)                       | Event ideas — 3 ideas with Name/Format/Activities/Budget                             |
| `/api/chatgpt3`           | GET(?query=)                       | Theme ideation — returns `{ recommendation, theme }` where `theme` is validated JSON |
| `/api/auth/[...nextauth]` | —                                  | NextAuth Google OAuth handler                                                        |

---

## Data Models

### Theme (`src/lib/models/theme.ts`)

```ts
{
  title: string (unique)
  date: Date
  description?: string
  occasion?: 'birthday'|'wedding'|'corporate'|'community'|'other'
  mood?: string[]
  colorPalette?: string[]      // hex colors
  events?: string[]            // activities
  decor?: string[]
  music?: string[]
  food?: string[]
  budgetEstimate?: number
  budgetNotes?: string
  checklist?: string[]
  timeline?: { phase, daysBefore, tasks[] }[]
  isPublic?: boolean           // true = starter/seeded theme
}
```

### EventTemplate (`src/lib/models/template.ts`)

```ts
{
  name: string
  category: string
  description: string
  headcount: number
  colorPalette: string[]
  mood: string[]
  activities: string[]
  decor: string[]
  music: string[]
  food: string[]
  checklist: string[]
  timeline: { phase, daysBefore, tasks[] }[]
  budgetCategories: { category, estimatedAmount, notes }[]
  vendorNeeds: string[]
  nearbyConsiderations: string[]
  communicationPlan: string[]
  createdBy?: string           // user email
  isPublic: boolean
  createdAt: Date
}
```

### Post/Note (`src/lib/models/post.ts`)

```ts
{ title: string, date: string, content: string }
```

### Event (Calendar) (`src/lib/models/event.ts` or inline)

```ts
{ title: string, start: Date, end: Date, color?: string }
```

### Booking (`src/lib/models/booking.ts`)

```ts
{
  vendorName: string
  status: 'to_contact'|'contacted'|'quoted'|'confirmed'|'cancelled'
  quote?: number
  dueDate?: Date
  notes: string
}
```

### Flow (Planner board) — stored as one document per session

```ts
{ nodes: ReactFlowNode[], edges: ReactFlowEdge[] }
```

---

## Key Components

### `QueryWorkspace` (`src/components/ai/query-workspace.tsx`)

Shared AI Studio UI. Props:

- `endpoint` — which API to call
- `mode: 'theme' | 'text'` — `theme` mode renders a structured preview card with "Save as My Theme" button; `text` mode renders plain response
- `examples` — clickable prompt chips shown before first query
- `responseKey` — which key to extract from response JSON

### `Flowchart` (`src/features/planner/flowchart.tsx`)

ReactFlow-based planning board. Features:

- Auto-saves to `/api/flows` after every change (guarded by `loadedRef` to prevent overwriting on mount)
- Loads from URL params `?theme=id` or `?template=id` — generates 2-column grid of nodes
- All node types are editable (controlled textarea/input)
- Lock mode (Controls button) disables all inputs via `useStore(s => !s.nodesDraggable)`
- Export: PNG, PDF (jsPDF), JSON, Markdown, TXT — all timestamped
- Fullscreen toggle via Fullscreen API

### Custom Node Types (nodes.js)

| Type                            | Description                                     |
| ------------------------------- | ----------------------------------------------- |
| `default` → `EditableNode`      | Standard node with textarea, handles top+bottom |
| `input` → `EditableInputNode`   | Accent-bordered start node, handle bottom only  |
| `output` → `EditableOutputNode` | Strong-accent border end node, handle top only  |
| `textUpdater`                   | "Theme" labelled input node                     |
| `nodesad`                       | "Details" textarea node                         |
| `nodetext`                      | Simple text input with both handles             |
| `textstrip`                     | Accent-colored text strip                       |
| `imageNode`                     | Image upload (<250KB) + caption                 |

### `CalendarPage` (`src/features/planner/calendar.tsx`)

Custom month-view calendar. Uses local date strings (no timezone drift). Shows notes and events as colored dots. Click empty date → Add event modal; click date with items → Detail modal.

---

## AI Integration

Three Gemini endpoints, each with a distinct system prompt:

| Endpoint   | Prompt style                                        | Response                                                       |
| ---------- | --------------------------------------------------- | -------------------------------------------------------------- |
| `chatgpt3` | Requests compact JSON theme object                  | `{ recommendation: textSummary, theme: validatedThemeObject }` |
| `chatgpt2` | Requests 3 ideas with Name/Format/Activities/Budget | Formatted text                                                 |
| `chatgpt`  | Answer + Key points + Watch out for                 | Formatted text                                                 |

**Theme JSON generation** (`chatgpt3`): Gemini response is parsed by `extractJson()` which tries direct parse → strip markdown fences → regex `{...}` extraction. `buildTheme()` validates every field and fills defaults (invalid occasion → `'other'`, missing colors → default palette, non-arrays → `[]`).

---

## Auth & Sessions

- Google OAuth via NextAuth. Session contains `user.email`, `user.name`, `user.image`.
- All authenticated API routes call `getServerSession(req, res, authOptions)`.
- `useFetch` from http-react uses `FetchConfig baseUrl="/api"` — raw `fetch()` calls must use full `/api/...` paths.
- UI settings (dark/light, font) stored in `localStorage` under key `eventgo-ui-settings`.

---

## UI System

CSS custom properties defined in `globals.css`:

| Variable              | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `--app-bg`            | Page background                                |
| `--app-surface`       | Card / section background                      |
| `--app-elevated`      | Slightly elevated panels                       |
| `--app-text`          | Primary text                                   |
| `--app-muted`         | Secondary / muted text                         |
| `--app-border`        | Border color                                   |
| `--app-accent`        | Teal accent (`#5eead4` dark / `#0f766e` light) |
| `--app-accent-strong` | Button fill accent                             |
| `--app-font-size`     | Controlled by `data-font-scale` on `<html>`    |
| `--app-font-family`   | Controlled by `data-font-family` on `<html>`   |

Three font scales: `sm=14px`, `md=16px`, `lg=18px` — applied to `:root` so all `rem`-based Tailwind utilities scale.

---

## Export System (Planner)

The export pipeline in `flowchart.tsx`:

1. **PNG/PDF**: `toCanvas` from html-to-image captures node HTML → Canvas API draws bezier edges on top (SVG edges don't survive html-to-image's foreignObject rendering) → PNG data URL → jsPDF for PDF
2. **JSON**: `JSON.stringify({ nodes, edges })`
3. **Markdown**: input nodes → `##`, regular → `###` + bullets, output → `---` + `## ✅`
4. **TXT**: numbered flat list

All filenames include an ISO timestamp (`eventgo-plan-2026-05-14T10-30-00.png`).

---

## Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash   # optional, defaults to gemini-2.0-flash
```

---

## Running Locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint + Prettier check
```

Pre-commit hooks run ESLint + Prettier automatically on staged files.
