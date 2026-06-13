# Contributing to EventGo

Thanks for your interest in contributing! EventGo is an AI-powered event planning
workspace built with Next.js, MongoDB, and Google Gemini. This guide explains how we
work so your contribution lands smoothly.

## Code of Conduct

By participating you agree to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting started

```bash
git clone https://github.com/mstomar698/eventgo.git
cd eventgo
npm install
cp .env.example .env.local   # fill in the variables (see README)
npm run dev                  # http://localhost:3000
```

You need a MongoDB connection string, Google OAuth credentials, and a Gemini API key
to run the full app. See the [README](./README.md#required-environment-variables) for
the complete list.

## Development workflow

We follow a **PR-based workflow — no direct pushes to `main`.**

1. **Find or open an issue.** Browse [open issues](https://github.com/mstomar698/eventgo/issues).
   Issues labelled [`good first issue`](https://github.com/mstomar698/eventgo/labels/good%20first%20issue)
   are a great place to start. Comment to claim it.
2. **Branch** from `main` using a descriptive name:
   - `feat/<short-name>` — new feature
   - `fix/<short-name>` — bug fix
   - `chore/<short-name>` — tooling / maintenance
   - `docs/<short-name>` — documentation
   - `test/<short-name>` — tests
   - `refactor/<short-name>` — refactor
3. **Make your change.** Keep PRs focused — one logical change per PR.
4. **Run the quality gates locally** before pushing (see below).
5. **Open a PR** against `main`. Fill in the PR template and link the issue with
   `Closes #123`.
6. **CI must pass** and the PR must be reviewed before merge. We use **squash merge**
   to keep `main` history linear.

## Quality gates

Every PR must pass these — they run in CI and are enforced as required status checks:

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run build         # Production build (also typechecks)
```

Auto-fix locally with:

```bash
npm run lint:fix
npm run format
```

Pre-commit hooks (husky + lint-staged) run ESLint + Prettier on staged files, so most
issues are caught before you even commit.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add booking edit/delete endpoints
fix: debounce planner autosave to avoid write storms
docs: document the AI endpoint contract
test: add api-utils response envelope tests
chore: bump dependencies
```

## Coding standards

- **TypeScript** throughout (strict mode).
- **Zod** validation on every API input.
- **Standard response envelope** — API routes return `{ success, data?, error? }` via
  the helpers in `src/lib/api-utils.ts`.
- **Ownership checks** — data-owning routes must scope by `session.user.email`.
- **No `window.alert/confirm/prompt`** — use the Modal component.
- Secrets stay **server-side only**; never expose API keys to the client.
- Keep the theme **clean and accessible** — both light and dark modes must work.

## Reporting bugs & requesting features

Use the [issue templates](https://github.com/mstomar698/eventgo/issues/new/choose).
For security issues, **do not** open a public issue — see [SECURITY.md](./SECURITY.md).

## Project roadmap

The current roadmap lives in [`docs/implementation-status.md`](./docs/implementation-status.md)
and is tracked as `epic`-labelled issues. Pick up any unblocked task and go!
