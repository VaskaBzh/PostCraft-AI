[← ADR Index](README.md)

# ADR-002: Feature-based Folder Structure (FSD-inspired)

**Date:** 2025-01-01
**Status:** Accepted

## Context

The initial project layout placed all React components in a flat `src/components/` folder:

```
src/components/
├── ChatInterface.tsx
├── ChatInput.tsx
├── MessageBubble.tsx
├── Sidebar.tsx
├── ApiKeySetup.tsx
└── PostCraftApp.tsx
```

As the number of components grew, the folder became a mix of concerns: UI primitives, full-page layouts, domain logic wrappers, and entry-point orchestrators were all at the same level. Navigating to the right component required reading every filename rather than following a structure that communicated intent.

## Decision

Adopt a **Feature-Sliced Design (FSD)-inspired** structure adapted for Next.js App Router conventions:

```
app/                        # Next.js routing layer
├── layout.tsx
├── page.tsx
└── api/generate/route.ts   # server boundary

src/
├── components/             # shared UI components
├── hooks/                  # application logic (one hook per concern)
├── store/                  # global state (Zustand)
└── types/                  # domain types (no imports from src)
```

The key constraint is a **strict dependency direction**: `components → hooks → store → types`. No layer imports from a layer above it.

## Consequences

**Better:**

- The folder name communicates the layer's responsibility
- Dependency violations are immediately visible — an import going "upward" is a code smell
- Adding a new platform or tone requires changes only in `types/` and `store/`, not scattered across components
- Easier to identify where a bug lives: UI glitch → `components/`, state issue → `store/`, API error → `hooks/` or Route Handler

**Worse / constrained:**

- The structure is not enforced by tooling (no ESLint import boundary rules) — it relies on developer discipline
- For very large feature sets, a per-feature subdirectory (e.g., `features/post-generation/`) would scale better; the current flat structure works at the current project size
