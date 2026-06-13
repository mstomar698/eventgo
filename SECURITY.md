# Security Policy

## Supported Versions

EventGo is under active development. Security fixes are applied to the `main` branch.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them privately via GitHub's
[private security advisory](https://github.com/mstomar698/eventgo/security/advisories/new)
feature. This lets us discuss and fix the issue before it is publicly disclosed.

When reporting, please include:

- A description of the vulnerability and its impact
- Steps to reproduce (proof-of-concept if possible)
- Affected routes/files and any relevant configuration

We aim to acknowledge reports within 72 hours and to provide a remediation timeline after
triage.

## Scope

Areas of particular interest:

- Authentication / authorization bypass (NextAuth, ownership checks on API routes)
- Exposure of secrets (API keys, tokens) to the client
- Injection via AI prompt inputs or unvalidated request bodies
- Rate-limiting / abuse of the Gemini-backed AI endpoints

## Good practices we follow

- All API inputs are validated with Zod.
- Data-owning routes are scoped by the authenticated session email.
- Secrets are read from server-side environment variables only and never shipped to the
  client bundle.
