# Kern UI — by Xoroh

M3-based design system. Neutral core + use-case blocks (mobility first).

- Docs + playground: https://ui.xoroh.org
- Hub: https://xoroh.org

## Structure

- `apps/docs/` — ui.xoroh.org (component docs + playground)
- `packages/kern/` — the library, single package with subpath exports:
  - `@xoroh/kern` — web (React, on Base UI)
  - `@xoroh/kern/native` — mobile (React Native, planned)
  - `@xoroh/kern/theme` + `@xoroh/kern/tokens` — shared theme (CSS + TS, generated from `tokens.json`)
- `packages/kern-emdash/` — EmDash adapter (`@xoroh/kern-emdash`): Astro integration + block plugin
- `packages/cli/` — installer placeholder (`kern add <component>`)
- `packages/kern/MIGRATION.md` — private → OSS map, phases, never-migrate list
- `skills/kern/` — agent skill (design reference + 11 topic files, MIT-safe)

## License

Apache License 2.0 — see `LICENSE`.
