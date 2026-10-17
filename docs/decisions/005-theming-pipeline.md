# 005. Theming pipeline explicit: matrix artifact, override-only presets, engine boundary

Status: accepted (P5C, 2026-10-07)

## Context

The theming pipeline worked but was implicit: seed ramps (`tokens.json`),
role tables + contrast overlays (`themes/kern.json`), resolution
(`resolve.ts`), and projection (`variants.ts`, `web-theme.tsx`, generated
CSS) were reconstructible only by reading four files together. Reviewing a
preset meant running the app — "what does this preset change?" had no
reviewable artifact. Meanwhile dark mode, density, and motion each looked
like a different mechanism (mode axis, ad-hoc radius math in the
configurator, motion scheme names), inviting a second role table or a
parallel preset registry.

## Decision

1. **Name the stages in code.** `packages/kern-tokens/src/pipeline.ts`
   exposes `seedStage` / `mapStage` / `aliasStage` / `componentStage`, each
   delegating to the existing data and functions. Structure only — a
   rendered-value diff from this module is a defect (D6).
2. **Flatten every context into a checked-in matrix.**
   `packages/kern-tokens/src/themes/matrix.json` holds all 24 mode ×
   contrast × preset cells with full values plus `changedRoles` /
   `changedShape` against the kern base. `check:theme-matrix` fails when it
   drifts; the generator is registered in `scripts/generated-artifacts.mjs`
   so the census and freshness gates also cover it.
3. **Algorithms are override data extending kern.** Dark is the mode axis of
   the base tables (documented, not duplicated). Compact is
   `themes/compact.json`: shape-only overrides (0.75× scale, `full` passes
   through — the same rule the theme configurator applies), zero color
   changes, catalogued in `themes/index.json` and resolvable as a `ThemeId`.
   Motion algorithms (`presets.ts`) select among the existing
   `tokens.json` motion schemes as validated data; P5C introduces no new
   motion token. No second role table, ever — enforced twice: `check:kern`
   audits the preset sources, `check:theme-matrix` audits resolved output.
4. **Draw the engine boundary without moving code.** `pipeline.ts` declares
   the `StyleEngine` contract (web projects to CSS vars, native to scheme
   objects); `web-theme.ts` and `kern-native/src/theme.tsx` stay untouched.
   The split lands later against this boundary, visual-no-op first.

## Consequences

- Preset review is a diff over `matrix.json`, not an app session. The gate
   names the regen command on drift, and any drift that moves a rendered
   value is treated as a D6 defect rather than a regen.
- New presets follow the compact pattern: a `themes/<id>.json` file with
   `extends: "kern"`, a catalog entry, overrides touching known roles only —
   the gates reject anything else with the file to fix named.
- The matrix grows with the preset count (one cell set per preset). If that
   becomes unwieldy, the follow-up is delta-only cells — not a second
   artifact format alongside this one.
- `themeIds()` gains `"compact"`, so the theme configurator lists a fourth
   preset with no site edit. Additive and intended.
