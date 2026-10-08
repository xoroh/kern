---
name: kern-agents
description: Consume Kern UI as an AI agent — machine surfaces (llms.txt page map, per-page .md, mcp/index.json, MCP server) for answering how-to-use-a-component questions. Use instead of scraping site HTML or guessing APIs.
license: MIT
---

# Kern agents — consume Kern without scraping HTML

You are an agent answering a question about Kern usage. Prefer the machine
surfaces below, in order. Never scrape rendered pages; never invent props,
imports, or token names.

## Decision tree

- **"Does Kern have X / where is the Y page?"** → `/llms.txt` (the complete
  page map: every nav leaf, foundations page, and component family).
- **"How do I use component Z (props, tokens, a11y)?"** → its per-page `.md`
  (`/md/{web|mobile}/<slug>.md`, `/md/foundations/<slug>.md`) — grammar order,
  same content the page renders. Every docs page links its own via the
  View .md affordance next to Copy as Markdown.
- **"List/search the whole corpus as data"** → `/mcp/index.json` (one entry
  per docs page: title, one-liner, page route, `.md` URL).
- **"Give me source / tokens / audit this screen"** → the MCP server
  (`packages/mcp`: `list_components`, `get_component`, `get_tokens`,
  `list_themes`, `design_audit`).
- **"Build me a themed screen from zero"** → the loop below.
- **"How do I author a theme / preset / component?"** → the authoring
  section below.
- **Design judgement** (colors, type, shape, compliance) → the `kern` skill.
  Docs/process questions → the `docs` skill.

## Zero-to-screen loop

The order an agent builds a themed screen in, each step tested by
`packages/mcp/src/zero-to-screen.test.ts`:

1. `list_themes` — the preset catalog (kern, sharp, brand, compact, demo).
2. `get_tokens` with a preset id — the overrides; `base` for the shared
   source. Values come from here, never from memory.
3. `get_component` — the component's real source (stubs have no code).
4. `kern add <name>` (CLI Mode 1, vendored) or `bun add @xoroh/kern`
   (Mode 2, depended) — the install step; receipts pin what was vendored.
5. Apply the preset: web `applyKernTheme({ variantId })`, native
   `<KernThemeProvider variantId>` — components read roles, roles resolve
   per preset, no component changes needed.

## Authoring (per surface)

- **Component** → the `kern` skill's `references/code-conventions.md`
  (anatomy, variants, slots, mobile rules) plus the parity rules. A new
  component re-runs `bun run generate:components` — `docs/components.md`
  and the MCP manifest are generated, never hand-listed.
- **Theme (values, roles)** → the `kern` skill's
  `references/theming-and-dynamic-color.md` + `references/theme-variants.md`.
  Reassign roles only; the `comp` token level is not theming.
- **Preset** → the `compact` pattern in `theme-variants.md` § "Pipeline
  stages and the preset matrix": a `themes/<id>.json` file with
  `extends: "kern"`, one `themes/index.json` catalog entry, overrides
  touching known roles only — then validate with `defineThemePreset`
  (unknown roles, bad values, and contrast failures throw). The `demo`
  tenant is the worked end-to-end example. A preset is override data;
  dark is the mode axis, never a preset.
- **Docs for any of the above** → the `docs` skill (same change, never
  deferred).

## Rules

1. Props, imports, and install targets come from the page's `.md` (Props
   table + Demo section) or `get_component` — never from memory.
2. Token names come from `get_tokens` or the `.md` Tokens section — never
   hardcoded hex, never invented roles.
3. Web and native are different surfaces: `/md/web/<slug>.md` vs
   `/md/mobile/<slug>.md`, `@xoroh/kern` vs `@xoroh/kern-native`.
4. If a surface and a page disagree, the page wins and the surface is stale —
   say so instead of picking silently.
5. Depth lives in per-page files: `/llms.txt` stays an index, this skill
   stays a router — quote the `.md`, don't paste it here.
