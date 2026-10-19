# M3 fidelity fix — report (fix/m3-fidelity)

**Branch:** `fix/m3-fidelity` in worktree `/tmp/opencode/kern-m3-fidelity` (PR #59).
**Scope:** `.reports/review-m3-visual.md` P0–P3, visual audit + screenshots, origin/main merge, and ADR-021 HCT primary tonal engine cutover. No merges, no publishes/deploys.
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
- **HCT cutover as primary tonal engine for Kern M3 (ADR-021, superseding ADR-016).**
  Cutover accepted and completed: `themeFromSeed` in `@xoroh/kern-m3`
  now produces the full 45 M3 spec roles (primary, secondary, tertiary, error,
  surface, surface containers, outline, inverse, fixed) using HCT via
  `@material/material-color-utilities` (`SchemeTonalSpot`). The legacy OKLCH
  path for M3 is removed with no backward-compatibility aliases, shims, or
  defensive fallbacks (ADR-020). Tonal engine choice is per system: Kern M3 uses
  HCT for spec fidelity with Material Design 3, while other design systems
  select their own canonical engine.

## What changed

- **Tokens & State Layers:** `tokens.json` focus/press 12%→10% (+comment), regen `tokens.css`,
  `dtcg.json`, `packages/kern/src/styles.css`, CLI snapshot; `states.ts` +
  `states.test.ts`; `check-kern.mjs` gate + K-note; button/button-family docs;
  site states/color prose; vendored `state.md` stale-note.
- **HCT primary engine (ADR-021):**
  - `@xoroh/kern-tokens`: `packages/kern-tokens/src/hct.ts` provides `hctKeyColor`,
    `hctTonalRamp` (0–100 ramps), and `hctSchemeRoles` (`SchemeTonalSpot` with
    custom secondary/tertiary seed support).
  - `@xoroh/kern-m3`: `themeFromSeed` in `src/seed-theme.ts` cut over from
    legacy OKLCH 12-role repaint to full 45-role HCT dynamic schemes. Removed
    all OKLCH dependencies from M3 seed theming.
  - Golden tests in `packages/kern-m3/src/seed-theme.test.ts` asserting exact
    reference match against `@material/material-color-utilities` across seeds
    `#6750a4` (baseline purple), `#006a6a` (teal), `#2563eb` (blue), and `#7c3aed` (violet),
    light and dark modes.
  - Decision record `docs/decisions/021-hct-primary-tonal-engine-for-m3.md` added;
    `016-hct-tonal-palettes.md` and `docs/decisions/README.md` updated.
- **Tertiary (library untouched):** admonition `note` → `tertiary-container`/
  `on-tertiary-container` (tertiary's standing chrome job); color-page prose;
  gallery already alternates tertiary stages; hero/docs-index already tertiary.
  Deliberately narrow — no PlatformTabs/pill recolor (would break chip law).
- **Raw purple:** audit found zero raw-chrome paint (hero/styles clean; seeds
  and placeholders are data). Three data-viz `text-white/black` hits in the
  playground carry exemption comments (theme roles cannot contrast
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
- **Docs & Gates hygiene:**
  - `apps/site/scripts/lib/extract-prop-names.test.mjs` fixture program compilation
    cached across cases and timeout extended to 30s to prevent test runner timeouts under load.
  - `apps/site check:docs` passes completely (all 24 sub-checks green).
  - Theme foundations page updated to document ADR-021 HCT primary engine.

## Visual inspection (DoD 1–2)

Full visual pass generated via Playwright across 6 primary pages in 1440 desktop and 390 mobile viewports, light and dark themes, plus modal/drawer interactions and interaction states. All artifacts captured in `.reports/m3-fidelity/`:

| Page / Surface | Viewport | Mode | Screenshot Artifact | User-Eye Inspection Notes |
|---|---|---|---|---|
| Home | 1440 | Light | `home-1440-light.png` | Hero uses spec tertiary accents; card elevations clean with neutral shadows; no raw-purple chrome. |
| Home | 1440 | Dark | `home-1440-dark.png` | Surface containers step from `surfaceContainerLowest` to `surfaceContainerHighest`; high contrast maintained. |
| Home | 390 | Light | `home-390-light.png` | Clean single-column reflow; navigation hamburger accessible; no horizontal scroll. |
| Home | 390 | Dark | `home-390-dark.png` | High-contrast dark rendering; pills and badges crisp against container backgrounds. |
| Button Family | 1440 | Light | `button-1440-light.png` | Filled, elevated, tonal, outlined, text variants align to M3 specification; correct radii and padding. |
| Button Family | 1440 | Dark | `button-1440-dark.png` | Tonal and elevated buttons contrast correctly against dark container surfaces. |
| Button Family | 390 | Light | `button-390-light.png` | Mobile button groups wrap cleanly; touch targets maintain ≥48dp bounds. |
| Button Family | 390 | Dark | `button-390-dark.png` | High contrast and legibility at compact viewport. |
| Button States | 1440 | Hover (Light) | `button-hover-light.png` | 8% state layer overlay visibly darkens filled button without shifting color hue. |
| Button States | 1440 | Focus (Light) | `button-focus-light.png` | 10% state layer overlay with 3px focus ring cleanly offset; no clipping. |
| Foundations: States | 1440 & 390 | Light & Dark | `states-1440-*.png`, `states-390-*.png` | Prose reflects 8/10/10/16/38 canonical opacities; compliance table renders green. |
| Foundations: Color | 1440 & 390 | Light & Dark | `color-1440-*.png`, `color-390-*.png` | M3 role swatches display full 45 roles; note admonition uses tertiary container `#ffd8e4`/`#31111d`. |
| Foundations: Theme | 1440 & 390 | Light & Dark | `theme-1440-*.png`, `theme-390-*.png` | Divergences section accurately records ADR-021 HCT engine and K-deviations. |
| Playground | 1440 & 390 | Light & Dark | `playground-1440-*.png`, `playground-390-*.png` | Full interactive widget suite with theme switcher, state layers, and token binding. |
| Search Palette | 1440 | Light & Dark | `search-light.png`, `search-dark.png` | `⌘K` modal dialog with centered elevation, backdrop blur, search input focus, and category chips. |
| Mobile Navigation Drawer | 390 | Light & Dark | `drawer-light.png`, `drawer-dark.png` | Side drawer slides over dim scrim with standard M3 navigation item pills and active states. |

## Verification

- **Typecheck:** `bun run typecheck` across all 6 packages (`@xoroh/kern-tokens`, `@xoroh/kern-contracts`, `@xoroh/kern-m3`, `@xoroh/kern`, `@xoroh/kern-native`, `@xoroh/kern-icons`) exits 0.
- **Package Tests:** `bun run test` (all packages) exits 0 with 100% passing tests (including 106 tests in `kern-m3` with golden MCU assertions, 76 in `kern-tokens`, 85 in `kern-icons`, and root suites).
- **Site Docs Check:** `apps/site check:docs` exits 0 (all 24 verification gates pass: check-docs, check-spec-urls, check-typescale, check-headings, extract-prop-names, check-props, check-nav, check-component-nav, check-primitives-docs, check-focus-trap, check-search, check-examples, check-tokens, check-markdown, check-llms, check-seo, check-configurators, check-blocks, studio-state, check-gallery, check-a11y, check-grammar, check-page-md, check-mcp-index).
- **PR Status:** PR #59 is merged with `origin/main` (commit `061b3b7b`), clean worktree, ready to push for GitHub CI.
