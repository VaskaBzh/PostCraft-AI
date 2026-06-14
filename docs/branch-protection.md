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

## Commit Convention

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Enforced by `commitlint` via the pre-commit hook. Valid types: `feat`, `fix`, `docs`, `refactor`, `chore`, `ci`, `test`, `perf`.

## GitHub Setup

### Configuring Branch Rules (GitHub UI)

1. Go to **Settings → Branches** in your repository
2. Click **Add branch ruleset**

**For `main`:**

- Branch name pattern: `main`
- Enable **Require a pull request before merging** (approvals: 1)
- Enable **Require status checks to pass** — add: `Lint`, `Type check`, `Unit tests`, `E2E tests`, `Build`
- Enable **Require branches to be up to date before merging**
- Enable **Do not allow bypassing the above settings**

**For `develop`:**

- Branch name pattern: `develop`
- Enable **Require a pull request before merging**
- Enable **Require status checks to pass** — same checks as `main`
- Enable **Require branches to be up to date before merging**

### Required GitHub Secrets

Add in **Settings → Secrets and variables → Actions**:

| Secret              | Description           | Where to get                             |
| ------------------- | --------------------- | ---------------------------------------- |
| `ANTHROPIC_API_KEY` | Claude API key        | console.anthropic.com                    |
| `VERCEL_TOKEN`      | Vercel personal token | vercel.com/account/tokens                |
| `VERCEL_ORG_ID`     | Vercel team/user ID   | vercel.com/account → Settings            |
| `VERCEL_PROJECT_ID` | Vercel project ID     | vercel.com/\<team\>/\<project\>/settings |

To get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`, run once locally after linking the project:

```bash
npx vercel link
cat .vercel/project.json
# { "orgId": "...", "projectId": "..." }
```

## See Also

- [Contributing](../CONTRIBUTING.md) — full Git Flow workflow, PR guidelines, commit examples
- [Architecture](architecture.md) — project structure and conventions
