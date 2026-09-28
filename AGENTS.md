# AGENTS.md — Kern UI (`xoroh/kern`)

Bun monorepo. Publishable packages: `@xoroh/kern`, `@xoroh/kern-emdash`,
`@xoroh/kern-mcp` (each versioned independently via changesets).

## Commands

```bash
bun install                 # install workspace deps
bun x changeset status      # what would release next
bun run changeset           # add a changeset (required per PR touching packages/)
bun run build               # from packages/mcp/ — bundle the MCP server to dist/
```

No test/lint pipelines yet — add them per package as code lands,
then document here.

## Source of truth

- `skills/kern/SKILL.md` — design authority. Read it before ANY UI work
  (components, pages, tokens, theming, audits). References load on demand.
- `packages/kern/MIGRATION.md` — private → OSS map. Copy never move;
  stubs are not wired into `index.ts` until migrated.
- `packages/kern/src/theme/tokens.json` — token source of truth.

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `ci:`).
- One version per publishable package: all `@xoroh/kern` subpaths release
  together; `-emdash` and `-mcp` version independently.
- Component naming: drop `Kern` prefix, kebab-case files (`button.tsx`).
- Core stays domain-neutral; use cases live in `src/blocks/<usecase>/`.
- Never commit secrets. `TODO.md` is gitignored (local-only by design).
