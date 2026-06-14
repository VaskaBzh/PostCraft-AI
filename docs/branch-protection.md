[Back to README](../README.md)

# Branch Protection

## Branching Model

PostCraft follows **Git Flow**. `develop` is the integration branch; `main` contains only stable, CI-verified releases.

```
main       ←── hotfix/*
  ↑              ↑
  └── release/* ─┘
           ↑
        develop  ←── feature/*
                 ←── fix/*
```

## Protected Branches

### `main`

- Direct pushes are blocked — all changes must come through a PR
- All CI jobs must pass before merge:
  - **Lint** — ESLint on `src/`
  - **Type check** — `tsc --noEmit`
  - **Unit tests** — Vitest with ≥80% coverage threshold
  - **E2E tests** — Playwright (Chromium, Firefox, WebKit)
  - **Build** — `next build` must succeed
- At least one approving review required

### `develop`

- PRs are required (direct push is discouraged)
- All CI jobs must pass (same pipeline as `main`)
- Merge strategy: squash or merge commit (no rebase merge to preserve history)

## Branch Naming

| Type    | Pattern             | Base      | Merges into        |
| ------- | ------------------- | --------- | ------------------ |
| Feature | `feature/<slug>`    | `develop` | `develop`          |
| Bug fix | `fix/<slug>`        | `develop` | `develop`          |
| Release | `release/<version>` | `develop` | `main` + `develop` |
| Hotfix  | `hotfix/<slug>`     | `main`    | `main` + `develop` |

## CI Pipeline (`.github/workflows/ci.yml`)

The pipeline runs on every push to `main`/`develop` and on every PR targeting those branches.

```
lint ─────────────────────────┐
typecheck ────────────────────┼──► build
unit ──────► e2e ─────────────┘
```

Job dependencies:

- `e2e` waits for `unit` to pass
- `build` waits for `lint`, `typecheck`, and `e2e` to pass

The `ANTHROPIC_API_KEY` secret is required for `e2e` and `build` jobs. It must be set in the repository's **Settings → Secrets and variables → Actions**.

## Commit Convention

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Enforced by `commitlint` via the pre-commit hook. Valid types: `feat`, `fix`, `docs`, `refactor`, `chore`, `ci`, `test`, `perf`.

## See Also

- [Contributing](../CONTRIBUTING.md) — full Git Flow workflow, PR guidelines, commit examples
- [Architecture](architecture.md) — project structure and conventions
