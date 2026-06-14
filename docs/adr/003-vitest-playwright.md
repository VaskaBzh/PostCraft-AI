[← ADR Index](README.md)

# ADR-003: Vitest + Playwright Testing Stack

**Date:** 2025-04-01
**Status:** Accepted

## Context

The project needed a testing setup that worked without friction alongside Next.js and TypeScript 6. The two common alternatives were:

**Jest + Cypress:**

- Jest requires Babel or `ts-jest` to handle ESM imports, which adds transform configuration that can diverge from the TypeScript compiler
- Cypress spins up a full browser but its component testing mode required an additional Webpack/Vite adapter
- Both tools have known cold-start latency in CI (~30–60s before the first test runs)

**Jest + Playwright:**

- Same Jest ESM friction as above
- Playwright itself is excellent for E2E, but pairing it with a slow unit runner did not resolve the DX problem

Neither combination integrated cleanly with the Next.js App Router's ESM module graph.

## Decision

Use **Vitest** for unit/component tests and **Playwright** for end-to-end tests.

- **Vitest** reuses the Vite transform pipeline (via `@vitejs/plugin-react`), understands ESM natively, and supports jsdom for React component rendering. No Babel, no `moduleNameMapper` hacks. Coverage is provided by `@vitest/coverage-v8` with an 80% threshold enforced in `vitest.config.ts`.
- **Playwright** runs real Chromium, Firefox, and WebKit. It supports API mocking via `page.route()`, visual regression snapshots, and parallel sharding in CI.

## Consequences

**Better:**

- Vitest cold-start is <1s on the dev machine; full unit suite runs in ~2s
- No Babel configuration — TypeScript is handled by the same esbuild pipeline as the app
- 80% coverage threshold catches regressions automatically in CI
- Playwright cross-browser tests surface rendering differences that jsdom cannot catch
- Visual regression snapshots (`e2e/visual/`) lock in layout correctness across browsers

**Worse / constrained:**

- `@vitejs/plugin-react` is a dev dependency even though the app uses Next.js (not Vite) in production — adds a small conceptual mismatch
- Playwright E2E tests require `ANTHROPIC_API_KEY` to be set even in CI, so the secret must be configured in GitHub Actions
- Visual snapshots must be regenerated (`--update-snapshots`) when the UI intentionally changes, which adds a manual step to visual-change PRs
