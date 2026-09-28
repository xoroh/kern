# Kern UI — by Xoroh

Open design system implementing Material Design 3: tokens, components,
blocks, showcase site, and tooling — MIT-licensed, human- and AI-usable.
M3 is the ruleset Kern follows, not what it is.

- Showcase + playground: https://ui.xoroh.org
- Hub: https://xoroh.org

## Structure

- `apps/docs/` — ui.xoroh.org (component docs + playground)
- `packages/kern/` — the library, single package with subpath exports:
  - `@xoroh/kern` — web (React, on Base UI)
  - `@xoroh/kern/native` — mobile (React Native, planned)
  - `@xoroh/kern/theme` + `@xoroh/kern/tokens` — shared theme (CSS + TS, generated from `tokens.json`)
- `packages/kern-emdash/` — EmDash adapter (`@xoroh/kern-emdash`): Astro integration + block plugin
- `packages/cli/` — installer placeholder (`kern add <component>`)
- `packages/mcp/` — MCP server (`@xoroh/kern-mcp`): list/get components, tokens, audits
- `.agents/skills/` — agent skills (kern design + docs upkeep, MIT-safe)

## License

Apache License 2.0 — see `LICENSE`.
