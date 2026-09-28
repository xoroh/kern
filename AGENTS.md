# AGENTS.md — Kern UI (`xoroh/kern`)

Bun monorepo. Single publishable package `@xoroh/kern` + EmDash adapter.

## Commands

```bash
bun install                 # install workspace deps
bun x changeset status      # what would release next
bun run changeset           # add a changeset (required per PR touching packages/)
```

No test/build/lint pipelines yet — add them per package as code lands,
then document here.

## Source of truth

- `skills/kern/SKILL.md` — design authority. Read it before ANY UI work
  (components, pages, tokens, theming, audits). References load on demand.
- `packages/kern/MIGRATION.md` — private → OSS map. Copy never move;
  stubs are not wired into `index.ts` until migrated.
- `packages/kern/src/theme/tokens.json` — token source of truth.

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `ci:`).
- One package, one version: all `@xoroh/kern` subpaths release together.
- Component naming: drop `Kern` prefix, kebab-case files (`button.tsx`).
- Core stays domain-neutral; use cases live in `src/blocks/<usecase>/`.
- Never commit secrets. `TODO.md` is gitignored (local-only by design).
