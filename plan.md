# EventGo Detailed Plan

## Product north star

Build EventGo into a practical, end-to-end event planning product that covers the full workflow:
**brief -> suggestions -> theme -> venue/nearby options -> schedule -> budget -> booking tracker -> day-of runbook -> post-event summary**.

## Progress checkpoint

- ✅ Baseline run completed (dependency/install, lint command operational, build operational).
- ✅ Initial env/auth hardening applied.
- ✅ Routing consolidation completed (App Router pages now import from `src/features`, `src/pages` is API-only).
- ✅ Global profile settings added for theme + font scale toggles.
- ✅ OSS quality baseline added (ESLint flat config, Prettier, Husky pre-commit, PR quality workflow, Dependabot).
- ✅ UI/UX redesign applied with professional app shell, marketing `/home`, and authenticated workspace dashboard.
- ✅ Auth flow updated to Google-only login for the current phase (`/home` public, `/` workspace redirect flow for unauthenticated users).
- ✅ AI dev/testing path switched to Gemini-backed routes (`/api/chatgpt*` now use Gemini).
- ✅ Data API error handling improved to surface actionable configuration issues.
- ⚠️ Stability smoke test results:
  - App routes are healthy (`/`, `/planner`, `/posts`, `/themes`, `/eventrecomm`, `/themerecomm`, `/info`, `/profile` all return 200).
  - API routes requiring DB config currently fail if `MONGODB_URI` is malformed (detected and surfaced with explicit guidance).
- ⏭️ Next active priorities: API/data contracts, then AI endpoint modernization.

## Target outcomes

1. A user can plan a real event without leaving the product.
2. Suggestions are useful for both first-time and experienced planners.
3. AI is cost-aware: free/low-cost where possible, premium only for high-complexity tasks.
4. Starter templates exist for birthdays and small community events (**<20 attendees**).

## AI usage strategy (cost-aware)

1. **Deterministic + rule engine first** for calculations/checklists/budget splits/timelines.
2. **Free AI tier** for lightweight tasks (copy rewriting, simple idea generation, short recommendations).
3. **Premium AI tier** only for higher-value reasoning (complex trade-offs, full event narratives, deep optimization).
4. Add caching, prompt templates, and graceful fallback between tiers.

## End-to-end event planning flow (product modules)

1. **Event brief intake**
   - Event type, headcount, city/area, budget, date flexibility, preferences, constraints.
2. **Theme and concept suggestions**
   - Theme options, activity packs, mood/style boards, decor suggestions.
3. **Venue and nearby area recommendations**
   - Suggested venue types, nearby services (parking, food, transport, emergency points), locality suitability.
4. **Schedule and task planner**
   - Timeline builder, flowchart/run-of-show, owner assignment, dependency tracking.
5. **Vendor and booking tracker**
   - Shortlist, status (to contact/quoted/confirmed), notes, due dates, fallback options.
6. **Budget and procurement**
   - Category-level budget allocation, expected vs actual, overrun warnings, cost-saving alternatives.
7. **Guest and communication layer**
   - Invite list import, RSVP state, reminders, shareable plan view.
8. **Day-of execution cockpit**
   - Time-block checklist, issue log, plan-B quick actions.
9. **Post-event wrap-up**
   - Spend summary, what worked/failed, reusable template generation.

## Starter template pack (must-have)

1. **Birthday at home (<20 people)**
2. **Birthday at cafe/restaurant (<20 people)**
3. **Small community meetup (<20 people)**
4. **Neighborhood workshop/book-club (<20 people)**

Each template should include default:

- checklist,
- timeline,
- budget categories,
- vendor needs,
- nearby-area considerations,
- communication plan.

## Engineering phases

### Phase 0 - Baseline and safety

1. Run lint/build baseline and map breakpoints.
2. Consolidate app/pages routing overlaps.
3. Centralize environment and auth configuration.

### Phase 1 - Unified domain model

1. Define canonical schemas for Event, Theme, Task, VenueOption, Vendor, BudgetItem, Guest.
2. Standardize API contracts and validation.
3. Version API responses and error model.

### Phase 2 - Planner core stabilization

1. Reliable persistence for planner flow + notes + themes + events.
2. Autosave and conflict-safe update behavior.
3. Robust CRUD with ownership and auth checks.

### Phase 3 - Suggestion engine

1. Rule-based recommendation service for quick wins.
2. AI orchestration layer with free-tier first and premium escalation.
3. Prompt libraries for event type, budget, and attendee-size specific outputs.

### Phase 4 - Venue and nearby intelligence

1. Nearby area scoring (travel/access/utility).
2. Venue shortlist generation with fit explanation.
3. Backup options when preferred constraints are not satisfied.

### Phase 5 - Template library and guided setup

1. Launch starter templates for birthdays/community events.
2. “Plan-from-template” wizard with editable defaults.
3. Save as reusable personal/team template.

### Phase 6 - Booking and execution operations

1. Vendor/booking pipeline with status transitions.
2. Day-of runbook and live status dashboard.
3. Export pack (brief, checklist, schedule, budget summary).

### Phase 7 - Production readiness

1. Observability, retries, and rate limiting.
2. Security hardening and permission model.
3. Cost monitoring and AI usage controls.

## Immediate implementation order

1. Baseline health check and blocker list.
2. Env/auth hardening.
3. Routing consolidation.
4. API contract standardization.
5. AI endpoint modernization.
6. Planner persistence stabilization.
7. Template pack (birthday/community <20) rollout.
