# M3 fidelity fix — report (fix/m3-fidelity)

**Branch:** `fix/m3-fidelity` in worktree `/tmp/opencode/kern-m3-fidelity` (from `main@fbc0b879`).
**Scope:** `.reports/review-m3-visual.md` P0–P3, executed as one PR. No merges, no publishes/deploys.
**Model note:** tokens were sufficient; nothing was cut for budget.

## Decisions (checked against VISION + ADRs)

- **State layers 8 / 10 / 10 / 16 / 38 (ADR-020 hard cut, no aliases).** The live
  m3.material.io spec, the kern skill compliance table, and the component
  extracts in `docs/design-systems/m3-usable/components/*.md` (hover 8,
  focus 10, press 10) all agree. `material-web v0.192` still ships focus/press
  at 12% — recorded as stale wherever we cited it (`tokens.json` comment,
  `states.ts`, `check-kern.mjs`, vendored `state.md`, skill
  `interaction-states.md` + `component-catalog.md`). The review's P0 (docs
  teaching 10/10 against 12/12 tokens) inverted after this: tokens move
  12→10, docs already taught 10/10 in prose in places and now agree everywhere.
- **HCT is an additive spike (ADR-016, D-HCT).** No cutover: OKLCH engine,
  artifacts, and gates untouched; `hct.ts` + MCU `^0.3.0` additive only.
  Pinned to 0.3.x because 0.4.0 ships a broken ESM import
  (`color_spec_2025.js` → extensionless `dynamic_color`, unresolvable under
  vitest); revisit 0.4.x at cutover. Divergence stays documented (seed-theme
  header, theme page) until the review-gated cutover.

## What changed

- **Tokens:** `tokens.json` focus/press 12%→10% (+comment), regen `tokens.css`,
  `dtcg.json`, `packages/kern/src/styles.css`, CLI snapshot; `states.ts` +
  `states.test.ts`; `check-kern.mjs` gate + K-note; button/button-family docs;
  site states/color prose; vendored `state.md` stale-note.
- **HCT spike:** `packages/kern-tokens/src/hct.ts` (`HCT_TONES` 0–100,
  `hctKeyColor`, `hctTonalRamp`, `hctSchemeRoles` via `SchemeTonalSpot`,
  full 47-role mapping incl. `surfaceTint`/`surfaceVariant` as observable
  kern deltas) + `hct.test.ts` (5 tests) + export + changeset. **Regression
  caught here:** MCU is ESM-only and broke kern-native jest at require time;
  fixed by adding it to `transformIgnorePatterns` (with comment), not by a
  shim. 50 suites / 449 tests green.
- **Tertiary (library untouched):** admonition `note` → `tertiary-container`/
  `on-tertiary-container` (tertiary's standing chrome job); color-page prose;
  gallery already alternates tertiary stages; hero/docs-index already tertiary.
  Deliberately narrow — no PlatformTabs/pill recolor (would break chip law).
- **Raw purple:** audit found zero raw-chrome paint (hero/styles clean; seeds
  and placeholders are data). Three data-viz `text-white/black` hits in the
  playground now carry exemption comments (theme roles cannot contrast
  arbitrary data fills).
- **State layers (P1-5):** Pagination/TOC/mobile-drawer/search-palette/
  site-header-search/InstallPicker/code-copy/gallery-link all route through
  `STATE_LAYERS`/`TRANSITION`/`FOCUS_RING`; `site-card:hover` secondary swap
  replaced with an `on-surface` overlay; press is 10% everywhere via one const.
- **Motion/shape/spacing (P1-6, P2-1/2/4/5):** `.site-card` transition
  tokenized; permalinks → `TRANSITION`; palette/drawer enter via
  `site-enter` (short4 + emphasized); kbd → extra-small; Pagination/SectionToc
  → extra-large; code wells radius-matched; `px-5`→`px-6`; copy-button 32px
  documented exception; `border-l-4` bands removed (tonal fills + pills carry it).
- **Type scale (P1-3/4):** scripted size-preserving pass (named sizes → `T_*`,
  font/tracking/leading drops, mono sizes → `T_CODE`, eyebrows → `T_KICKER`):
  gate went 227 → 0 off-scale, then the gate was extended to
  `demos/`, `components/icons/`, `components/theme/`,
  `domains/playground/` so it stays at zero.
- **Docs:** Divergences catalog on the theme page (HCT, surfaceTonal,
  FixedDim, fixed-reference, no surface-variant, FAB default, no resting
  shadow, DTCG notes, docs-chrome catalog); surfaceTonal-vs-surface-tint
  paragraph on Color; DTCG projection notes on Tokens.

## Verification

- Visual: dev server routes 200 (`/`, `/components/web/button`,
  `/foundations/m3/{states,color,tokens,theme}`, `/playground`); SSR spot
  checks (10/10 prose live, divergences + DTCG sections render, tertiary on home).
- Green: `lint`, root `typecheck` (all packages + site — site typecheck passes
  after the build regenerated the stale route tree), `test` (75+32+102+831+85),
  `test:scripts` 32/32, `test:native` 103, `test:native:jest` 449/449,
  `test:e2e` 26/26 (requires the preview server up: `apps/site build` +
  `preview`; bare `test:e2e` fails 26× `ERR_CONNECTION_REFUSED`, same on clean HEAD),
  gates `check:{contrast,kern,theme-matrix,layers,native-theme,xoroh-leaks,
  workflow,ts-policy,stale-refs,elevation-parity,currency,parity,consumption,
  generated:census,elevation,pack,registry-paths,primitives,coverage}`,
  `preflight:publish`, `check:dist`, `check:dist:types`, `check:typescale`,
  `check:gallery`, `check:snippets`, kern-tokens `check:publish`.
- Pre-existing failures, identical on clean HEAD (stash-compared):
  `check:generated` + `icons:check` (empty icon catalog, needs upstream sync),
  `check:docs` (`public/mcp/index.json` unparsable), `check:configurators`
  (`Unexpected typeof`). Correction: an early "base also fails jest" reading
  was invalid — untracked `dist/` + `node_modules` persisted across the stash;
  the true base jest state was not measured, but this tree is green.
- Left as follow-ups (not debt hiding): playground/demo target densities
  (`h-8`/`h-9`/`size-10` < 48dp), header contrast control (documented only),
  playground exempt-or-not (review Q6) now smaller but open, HCT cutover
  (review-gated per ADR-016).
