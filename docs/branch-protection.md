# Branch Protection Setup

Configure GitHub branch protection rules to enforce CI checks before merging.

## Branches to protect

- `main` — production; direct push forbidden
- `develop` — integration; CI must pass before merge

## Steps (GitHub UI)

1. Go to **Settings → Branches** in your repository
2. Click **Add branch ruleset** (or **Add classic rule** for classic protection)

### For `main`

- **Branch name pattern:** `main`
- Enable **Require a pull request before merging**
  - Require approvals: 1
- Enable **Require status checks to pass before merging**
  - Search and add these required checks:
    - `Lint`
    - `Type check`
    - `Unit tests`
    - `E2E tests`
    - `Build`
    - `Production Deploy`
- Enable **Require branches to be up to date before merging**
- Enable **Do not allow bypassing the above settings**

### For `develop`

- **Branch name pattern:** `develop`
- Enable **Require a pull request before merging**
- Enable **Require status checks to pass before merging**
  - Required checks:
    - `Lint`
    - `Type check`
    - `Unit tests`
    - `E2E tests`
    - `Build`
    - `Preview Deploy`
- Enable **Require branches to be up to date before merging**

## Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret              | Description                  | Where to get                             |
| ------------------- | ---------------------------- | ---------------------------------------- |
| `ANTHROPIC_API_KEY` | Claude API key               | console.anthropic.com                    |
| `VERCEL_TOKEN`      | Vercel personal access token | vercel.com/account/tokens                |
| `VERCEL_ORG_ID`     | Vercel team/user ID          | vercel.com/account → Settings            |
| `VERCEL_PROJECT_ID` | Vercel project ID            | vercel.com/\<team\>/\<project\>/settings |

## Getting Vercel IDs

Run once locally after linking the project:

```bash
npx vercel link
cat .vercel/project.json
# { "orgId": "...", "projectId": "..." }
```

Then add `orgId` as `VERCEL_ORG_ID` and `projectId` as `VERCEL_PROJECT_ID` in GitHub secrets.
