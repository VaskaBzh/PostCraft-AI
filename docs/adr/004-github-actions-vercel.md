[← ADR Index](README.md)

# ADR-004: GitHub Actions + Vercel CI/CD Pipeline

**Date:** 2025-05-01
**Status:** Accepted

## Context

Before this decision, deployments were manual: a developer ran `vercel deploy` locally after verifying the build worked. This had three problems:

1. **No gate** — broken code could be deployed to production if the developer forgot to run tests
2. **No preview deploys** — reviewers had to check out PRs locally to see UI changes
3. **No auditability** — there was no record of what passed CI before each production deploy

## Decision

Implement a **5-job GitHub Actions pipeline** with Vercel deployment integration.

Pipeline structure (`.github/workflows/ci.yml`):

```
lint ──┐
       ├──► e2e ──► build
typecheck ─┘
unit ──────┘
```

- **lint**: ESLint on `src/`
- **typecheck**: `tsc --noEmit`
- **unit**: Vitest with coverage (≥80% threshold)
- **e2e**: Playwright on Chromium + Firefox + WebKit; depends on `unit` passing
- **build**: `next build`; depends on `lint`, `typecheck`, and `e2e` all passing

Vercel is configured to deploy automatically:

- **Preview deploy** on every PR (triggered by Vercel's GitHub integration)
- **Production deploy** on merge to `main`

Branch protection on `main` requires all five CI jobs to pass before merge is allowed.

## Consequences

**Better:**

- Broken builds and failing tests are blocked from reaching production
- Every PR gets a Vercel preview URL — reviewers can test UI changes without checking out locally
- CI run history provides a complete audit trail of what state the codebase was in at each deploy
- `build` job running `next build` catches any type errors or import issues that `tsc --noEmit` misses (e.g., dynamic imports, route config)

**Worse / constrained:**

- `ANTHROPIC_API_KEY` must be set as a GitHub Actions secret; E2E tests and the build job will fail without it
- Full pipeline takes ~4–6 minutes (Playwright browser install is cached but still slow on cold runners)
- Visual regression snapshots are browser/OS-specific — the Playwright cache key is tied to `package-lock.json`, so any dependency update invalidates it and triggers a full browser re-download
