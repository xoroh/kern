# Contributing to Kern

Bun monorepo (`bun install` to start). Per-PR requirements:

1. **Changeset** — every PR touching `packages/` adds one: `bun run changeset`.
   Check what would release: `bun x changeset status`.
2. **Docs in the same change** — component page, skill refs, or repo docs
   as appropriate. The docs skill (`.agents/skills/docs/SKILL.md`) says where.
3. **Conventional commits** — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `ci:`.
4. **Design work** — read `.agents/skills/kern/SKILL.md` first. Core stays
   domain-neutral; use cases go in `src/blocks/<usecase>/`.

Flow: fork/branch → PR against `main` → review → merge. Versioning and
publishing run through the **Version Packages** PR (see `docs/releases.md`) —
never publish by hand.
