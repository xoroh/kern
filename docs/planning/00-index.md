# Domains program — index (enriched 2026-10-08 from lanes R1–R8)

Base: `35eaad9` (Batch 4 merged, rail removed). Planning skeleton: `ae2a4fc`.

## Domain map

| Key | Domain | What lives there | Sidebar |
|---|---|---|---|
| P | Primitives | `@xoroh/kern-primitives` headless kernel + RN-standalone install path. Brand "Primitives", NOT "RN" (`check:primitives` forbids importing `kern-native`) | New `primitives-nav.ts`, per-export-family pages |
| C | Components | All component pages (`/components/$platform/$component`, ~192), galleries, `/reference` index (moved from docs) | From `content/families.ts` `FAMILY_GROUPS` |
| D | Docs (main) | Landing `/`, getting-started (minus mobile step 6), guides, web API, contributing, about, changelog (single source), community, legal | Remainder of `nav.ts` |
| B | Blocks | `/showcase` shell + `/patterns` (moved — all 6 cards link into C; D must have NO components). Real block content is new work | Category sidebar (Sidebar, Dashboard, Auth, …) |
| G | Playground | One customizer app: hub shell + theme-configurator as panel + per-family configurator panels | Tool nav, not docs nav |
| F | Foundations | Theory only: tokens/color/type/elevation/shape/motion/states pages, theme reference page, accessibility statement, icons gallery | Reading-order registry (`foundations/shell.tsx` `FOUNDATIONS`) |

Cross-cutting: `07-demos` (every component gets a live demo), `08-correctness` (P0 token fixes first),
`09-onboarding` (CLI/MCP/skill use cases, M3 system part, show/hide policy).

## Batch order (each batch = worktrees + PRs + cross-review, same as ever)

1. **P0 truth-pass** (small, first): CLI README lie (`packages/kern-cli/README.md` "not implemented" vs shipped Mode 1 —
   `docs/architecture.md:30` records the contradiction), MCP `list_components` native import string
   (`@xoroh/kern/native` vs parity doc `@xoroh/kern-native`, `docs/platform-parity.md:36-38`),
   `get_tokens` missing `compact` enum. No user may be directed at a lying surface.
2. **P1 primitives standalone** (`01`): G1–G8 gaps, keywords + "React Native" in description, README all 15 modules,
   Button through `useKernPress` (G8), binding contract (G7), then rn-reusables adapter.
3. **P2 correctness P0s** (`08`): icon-button filled, chip filter-selected + assist, card filled/shape,
   button state layers. Wrong pixels beat missing pages.
4. **P3 demos** (`07`): web undemoed (~40 exports), mobile unaccounted (~35), examples registry beyond 5.
5. **P4 components domain** (`02`): move routes, sidebar from `FAMILY_GROUPS`, reference index move.
6. **P5 blocks domain** (`04`): manifest block type + viewer + first categories.
7. **P6 playground domain** (`05`): unified customizer, R3 sidebar, export = preset `.json`.
8. **P7 foundations + color usage** (`06`): theme-page split, role→surface map + rules.
9. **P8 docs-shell package** (`03`): reusable sidebar + TOC + search + pagination, all 6 domains.
10. **P9 onboarding + M3 part** (`09`): system-choice step, use-case pages, show/hide enforcement.
11. **Publish 0.1.0** — nothing adoptable until then.

**Batch status (2026-10-09):** batches 1–10 LANDED (P0 truth-pass, P1 primitives standalone incl.
G1 ruling + G5 versioning doc, P2 correctness P0s/P1s/P2s + start-tier parity suites, P3 demos — web 0
demo-less / mobile 12-list / examples 14, P4 components domain, P5 blocks domain (3 blocks + CLI add),
P6 playground studio, P7 foundations, P8 docs-shell parts, P9 onboarding). Batch 11 (publish 0.1.0) is
verified code-ready (`check:publish` 6/6, version dry-run: all public packages → 0.1.0) and blocked only
on the three founder actions in `TODO.md` (NPM_TOKEN secret, RELEASE_CHANGESSETS variable, npm login).

## Decisions owed

- D18: 6 deployables vs path-prefixes-behind-subdomain-rewrites (one TanStack app today, `wrangler.jsonc` `kern-site`, no custom domain).
- D19: P brand "Primitives" (recommended — boundary-enforced) vs "RN". — the tree ships "Primitives"
  branding and the `check:primitives` boundary; confirm or overrule.
- D20: 5-tab page IA proposal — SHIPPED as the primary tabs (Foundations/Components/Patterns/Playground/
  Showcase); confirm or overrule.
- D21: search stays global (R6: moving it into G blinds every domain) — CONFIRMED in P6/P8 (the studio
  embeds no search).
- D1 (CLI fate) — answered by P0-truth + P9: Mode 1 shipped, unpublished, receipts forward-designed;
  `list`/`diff`/`upgrade` documented as coming. D8 (showcase real-only) — held (3 real blocks only).
  D15 (data-heavy parked) — parked.
- Redirect-alias stubs (`/accessibility`, `/icons`, `/styles/*`, `/theme/`) — delete now or keep one cycle.
