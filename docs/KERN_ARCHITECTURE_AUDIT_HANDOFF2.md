# Kern Design System Architecture Audit — Handoff

**Status:** audit / discovery only. No architectural changes implemented.
**Date:** 2026-10-13 (UTC). **Repo:** `xoroh/kern` (Bun monorepo, `bun@1.3.8`).
**Auditor method:** read-only inspection of source, config, docs, plus executed gates/tests. No source, manifest, lockfile, or config modifications were made. This report file is the only change.
**Authoritative repo docs consulted:** `docs/architecture.md`, `docs/versioning.md`, `docs/platform-parity.md`, `docs/parity-contract.md`, `docs/binding-contract.md`, `docs/verification-limits.md`, `docs/design-systems/README.md` + `matrix.md`, `docs/adr/001–005`, `TODO.md`, `AGENTS.md`, `CONTRIBUTING.md` (partially), per-package READMEs.

> Legend used throughout: **[F]** = verified fact (file/line or command output cited) · **[I]** = reasonable inference · **[R]** = recommendation · **[Q]** = unresolved question.

---

## 1. Executive summary

**What Kern currently is [F]:** a Material Design 3 (M3) design system for **two renderer families** — web (React DOM) and native (React Native) — published as **six independent npm packages** plus one private installer, with a shared platform-free foundation:

| Package | Dir | Publishes? | Role |
|---|---|---|---|
| `@xoroh/kern-tokens` | `packages/kern-tokens` | yes (0.0.0 → 0.1.0 planned) | canonical tokens, themes, tones, motion, feedback spec, variant registry, generated CSS |
| `@xoroh/kern` (+ `/start` subpath) | `packages/kern` | yes | web M3 components on Base UI + web composition tier (blocks/scaffolds) |
| `@xoroh/kern-native` | `packages/kern-native` | yes | RN M3 components + native composition (in-package) |
| `@xoroh/kern-primitives` | `packages/kern-primitives` | yes | unstyled behaviour kernel (React-only, no tokens/DOM/RN) |
| `@xoroh/kern-icons` | `packages/kern-icons` | yes | Material-Symbols registry + web/native `Icon` |
| `@xoroh/kern-mcp` | `packages/mcp` | yes | MCP server (list/fetch/audit over generated manifest) |
| `@xoroh/kern-cli` | `packages/kern-cli` | **no** (`private:true`) | `kern init` / `kern add` source-vendoring installer |

**What should be preserved [R]:** the renderer-family split (never `if (isNative)` branches), the one-resolver token pipeline (`resolveThemeDetails`), the parity-contract system (`parity/contract.ts` + per-side suites + `check:parity`), the behaviour kernel (`kern-primitives`) with its enforced boundaries, the icon pipeline (pinned source → committed registry), independent per-package versioning via changesets, and the executable design-law gates (`check:kern`, `check:contrast`, `check:layers`, `check:primitives`, `check:coverage`).

**Recommended architecture [R] (Option B, §12–13):** keep the current package shape; do **not** rename/split packages. Add the multi-design-system layer as *new, additive* packages and seams only: (a) a provider-registry + capability-declaration mechanism (new `@xoroh/kern-providers`-style util or an extension of `kern-primitives`/`mcp` manifest — decision deferred, see §15); (b) M3 provider implementations stay where they are (`kern`/`kern-native` become *the M3 provider*, explicitly labelled); (c) a possible future second provider proves the contracts. Shared foundation = `kern-tokens` (generalised role schema, M3 values stay as the default preset) + `kern-primitives` (extended only) + `kern-icons` core (set-agnostic) with the Material-Symbols set remaining one registered set.

**Most important changes required [R]:** (1) fix the three currently-red signals before any evolution: `kern-tokens` test (`secondary` expectation), `check:kern` (4 findings), `check:coverage` (`presentation` exclusion); (2) decide the provider-identity question (is `@xoroh/kern` the M3 provider, or does a neutral `@xoroh/kern` facade sit above `@xoroh/kern-m3/*`?); (3) generalise `kern-tokens` role/preset schema so non-M3 providers are possible without forking; (4) split `@xoroh/kern/start` into its own package when the first breaking window allows (pre-1.0 per ADR-004); (5) close the 37 web-only / 10 native-only parity gaps or rule them asymmetric explicitly.

**Most important unresolved decisions [Q]:** provider packaging (separate packages vs groups vs facets); whether the shared token foundation adopts DTCG naming or keeps `--sys-*` with a mapping layer; how provider selection happens (build-time vs runtime); the blocks distribution model (source-vendoring vs packages); the second-provider validation choice.

**Report path:** `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF2.md` (this file).

---

## 2. Verified repository inventory

### 2.1 Root and workspace [F]

- Root: `/home/novexo/Desktop/Business/xoroh-monorepo/kern`. Git repo, HEAD `d5007b7` ("P1 rn-reusables adapter…"). Working tree **dirty** at audit time (`git status` shows ~20+ modified files under `.agents/`, `.changeset/`, `apps/site/…` — audit did not touch them; a follow-up should re-verify with a clean tree).
- `package.json:1-77`: `name kern`, `private:true`, `packageManager bun@1.3.8`, `engines bun>=1.3.8`, workspaces `apps/*`, `packages/*`. Root devDeps: `@arethetypeswrong/cli ^0.18.5`, `@biomejs/biome ^2.5.14`, `@changesets/cli ^3.0.3`, `@playwright/test ^1.63.0`, `culori ^4.0.2`, `publint ^0.3.24`, `typescript 5.9.3` (exact pin; `check:ts-policy` enforces equality), `yaml ^2.9.1`.
- Root scripts (selected, `package.json:10-61`): `build` = token CSS + tones + motion + component manifest + `scripts/build-order.mjs`; `typecheck`/`test` fan out per `--filter`; ~20 `check:*` gates; `test:e2e` = playwright; `icons:sync|generate|check`; `check:publish` fans out to 6 packages + `preflight:publish`.

### 2.2 Packages, apps, tools [F]

- `packages/`: `kern`, `kern-cli`, `kern-icons`, `kern-native`, `kern-primitives`, `kern-tokens`, `mcp` (7 dirs).
- `apps/`: `mobile` (Expo host), `site` (TanStack Start docs/playground at `kern.xoroh.org`).
- `docs/`: `architecture.md`, `binding-contract.md`, `components.md` (generated), `parity-contract.md`, `platform-parity.md`, `versioning.md`, `releases.md`, `verification-limits.md`, `*-family-reference.md`, `adr/001–005`, `conventions/` (8 files), `design-systems/` (13 system notes + `matrix.md` + `m3-archive/` git-ignored + `m3-usable/`), `plan/`, `planning/`.
- `scripts/`: 23 gates + `lib/codeowners.mjs` (`audit-elevation`, `build-lock/order`, `check-commit-intent/consumption/coverage/currency/dist-exports/dist-types/elevation-parity/generated-census/generated-freshness/kern/layers/pack/parity/primitives/registry-paths/stale-refs/ts-policy/workflow`, `generated-artifacts`, `measure-elevation`, `preflight-publish`).
- `parity/`: `contract.ts` (DATA ONLY, imports nothing — ADR-002 boundary), `currency-claims.ts`.
- `e2e/`: `playwright.config.ts` (chromium only, 1400×1000, workers 1, base `localhost:4173`), `dialog-focus-trap.spec.ts`, `sheet-dismissal.spec.ts`, `page-render.spec.ts`, `visual-baseline.spec.ts`, `support/`.
- `.changeset/`: `config.json` (`access:public`, `baseBranch:main`, `updateInternalDependencies:patch`, no fixed/linked/ignore) + ~70 pending changesets. All public packages at `0.0.0`; first release computes to `0.1.0` (verified dry-run per `TODO.md:3-9`).
- No Storybook/Ladle/Playroom (grep 0 hits) [F]: the equivalent is site routes + showcase registry + blocks catalog + mobile Expo host.
- No `tsup.config.*` anywhere [F]: every build is a `tsup` CLI one-liner in that package's `package.json`.
- `biome.json`: `biome check .`, space indent, recommended lint, organize-imports on, Tailwind directives, overrides disabling all rules for `packages/kern-icons/src/sets/**` and `routeTree.gen.ts`.

### 2.3 TypeScript / aliases / module conventions [F]

- All packages `strict:true`, `skipLibCheck:true`, `noEmit:true`, TS `5.9.3` exact. `target es2022`, `moduleResolution bundler`, `jsx react-jsx`.
- Path aliases: `@kern-parity/contract → parity/contract.ts` (kern + kern-native jest/vitest); apps/site `#/* → src/*`, `@/*`, plus `react-native → react-native-web` and `react-native-svg → elements.web.js` aliases in `vite.config.ts`.
- Conventions: barrels are the contract (`exports` maps block deep `src/` paths — `docs/architecture.md:84-86`); `sideEffects` declared (`kern: ["./src/theme.css"]`, icons/primitives `false`); ESM+CJS dual via tsup (`--format esm,cjs --dts --dts-resolve`); `publishConfig {access:public, provenance:true}` on all six public packages.

---

## 3. Existing architecture and dependency graph

Verified dependency direction (`docs/architecture.md:39-63`, `package.json` manifests, `check:layers` PASS — see §18):

```
kern-tokens  (imports nothing from sibling packages)   [F]
   /     |      \
  v      v       v
kern  kern-native   (peers — never import each other; enforced by check:layers)
  |
  v
/kern/start  (subpath of @xoroh/kern; composes via @xoroh/kern only,
              zero direct @base-ui/react imports — enforced)

kern-primitives  (imports NOTHING from kern-tokens/kern/native; enforced by check:primitives)
  ^ used by both renderers (kern deps + native deps on it)

kern-icons  (independent; peers react / react-native(+svg optional))
kern-mcp    (reads everything via generated manifest, imports nothing from it)
kern-cli    (private; reads manifest + apps/site/src/blocks; never published)
```

- `kern-tokens` deps: only `@fontsource-variable/inter` [F] (`packages/kern-tokens/package.json:70-72`).
- `@xoroh/kern` deps [F] (`packages/kern/package.json:109-116`): `@base-ui/react ^1.8.0`, `@xoroh/kern-primitives ^0.0.0`, `@xoroh/kern-tokens ^0.0.0`, `cva`, `clsx`, `tailwind-merge`; peers `react>=18`, `react-dom>=18`, `@base-ui/react ^1.8.0`. Exports: `.`, `./theme` (raw `src/theme.css`), `./tokens`, `./utils` (`dist/utils/cn`), `./start`.
- `@xoroh/kern-native` deps [F]: `@xoroh/kern-primitives`, `@xoroh/kern-tokens`, `react-native-svg@15`; peers `react ^19`, `react-native >=0.86<0.89`; exports `.` + `./native` both with `react-native` condition first. No expo/nativewind deps [F].
- `@xoroh/kern-primitives`: no runtime deps; peer `react>=18` [F].
- `@xoroh/kern-icons`: no runtime deps; optional peers for RN [F]; `react-native` export condition.
- `@xoroh/kern-mcp`: deps `@modelcontextprotocol/sdk`, `zod` [F].

Styling systems [F]: web = Tailwind utilities + CVA + `cn`/`cnState` reading `--sys-*` CSS vars (no CSS modules / vanilla-extract — grep 0 hits); native = `StyleSheet.create` only (~15 call sites, e.g. `kern-native/src/utils/overlay-styles.ts:9`, `components/button.tsx:126-249` `buttonStyles()` returning `{container,label}`).

---

## 4. Detailed audits: kern-native, kern-token(s), kern-icons

### 4.1 `kern-token` → actual name `@xoroh/kern-tokens` [F]

> Name note: the brief says `kern-token`; the verified package name is `@xoroh/kern-tokens` (`packages/kern-tokens/package.json:2`). There is no `kern-token` package.

1. **Verified purpose:** platform-free design language: canonical tokens, theme presets, contrast overlays, tones, feedback spec, variant registry, generated CSS (`docs/architecture.md:23`; `src/index.ts:1-3` header "platform-free… No React, no DOM").
2. **Public API:** `src/index.ts:1-17` re-exports `contrast, expressive-shapes, feedback, focus, functional, motion, pipeline, presets, seed-theme, sizes, tokens, tones, variants`; key fns: `resolveThemeDetails/resolveTheme/varName/shapeVarName/themeIds/defineThemePreset` (`resolve.ts`), `seedStage/mapStage/aliasStage/componentStage/buildThemeMatrix/scopedDeltas` (`pipeline.ts`), `statusTone/spectrumTone/makeHueRamp`, `resolveMotionScheme/springConfig/motionCssVars`, `themeFromSeed`, `defineVariant/registerVariant`, `contrastRatio/contrastIssues`, `hexToOklch/oklchToHex`. Exports map: `.`, `./tokens`, `./tokens.json` (raw), `./themes/*` (raw JSON), `./theme` (raw `src/tokens.css`).
3. **Structure:** `src/` = 33 entries (`tokens.ts/json`, `resolve.ts`, `pipeline.ts`, `kern-roles.ts` (58 roles: 45 M3 + 13 Kern extras incl. `surfaceTonal`), `kern-elevation.ts`, `color/contrast/functional/feedback/focus/motion/tones/variants/sizes/seed-theme/presets/expressive-shapes.ts`, `themes/{kern,sharp,brand,compact,demo,index}.json` + generated `matrix.json`, `tokens.css/tones.css/motion.css/comp-tokens.css/tailwind.css` generated); `scripts/gen-{css,comp-css,motion-css,tones-css,theme-matrix}.mjs` + `check-contrast/check-theme-matrix.mjs`.
4. **Technology:** pure TS + JSON, OKLCH canonical with precompiled `srgb` per step (RN cannot parse oklch — `tokens.json:1-2` comment). No React/DOM/RN.
5. **Dependencies/dependents:** deps only fontsource; depended on by `kern`, `kern-native` (both as dep+dev workspace), `mcp` (reads).
6. **Token/styling assumptions:** M3-shaped: 58 colour roles/scheme, 10-entry shape scale, elevation L0–L5 (M3 dp + Kern K4 shadow deviation noted `tokens.json:1022`), M3 state opacities (exactly 5; `focus-visible` forbidden), 15 M3 typescale entries + emphasized variant, spacing `space-0…900`, full M3 motion (easing/duration/spring/schemes standard+expressive). Themes: `kern.json` base role tables (light+dark) + contrast overlays; `sharp/brand/compact/demo` are **override-only** presets (`extends:kern`, enforced by `pipeline.assertSingleRoleTable` + `check:kern` + `check:theme-matrix`).
7. **Web/mobile compat:** both by design — one resolver `resolveThemeDetails(mode,contrast,variant)`; web projects to CSS vars (`applyKernTheme`), native reads objects (`KernThemeProvider/useKernScheme`). `matrix.json` flattens all 30 mode×contrast×preset cells.
8. **Tests/validation:** vitest (9 files). **Currently 1 failure [F, §18]:** `tokens.test.ts:55` expects `light.secondary === "#2563eb"` but gets `"#625b71"`. Gates: `check:kern`, `check:contrast`, `check:theme-matrix`, `check:generated*`.
9. **Publishing readiness:** ready-shaped (dual ESM/CJS+dts, files list, provenance) but **unpublished** (0.0.0, founder HOLD until `RELEASE_CHANGESSETS=true` + `NPM_TOKEN`; `TODO.md`, `docs/versioning.md §6`). `check:publish` green per TODO (re-verify — tree is dirty).
10. **Strengths:** single source of truth with dual encoding; override-only preset discipline with double enforcement; machine-readable matrix artifact; contrast validated in code (`defineThemePreset` fails loud); platform-free boundary enforced by `check:layers`.
11. **Limitations/debt:** (a) M3-coupled naming (`--sys-*` vars, `ColorRole = keyof kern.color.light` — any non-M3 provider must fit the 58-role schema or fork); (b) no DTCG-format interchange (custom JSON schema; `$`-keys filtered by `isTokenKey`); (c) runtime resolution only (no build-time extraction); (d) component-token layer thin (`comp-tokens.css`/`tailwind.css` var maps); (e) the failing secondary test signals spec-vs-code drift needing a ruling.
12. **Recommended future role:** remain the shared foundation's token layer; generalise the *schema* (role-set declaration per provider) while keeping M3 values as the default `kern` preset. Do not split yet (split candidates later: `@xoroh/kern-tokens-m3` values vs token engine — only when a second provider exists).

### 4.2 `kern-native` → actual name `@xoroh/kern-native` [F]

1. **Purpose:** RN renderer: "same components and contracts as web, on native primitives" (`package.json:4`).
2. **Public API:** `src/index.ts:1-477` barrel (~60 concepts: `Button/buttonStyles/NATIVE_BUTTON_VARIANT_ALIASES`, `Card`, `Dialog`, sheets family, `TopAppBar`, `AppShell`, `KernPressable`, `OverlayModalityProvider`, `web-parity.*` shims, `fonts` (`KernFontGate/kernFontFaces/useKernFonts`), `theme` (`KernThemeProvider/useKernScheme/useKernTheme/useKernMotion…)`). Exports `.` + `./native` with `react-native` condition.
3. **Structure:** `src/{index.ts, theme.tsx:1-142, fonts.tsx:1-83, field-context.tsx, utils/overlay-styles.ts, components/~137 entries}`; `test-doubles/`, `jest-mocks/`, `jest.config.cjs` + `vitest.config.ts` (dual runner), `babel.config.cjs`.
4. **Technology:** React 19 + RN (peer `>=0.86<0.89`), `react-native-svg@15` dep, `StyleSheet` only, `kern-primitives` behaviour models + local `components/presentation.tsx` bindings. No Expo/NativeWind deps.
5. **Deps/dependents:** deps primitives+tokens+svg; consumed by `apps/mobile`, `apps/site` (via `react-native-web` alias).
6. **Token assumptions:** never module-scope resolution — `useKernScheme()` per render (`docs/platform-parity.md:309`); `buttonStyles(variant,size,disabled,theme=resolveThemeDetails(),…)` with `withAlpha` disabled washes (12%/38%); radii from `theme.shape`; fonts host-loaded (`useKernFonts(loader)` takes any `loadAsync`-shaped loader; components set weight only).
7. **Web/mobile:** native-only package; web counterpart is `@xoroh/kern`. Parity: 117 native export rows, 92 shared concepts, 10 native-only files → web, 37 web-only files → native (`check:parity` PASS, §18).
8. **Tests:** dual — vitest (node+stubs, non-`.rntest` files) + jest+RNTL (`*.rntest.tsx`, preset `@react-native/jest-preset`); parity suites `src/parity/native-parity-*.rntest.tsx` (10 incl. start). `docs/verification-limits.md` records 1 pre-existing jest failure (`fab-family.rntest.tsx`, 2026-10-07) — re-verify.
9. **Publishing readiness:** shaped ready (dual + dts + provenance), unpublished (HOLD as above).
10. **Strengths:** honest renderer split; variant law mirrored with web (Button/aliases/sizes); deliberate asymmetries documented (Sonner, Picker, link-as-Pressable, Loader sizes, meter `role`); host owns fonts (no expo peer).
11. **Limitations/debt:** RN `Modal`-based sheets (gesture handling flagged as possibly needing `@xoroh/kern-expo` later); `buttonStyles` default `theme=resolveThemeDetails()` invites module-scope capture if misused; composition tier in-package (vs web's `/start` subpath) — asymmetric boundary to reconcile in provider design; two-runner trap (vitest silently skips `.rntest` — documented §1/§4 of verification-limits).
12. **Recommended future role:** become (or host) **the M3 native provider implementation**. Keep package name (migration cost of rename outweighs benefit pre-1.0; post-1.0 renames need ADR-004 deprecation windows). Extract native composition only if/when a symmetric `@xoroh/kern-native/start` edge is needed.

### 4.3 `kern-icons` → actual name `@xoroh/kern-icons` [F]

1. **Purpose:** icon system: set registry + semantic aliases + web/native `Icon` renderers (`package.json:4`).
2. **Public API:** `src/index.ts:20-95`: `resolveIconName, SEMANTIC_ICONS (42 meanings), IconNameInput/MaterialIconName/BrandIconName, ICON_MANIFEST, ICON_NAMES/isIconName/ICON_COUNT (1340 material), ICON_SHAPES/WEIGHTS, registry fns (register/get/listIconSets), resolve fns, Icon/useIcon`. Single `.` export with `react-native` condition (`dist/index.native.js`).
3. **Structure:** `src/{index.ts, index.native.ts (differs only in Icon import), core/{types,resolve,naming,registry,semantic}, render/{Icon.tsx, Icon.native.tsx, useIcon.ts}, sets/{index.ts (EXTRA_SETS={}), material/{manifest,names,symbols,shapes/w400 chunked a–z,0}}}`; `tools/{sync,generate,check}.ts + lib/{catalog,config,emit,naming,path,svg,validate}`; `config/source.json` (pinned `@material-symbols/svg-400@0.47.2`, rounded/400, grid 960); `assets/material/rounded/*.svg`; `THIRD_PARTY/NOTICE` (Apache-2.0).
4. **Technology:** committed TS registry (`d` strings rebased `0 0 24 24`); web `Icon` = inline `<svg><path>`; native = `react-native-svg`; `useIcon` stateless/SSR-safe.
5. **Deps/dependents:** zero runtime deps; optional RN peers; used by both renderers + site.
6. **Token/styling:** `color` defaults `currentColor` (follows text role); sizes `16|18|20|24|32|40|48`, `ICON_TOUCH_TARGET 48`; `filled` = M3 FILL.
7. **Web/mobile:** both via export condition; one resolution, two emitters.
8. **Tests:** vitest (core resolve + tool lib tests); `icons:check` (registry matches source) in CI gates.
9. **Publishing readiness:** shaped ready, unpublished (HOLD).
10. **Strengths:** set-agnostic core (`registerIconSet`, qualified `set:name` resolution, semantic layer) with a pinned, reproducible pipeline (`sync→generate→check`, deterministic byte-identical emit); canonical kebab-case naming with chunked shapes for tree-shaking.
11. **Limitations/debt:** single shipped set (material only; brand count 0; `EXTRA_SETS` empty) — the "provider-independent icon system" question is answered at the *core* level but not yet exercised by a second set; `filledReusesOutline:465` noted in manifest.
12. **Recommended future role:** keep as the shared icon **infrastructure**; do not couple providers to the Material visual language — providers consume via `name/set/semantic` and may register own sets. Ship (or document) at least one non-Material set later to prove independence.

**Package-boundary verdict [R]:** current boundaries align well with the vision's foundation layer. **Do not rename/split** `kern-tokens`, `kern-native`, `kern-icons` — benefit unproven, migration cost high (exports maps, aliases, parity tooling, site imports, changesets all keyed on current names). The missing pieces are additive (provider registry, contracts, second provider), not renames.

---

## 5. Current token, theme, and component architecture

### Tokens [F]

- Canonical `packages/kern-tokens/src/tokens.json` (1135 lines): `palettes` (neutral full + sparse blue/primary/red/green/amber + m3violet/m3rose), `spectrum` (11 hues × 50–950, `{oklch,srgb}`), `base`, `typography` (Inter; 15 M3 types + roles + emphasized), `shape` (10 steps), `elevation` L0–L5, `motion` (legacy + full M3 easing/duration/spring/schemes), `states` (5 opacities), `spacing` (`space-0…900`).
- Role inventory `kern-roles.ts`: 58 roles = 45 M3 + 13 Kern extras (`success/warning/info`×4 + `surfaceTonal`). Elevation map `kern-elevation.ts` (+ `KERN_UNASSIGNED_ELEVATION`, `auditElevation`).
- Themes: `themes/kern.json` (247 lines: light/dark ~58-role tables + radius + conventions + 4 contrast overlays); override-only presets `sharp/brand/compact/demo` + `index.json` catalog; generated `matrix.json` (30 cells + `changedRoles/changedShape`).
- Resolution order [F] (`resolve.ts:105-118`): base(mode) → contrast overlay → preset overrides. `defineThemePreset` validates id/base/roles/hex/shapes and **fails loud on contrast** both modes.
- CSS generation: `gen-css.mjs → tokens.css` (971 lines: `:root`/`.dark`/shape/type/motion/states/spacing/spectrum/`[data-kern-theme]`/app bridge/`@theme inline`); `gen-tones-css/gen-motion-css/gen-comp-css.mjs → tones.css/motion.css/comp-tokens.css+tailwind.css` (thin `var()` maps, e.g. `--color-md-primary:var(--sys-color-primary)`).
- DTCG relevance [I+R]: DTCG Format Module reached first stable version 2025.10 (W3C CG, supported by Figma/Tokens Studio/Style Dictionary/Terrazzo). Kern's schema is custom (no `$value/$type`, `$`-keys are metadata filtered by `isTokenKey`). Interop path: add a **DTCG export projection** (generator emitting `$value/$type` JSON) rather than re-authoring the canonical source; adopt `$`-prefixed metadata discipline already half-present. Do not adopt DTCG as canonical until tooling needs it (cost > benefit today).

### Theme architecture [F]

- No theme provider component on web: `src/web-theme.ts:1-174` exports `applyKernTheme(el,mode,contrast,variant,motion)` (sets vars + `.dark` + `data-*`) and `useKernTheme()` (mode/system/localStorage/media-query, returns `{mode,…,scheme,setMode,…}`). Native: `KernThemeProvider({mode,contrast,variant})` + `useKernScheme/useKernTheme/useKernMotion` (`kern-native/src/theme.tsx:1-142`). `pipeline.ts` declares the `StyleEngine` contract (ADR-005) without moving code.
- `ThemeId = kern|sharp|brand|compact|demo` (+ legacy `m3` alias); `Mode × Contrast × ThemeSelection` triple is the theme address on both renderers.

### Component architecture [F]

- Web (`packages/kern/src`): ~70 concepts in `src/components/` (144 files incl. tests); barrel `components/index.ts` (~650 lines) is the contract; exemplar `button.tsx:1-522` (CVA: variant×color×size×shape×block×toggle×selected + compoundVariants; Tailwind arbitrary vars; `BUTTON_VARIANT_ALIASES filled→primary/text→ghost`; controlled+uncontrolled toggle; `href` link variant; `softDisabled`). Headless behaviour from `@base-ui/react` (ADR-002) + `kern-primitives`; styling owned by Kern. `src/start/` composition tier (blocks/link/navigation/panes/scaffolds/top-app-bar) published as `@xoroh/kern/start`; `check:layers` forbids direct Base UI imports there.
- Native: ~60 concepts, single-component-per-concept (vs web multipart `Root/Content/…`), `buttonStyles()` pure fn + `Pressable` + `android_ripple` + `hitSlop`; press via kernel `useKernPress` (G8); slot merge via `mergeSlotProps`.
- Bindings [F] (`docs/binding-contract.md`, draft): `kern/src/components/presentation.tsx` and `kern-native/src/components/presentation.tsx` bind kernel models to platform mechanics; deliberately **not barrel-exported** (registry treats barrel exports as components); imported via direct module path.
- Variant law [F] (`platform-parity.md:54-90`): `variant` meaning frozen per component, identical across platforms (Button=colour config; Card=elevation; Text=typescale; Chip=kind; Fab=size — corrected against M3 spec pages 2026-10-01).

---

## 6. Web and native readiness assessment

- **Web: production-shaped, pre-release.** ~70 concepts, Base UI behaviour, Tailwind+CVA, axe-core suites (`accessibility.test.tsx`, 0 violations on sampled components), 9 web parity suites, e2e dialog/sheet/painted-page specs green (2026-10-07). Gaps: 37 web-only concepts need native versions or explicit asymmetry rulings; `check:kern` currently flags 4 findings (§18); no visual regression.
- **Native: production-shaped, pre-release.** ~60 concepts on RN primitives, RNTL suites + parity suites, Expo host app, no Expo/NativeWind coupling. Gaps: 10 native-only concepts need web versions or rulings; gesture-heavy sheets are RN-primitive-built (adequacy risk flagged by repo itself — possible future `@xoroh/kern-expo`).
- **Shared contracts: unusually mature.** `parity/contract.ts` (~1100 lines, 20+ rows, families toggle/named-surface/text-field/stepper/otp-field/hint-surface/static-content) + `contractFor`/canaries + `check:parity` PASS. Honest-gap culture (measured divergences documented, e.g. web autocomplete empty-state defect, NumberField max/stepper defects, OTP first-position labelling).
- **Cross-cutting red signals at audit time [F]:** (1) tokens test failure; (2) `check:kern` exit 1; (3) `check:coverage` exit 1 (`presentation`); (4) dirty working tree; (5) `apps/mobile` has no `bundle` script while CI `apps` job references one (subagent finding — verify before next CI run); (6) recorded `fab-family.rntest.tsx` failure (2026-10-07, re-verify).

---

## 7. Multi-design-system architecture analysis

### Provider architecture [R]

- **Recommendation:** each provider = a **group of packages** following the existing renderer split, not one package and not one giant component:
  - `<provider>-tokens` (preset + role deltas extending the shared schema) — for M3 this already exists implicitly (`kern.json` + presets inside `kern-tokens`; a future provider adds its own preset files + optional role-set declaration).
  - `<provider>-web` + `<provider>-native` component implementations (for M3: today's `kern` + `kern-native`, explicitly labelled as the M3 provider).
  - Shared: provider registry + capability declarations + contract-test harness (new small package or `kern-primitives`-adjacent util + `mcp` manifest extension).
- **Registration/identification [proposal]:** `{ id: "m3", spec: "m3-expressive-2026-10", implVersion, kernContractsVersion, deps }` declared per provider package; `listProviders()/providerInfo(id)` API; selection **build-time first** (import `@xoroh/kern-m3` vs `@xoroh/kern-<other>`), runtime switching only for theme-level (mode/contrast/preset) — not for provider swapping (different dependency graphs; runtime provider swap is a non-goal for v1).
- **Tree-shaking/bundle:** per-component barrels + `sideEffects:false` (primitives/icons already) must extend to provider packages; deep-import bans stay; CLI vendoring gives a zero-dependency option for web.
- **Missing components:** implement from primitives + provider foundations; mark provenance in metadata (`origin: "native" | "kern-adapted"`), docs badge, and separate test file naming (`*.adapted.test.*`); never silently claim native status (parity-contract "measured, not claimed" rule generalises).
- **Capability differences:** capability declarations per component (`supports: ["scalar-value"]`, `lacks: ["clock-face"]` with rationale + spec pointer); contract tests assert declared subset; `check:parity`-style gate extended to `check:provider` fails on undeclared claims.

### Component contracts (concrete examples) [R]

| Example | Baseline? | Notes |
|---|---|---|
| Button | **common baseline** (already proven: variant/color/size/shape/toggle/aliases mirrored) | capability: toggle-morph optional per provider |
| Text input | **baseline** (`text-field` family incl. multiline/error-text obligation) | delivery differs (describedby vs hint-fold) — obligation, not mechanism |
| Checkbox | **baseline** (checked axis) | trivially portable |
| Dialog | **baseline** (`named-surface` + modal + dismissal paths split web-escape/native-back) | |
| Select | **baseline behaviour, API-shape free** (compound vs flat+modal both accepted) | |
| Date picker | **baseline value contract + optional capabilities** (calendar views, range) — range is a stated gap (matrix.md: G-range) | |
| Data table | **baseline basic table** (caption obligation proven); **advanced grid → rent/wrap** (`R-G` per matrix.md), not a Kern re-implementation | |
| Navigation (bar/drawer/rail) | **baseline** (selection + roving + landmarks) | |
| Command palette | **provider-specific allowed** (not all systems have it; matrix shows `–` for most) — shared contract if/once two providers ship it | |

Rule of thumb: baseline = behaviour + role/label/state obligations; API shape (compound vs flat, value scalar vs array) stays provider-free within documented mappings; visual treatment never in baseline.

### Missing-component strategy [R]

Generalise the repo's own "measure both sides first" rule: (1) registry marks `origin`; (2) docs badge "Native to <provider>" vs "Kern adaptation for <provider>"; (3) adapted implementations live in the provider's package (not shared), import only shared kernel/tokens; (4) adaptation test asserts provider foundations used (roles, shape scale, motion) — an adaptation that bypasses foundations fails review.

### Design-system versioning [R]

Five independent coordinates (never conflated):
1. **Provider identity** (`m3`, stable string).
2. **Spec generation** (`m3-expressive` + evidence date / spec snapshot ref; repo already keeps `m3-archive/` + `m3-usable/` — formalise the pointer).
3. **Kern impl version** (semver per package via changesets; ADR-004: pre-1.0 free change, post-1.0 one-minor deprecation window).
4. **Underlying dep versions** (Base UI, RN — peers, host-controlled).
5. **App-selected version** (app pins provider packages; maintenance/security ride as patches per `updateInternalDependencies:patch`).

Apps stay on visuals by pinning major+minor and accepting patches; visual/behavioural changes ship as minors/majors with migration notes (changeset body rule from ADR-004).

---

## 8. Shared API and compatibility recommendations

- **Contracts to standardise (platform-independent):** props/variants naming (variant law), composition/slots (`data-slot` convention + `asChild`/`Slotted` web, slot-props merge native), controlled+uncontrolled (both Buttons already do `pressed/defaultPressed/onPressedChange`), a11y obligations (role/label/state families in `parity/contract.ts`), events (`on*Change` value callbacks; press reporting via kernel), refs/imperative (forwarded refs; imperative handles only where M3 requires, e.g. ExtendedFab collapse), form integration (Base UI field/form on web; RN analogue documented per component), responsive (pane/split breakpoints as tokens, not magic numbers).
- **Requiring platform specialisation:** focus (ring rendering web vs platform-owned native), dismissal (escape vs hardware-back), portals/modals, pickers (platform Picker), hover/preview (web-only), scrolling, fonts/loading, haptics/gestures.
- **Extension points:** per-provider `color`/`shape` axes (Button `danger` pattern generalises), preset overrides (`defineThemePreset`), icon-set registration, feedback-variant registration (`registerFeedbackVariant`), tone/hue registration, motion algorithms (`defineMotionAlgorithm`).
- **Anti-lowest-common-denominator rule [R]:** contracts assert obligations each provider meets with its own delivery (error-text, tooltip-linking, caption precedents); gaps stay explicit (GAP rows) rather than weakening the baseline.

---

## 9. Theme and blocks architecture

### Theme infrastructure vs presets [F+R]

- **Kern owns:** resolver (`resolveThemeDetails`), role schema + inventory audit, shape/elevation/motion scales, contrast engine + overlays, preset validation (`defineThemePreset`), matrix artifact + drift gates, projection runtimes (`applyKernTheme`/`KernThemeProvider`), token mapping rules (`varName/shapeVarName`), CSS generators.
- **Providers own:** base role tables + presets (today: `kern.json` + 4 presets = the M3 theme family; custom themes via `defineThemePreset` overrides-only). The infrastructure forces no visual identity: presets change values, not structure — but the *structure* (58-role schema) is M3-shaped, which is the generalisation work item (§13 St
...[truncated 14109 chars]