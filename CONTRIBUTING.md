# Contributing to Kern

Bun monorepo (`bun install` to start). Per-PR requirements:

1. **Changeset** — every PR touching `packages/` adds one: `bun run changeset`.
   Check what would release: `bun x changeset status`.
2. **Docs in the same change** — component page, skill refs, or repo docs
   as appropriate. The docs skill (`.agents/skills/docs/SKILL.md`) says where.
3. **Lint clean** — `bun run lint` passes (`bun run format` fixes).
   Config: `biome.json` (lint + format + import order).
4. **Tests + types pass** — `bun run test`, `bun run test:native`, and
   `bun run typecheck` in `packages/kern/`.
5. **Conventional commits** — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `ci:`.
6. **Design work** — read `.agents/skills/kern/SKILL.md` first. Core stays
   domain-neutral; use cases go in `src/blocks/<usecase>/`.

Flow: fork/branch → PR against `main` → review → merge. Versioning and
publishing run through the **Version Packages** PR (see `docs/releases.md`) —
never publish by hand.
