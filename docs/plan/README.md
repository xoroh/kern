# Kern roadmap

Status: current · recorded 2026-09-29 · last reviewed 2026-10-01 (K-04) ·
update the table when a plan changes state

Work queue toward a complete 0.1.0: icons, tones, theme engine, feedback
language, web and native composition. Kern is standalone — it knows nothing
about any product that consumes it.

## Legend

P0 = blocks the 0.1.0 alpha · P1 = next · P2 = later. State: `planned` →
`in progress` → `done` (move the row's detail into the plan file's log when
done).

## Tracker

| # | Area | What ships | Package | P | Plan | State |
|---|---|---|---|---|---|---|
| 1 | Icons | name union, shape registry, codegen, `Icon` web + native | `@xoroh/kern-icons` | P0 | [kern-icons](kern-icons.md) | done |
| 2 | Tones | spectrum ramps, status/user/avatar tones, 9 functional domains, tone CSS | `@xoroh/kern-theme` | P0 | [kern-tones](kern-tones.md) | done |
| 3 | Theme engine | variant registry, `assertCompleteScheme`, layer deltas | `@xoroh/kern-theme` | P0 | [theme-parity](theme-parity.md) | done |
| 4 | Feedback | boot, loader styles, tenant registry, critical loader | `kern` + `kern-native` | P0 | [feedback](feedback.md) | done |
| 5 | Web composition | top-app-bar, sidebar/rail/drawer, panes, scaffolds, search, settings, status-bar | `@xoroh/kern-start` | P0 | [kern-start](kern-start.md) | done |
| 6 | Native composition | sheets, shell, menu screens, splash, layouts, panes | `kern-native` | P1 | [native-composition](native-composition.md) | done |
| 7 | Web components | Command, Sonner, CountrySelect, SegmentedButton, Banner | `kern` | P1 | [web-extras](web-extras.md) | done |
| 8 | Fonts | Inter faces exported, host injects an `expo-font`-shaped loader | `kern-native` | P1 | [native-composition](native-composition.md#8-fonts) | done |
| 9 | CLI | `kern add` installer | `@xoroh/cli` | P2 | — | not planned |
| 10 | Composition tests | render tests per block | all | P2 | in each plan's acceptance | planned |
| 11 | Docs | shell docs + parity page | `docs/` + `apps/site` | P2 | — | in progress |

Row 11 log: contributor docs restructured (`../architecture.md`,
`../platform-parity.md` rebuilt from the generated inventory, conventions
for changesets / parity / stubs, `change-routing.md` in the docs skill).
Rows 6-8 landed while this pass was open, so the parity tables were
recomputed against the new surface (236 web / 78 native exports).
Remaining: the site shell docs, and a final parity re-pass once the K-02 and
K-03 reports are written — their acceptance evidence may still change the
surface. `docs/components.md` is stale by 53 entries and needs
`bun run generate:components` (K-05 owns that script).

## Out of scope

- Brand marks and product names never appear in the API — apps ship their
  own assets (or drop them into `assets/brand/`).
- Domain couplings (auth, routing, tenancy, country data) arrive as
  props/slots, never as dependencies.
- EmDash adapter: dropped 2026-09-29 (hard cut). Rebuild fresh if CMS
  integration is needed.

## System law (locked 2026-09-29)

- **Material 3 rules and principles govern** structure, behavior, and naming.
  Kern's expression (pills, neutral emphasis, flat elevation) is recorded per
  component as an override and gate-checked (`check:m3`) — never an excuse to
  drift from M3 semantics.
- **Naming law**: unprefixed PascalCase, M3-canonical concepts (`Button`,
  `TopAppBar`, `NavigationBar`, `CircularProgress`, `Icon`). No prefixes, no
  product names, no bridge names.
- **Hard cuts over deprecation machinery:** removed means deleted outright —
  no warning shims, no stub packages, no alias layers.
- **Kern is standalone:** no references to downstream products or their
  codebases, in code or docs. Consumers depend on Kern, never the reverse.

## Renderer split (no rewrites "per language")

The system language is written **once** and shared: `kern-theme` (tokens,
themes, tones, feedback spec) + `kern-icons` registry — pure TS, any renderer.
Widgets and composition (blocks/scaffolds) are implemented per **renderer
family**: DOM (`kern` + `kern-start`; web *and* desktop reuse) vs React Native
(`kern-native`; splits to `kern-expo` when Expo-only peers force it). Same
model as M3 shipping Material Web + Material Compose + Android from one spec.
