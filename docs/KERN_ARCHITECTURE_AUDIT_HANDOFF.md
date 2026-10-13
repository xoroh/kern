# Kern Design System Architecture Audit — Handoff

**Status:** audit / discovery only. No architectural changes implemented. This file is the only artifact created.
**Date:** 2026-10-13. **Repo:** `/home/novexo/Desktop/Business/xoroh-monorepo/kern` (own git repo, HEAD `d5007b7`, Bun monorepo `bun@1.3.8`).
**Working tree at audit time:** dirty — 358 porcelain entries (298 modified, 59 untracked). Where a result differs between HEAD and the dirty tree, this report says which.

> Legend: **[F]** verified fact (file/line or command output) · **[I]** reasonable inference · **[R]** recommendation · **[Q]** unresolved question · **[P]** proposal (not implemented).

---

## 1. Executive summary

**What Kern currently is [F]:** a Material Design 3 design system for **two renderer families** — web (React DOM) and native (React Native) — organised as a Bun workspace with **7 packages** and **2 apps**, plus an unusually deep executable-gate and documentation apparatus (23 CI-invoked gates, a data-only cross-renderer parity contract, a generated component registry, a docs site that doubles as the preview/test platform).

| Package | Dir | Public | What it actually is |
|---|---|---|---|
| `@xoroh/kern-tokens` | `packages/kern-tokens` | yes | Platform-free token foundation: canonical `tokens.json`, role tables, themes, contrast, tones, motion, generated CSS. **M3-shaped naming (`--md-sys-*`).** |
| `@xoroh/kern` (+ `./start`) | `packages/kern` | yes | **The M3 web implementation** (package description: "Material 3 React components on Base UI primitives") + web composition tier. |
| `@xoroh/kern-native` | `packages/kern-native` | yes | **The M3 native implementation** (RN `StyleSheet` + shared primitives) + native composition. |
| `@xoroh/kern-primitives` | `packages/kern-primitives` | yes | Unstyled behaviour kernel shared by both renderers; may not import tokens (enforced). |
| `@xoroh/kern-icons` | `packages/kern-icons` | yes | Set-agnostic icon registry + web/native `Icon`; ships one set (Material Symbols, 1340 glyphs). |
| `@xoroh/kern-mcp` | `packages/mcp` | yes | MCP server over the generated component registry + maturity data. |
| `@xoroh/kern-cli` | `packages/kern-cli` | **no** (`private: true`) | `kern init` / `kern add` source-vendoring installer (shadcn-style Mode 1 + dependency Mode 2). |

Note on the brief's names: there is **no `kern-token` package** — the verified name is `@xoroh/kern-tokens`. `kern-native` and `kern-icons` exist as named.

**What must be preserved [R]:** the renderer-family split (never `if (isNative)`); the single token resolver `resolveThemeDetails` (`packages/kern-tokens/src/resolve.ts:105`) feeding both engines; the data-only parity contract (`parity/contract.ts`) + per-side suites + `check:parity`; `kern-primitives` with its enforced boundary; the icon pipeline (pinned source → committed registry → byte-freshness gate); per-package changesets versioning; and the executable design-law gates (`check:kern`, `check:contrast`, `check:layers`, `check:primitives`, `check:coverage`, `check:consumption`). None of it should be rewritten.

**The single biggest architectural fact [F]:** platform and provider are currently **conflated in package identity**. `@xoroh/kern` *is* the M3 web provider; `@xoroh/kern-native` *is* the M3 native provider; and the "shared" token layer is M3-flavoured (45 M3 roles + 13 registered kern deviations, `--md-sys-*`/`--md-comp-*` var names, `kern-roles.ts` is an M3 conformance inventory). There is **no provider abstraction anywhere** — no provider id, no registration, no capability declaration. The docs site has a *narrative* seam for a second system (`apps/site/src/systems/design-systems.ts`), but the packages have none.

**Recommended architecture [R] (Option B, §12):** minimal package churn — keep every existing package name; explicitly *label* `kern`/`kern-native` as the M3 provider; add two small, additive layers: (a) a **contract/capability package** (types + shared contract tests + provider metadata) and (b) a **provider facet on the token layer** (role-set registry so a non-M3 provider is data, not a fork). Validate with a second, deliberately small provider (Stage 9). Do not build a neutral facade package yet (Option C) — it is justified only when a second provider is real.

**Most important required changes [R]:**
1. Fix three signals that are red **at HEAD**: `packages/mcp` manifest test (SearchBar vs barrel), `check:coverage` (`presentation.tsx`), `check:kern` false-positive regex on `studio.tsx` prose (§18).
2. Settle the provider-identity decision (§12) before any package is published — pre-1.0 is the only free moment (ADR-004).
3. Generalise the token role-set schema so a second provider does not fork `kern-tokens`.
4. Publish readiness: founder HOLD items in `TODO.md` (NPM_TOKEN, `RELEASE_CHANGESSETS`) and the Tailwind consumer story (§15 Q3).
5. Close or formally rule the 37 web-only / 10 native-only parity gaps.

**Most important unresolved decisions [Q]:** provider packaging (separate packages vs facets vs neutral facade); token interchange format (DTCG projection vs custom); provider selection model (build-time vs runtime); blocks distribution as providers multiply; the second-provider validation choice; whether `@xoroh/kern/start` is split back into its own package.

**Report path:** `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF.md` (this file). An incomplete earlier draft exists at `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF2.md` (247 lines, ends in a literal `...[truncated 14109 chars]` marker, sections 10–20 missing); it was **not** modified by this audit.

---

## 2. Verified repository inventory

### 2.1 Root, workspace, tooling [F]
- Root `package.json:1-77`: `name: kern`, `private`, `packageManager: bun@1.3.8`, `engines.bun >=1.3.8`, workspaces `apps/*`, `packages/*`. Environment measured: `bun 1.3.8`, `node v24.21.0`.
- Root scripts (`package.json:10-61`): `build` = token/tones/motion/manifest generators + `scripts/build-order.mjs`; `typecheck`/`test` fan out with `--filter`; **21 `check:*` gates** + `preflight:publish`, `icons:{sync,generate,check}`, `test:{all,e2e,native,native:jest,scripts}`, `build-lock`.
- Root devDeps: `@arethetypeswrong/cli`, `@biomejs/biome`, `@changesets/cli`, `@playwright/test`, `culori`, `publint`, `typescript@5.9.3` (exact; `check:ts-policy` enforces the pin everywhere), `yaml`.
- Tooling: Biome (`biome.json`, lint+format+import order), tsup per package (no `tsup.config.*` — CLI one-liners in each manifest), Vitest (web/tokens/primitives/icons/cli), Jest + RNTL (`*.rntest.tsx` in kern-native), Playwright (`e2e/`), changesets (`.changeset/config.json`: `access: public`, `baseBranch: main`, `updateInternalDependencies: patch`, no fixed/linked groups).

### 2.2 Layout [F]
- `packages/`: `kern`, `kern-cli`, `kern-icons`, `kern-native`, `kern-primitives`, `kern-tokens`, `mcp`.
- `apps/`: `site` (TanStack Start + React 19.3 + Vite 8 + Tailwind v4, Cloudflare `wrangler deploy`, 41 route files) and `mobile` (Expo ~57, RN 0.86.3, React 19.2.3; ~790 LOC of screens).
- `docs/`: `architecture.md`, `platform-parity.md` (326 L), `parity-contract.md` (1019 L), `binding-contract.md`, `versioning.md`, `releases.md`, `verification-limits.md`, `components.md` (generated), family references, `adr/001–005`, `conventions/` (8), `design-systems/` (14 systems + `matrix.md` + git-ignored `m3-archive/` + committable `m3-usable/`), `plan/`, `planning/` (P0–P9 program logs).
- `scripts/`: 24 `.mjs` gates + `lib/codeowners.mjs` (+ its test).
- `parity/`: `contract.ts` (1233 L, **imports nothing**), `currency-claims.ts` (155 L).
- `e2e/`: 4 specs + `support/`; `playwright.config.ts` (chromium 1400×1000, `workers: 1`, `baseURL :4173`).
- `.github/workflows/`: `ci.yml` (346 L, jobs `cold-install`, `e2e`, `gates`, `dist-gates`, `pkg` matrix over 6 packages, `apps`), `release.yml` (changesets action gated on `vars.RELEASE_CHANGESSETS == 'true'`), `deploy.yml`.
- `.agents/skills/`: `kern` (design canon, 14 reference files), `kern-agents` (llms.txt/MCP surfaces), `docs`.
- No Storybook/Ladle/Playroom [F] — the preview platform is the docs site (live components, gallery, theme studio, blocks viewer, phone-frame RN-on-web previews) + the Expo app.

### 2.3 TypeScript conventions [F]
- All packages `strict`, `noEmit`, `moduleResolution: bundler`, TS 5.9.3 exact; `target es2022`, `jsx react-jsx`.
- Path alias `@kern-parity/contract → parity/contract.ts` (both renderers' test configs); site `#/* → src/*` and Vite aliases `react-native → react-native-web`, `react-native-svg → …/elements.web.js` (`apps/site/vite.config.ts:8-22`, the deliberate "S2.3 real previews, not screenshots" choice).
- **Barrels are the contract**: `exports` maps block deep `src/` imports (`docs/architecture.md:84-86`). Exception by design: the presentation bindings are imported by *direct module path* and never from a barrel (`docs/binding-contract.md`).
- Dual ESM+CJS via tsup `--dts --dts-resolve` (ADR-001); `publishConfig {access: public, provenance: true}` on all six public packages; `sideEffects: ["./src/theme.css"]` (kern), `false` (primitives, icons).

---

## 3. Existing architecture and dependency graph

Verified against manifests, `docs/architecture.md:39-63`, `docs/conventions/file-ownership.md:41-51`, and **my own run of `bun run check:layers` → exit 0** (§18):

```
layer 0   kern-primitives ──(may import: react only)──▶ ✗ tokens/native/kern  [check:primitives]
          kern-tokens    ──(imports nothing in-repo)──▶  + @fontsource-variable/inter
          kern-icons     ──(imports nothing in-repo)──▶  peers react, react-native(+svg) optional

layer 1   @xoroh/kern          = M3 WEB provider    (deps: base-ui, primitives, tokens, cva/clsx/tailwind-merge)
          @xoroh/kern-native   = M3 NATIVE provider (deps: primitives, tokens, react-native-svg)
                                  ── the two are PEERS, never import each other  [check:layers]

subpath   @xoroh/kern/start    = web composition; may import @xoroh/kern only,
                                 zero direct @base-ui/react               [ADR-002 amendment, check:layers]

tooling   @xoroh/kern-mcp      reads generated manifest, imports nothing from packages
          @xoroh/kern-cli      private; parses manifest + apps/site/src/blocks/manifest.ts as text
```

- Peer-dependency policy [F] (`docs/releases.md:49-100`): an internal `@xoroh/*` dep that ships goes in `peerDependencies` with a real range; `workspace:*` never in shipped fields (npm does not rewrite it) — enforced by `scripts/preflight-publish.mjs` (ran: 6 packages packed clean).
- Styling [F]: web = Tailwind v4 utilities + CVA + `cn`/`cnState` reading `--md-sys-*` CSS variables (no CSS modules, no vanilla-extract); native = `StyleSheet.create` / style-map functions (`buttonStyles()`), values from `resolveThemeDetails()` per render.
- **Tailwind consumer wiring [F]:** the site stylesheet does `@import "tailwindcss"` + `@import "@xoroh/kern-tokens/theme"` + `@source "../../../packages/kern/src/components"` (`apps/site/src/styles.css:1-3`) because component classes are compiled by the *consumer's* Tailwind from package **source**. The published tarball ships only `dist` + `src/theme.css` (`packages/kern/package.json` `files`) — see §15 Q3.

---

## 4. Detailed package audits

### 4.1 `@xoroh/kern-tokens` (the brief's "kern-token")

1. **Purpose [F]:** platform-free design language — canonical tokens, themes/presets, contrast overlays, tones, feedback spec, variant registry, generated CSS (`src/index.ts:1-3`: "No React, no DOM").
2. **Public API [F]:** `index.ts:1-17` re-exports `contrast, expressive-shapes, feedback, focus, functional, motion, pipeline, presets, seed-theme, sizes, tokens, tones, variants`. Core symbols: `resolveThemeDetails/resolveTheme/varName/shapeVarName/themeIds/defineThemePreset` (`resolve.ts`), `seedStage/mapStage/aliasStage/componentStage/buildThemeMatrix/scopedDeltas/assertSingleRoleTable` (`pipeline.ts`), `M3_ROLES/KERN_ROLES/ALL_ROLES/auditRoleInventory/CONTRAST_WAIVERS` (`kern-roles.ts`), `themeFromSeed`, `resolveMotionScheme/springConfig/motionCssVars`, `statusTone/makeHueRamp`, `defineVariant/registerVariant`, `contrastRatio/contrastIssues`. Exports map: `.`, `./tokens`, `./tokens.json`, `./themes/*`, `./theme` (= `src/tokens.css`).
3. **Structure [F]:** `src/` = `tokens.json` (1135 L), `themes/{kern,sharp,brand,compact,demo,index}.json` + generated `matrix.json`, `resolve/pipeline/kern-roles/kern-elevation/color/contrast/functional/feedback/focus/motion/tones/variants/sizes/seed-theme/presets/expressive-shapes.ts`, generated `tokens.css` (971 L), `tones.css`, `motion.css`, `comp-tokens.css` (192 L `--md-comp-*`), `tailwind.css` (530 L `@theme` adapter); `scripts/gen-*.mjs` + `check-contrast.mjs` + `check-theme-matrix.mjs`; 9 test files.
4. **Technology [F]:** pure TS + JSON; OKLCH canonical with precompiled `srgb` per step because RN cannot parse OKLCH (`tokens.json` `$comment`).
5. **Deps/dependents [F]:** only `@fontsource-variable/inter`; depended on by `kern` and `kern-native` (dep + workspace devDep), read by `mcp` and the site.
6. **Token/styling assumptions [F]:** M3-shaped — 58 colour roles per scheme (45 M3 + 13 registered kern deviations: `success/warning/info` families + `surfaceTonal`, `kern-roles.ts:163-191`), 10-step shape scale, elevation L0–L5, 5 state opacities, 15 M3 typescale roles (+emphasized), spacing `space-0…900`, full M3 motion (easing/duration/spring/standard+expressive schemes). Themes: `themes/kern.json` base role tables (light+dark) + contrast overlays; presets (`sharp/brand/compact/demo`) are **override-only** (`extends: "kern"`), enforced twice — `check:kern` on sources, `check:theme-matrix` on resolved output (`pipeline.assertSingleRoleTable`).
7. **Web/mobile compatibility [F]:** both by design. One resolver, two projections: web `applyKernTheme` writes CSS vars + `.dark` + `data-kern-*` (`packages/kern/src/web-theme.ts:44-66`); native `KernThemeProvider`/`useKernScheme` reads the object (`packages/kern-native/src/theme.tsx:56-107`). `themes/matrix.json` flattens all 30 mode × contrast × preset cells as a reviewable artifact (ADR-005).
8. **Tests/validation [F]:** vitest 9 files / 86 cases; **1 failure at audit time** (`src/tokens.test.ts:55` expects `light.secondary === "#2563eb"`, gets `"#625b71"` — **dirty-tree only**: HEAD still has `#2563eb`; the uncommitted change moves secondary/tertiary to published M3 baseline values). Gates: `check:kern`, `check:contrast` (1656 checks PASS), `check:theme-matrix` (30 cells PASS).
9. **Publishing readiness [F]:** shaped ready (dual ESM/CJS + dts, `files`, provenance, `check:publish` green per `TODO.md`), **unpublished** — all packages `0.0.0`, founder HOLD (`docs/versioning.md §6`).
10. **Strengths [R]:** single source of truth with dual encoding (OKLCH for math, sRGB for RN/CSS); override-only presets with executable enforcement; the matrix artifact makes "what does this preset change?" a diff; contrast validated in code (`defineThemePreset` throws on failure); deviation registry (`KERN_EXTRA_ROLES` → deviation ids) makes additions auditable.
11. **Limitations/debt [R]:** (a) **M3-coupled naming** — `ColorRole = keyof typeof kern.color.light` (`resolve.ts:13`), `--md-sys-*` var names (`varName`, `resolve.ts:129-132`), `check:kern` is an M3 conformance gate; a non-M3 provider must fit the 58-role schema or fork. (b) No DTCG interchange format (custom JSON; `$`-keys are metadata filtered by generators). (c) Runtime resolution only — no build-time extraction step. (d) The `--md-comp-*` component-token layer exists only as CSS (web); native reads globals directly. (e) The in-flight secondary change shows spec-vs-test drift is possible without a ruling.
12. **Recommended future role [R]:** remain *the* shared token foundation. Generalise the **schema** (declared role-sets per provider, see §16.2) while keeping M3 values as the default preset. Do **not** split into `kern-tokens` + `kern-tokens-m3` before a second provider exists — no consumer would benefit, and every exports/alias/gate is keyed on the current name.

### 4.2 `@xoroh/kern-native`

1. **Purpose [F]:** RN renderer — "the same components and contracts as web, on native primitives" (`package.json:4`).
2. **Public API [F]:** `src/index.ts` (477 L barrel, 183 export statements): components (`Button`, `Card`, `Dialog`, sheets family, `NavigationRail`, `TopAppBar`, `AppShell`, `KernPressable`, `OverlayModalityProvider`, `web-parity.*` shims…), `theme` (`KernThemeProvider`, `useKernScheme`, `useKernTheme`, `useKernMotion`), `fonts` (`KernFontGate`, `useKernFonts`), style fns (`buttonStyles`, `accordionStyles`…). Exports `.` and `./native`, both with `react-native` condition first.
3. **Structure [F]:** `src/{index.ts, theme.tsx, fonts.tsx, field-context.tsx, utils/, components/ (89 non-test files + 50 `.rntest.tsx` + 8 `.test.*`), parity/ (10 parity suites)}`; `test-doubles/`, `jest.config.cjs` + `vitest.config.ts` (dual runner), `babel.config.cjs`.
4. **Technology [F]:** React 19 + RN peer `>=0.86 <0.89`, dep `react-native-svg@15`; `StyleSheet` only; behaviour from `@xoroh/kern-primitives` + local `components/presentation.tsx` bindings. **No Expo/NativeWind/Styling-library deps** — fonts are host-loaded (`docs/plan/native-composition.md` §8; `apps/mobile/src/fonts.ts` loads 3 Inter faces, not the 18-face barrel).
5. **Deps/dependents [F]:** deps `kern-primitives`, `kern-tokens`, `react-native-svg`; consumed by `apps/mobile` and by `apps/site` (via react-native-web alias, 152 import refs).
6. **Token/styling assumptions [F]:** never module-scope scheme capture — components read `useKernScheme()` per render (`theme.tsx:96-107` documents the cost model); disabled washes via `withAlpha` at 12%/38%; radii from `theme.shape`.
7. **Web/mobile compatibility [F]:** native-only package; must never import `@xoroh/kern` (README "The boundary"; `check:layers`). Parity: 117 native registry rows, 92 shared concepts, 10 native-only files → web, 37 web-only → native, 0 stubs (`check:parity` PASS).
8. **Tests [F]:** dual-runner — vitest (8 files/95 cases, non-`.rntest`) **and** Jest+RNTL (50 suites/449 cases, only `*.rntest.tsx`). `docs/verification-limits.md` warns the two-runner split is a trap (running one silently skips the other). At audit time both green; an older recorded `fab-family.rntest.tsx` failure (2026-10-07) did **not** reproduce.
9. **Publishing readiness [F]:** shaped ready, unpublished (HOLD).
10. **Strengths [R]:** honest renderer split with a *measured* parity contract; mirrored variant law (aliases, size map, `NATIVE_BUTTON_VARIANT_ALIASES`); platform asymmetries documented rather than hidden (Sonner has no native counterpart by design; link = `Pressable`; RN dialog trait substitution, README "Accessibility is not optional").
11. **Limitations/debt [R]:** sheets built on RN primitives (repo flags possible future gesture library need); composition tier lives *inside* the package while web's lives in a subpath — an asymmetry to reconcile when provider packaging is decided; `buttonStyles(…, theme = resolveThemeDetails())` default invites stale-theme capture if misused; the two-runner trap.
12. **Recommended future role [R]:** become the **M3 native provider** (keep the name — renames cost more than they return, and post-1.0 need ADR-004 deprecation windows). Extract a `/start`-style composition subpath only if symmetry with web is required by tooling.

### 4.3 `@xoroh/kern-icons`

1. **Purpose [F]:** "Kern icon system: set registry, semantic aliases, and web/native Icon renderers" (`package.json:4`).
2. **Public API [F]:** `src/index.ts` / `index.native.ts`: `Icon`, `useIcon`, `SEMANTIC_ICONS` (42 pinned meanings), `resolveIconName`, `ICON_MANIFEST/ICON_NAMES/ICON_COUNT` (1340), `registerIconSet/getIconSet/listIconSets`, `IconNameInput` (`set:name`, `arrow_back` snake, `arrow-back` kebab, semantic alias — four compile-time-checked forms), `ICON_TOUCH_TARGET = 48`.
3. **Structure [F]:** `src/core/{types,resolve,naming,registry,semantic}`, `src/render/{Icon.tsx,Icon.native.tsx,useIcon.ts}`, `src/sets/material/{manifest,names,symbols,shapes/w400 (a–z chunked)}`, `tools/{sync,generate,check}.ts` + `tools/lib/*`, `config/source.json` (pinned `@material-symbols/svg-400@0.47.2`), `assets/material/rounded/*.svg` (git-ignored), `THIRD_PARTY/NOTICE` (Apache-2.0).
4. **Technology [F]:** committed TypeScript registry of `d` strings rebased to `0 0 24 24`; web renderer = inline `<svg><path>` (SSR-safe, `currentColor`); native = `react-native-svg` via the `react-native` export condition; no runtime fetch/scale.
5. **Deps/dependents [F]:** zero runtime deps; `react-native`/`react-native-svg` **optional** peers; used by both renderers and the site (25 refs).
6. **Token/styling assumptions [F]:** colour defaults to `currentColor` (follows the text role — no token coupling); sizes `16|18|20|24|32|40|48`; `filled` = M3 FILL axis.
7. **Web/mobile compatibility [F]:** both, one resolution path, two emitters (`exports` conditions).
8. **Tests/validation [F]:** vitest (3 files/76 cases: resolve, naming, path) + `icons:check` gate (5 legs: SVG standards, 24-grid bounds, platform boundary, regen byte-freshness, name reachability) — **ran green**: 1340 icons on-grid, 31 generated files byte-match, reachability 46/1340 reported (report-only).
9. **Publishing readiness [F]:** shaped ready, unpublished (HOLD).
10. **Strengths [R]:** the *core* is provider-independent (set registry + qualified names + semantic layer) — exactly the "icon infrastructure" the vision wants; deterministic offline pipeline (`sync → generate → check`); chunked tree-shakable shape modules; third-party licence hygiene.
11. **Limitations/debt [R]:** only one set ships (`EXTRA_SETS` empty, `assets/brand` empty) — set-independence is claimed but unproven; icon naming is Material-flavoured by default (semantic aliases soften this); reachability reporting shows most of the catalog is unreferenced by first-party code (fine, but a UX question for docs).
12. **Recommended future role [R]:** keep as the shared icon **infrastructure**; individual design systems register their own sets and semantic mappings; Kern must not force one visual glyph language on every provider (the semantic-alias layer, not the Material glyphs, is the provider-neutral contract).

### 4.4 The other four (brief coverage — they exist and matter) [F]
- **`@xoroh/kern` (web)**: 87 non-test component files + 72 test files + `start/` (10 files). Exports `.`, `./theme` (raw `src/theme.css`), `./tokens`, `./utils`, `./start`. **Publishing note:** `src/theme.css:1` reads `@import "@xoroh/kern-theme/theme";` — a package renamed to `@xoroh/kern-tokens` in commit `80434f0` (2026-10-01); no gate parses CSS imports, and docs site/README tell users to import `@xoroh/kern-tokens/theme` directly instead. See §15 Q4.
- **`@xoroh/kern-primitives`**: 16 modules, 81 public exports; `check:consumption` (ran green): 70 adopted, 11 explicitly `not-yet-adopted` in `adoption.json` (deliberate, reasoned entries); `check:primitives` (ran green) walks the transitive import graph forbidding tokens/native/kern/react-native/react-dom. Carries a documented **react-native-reusables adapter recipe** (`README:252-271`) — an existing 2nd-library interop story.
- **`@xoroh/kern-mcp`**: tools `list_components / get_component / get_tokens / list_themes / design_audit` (`src/tools.ts`) over generated `manifest.ts` (417 rows: 300 web + 117 native, 0 stubs) and derived `maturity.ts` (states derived from version + registry status, never hand-typed). **Test red at HEAD** (§18).
- **`@xoroh/kern-cli`**: `kern init` (scaffolds `starters/web/`, `file:` deps until publish), `kern add <component|block>` (TypeScript-compiler-API closure resolution over relative imports, mirrored layout, sha256 receipts in `kern.receipt.json`, hybrid tokens-by-default / `--self-contained`); web-only for Mode 1 (native refused until Metro asset story scoped); 15 tests green; **not in the CI `pkg` matrix** (private).

**Package-boundary verdict [R]:** current boundaries align with the vision's foundation/provider split *once you relabel what the packages are*. Do **not** rename or split `kern-tokens`, `kern-native`, `kern-icons`, `kern`. The missing pieces are additive (contracts, capabilities, provider metadata, token role-set generalisation) — not renames.

---

## 5. Current token, theme, and component architecture

### Tokens [F]
- Canonical `packages/kern-tokens/src/tokens.json` (1135 L): `palettes` (sparse OKLCH+sRGB steps), `spectrum` (11 hues × 50–950), `base`, `typography` (Inter; 15 M3 scale roles + emphasized + family/fontFaces), `shape` (10), `elevation` (L0–L5), `motion` (easing/duration/spring/schemes standard+expressive), `states` (5 opacities), `spacing` (18 steps).
- Role inventory `kern-roles.ts`: **45 M3 + 13 kern = 58**; contrast waivers are per-role and reasoned (`CONTRAST_WAIVERS`); `auditRoleInventory()` returns missing/unregistered/missing-deviation.
- Themes: `themes/kern.json` (247 L base tables + contrast overlays), 4 override-only presets, `index.json` catalog, generated `matrix.json`.
- Resolution order (`resolve.ts:105-118`): `base(mode) → contrast overlay → preset overrides`. Legacy alias `m3 → kern` kept (`resolve.ts:42`).
- Generated CSS: `tokens.css` (incl. `[data-kern-theme="<id>"]` scoped-delta blocks + `@theme inline`), `tones.css`, `motion.css`, `comp-tokens.css` (`--md-comp-*` → `--md-sys-*` maps), `tailwind.css` (`@theme { --color-md-*: var(--md-sys-*) }` adapter).
- **DTCG [F+R]:** the W3C DTCG *Design Tokens Format Module 2025.10* is the first stable spec (published 2025-10-28; verified via designtokens.org/w3.org). Kern's schema is custom (no `$value/$type`; `$comment`/`$schema` are metadata filtered by generators). Recommended interop path: an **additional generator emitting a DTCG projection** for tool exchange — do not re-author the canonical source.

### Theme architecture [F]
- Web: no React provider required — `applyKernTheme(el, mode, contrast, variant, motion)` + `useKernTheme()` hook (`web-theme.ts`), localStorage key `kern-tokens-mode`, OS `matchMedia`, `colorScheme` mirroring; site has a first-paint `THEME_INIT` inline script (`apps/site/src/routes/__root.tsx:16-41`).
- Native: `KernThemeProvider({mode, defaultMode, contrast, variant})` + `useKernScheme/useKernTheme/useKernMotion` (`theme.tsx`), controlled/uncontrolled mode.
- `pipeline.ts` declares the `StyleEngine` contract (web = css-vars, native = scheme-object) **without moving code** (ADR-005) — the declared seam for a future engine split.
- Theme address = `Mode × Contrast × ThemeSelection` triple, identical on both renderers; subtree scoping via `data-kern-theme` (components may never name a preset — pinned by `check:kern`).

### Component architecture [F]
- **Web:** CVA variants + Tailwind arbitrary-value classes reading `--md-sys-*` (`button.tsx:1-522`: 5 M3 configurations × `color` axis (`danger`) × size × shape × block/toggle/selected + compoundVariants; M3 aliases `filled→primary`, `text→ghost`; state *layers* via `before:` overlay + `--md-sys-state-*` opacities). Behaviour from `@base-ui/react` (ADR-002) + `kern-primitives`. Composition tier `src/start/` (blocks, link, navigation, panes, scaffolds, top-app-bar) via `@xoroh/kern/start`, forbidden direct Base UI imports (enforced).
- **Native:** single-function components per concept, style-map functions + `Pressable`, press via kernel `useKernPress`, ripple/hitSlop, `accessibilityRole/State/Label/Hint` throughout (measured: 132 label / 110 state / 34 role refs).
- **Bindings:** `presentation.tsx` in each renderer binds kernel models to platform mechanics; deliberately **not** barrel-exported (`docs/binding-contract.md`, draft status).
- **Variant law [F]:** `variant` meaning frozen per component and identical across platforms (`docs/platform-parity.md:54-90`); guarded by tests + docs.
- **Callback lexicon [F]:** `value/defaultValue/onValueChange` and `open/defaultOpen/onOpenChange` are canonical; older names are deprecated aliases resolving to one store; guarded by `packages/kern/src/callback-lexicon.test.ts`.
- **Registry:** generated `packages/mcp/src/manifest.ts` (417 rows) → `docs/components.md` → site `src/generated/manifest.ts` (route source of truth); `status: real|stub`, 0 stubs (stubs are never wired — `conventions/stubs.md`).

---

## 6. Web and native readiness assessment

- **Web: production-shaped, pre-release [F].** 87 component modules, Base UI behaviour, Tailwind+CVA, 72 test files (791 cases green at audit time), 9 web parity suites, axe-core scan present in exactly **one** file (`accessibility.test.tsx`, violations `toEqual([])`), Playwright e2e (dialog focus trap, sheet dismissal, painted-page, visual-baseline seeds) — 12 cases. Gaps: no visual regression assertions (baseline PNGs are seeded for human promotion); a11y coverage on the site is *expectations, not measurements* (`apps/site/scripts/generate-a11y.mjs` header says no axe runner exists in the site pipeline).
- **Native: production-shaped, pre-release [F].** 89 component modules, 50 Jest suites (449 cases) + 8 vitest files (95), parity suites per family, Expo host with three real screens, no framework lock-in. Gaps: gesture-heavy sheets adequacy (repo's own flag), no Detox/E2E on device, two-runner trap.
- **Shared contracts: unusually mature [F].** `parity/contract.ts` (27 rows, families `toggle|named-surface|text-field|stepper|otp-field|hint-surface|static-content`, provenance fields enforced by `check:parity`), `PARITY_COUNTS = {web: 300, native: 117, shared: 92}`, `currency-claims.ts` (spec-currency admissibility + `SUPERSEDED` chain), `check:elevation-parity` (cross-renderer resting elevation), `check:consumption` (adoption ledger).
- **Red signals at audit time [F] (§18 has command output):** ① `packages/mcp` manifest test fails **at HEAD** (SearchBar vs `src/components/index.ts`); ② `check:coverage` fails **at HEAD** (`presentation.tsx` not excluded); ③ `check:kern` fails **at HEAD** by 1 false positive (regex matches prose in `studio.tsx`) and at 5 findings in the dirty tree; ④ `kern-tokens` `tokens.test.ts:55` fails **dirty-tree only** (secondary baseline change in flight); ⑤ `check:elevation-parity`, `lint`, site `check:docs`, site `check:gallery` red on the dirty tree; ⑥ CI `apps` job runs `bun run bundle` in `apps/mobile` but `apps/mobile/package.json` has **no `bundle` script** (verified at HEAD and WT) — that CI step cannot succeed as written [I: would fail when reached].

---

## 7. Multi-design-system architecture analysis

**Current state [F]:** there is no provider abstraction. What exists that helps:
- Docs-side registry with a documented "second system lands as data" path (`apps/site/src/systems/design-systems.ts:1-45`, `DESIGN_SYSTEMS` + `CURRENT_SYSTEM_ID = "m3"`).
- Research track `docs/design-systems/` (14 systems, part-by-part matrix, explicitly "research only, NO implementation (founder directive)").
- Spec-currency machinery (`parity/currency-claims.ts`, `check:currency`, `m3-usable/` extracts, `m3-archive/` evidence locker) — a natural basis for *design-system specification versioning*.
- Maturity derived from package version + registry status (`packages/mcp/src/maturity.ts`).

**What blocks it [F]:** token role-set is fixed to M3's 58 roles with M3 var names; `check:kern` is an M3 law; the flagship package names (`@xoroh/kern`, `@xoroh/kern-native`) read as *platform* names but are M3 implementations; blocks/CLI/manifest are keyed to one provider's packages.

### Provider architecture [R]/[P]
- **Packaging:** provider = **group of packages following the existing renderer split**: for M3 that is today's `kern` (web) + `kern-native` (native) + its presets inside `kern-tokens`, explicitly labelled `provider: m3`. A future provider gets its own pair (e.g. `@xoroh/<name>{,-native}`), not a conditional inside Kern's packages. Shared: tokens (schema), primitives (behaviour), icons (infrastructure), contracts (types + tests), mcp (metadata).
- **Registration & identity [P]:** each provider package exports a `providerManifest` (§16.1) — `{ id, label, spec: { system, generation, evidence }, contractVersion, capabilities, deps }`. A tiny registry function (`listProviders`, `providerById`) lives in the new contracts package; the MCP manifest embeds it so tooling sees one inventory.
- **Selection:** **build-time** (the app imports one provider's package; the bundler drops the rest). Runtime *theme* switching (mode/contrast/preset) already exists; runtime *provider* swapping is a non-goal (different dependency graphs, different DOM).
- **Tree-shaking:** per-component barrels + `sideEffects: false` (already on primitives/icons; extend to provider packages), keep deep-import bans, keep CLI vendoring as the zero-dependency option.
- **Missing components:** see §8. **Capability differences:** declared, never silently dropped (§16.3). **Provider-specific extensions:** extension axes already exist per component (`color`, `shape`, preset overrides, `registerIconSet`, `registerVariant`, feedback-variant registry) — the contract must mark them optional rather than flattening them.

### Component contract classification (concrete) [R]

| Example | Baseline (common contract) | Optional capability | Provider-specific |
|---|---|---|---|
| **Button** | `variant` law (5 configurations), `size`, `color` axis, disabled/soft-disabled obligations, `loading`, controlled/uncontrolled `pressed` | toggle-morph, `href` link-variant (web-only delivery of the same obligation) | M3 alias set (`filled/text`) |
| **Text input / Field** | value/state callbacks, label+description+error **obligation**, a11y name/state | OTP/`input-otp`, `number-field` stepper | error delivery mechanism (describedby vs hint-fold) |
| **Checkbox** | checked axis, group membership, label obligation | indeterminate (if the system defines it) | visual treatment |
| **Dialog** | `named-surface` family: modal, named, dismissal paths recorded per platform (escape vs hardware-back) | full-screen variant | focus initial-target policy |
| **Select** | selection model + listbox semantics + value callbacks | typeahead/combobox, multi-select | popover vs bottom-sheet presentation |
| **Date picker** | value contract, calendar semantics | **range** (explicit gap: `matrix.md` G-range), clock view | M3Expressive vs other calendars |
| **Data table** | basic table + caption obligation (parity family `static-content`) | sort/pagination as capabilities | **advanced grid → rent/wrap (`R-G`)**, not a Kern rebuild |
| **Navigation** | selection + roving focus + landmarks; bar/drawer/rail as surfaces | rail on narrow screens | M3-specific sizes |
| **Command palette** | *not baseline* — most surveyed systems lack it (`matrix.md`: `–`); becomes a contract only when two providers ship it | — | provider-specific today |

Rule of thumb [R]: baseline = behaviour + role/label/state **obligations** (what `parity/contract.ts` already encodes); API *shape* stays free within documented mappings; visual treatment is never in the baseline. This is the anti-lowest-common-denominator guard: obligations are met by each provider's own delivery.

### Design-system versioning [R] — five coordinates, never conflated
1. **Provider identity** — stable string (`m3`).
2. **Specification generation + evidence date** — e.g. `m3-expressive` with a spec-snapshot pointer (`docs/design-systems/m3-usable/`, `currency-claims` URLs, `SUPERSEDED` chains).
3. **Kern implementation version** — per-package semver via changesets; ADR-004: free change pre-1.0, one-minor deprecation window from 1.0.
4. **Underlying dependency versions** — Base UI / RN as peers, host-controlled.
5. **App-selected version** — the app pins provider packages; maintenance/security rides as patches (`updateInternalDependencies: patch`), visual/behavioural change rides as minor/major with migration notes.

An app stays on a known visual implementation by pinning `^minor.patch-range` and reading the changeset bodies — this machinery already exists; it needs the provider metadata (coordinate 1–2) attached to it.

---

## 8. Missing-component strategy

The repo already has the right instinct: **measured, not claimed** (`docs/parity-contract.md`), `status: real|stub` with stubs never wired, `NON_M3_ROWS` recording deliberate absence (`scroll-area`, `input-otp`, `number-field` — "M3 defines no such component"), and `RULED OUT` entries with evidence. Generalise this [R]/[P]:

1. **Registry provenance field:** `origin: "spec-native" | "kern-adaptation"` on every component row (§16.1). `spec-native` requires a `currency` claim URL (reuse `check:currency`); `kern-adaptation` requires a rationale + the foundations it uses.
2. **Docs:** a visible badge on the component page ("Defined by M3" vs "Kern adaptation for M3") generated from the registry — same source, no hand-typing (mirrors `maturity.ts` discipline).
3. **Tests:** adaptation tests must assert the component uses provider foundations (roles from the scheme, shape scale, motion tokens) — an adaptation that hardcodes hex fails review/`check:kern` (the off-scale scan already exists).
4. **Placement:** adaptations live in the **provider's package**, importing only shared primitives/tokens — never in the shared layer, so a second provider can decline them.
5. **Never claim spec-native without a citation** — `check:spec-urls` already fails invented/404/M2 links on the site; extend the same rule to registry `currency` claims.

---

## 9. Shared API and compatibility recommendations

**Standardise (platform-independent) [R]:** variant law; canonical callback lexicon (`value/open` families — already executable via `callback-lexicon.test.ts`); controlled+uncontrolled state (kernel `useControllableState`); composition/slot doctrine (`render` on web, `mergeSlotProps` on native; `asChild` grandfathered — `conventions/api-consistency.md §3`); `KernSize` size foundation; a11y obligation families from `parity/contract.ts`; ref composition (`mergeRefs` in kernel); capability declarations (§16.3).

**Specialise per platform [R]:** focus rendering (ring vs platform focus), dismissal (escape vs hardware-back), portals/modality (kernel model, platform hosts), hover/preview, scrolling, fonts/loading, haptics/gestures, form integration mechanics (Base UI field vs RN controlled inputs), responsive layout (pane breakpoints — keep as tokens).

**Extension points to preserve [F]:** per-component `color`/`shape` axes; `defineThemePreset` override validation; `registerIconSet`; variant registry (`registerVariant` — surfaced as "tenant" presets in the theme studio); feedback-variant registry; motion algorithms.

**Compatibility practice [R]:** keep contract tests *primitive-agnostic* (assert role/name/state, never DOM structure — the rule already written at `docs/parity-contract.md:21-46`), so a future primitive swap cannot invalidate them.

---

## 10. Theme and blocks architecture

### Four distinct concepts (all already distinguishable in the tree) [F]
1. **Shared Kern theme infrastructure (Kern owns):** resolver, role schema + audit, shape/elevation/motion scales, contrast engine, preset validation, matrix artifact + drift gates, projection engines (`applyKernTheme` / `KernThemeProvider`), CSS generators. `kern-tokens` + the two engine files.
2. **Design-system-specific theme presets (provider owns):** today `themes/kern.json` + `sharp/brand/compact/demo` = the M3 theme family, plus app-defined presets via `defineThemePreset` (overrides-only, contrast-validated). The infrastructure changes *values*, not structure — but note the *structure itself* (58 roles) is M3's: that is the generalisation item.
3. **Design-system-specific components:** per-renderer packages (§4.2, §5).
4. **Design-system-specific blocks:** composed interfaces over one provider's components.

### Blocks today [F]
- Web composition building blocks live in `@xoroh/kern/start` (`SearchBar`, `SettingsRow`, `AppShell`, `NavigationRail`, panes, scaffolds…) with the tier law: component → block → scaffold, lower never imports higher (`docs/architecture.md:133-153`).
- **Installable blocks** are real `.tsx` sources in `apps/site/src/blocks/` with `manifest.ts` (`BlockEntry { name, title, category, description, file, files[], registryDependencies[], dependencies[] }`) — 3 shipped (`settings-screen`, `auth-form`, `empty-search`), gated by `check-blocks.mjs` (no site-chrome imports, every registryDependency must be a real export).
- Distribution is **source-vendoring, shadcn-style, already implemented**: `kern add <block>` text-parses the manifest (deliberately not a runtime import — "a shared runtime import would couple the CLI to the site's bundler", `kern-cli/src/blocks.ts:47-51`), copies declared files under `<dest>/blocks/`, records a receipt. Components vendor with TS-compiler-API closure resolution (`add.ts`/`closure.ts`).
- Docs research for the next blocks tranche: `docs/planning/04-blocks.md` (manifest type, viewer, categories) — partially landed.

### Recommendation [R]/[P]
- **Distribution:** keep **source-vendoring as the primary channel** (it matches the open-source, own-your-code, receipts model and works pre-publish); add package distribution later only if versioned block dependencies become painful. Blocks are *source*, previews are *generated from those same bytes* (`?raw` import in the viewer guarantees the fence cannot drift).
- **Provider binding:** blocks must declare `provider: "m3"` + `componentDeps` referencing **provider-qualified** names (§16.4). A block never imports an unrelated provider's package; `check-blocks` gains a provider match rule. Thematic portability comes from blocks using only `--md-sys-*`-style *role tokens* via the shared theme layer, never literal values (already enforced: "zero hex" rule in `04-blocks.md` design).
- **Install/theming/preview:** unchanged — manifest + viewer + CLI; add provider badge + capability notes to the viewer.
- **Do not** generate blocks from templates at build time; keep the 3 real ones honest (D8 "real-only" rule already holds the line).

---

## 11. Open-source prior-art analysis

### Already researched in-repo (verified files) [F]
`docs/design-systems/` = 14 per-system notes + `matrix.md` (codes: they-have Y/P/–; kern B/W/N/G/R). High-value learnings recorded there:
- **shadcn/ui** — registry-as-distribution + blocks + 3-install-paths; *Kern already mirrors the shape* (manifest + CLI + viewer). Does not solve: cross-renderer parity, tokens.
- **Base UI** — Kern's web behaviour base (ADR-002); learn `render` doctrine, anatomy-first docs, imperative handles. Not a dependency candidate beyond current use; no native story.
- **m3-material-web** — reference implementation, **maintenance mode** → the M3 reference slot is open; learn ref→sys→comp token layering (Kern's `--md-comp-*` mirrors it). Does not solve Kern's native side.
- **MUI** — data-not-pages docs, per-demo axe JSON, open-core ladder; Material **2**, not M3. Alternative approach only.
- **React Native Paper** — the direct MD3-native incumbent; PaperProvider/theming parallels; Kern differentiates on parity contract + deviations slot. Possible *inspiration*, not a dependency.
- **Tamagui / Gluestack / NativeBase** — universal-runtime approaches Kern deliberately declined (renderer split + contract instead of one universal runtime — recorded as "decided-divergence"); NativeBase = tombstone/lessons.
- **Carbon / Ant / Fluent / Chakra / Mantine** — docs IA, patterns/blocks layer, per-platform IA, token-recipe ergonomics: documentation/tooling inspiration only.
- **react-native-reusables** — Kern already ships an **adapter recipe** in `kern-primitives/README:252-271` (Slot/Presence/Portal/… mapped 4-way, live-verified) — a working example of "shared kernel with interop", not a dependency (D-031 measured owning the wiring).

### External verification (this audit) [F]
- **W3C DTCG Design Tokens Format Module 2025.10** — first stable version 2025-10-28 (designtokens.org / w3.org CG report). Relevance: interchange, not canonical storage. Kern's generators already use `$`-metadata discipline. **Possible dependency (generator-side) or inspiration (projection)**; do not adopt as canonical now.
- **React Aria (Adobe)** — actively maintained headless web library (react-aria-components v1.20.0 line, verified releases page). Alternative to Base UI for *web behaviour*; no first-party React Native surface found. **Alternative approach**, not a recommendation to switch (ADR-002 is settled and enforced).
- **Style Dictionary / Tokens Studio** — DTCG-aware token tooling (verified via styledictionary.com/info/dtcg, docs.tokens.studio). **Possible dependency** for a DTCG projection step; Kern's generators are bespoke and currently sufficient.

### What none of them solve for Kern [R]
A single **cross-renderer behavioural parity contract with executable per-side suites**, provider pluggability over a shared token/behaviour kernel, and a spec-currency ledger. Kern's own `parity/`, `kern-primitives`, and `currency-claims` are the differentiating prior art — invest there rather than replacing them.

---

## 12. Three architecture options

### Option A — Minimal evolution
Keep every package and boundary; add only: provider **metadata** (a `provider` field + manifest entry, no new package), fix the red gates, document the M3-provider labelling in `docs/architecture.md`, add the `origin` field for missing components.
- **Deps:** none new (metadata lives in `mcp` manifest + READMEs). **APIs:** additive only.
- **Pros:** near-zero migration; no consumer impact; fastest to publish 0.1.0. **Cons:** contracts remain implicit (parity contract is data in `parity/`, not importable API); a second provider would still fork the token schema; capability claims stay unenforced.
- **Migration:** days. **Maintenance:** low. **Risk:** low. **Bundle:** unchanged.

### Option B — Recommended: shared foundation + labelled providers + contract package
Everything in A, plus:
1. New small package **`@xoroh/kern-contracts`** (name provisional): component contract *types*, capability declarations, the provider manifest type, and a **shared contract-test harness** both renderers (and future providers) import. `parity/contract.ts` becomes its data instance (moved or re-exported — one migration, one consumer seam).
2. **Token role-set registry** inside `kern-tokens` (additive API): providers declare their role set; M3's 58 remain the default and `check:kern` becomes "the M3 provider's law" rather than the whole repo's law.
3. `kern`/`kern-native` export `providerManifest` and are documented as the M3 provider; mcp manifest embeds provider + origin + capability data.
4. Blocks/CLI gain provider-qualified dependency checks.
- **Pros:** contracts become a real, versionable API; second provider is additive; no renames; gates stay. **Cons:** one new package to version/publish; a bounded migration of `parity/` imports; some doc churn.
- **Migration:** ~1–2 stages of the roadmap (§14 Stages 2–3); no breaking consumer change (all pre-1.0).
- **Bundle:** negligible (types + a few functions; tree-shakable). **Risk:** medium-low — main risk is over-generalising the schema before a second consumer exists; guard by only extracting what Stage 9 needs.

### Option C — Long-term platform architecture
Neutral facade `@xoroh/kern` (types + provider selection + theme infrastructure) with implementations moved to `@xoroh/kern-m3{,-native}`; separate `@xoroh/kern-start` package again; per-provider token packages; registry-style provider discovery; multi-provider docs routing (`/components/<provider>/…`).
- **Pros:** cleanest identity story; scales to N providers and N platforms. **Cons:** breaks every import path, the site, the CLI, the parity tooling and the gates at once; two-package indirection for the 99% case (one provider); premature while zero second providers exist.
- **Migration:** large (touches every consumer, requires ADR-004-style coordination even pre-1.0). **Risk:** high; contradicts "preserve what works" without evidence of strain.

### Recommendation: **Option B**, staged so A's fixes land first (Stage 1), B's seams land before publish (Stages 2–4), and C is re-evaluated only if/when a second provider ships (Stage 9 evidence). This fits the codebase (all changes are additive to an already well-gated tree) and the vision (platform ≠ provider) without betting on hypotheticals.

---

## 13. Proposed package structure and dependency graph

**Proposed (Option B) [P]** — existing names unchanged, one new package:

```
                 ┌───────────────────────────┐
                 │ @xoroh/kern-tokens        │  role-set registry (NEW, additive),
                 │ (shared token foundation) │  M3 values = default preset
                 └────────────┬──────────────┘
                 ┌────────────┴──────────────┐
                 │ @xoroh/kern-primitives    │  shared behaviour (unchanged)
                 └────────────┬──────────────┘
                 ┌────────────┴──────────────┐
                 │ @xoroh/kern-contracts (NEW)│ contract types + capability decls
                 │                            │ + provider manifest + test harness
                 └───────┬──────────────┬─────┘
        (M3 WEB)         │              │        (M3 NATIVE)
   ┌─────────────────────▼──┐      ┌────▼──────────────────────┐
   │ @xoroh/kern            │      │ @xoroh/kern-native        │
   │ + ./start (composition)│      │ (composition in-package)  │
   │ exports providerManifest│     │ exports providerManifest  │
   └───────────┬────────────┘      └────┬──────────────────────┘
               │   (peers never import each other — check:layers)
   ┌───────────▼────────────┐      ┌────▼──────────────────────┐
   │ @xoroh/kern-icons      │      │ apps/site (web docs)      │  independent of providers
   │ (set infrastructure)   │      │ apps/mobile (RN host)     │
   └────────────────────────┘      └───────────────────────────┘
   @xoroh/kern-mcp  (reads registry incl. provider/capability metadata; imports nothing)
   @xoroh/kern-cli  (private; vendors components/blocks per provider-qualified manifest)
```

Per-package rules [P]: `kern-contracts` depends on nothing but types (no React, no tokens) — providers depend on it; **nothing shared may depend on a provider**; `mcp`/`cli` read, never import; icons stay provider-independent (sets are data).

| Package | Responsibility | Public API (new bits marked) | Must NOT depend on it | Publish |
|---|---|---|---|---|
| `kern-tokens` | shared token schema + M3 values + engines' inputs | + `defineRoleSet`, `roleSetFor`, DTCG projection *(deferred)* | apps' UI code | yes |
| `kern-primitives` | shared behaviour | unchanged | tokens/renderers (enforced) | yes |
| `kern-contracts` *(new)* | contract types, capability + provider manifest, harness | `ComponentContract`, `Capability`, `ProviderManifest`, `runContractSuite` | any renderer | yes |
| `kern` / `kern-native` | M3 implementations | + `providerManifest`, `origin` metadata | each other (enforced) | yes |
| `kern-icons` | icon infrastructure + sets | unchanged | — | yes |
| `kern-mcp` | machine registry incl. provider metadata | + provider/origin fields | — | yes |
| `kern-cli` | vendoring/scaffold | + provider-qualified dep checks | — | no |

---

## 14. Migration roadmap (stages, with acceptance criteria)

> Dependencies flow downward; each stage lists only its own delta.

**Stage 1 — Preserve & document current behaviour (no code moves)**
- *Goal:* a truthful baseline before evolution. *Files:* `docs/architecture.md` (add "the packages ARE the M3 provider" section), this report, red-gate fixes: `packages/mcp/src/manifest.test.ts` or `generate-manifest.mjs` (start-tier barrel rule), `scripts/check-coverage.mjs` (`NOT_A_COMPONENT` entry for `presentation` **or** a ruling), `scripts/check-kern.mjs:681` (preset-read regex must not match prose).
- *Acceptance:* `bun run lint`, `bun run typecheck`, `bun run test:all`, `check:kern`, `check:coverage`, `check:parity`, `check:contrast` all exit 0 on a clean tree; CI green on main. *Tests:* existing suites. *Risks:* a "fix" that hides a real defect — each fix must state whether it was bug or gate. *DoD:* clean `git status`, red list empty, docs updated.

**Stage 2 — Establish shared foundations (additive)**
- *Goal:* token role-set registry + contracts package skeleton. *Files:* `packages/kern-tokens/src/{kern-roles,resolve}.ts` (additive exports), new `packages/kern-contracts/` (`src/{contract,capability,provider}.ts`), root `package.json` scripts (`check:contracts`), `scripts/build-order.mjs` registration.
- *Depends on:* Stage 1. *Acceptance:* M3 declares its role set through the new API with **identical resolved output** (matrix diff empty); `check:theme-matrix` still green; new package passes `publint`/`attw`. *Tests:* unit tests for registry; golden test that `resolveThemeDetails` output is byte-identical. *Risk:* premature abstraction — mitigate by only wrapping existing data.

**Stage 3 — Define and validate component contracts**
- *Goal:* move `parity/contract.ts` consumption onto `kern-contracts` types; both renderer suites run against the shared harness; add capability declarations for the first 10 baseline components (Button, Field/Input, Checkbox, Dialog, Select, Snackbar, Tabs, Menu, List-item, Progress).
- *Files:* `parity/contract.ts`, `packages/kern/src/parity/*`, `packages/kern-native/src/parity/*`, `scripts/check-parity.mjs` (point at the new types, keep counts).
- *Acceptance:* `check:parity` counts unchanged (300/117/92); a deliberately falsified capability fails the new `check:capabilities`. *Risk:* type churn in parity suites — do it in one PR per family.

**Stage 4 — First complete M3 provider, labelled**
- *Goal:* `providerManifest` exported by both packages; registry + site + MCP display provider id, spec generation, maturity; `origin` field (`spec-native | kern-adaptation`) with `check:currency` linkage.
- *Acceptance:* `mcp` manifest rows carry provider+origin; site component pages show the badge; no API break (additive only). *Depends on:* 2–3.

**Stage 5 — Web + native coverage**
- *Goal:* close or rule the 37 web-only / 10 native-only gaps; close `verification-limits.md` honesty items; add a second axe entry point (per-family, not one file) and native a11y assertions already present are promoted to contract obligations.
- *Acceptance:* `check:parity` gap counters reach 0 or every remainder has a ruling row; a11y expectation→measurement story started.

**Stage 6 — Design-system-specific themes**
- *Goal:* presets as first-class provider-owned data with provider-qualified ids; theme studio lists them; scoped `[data-kern-theme]` blocks verified per preset (already generated).
- *Acceptance:* `check:theme-matrix` cell count documented; adding a preset = data only.

**Stage 7 — Blocks on the shared component API**
- *Goal:* block manifest gains `provider` + `componentDeps`; `check-blocks` enforces provider match; CLI refuses cross-provider vendoring; grow block set (dashboard/nav shells/forms/settings/pricing/auth per brief) — each real, D8-style.
- *Acceptance:* `kern add <block>` receipts record provider; viewer badge shown; no site-chrome imports.

**Stage 8 — Docs, previews, testing, distribution polish**
- *Goal:* e2e visual baselines promoted from seeds to assertions (or documented as manual); `check:gallery` bun/RN interop fixed; site `check:docs` green; consumer Tailwind story documented and starter-tested (§15 Q3); publish readiness re-verified (`check:publish`, `preflight:publish`).

**Stage 9 — Second independent implementation (architecture validation)**
- *Goal:* one **small** second provider (e.g. a 6–8 component system or a "neutral" mini-system) implemented as `{name}` + `{name}-native` against `kern-contracts` + role-set registry, proving: token schema suffices, contracts don't force M3 structure, docs registry path works.
- *Acceptance:* provider manifest listed by MCP; its blocks (if any) install; contract suites pass; **no fork of `kern-tokens`**. *Decision point:* if this succeeds → C reconsidered; if it strains → revisit §12 trade-offs.

**Decisions owed before implementation [R]:** provider package naming; whether `kern-contracts` is a package or a `kern-primitives` subpath (default: package — primitives must stay token/contract-free by its own law); `origin` field name/enums; token schema generalisation shape. **Safe to defer [R]:** DTCG projection; `/start` package split; runtime provider selection (non-goal); advanced-grid/rent decisions; native Mode-1 vendoring; Option C facade.

---

## 15. Risks, technical debt, unresolved questions

**Risks / debt [F+R]**
1. **Red-at-HEAD gates** (manifest test, `check:coverage`, `check:kern` false positive) — CI cannot be trusted until Stage 1; three of them are visible only by running the gates (§18).
2. **Conflated identity** — publishing `@xoroh/kern` before the provider-identity decision bakes the platform/provider confusion into npm (pre-1.0 is the only free rename window; ADR-004).
3. **Dirty-tree discipline** — 358 uncommitted entries, several failing tests/gates are in-flight work (secondary colour baseline, chip/toolbar elevation, docs checks). Any follow-up must start from a clean-tree re-run.
4. **Tailwind consumer story** — components are styled with utility classes compiled by the *consumer's* Tailwind from source; published `files` excludes `src/components`. Starter (`packages/kern-cli/starters/web/src/app.css`) relies on Tailwind v4 automatic content detection reaching `node_modules/@xoroh/kern/dist` (unverified for a real consumer install) [Q3].
5. **`@xoroh/kern/theme` broken import** — `packages/kern/src/theme.css:1` imports `@xoroh/kern-theme/theme` (renamed away in `80434f0`); no gate parses CSS imports; docs point users at `@xoroh/kern-tokens/theme` instead [Q4].
6. **Single axe file / expectations-not-measurements** on the site; visual regression not asserted.
7. **Two-runner trap** in `kern-native` (documented, easy to misuse locally).
8. **CI `apps/mobile` `bundle` script missing** (§6 ⑥).
9. **Stale docs spots** found: `apps/mobile/README.md` ("Empty on purpose" vs ~790 LOC), `apps/site/src/demos/web/registry.tsx` header references a non-existent `registry-audit.ts`, `docs/architecture.md` theme.css description vs actual file.
10. **`.team/programs/K-01-deviations.md` referenced by gates/docs does not exist in this repo** (`scripts/check-elevation-parity.mjs:163-166` resolves it from a `KERN_TEAM_ROOT`/monorepo-root `.team`; local `.team` has only `briefs/`, `reports/`) — deviation ids resolve only when the org-root directory is present [Q5].

**Unresolved questions [Q]**
- **Q1 Provider packaging:** separate provider packages (recommended default) vs facets vs facade (Option C).
- **Q2 Token format:** keep custom canonical + optional DTCG projection (recommended) vs adopt DTCG canonical.
- **Q3 Tailwind delivery:** is `@source` of `node_modules` needed for consumers, or should Kern ship a pre-compiled component CSS layer? Must be answered before publish (starter + a scratch consumer install will answer it empirically).
- **Q4** `@xoroh/kern/theme` fix: point at `@xoroh/kern-tokens/theme`, or drop the subpath (pre-1.0 free).
- **Q5** Deviation-registry location (org-root `.team` vs in-repo `docs/`).
- **Q6** Blocks distribution once providers > 1 (source-vendoring recommended to persist).
- **Q7** Second-provider candidate choice (Stage 9 input).
- **Q8** `@xoroh/kern/start` split (ADR-002 amendment kept it in-package; Option C would undo — defer until strain is real).

---

## 16. Proposed APIs (PROPOSALS — nothing below exists)

### 16.1 Provider manifest [P]
```ts
// @xoroh/kern-contracts (new)
export type ProviderManifest = {
  id: string;                       // "m3"
  label: string;                    // "Material 3"
  spec: { system: string; generation: string; evidence: string[] }; // urls/dates
  contractVersion: string;          // semver of the contract suite implemented
  renderers: Array<"web" | "native">;
  capabilities: Record<ComponentName, CapabilityDeclaration>;
};
// exported by @xoroh/kern and @xoroh/kern-native as `providerManifest`
```

### 16.2 Token role-set registry [P]
```ts
// @xoroh/kern-tokens (additive)
export function defineRoleSet(set: {
  id: string; roles: readonly string[]; varPrefix?: string; // default "--md-sys-"
}): RoleSet;
export const M3_ROLE_SET: RoleSet;      // today's 45+13, defined through the API
export function roleSetFor(providerId: string): RoleSet;
// resolveThemeDetails stays M3-default; a second provider resolves against its set.
```

### 16.3 Capability declaration [P]
```ts
export type CapabilityDeclaration = {
  supported: string[];               // ["toggle", "loading", "href-as-link"]
  unsupported?: Array<{ feature: string; reason: string; specRef?: string }>;
  origin: "spec-native" | "kern-adaptation";
  currencyRef?: string;              // required when origin = "spec-native"
};
```

### 16.4 Contract test harness [P]
```ts
// @xoroh/kern-contracts
export function runContractSuite<C extends ComponentContract>(
  contract: C,
  impl: ContractImplementation<C>,   // renderer-supplied queries: query(), props, events
): ContractResult;                   // role/name/state obligations, never DOM structure
```

### 16.5 Provider-qualified block manifest [P]
```ts
// apps/site/src/blocks/manifest.ts (extended)
type BlockEntry = { /* existing fields… */ provider: "m3"; componentDeps: string[] };
// check-blocks: every componentDep resolves in THAT provider's registry; CLI refuses cross-provider.
```

---

## 17. Important files and symbols reviewed

**Root/config:** `package.json`, `biome.json`, `.changeset/config.json`, `.github/workflows/{ci,release,deploy}.yml`, `TODO.md`, `AGENTS.md`.
**Docs:** `docs/architecture.md` (packages, dep direction, tiers, gates), `docs/binding-contract.md`, `docs/platform-parity.md`, `docs/parity-contract.md` (structure), `docs/versioning.md`, `docs/releases.md`, `docs/verification-limits.md`, `docs/adr/{001,002,003,004,005}`, `docs/conventions/{api-consistency,file-ownership,parity,primitives,stubs,changesets,component-docs}.md`, `docs/design-systems/{README,matrix,m3-material-web,shadcn,base-ui,rn-paper,tamagui,…}.md`, `docs/planning/00-index.md`, `docs/planning/04-blocks.md`, `docs/plan/README.md`.
**kern-tokens:** `src/index.ts`, `src/tokens.ts`, `src/resolve.ts` (`resolveThemeDetails:105`, `varName:129`, `LEGACY_ALIASES:42`), `src/pipeline.ts` (`seedStage/mapStage/aliasStage/componentStage:45-105`, `assertSingleRoleTable:215`, `scopedDeltas:287`), `src/kern-roles.ts` (`M3_ROLES:180`, `KERN_EXTRA_ROLES:163`, `auditRoleInventory:198`), `src/tokens.json`, `src/themes/*.json`, generated CSS files, `scripts/{gen-css,gen-comp-css,gen-tones-css,gen-motion-css,gen-theme-matrix,check-contrast,check-theme-matrix}.mjs`.
**kern (web):** `package.json` (exports/files/peers), `src/index.ts`, `src/components/index.ts` (650 L barrel), `src/components/button.tsx` (`buttonVariants`, `ButtonProps:273`, `BUTTON_VARIANT_ALIASES`), `src/components/presentation.tsx`, `src/web-theme.ts` (`applyKernTheme:44`, `useKernTheme:94`), `src/theme.css:1`, `src/start/{index,blocks,navigation,panes,scaffolds,top-app-bar}.tsx`, `src/callback-lexicon.test.ts`, `src/composition.test.ts`.
**kern-native:** `package.json`, `src/index.ts` (477 L), `src/theme.tsx` (`KernThemeProvider:56`, `useKernScheme:104`, `useKernMotion:138`), `src/components/button.tsx` (`NativeButtonProps:251`), `src/components/web-parity.tsx`, `src/components/presentation.tsx`, `README.md` (boundary + a11y sections), jest/vitest configs.
**primitives:** `src/index.ts` (module doc + 16 modules), `README.md` (`Adapting react-native-reusables:252`), `adoption.json`.
**icons:** `README.md`, `src/index.ts`/`index.native.ts`, `src/core/resolve.ts`, `src/core/semantic.ts`, `tools/{sync,generate,check}.ts`, `config/source.json`.
**cli/manifest:** `src/kern.ts` (commands, dual namespace refusal), `src/add.ts`, `src/closure.ts`, `src/init.ts`, `src/blocks.ts`, `starters/web/{package.json,src/app.css}`.
**mcp:** `src/{index,tools,manifest,maturity}.ts`, `src/manifest.test.ts`, `scripts/generate-{manifest,maturity}.mjs`.
**parity/e2e/scripts:** `parity/contract.ts` (`ParityRow`, `CONTRACTS`, `PARITY_COUNTS:1136`, `assertParity:1217`), `parity/currency-claims.ts` (`CURRENCY_CLAIMS:60`, `NON_M3_ROWS:127`, `SUPERSEDED:143`), `e2e/*`, `scripts/check-{kern,layers,coverage,parity,currency,consumption,primitives,workflow,stale-refs,elevation-parity,dist-exports,ts-policy,pack,registry-paths}.mjs`, `scripts/{generated-artifacts,build-order,build-lock,preflight-publish}.mjs`.
**apps:** `apps/site/{package.json,vite.config.ts,src/styles.css,src/systems/design-systems.ts,src/blocks/manifest.ts,src/routes/docs/getting-started.tsx,src/routes/foundations/index.tsx,scripts/*}`, `apps/mobile/{package.json,App.tsx,src/*}`.

---

## 18. Tests and commands executed (actual results)

> All read-only checks; nothing was written to the repository by these runs. "Audit" runs were executed by this audit (directly or via its exploration sub-steps) on 2026-10-13.

| Command | Exit | Result |
|---|---|---|
| `bun run check:layers` | **0** | layering holds: primitives/tokens/icons layer 0, kern/native layer 1, cli/mcp tooling; no upward/renderer↔renderer edges |
| `bun run check:kern` | **1** | **5 violations**: chip `level1` vs M3 `level0`; toolbar `level3` vs `level2`; `apps/site/.../studio.tsx` "reads a preset theme file" (**false positive** — regex `scripts/check-kern.mjs:681` matches the prose "…from the empty template … themes/brand.json"; **reproduces at HEAD**); `extended-fab.tsx rounded-[20px]`; `list-item.tsx rounded-[16px]` (last four patterns absent at HEAD → dirty-tree) |
| `bun run check:coverage` | **1** | `presentation` component file not barrel-exported and not in `NOT_A_COMPONENT` — **fails at HEAD too** (script unmodified) |
| `packages/kern-tokens: bun run test` | **1** | 8 files/85 pass, **1 fail** `src/tokens.test.ts:55` (`#2563eb` expected vs `#625b71`) — **dirty-tree only** (HEAD value matches test) |
| `packages/mcp: bun test src/` | **1** | 12 pass, **1 fail** `manifest.test.ts:48` — `SearchBar` (`manifest.ts:1891`, path `src/start/blocks.tsx`) not exported from `packages/kern/src/components/index.ts`; identical row present at HEAD → **fails at HEAD** |
| `bun run check:parity` | 0 | boundary held; shared **92**, native-only **10**, web-only **37**, stubs **0**, deliberate **6**; 4 canaries pass |
| `bun run check:contrast` | 0 | 53 text + 16 UI pairs × 4 presets × 2 modes × 3 contrasts = **1656 checks**, 0 orphans, 3 waivers |
| `bun run check:theme-matrix` | 0 | 30 cells in sync; single role table |
| `bun run check:consumption` | 0 | 81 exports of kern-primitives: 70 adopted, 11 declared not-yet-adopted |
| `bun run check:primitives` | 0 | 33 files, 33 reachable, forbidden imports enforced |
| `bun run check:currency` | 0 | 15 claims, 14 current, 1 superseded (resolves) |
| `bun run check:ts-policy` / `check:pack` / `check:workflow` / `check:stale-refs` / `check:generated:census` / `check:dist` / `check:dist:types` / `build-lock:status` / `test:scripts` | 0 | all pass (417 registry paths resolve; 3 workflows, 23 gates invoked, 2 excused; 20 codeowners tests) |
| `bun run check:elevation-parity` | **1** | Fab (web 2 vs native 3), FabMenu (4 vs 3), Snackbar (3 vs 2) + 2 reopened ruled rows; 14 one-sided names ruled — measured on dirty tree; HEAD-state not isolated |
| `bun run lint` | **1** | 1153 files, 100 errors / 12 warnings — formatting drift in dirty tree |
| `bun run icons:check` | 0 | SVG standards ok; **1340** icons on 24-grid; 31 generated files byte-match; reachability 46/1340 (report-only) |
| `bun run preflight:publish` | 0 | **6** packages packed with `npm pack`, no `workspace:` in shipped fields |
| `bun run typecheck` (root) | 0 | kern-tokens, primitives, kern, kern-native, kern-icons all pass |
| `packages/kern: bun run test` | 0 | **72 files / 791 cases** pass (84.8 s); `getByRole` assertions dominate; 1 axe file |
| `packages/kern-native: jest` | 0 | **50 suites / 449 cases** pass (0 snapshots) |
| `packages/kern-native: vitest` | 0 | **8 files / 95 cases** pass |
| `packages/kern-primitives: test` | 0 | **16 files / 194 cases** pass |
| `packages/kern-icons: test` / `kern-cli: test` | 0 | 76 / 15 cases pass |
| `apps/site: typecheck` | 0 | pass (runs `check:dist:types` first) |
| `apps/site: check:docs` | **1** | raw `48px`/`12dp` literals in prose; `rich-tooltip` slug not in inventory; `nativePeer "RichTooltip"` unknown |
| `apps/site: check:gallery` | **1** | `TypeError: require() async module "react-native"` (Bun ↔ react-native-svg interop, likely environmental [I]) |
| Playwright `test:e2e` | **not run** | requires built site + preview server; specs read instead (4 specs / 12 cases) |

**Test inventory [F]:** ~168 test files / ≈1,751 cases across vitest + jest + playwright (plus 20 script tests); `docs/verification-limits.md` records an older measured baseline (107 suites / 1049 tests, 2026-10-07) and the suite's known blind spots — read it before trusting green.

---

## 19. Files/directories not inspected (and why)

- **Full text of `docs/parity-contract.md` (1019 L)** — structure and key tables summarized; per-row content not re-derived.
- **Individual component implementations** (87 web + 89 native modules) — sampled (button, dialog, checkbox, input, presentation, web-parity, sheets references); not line-audited.
- **`apps/site` internals beyond scripts/registry/routes inventory** — demos, showcase, and domain modules summarized by exploration, not line-audited.
- **`docs/design-systems/m3-archive/`** — git-ignored ~5 GB evidence locker, not present-checked beyond its README; `m3-usable/` read at README level only (it is **untracked** in git).
- **`.team/` briefs/reports (~100 files)** — org task artifacts, explicitly "not the source of truth" (`.team/README.md`); skimmed directory only. `.team/research/` and `.team/programs/` are **not in this repo** (they live at the monorepo root) — cited gates tolerate their absence.
- **`.agents/skills/kern/references/*` (14 files)** — design canon; listed, not re-read for this audit.
- **`.worktrees/p1-g5`** (branch `kern/p1-g5-versioning`) — separate worktree; out of scope (no modifications made anywhere).
- **`e2e` execution and site build/deploy** — not run (needs build + server + network).
- **Generated artifacts** (`docs/components.md` rows, `apps/site/src/generated/*`, `routeTree.gen.ts`) — treated as generated; headers and generators read instead.

---

## 20. Follow-up handoff (for the next architect / agent)

**Read in this order (30 min):** this file → `docs/architecture.md` → `docs/platform-parity.md` (variant law + coverage) → `docs/conventions/file-ownership.md` → `docs/adr/002` + `005` → `docs/verification-limits.md` → `parity/contract.ts` header.

**Ground rules:** audit/plan first — no implementation until instructed (the brief for this phase said so explicitly). Never hand-edit generated files (`tokens.css`, `tones.css`, `motion.css`, `mcp/src/manifest.ts`, `docs/components.md`, site `src/generated/*`). Respect the barrels and the presentation-binding direct-import rule (`docs/binding-contract.md`). Never let `kern` and `kern-native` import each other, and never let `kern-primitives` touch tokens — `check:layers`/`check:primitives` enforce it. Publishing is founder-HOLD (`TODO.md`: needs `NPM_TOKEN`, `RELEASE_CHANGESSETS=true`, npm login) — prepare, never publish.

**Before any planning work, re-baseline (the tree was dirty during this audit):**
```
git status --porcelain | wc -l          # expect 0 on a clean tree
bun run lint && bun run typecheck && bun run test:all
bun run check:kern && bun run check:coverage && bun run check:parity && bun run check:contrast
cd packages/mcp && bun test src/        # the SearchBar failure must be fixed or ruled
```

**The five decisions to make first (everything else can wait):**
1. **Provider identity:** label-now (Option B) vs facade-now (Option C). Recommendation: label now; facade only after Stage 9. → §12.
2. **Token schema generalisation shape** (role-set registry vs provider-scoped token packages) → §13, §16.2.
3. **Tailwind consumer delivery** — empirically test a scratch consumer install of the packed tarball; decide `@source` guidance vs precompiled CSS → §15 Q3.
4. **`@xoroh/kern/theme` broken import** fix direction → §15 Q4.
5. **Where contracts live:** new `@xoroh/kern-contracts` package (recommended) vs a subpath → §13.

**Known traps:** the two-runner split in `kern-native`; `check:kern`'s prose-matching regex; `check:generated` claims read-only but rewrites-then-restores bytes (don't run while the tree is dirty); `check:dist-exports` counts private manifests as "publishable" in its success label; `check:coverage` and the mcp barrel test disagree with the binding contract's "presentation is not a component" ruling — resolve the disagreement, don't pick a side silently; site scripts need `bun --preload ./scripts/preload-rn.mjs` to import RN code under Bun.

**Success criteria for the next phase:** Stage 1 of §14 (green baseline + provider labelling doc) with the red list empty and a decision record for items 1–5.

*End of report.*
