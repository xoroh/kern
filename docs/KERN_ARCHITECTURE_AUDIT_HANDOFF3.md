# Kern Design System Architecture Audit — Handoff (Report 3)

**Status:** audit / discovery only. No architectural changes implemented.
**Date:** 2026-10-13 (UTC). **Repo:** `xoroh/kern` @ `d5007b7` (Bun monorepo, `bun@1.3.8`).
**Auditor method:** read-only inspection of source, config, docs, plus executed gates/tests. No source, manifest, lockfile, or config modifications were made. This report file is the only change.
**Prior audits in repo:** `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF.md`, `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF2.md` (not read during this audit; findings here were derived independently and cross-checked against live command output).

> Legend: **[F]** = verified fact (file:line or command output cited) · **[I]** = reasonable inference · **[R]** = recommendation · **[Q]** = unresolved question.

---

## 1. Executive summary

### What Kern currently is [F]

Kern is a **Material Design 3 (M3) design system for two renderer families** — web (React DOM) and native (React Native) — shipped as **six independently-versioned npm packages plus one private installer**, all at version `0.0.0` (nothing published yet).

| Package (npm name) | Directory | Publishes | Renderer | Role |
|---|---|---|---|---|
| `@xoroh/kern-tokens` | `packages/kern-tokens` | yes | platform-free | canonical `tokens.json`, M3 role tables, contrast overlays, tones, motion, feedback spec, variant registry, generated CSS |
| `@xoroh/kern` | `packages/kern` | yes | web (DOM) | M3 components on `@base-ui/react` headless primitives + `./start` composition tier |
| `@xoroh/kern/start` | `packages/kern/src/start` | yes | web (DOM) | blocks, scaffolds, panes, navigation, top app bar, link seam |
| `@xoroh/kern-native` | `packages/kern-native` | yes | native (RN) | RN M3 components + in-package composition tier |
| `@xoroh/kern-primitives` | `packages/kern-primitives` | yes | platform-free | un-styled behaviour kernel (React-only; no tokens, no DOM, no RN) |
| `@xoroh/kern-icons` | `packages/kern-icons` | yes | both | Material Symbols registry + set registry + web/native `Icon` |
| `@xoroh/kern-mcp` | `packages/mcp` | yes | node | MCP server over a generated 417-row component manifest |
| `@xoroh/kern-cli` | `packages/kern-cli` | **no** (`private:true`) | bun | `kern init` / `kern add` source-vendoring installer |

Two apps: `apps/site` (TanStack Start docs site at kern.xoroh.org, consumes all six packages and previews real RN via `react-native-web`) and `apps/mobile` (Expo `~57.0.25` / RN `0.86.3` showcase host).

**The single most important architectural fact:** Kern is *one* design system (M3) implemented *twice* (web+native), with a shared platform-free language layer. It is **not** yet a multi-design-system platform: there is no provider registry, no capability declaration, no provider metadata, and the token layer's TypeScript types are literally derived from a Material role file (see §10).

### What should be preserved [R]

1. **The renderer-family split** (`packages/kern` vs `packages/kern-native`, never `if (isNative)`) — mechanically enforced by `scripts/check-layers.mjs` and `scripts/check-parity.mjs`, both green.
2. **The one-resolver token pipeline** — `resolveThemeDetails(mode, contrast, variant)` is the only place a scheme is built; web projects CSS custom properties, native reads the same object.
3. **`@xoroh/kern-primitives`** as the un-styled behaviour kernel with its transitive-closure boundary gate (`check:primitives` green: 33 files, 33 reachable, zero token/renderer/platform imports).
4. **The icon pipeline** (pinned upstream source → committed registry → `tools/check.ts` freshness + reachability legs) and the `IconSet` multi-set contract in `src/core/registry.ts`.
5. **The parity contract** (`parity/contract.ts`, data-only, 27 rows / 26 components) with per-renderer suites on both sides.
6. **Independent per-package versioning via changesets**, `publishConfig.provenance`, and the executable design-law gates.
7. **M3 conformance as executable law** — `check:kern`, `check:contrast`, `check:elevation-parity`, `check:theme-matrix`, `check:currency`. This is genuinely unusual and is Kern's moat.

### Recommended architecture [R] (Option B, §16)

Keep every current package and package boundary. Do not rename, do not split. Add the multi-design-system layer as **new, additive** seams only:

- **`kern-tokens` stays the shared token foundation** — generalise the *schema* (role table shape, var-name emitter, preset override mechanism) so a second provider can supply its own role table without editing `kern.json`, while M3 remains the default preset.
- **`kern` + `kern-native` become, explicitly, the M3 provider.** They are already that. What is missing is a *label*, not a rewrite.
- **Add a provider-registry concept** — in `kern-primitives` (it is the only package both renderers already depend on and it must stay token-free) or as a new tiny `@xoroh/kern-provider` package. This is the one genuinely new package and it is the only decision that must be made before implementation (§16).
- **`parity/contract.ts` evolves from "web↔native parity" to "provider contract"** — it is already a data-only, primitive-agnostic, test-driven contract file. This is the natural home for common component contracts.
- **Blocks stay source-vendored** (`kern-cli` Mode 1), extended from the site's 4-block manifest to a per-provider manifest.

### Most important changes required [R]

1. **Fix the currently-red signals before evolving anything** (§20): 1 failing unit test in `kern-tokens`, 5 `check:kern` violations, 4 `check:elevation-parity` findings, 2 gate failures (`check:coverage`, `check:generated`), 1 `kern-mcp` test failure, and 100 Biome errors (all in `apps/site` + dirty-worktree files).
2. **Publish** — all eight packages sit at `0.0.0`, nothing is on npm, and `apps/site`'s live native previews already depend on the workspace.
3. **Generalise the token schema** so `--sys-*` is not hardcoded in five files and `RoleTable` is not `keyof typeof kern.color.light`.
4. **Add provider identity + capability declaration** so an app can name a design system and know what it does not have.
5. **Resolve the icon bundle problem** — `kern-icons` ships a ~370 KB-gzip eager registry.

### Most important unresolved decisions [Q] (§21)

- Where provider registration lives (`kern-primitives` vs a new package).
- Whether `@xoroh/kern` stays the M3 provider or becomes a neutral facade over `@xoroh/kern-m3/*`.
- Whether the token layer adopts DTCG (`$value`/`$type`) for interchange or keeps `--sys-*` plus a mapping layer.
- Build-time vs runtime provider selection.
- Whether `@xoroh/kern/start` splits into its own package (it is a separate dependency edge already; ADR-004 flags pre-1.0 as the window).
- The blocks distribution model at scale.

### Report path [F]

`docs/KERN_ARCHITECTURE_AUDIT_HANDOFF3.md` (this file).

---

## 2. Verified repository inventory

### 2.1 Root and workspace [F]

- **Root:** `/home/novexo/Desktop/Business/xoroh-monorepo/kern`. Git repo, HEAD `d5007b7` ("P1 rn-reusables adapter…").
- **Working tree is dirty** at audit time (`git status` shows ~20+ modified/deleted files under `.agents/`, `.changeset/`, `apps/site/…`). The audit did not touch them. A follow-up should re-verify §20 on a clean tree.
- `package.json`: `name kern`, `private: true`, `packageManager: "bun@1.3.8"`, `engines: { bun: ">=1.3.8" }`, `workspaces: ["apps/*", "packages/*"]`.
- **Package manager: Bun 1.3.8**, lockfile `bun.lock` (437 KB).
- Root devDependencies: `@arethetypeswrong/cli ^0.18.5`, `@biomejs/biome ^2.5.14`, `@changesets/cli ^3.0.3`, `@playwright/test ^1.63.0`, `culori ^4.0.2`, `publint ^0.3.24`, `typescript 5.9.3` (exact), `yaml ^2.9.1`.
- **Monorepo tooling is deliberately thin:** no Turborepo/Nx/Lerna. `scripts/build-order.mjs` topologically sorts buildable packages from *declared* `@xoroh/*` deps — the same declarations `check-layers` enforces, so build order and the layer map cannot drift. `scripts/build-lock.mjs` provides a filesystem lock at `node_modules/.build-lock` because tsup builds in place and two concurrent builds interleave into a torn dist (comment `build-lock.mjs:5-9`: "Measured: a build killed mid-DTS leaves `js=10, d.ts=0`").
- **No `tsup.config.*` anywhere** — every build is a one-line `tsup` CLI invocation in that package's `package.json`.

### 2.2 Packages [F]

`packages/`: `kern`, `kern-cli`, `kern-icons`, `kern-native`, `kern-primitives`, `kern-tokens`, `mcp` (7 dirs; `mcp` publishes as `@xoroh/kern-mcp`).

**`packages/kern-tokens`** — platform-free token engine. Only dependency: `@fontsource-variable/inter ^5.3.0`. Exports `.` / `./tokens` (dist), `./tokens.json` (raw JSON), `./themes/*` (raw JSON), `./theme` (→ `./src/tokens.css`). **`files[]` is `["dist","src/tokens.css","src/tokens.json","src/themes/*.json","README.md","LICENSE"]`** — `tones.css`, `motion.css`, `comp-tokens.css`, `tailwind.css` exist in the repo but are **not published** (§5.7).

**`packages/kern`** — web renderer. Dependencies: `@base-ui/react ^1.8.0`, `@xoroh/kern-primitives ^0.0.0`, `@xoroh/kern-tokens ^0.0.0`, `class-variance-authority ^0.7.1`, `clsx ^2.1.1`, `tailwind-merge ^3.7.0`. Peers: `react >=18`, `react-dom >=18`, `@base-ui/react ^1.8.0`. `sideEffects: ["./src/theme.css"]`. Exports `.`, `./theme` (→ `./src/theme.css`), `./tokens`, `./utils`, `./start`.

**`packages/kern-native`** — RN renderer. Dependencies: `@xoroh/kern-primitives ^0.0.0`, `@xoroh/kern-tokens ^0.0.0`, `react-native-svg "15"` (exact major pin, no caret). Peers: `react ^19.0.0`, `react-native >=0.86.0 <0.89`. Exports `.` and `./native` — **byte-identical targets** (§8.6).

**`packages/kern-primitives`** — behaviour kernel. **Zero runtime dependencies**; peer `react >=18`. `sideEffects: false`. Exports `.` only.

**`packages/kern-icons`** — icon system. **Zero dependencies**; peers `react >=18`, `react-native *`, `react-native-svg *` (both `optional`). `sideEffects: false`. Exports `.` only, with a `react-native` condition nested inside it mapping to `dist/index.native.js`.

**`packages/mcp`** — MCP server. Dependencies `@modelcontextprotocol/sdk ^1.30.1`, `zod ^4.6.5`. Exports `.`, `./manifest`, `./maturity`, `./package.json`.

**`packages/kern-cli`** — installer. `private: true`. `bin: { kern: "./src/kern.ts" }` — the bin **is TypeScript source**, executed by Bun. Sole dependency `typescript 5.9.3` (closure resolver via the TS compiler API).

### 2.3 Apps [F]

- **`apps/site`** — name `site`, private. TanStack Start `^1.168.60` + TanStack Router `^1.170.41` + Vite `^8.0.0` + Tailwind v4 (`@tailwindcss/vite`), deployed to Cloudflare Workers (`@cloudflare/vite-plugin`, `wrangler ^4.70.0`). Depends on **all six** packages via `workspace:*` plus `react-native-web ^0.21.0` and `react-native-svg` for **live native previews in a browser** (`apps/site/vite.config.ts:9-22` aliases `react-native` → `react-native-web` and pins `react-native-svg` to `elements.web.js`). 307 source files reference `@xoroh/kern`. This is the standing proof that the packages are consumable as code.
- **`apps/mobile`** — Expo `~57.0.25`, React Native `0.86.3`, React `19.2.3`. Runtime dependency on `@xoroh/kern-native` only. `metro.config.js` sets `unstable_conditionNames: ["react-native","require","import"]` so workspace `exports` maps resolve under Metro.

### 2.4 Docs / conventions / governance [F]

- `docs/`: `architecture.md`, `binding-contract.md`, `components.md` (generated), `parity-contract.md` (77 KB), `platform-parity.md`, `versioning.md`, `releases.md`, `verification-limits.md`, five `*-family-reference.md`, `adr/001-005`, `conventions/` (8 files), `design-systems/` (13 system notes + `matrix.md` + `m3-archive/` git-ignored + `m3-usable/`), `plan/` (7 files), `planning/` (10 files).
- `docs/adr/`: `001-esm-only` (dual ESM+CJS output), `002-base-ui-primitives` (web widgets compose on Base UI; Base UI is a dependency of `@xoroh/kern` **only**), `003-generated-inventory` (committed generated manifest + CI regen-and-diff), `004-stability-windows` (proposed; hard cuts before 1.0, one-minor deprecation window from 1.0), `005-theming-pipeline` (named stages, matrix artifact, override-only presets, engine boundary).
- `.agents/skills/`: three skills — `kern` (design canon; 12 reference files, ~1,700 lines), `docs` (doc/skill upkeep + change routing), `kern-agents` (machine surfaces: `llms.txt`, per-page `.md`, `mcp/index.json`, MCP server).
- `.changeset/`: **71 pending changesets** + `config.json` (`access: public`, `baseBranch: main`, `updateInternalDependencies: patch`, no `fixed`/`linked`/`ignore`). All public packages at `0.0.0`; first release computes to **0.1.0** (`TODO.md:3-9`).
- Governance docs: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `SUPPORT.md`, `SECURITY.md`, `LICENSE` (MIT), `.github/CODEOWNERS` (109 lines, last-match-wins, teams including `@xoroh/design-system-lead` for tokens, `@xoroh/kern-lead`, `@xoroh/qa`, `@xoroh/release`), `.github/PULL_REQUEST_TEMPLATE.md`, `FUNDING.yml` (`github: [xoroh]`).

### 2.5 What is *not* in the repo [F]

- **No Storybook, Ladle, Playroom, or Histoire** (grep: zero hits). The equivalent is `apps/site/src/showcase/registry.ts` (~54 per-component configurators) + `apps/site/src/demos/` (96 web + mobile content files) + `apps/site/src/blocks/` + `apps/mobile`'s three-tab Expo showcase.
- No monorepo task runner (Turborepo/Nx).
- No `.changeset` release has run; no `packages/*/CHANGELOG.md` beyond the root `CHANGELOG.md`.
- No React Web Components / custom-elements output; the web renderer is React-only.

---

## 3. Existing architecture and dependency graph

### 3.1 The layer map [F]

`scripts/check-layers.mjs:55-70` declares the map; `bun run check:layers` **passes** (§20). Rules enforced: no upward edges, no renderer→renderer edge, no undeclared bare imports (parsed with the TS compiler API, not regex), `kern/src/start` must not import `@base-ui/*`, and the build graph must be acyclic and cover every buildable package.

```
kern-tokens  (imports nothing from sibling packages; only @fontsource-variable/inter)
   |     |      \
   v     v       v
kern  kern-native   (peers — never import each other; enforced)
  |
  v
@xoroh/kern/start   (subpath of @xoroh/kern; zero direct Base UI import — enforced)

kern-primitives  (React only; may not import tokens, either renderer, or any platform)
kern-icons       (independent; optional RN peers)
kern-mcp, kern-cli  (tooling; read everything, import nothing from it)
```

### 3.2 Verified dependency edges [F]

| Package | Runtime dependencies | Peers |
|---|---|---|
| `kern-tokens` | `@fontsource-variable/inter` | — |
| `kern-primitives` | *(none)* | `react >=18` |
| `kern-icons` | *(none)* | `react >=18`, `react-native *` (opt), `react-native-svg *` (opt) |
| `kern` | `@base-ui/react`, `@xoroh/kern-primitives`, `@xoroh/kern-tokens`, `cva`, `clsx`, `tailwind-merge` | `react`, `react-dom`, `@base-ui/react` |
| `kern-native` | `@xoroh/kern-primitives`, `@xoroh/kern-tokens`, `react-native-svg "15"` | `react ^19.0.0`, `react-native >=0.86.0 <0.89` |
| `kern-mcp` | `@modelcontextprotocol/sdk`, `zod` | — |
| `kern-cli` | `typescript` | — |

`kern-tokens` imports nothing from siblings — verified by inspection of `packages/kern-tokens/src/index.ts` (pure barrel of 12 internal modules). `kern-primitives` imports only `react` — verified by `check:primitives` walking the **transitive** closure (33 files) rather than grepping.

### 3.3 Composition tier model (shared terminology, different packages) [F]

`docs/architecture.md:133-153` and `docs/platform-parity.md` define three tiers, and both renderers implement the same names:

| Tier | Web | Native |
|---|---|---|
| **Component** (one widget, variants + slots) | `@xoroh/kern` | `@xoroh/kern-native` |
| **Block** (pattern composition, slot-driven, domain-free) | `@xoroh/kern/start` (`SearchBar`, `SettingsRow`, `StatusBar`, `ThemeToggle`, `ContrastToggle`, `Sidebar*`, `NavigationRail*`, `SectionDrawer`, `TopAppBar`, `Pane`, `ListDetail`, …) | `@xoroh/kern-native` (`NavigationBar`, `NavigationDrawer`, `MenuScreen`, `MenuSheet`, `BottomSheet`, `SnapSheet`, `DockSheet`, `FilterChipRow`, `SecondaryTabs`, `Pane`, `ListDetail`, `SettingsRow`, …) |
| **Scaffold** (page frame = named regions + behaviour) | `@xoroh/kern/start` (`AppShell`, `Document`) | `@xoroh/kern-native` (`AppShell`, `BootSplash`, `ErrorBoundary`, `Pane`/`SupportingPane`) |

Lower tiers never import higher. **Blocks carry no application domain** — auth, routing and tenancy arrive as props and slots (`docs/architecture.md:141-143`, `docs/design-systems/README.md` "Out of scope").

### 3.4 The multi-design-system research track already in the repo [F]

`docs/design-systems/` is a **completed research track, explicitly marked "research only, NO implementation (founder directive)"** (`docs/design-systems/README.md:3-4`). It contains:

- `matrix.md` — a **35-part-family × 13-system** comparison matrix (m3-material-web, MUI, shadcn, Base UI, Mantine, Chakra, Ant, Carbon, Fluent, Tamagui, RN Paper, NativeBase, Gluestack) with kern's own B/W/N/G/R verdicts, plus a "Reading the matrix" section that states: *"kern leads outright in exactly one cell family: **sheets**"*, *"kern's structural edge (no competitor has it): one parity contract across web+native + M3-deviations slot + AI surface planned"*, and *"Every G needs a standing decision (build / rent / never)."*
- 13 per-system notes.
- `m3-usable/` — curated, committable M3 extracts (tokens, 36 component specs, foundations, parity gaps).
- `m3-archive/` — git-ignored local M3 evidence locker (375 spec pages, 6.1k illustrations, 9 code clones).

This is directly usable input for Phase D/Phase G: the repo has already done the survey work.

---

## 4. Detailed audit — `@xoroh/kern-tokens`

### 4.0 Correcting the task brief [F]

The brief names the package `kern-token`. The repository package is **`@xoroh/kern-tokens`** (plural) at `packages/kern-tokens`. All findings below are against the verified name and path.

### 4.1 Verified purpose [F]

The single, platform-free source of truth for Kern's visual language: canonical token data, the M3 role tables, contrast overlays, the theme resolver, the tonal/spectrum engine, motion, the loading/feedback spec, expressive shapes, and the generators that project all of it into CSS. Its README states the boundary the other way from what one might expect: *"This package may not import React, the DOM, `@xoroh/kern`… Tokens that know what a Button is have become a component."*

### 4.2 Public API [F]

`src/index.ts` is a pure 12-line barrel:

```ts
export * from "./contrast";
export * from "./expressive-shapes";
export * from "./feedback";
export * from "./focus";
export * from "./functional";
export * from "./motion";
export * from "./pipeline";
export * from "./presets";
export * from "./seed-theme";
export * from "./sizes";
export * from "./tokens";
export * from "./tones";
export * from "./variants";
```

**~105 runtime values plus their types.** The load-bearing ones:

| Symbol | Module:line | Purpose |
|---|---|---|
| `tokens` | `tokens.ts:9` | the whole `tokens.json` as a typed const |
| `themes` | `tokens.ts:13` | `{ kern, sharp, brand, compact, demo }` named presets |
| `resolveThemeDetails(mode, contrast, variant)` | `resolve.ts:105` | **the only scheme resolver** |
| `resolveTheme`, `varName`, `shapeVarName`, `themeIds` | `resolve.ts:121-138` | helpers |
| `defineThemePreset(theme)` | `resolve.ts:57` | fail-loud custom-theme validation |
| `themeFromSeed(seed, id, opts)` | `seed-theme.ts:113` | one hex → validated M3-dynamic-colour preset |
| `seedStage` / `mapStage` / `aliasStage` / `componentStage` | `pipeline.ts:45/55/66/103` | the named four-stage pipeline (structure only, no recomputation) |
| `projectToCssVars(scheme)` | `pipeline.ts:89` | the web projection |
| `buildThemeMatrix()` | `pipeline.ts:161` | flattens 2 modes × 3 contrasts × 5 presets → 30 cells |
| `assertSingleRoleTable(matrix)` | `pipeline.ts:215` | the "no second role table" law, executable |
| `scopedDeltas(matrix)` | `pipeline.ts:287` | per-preset CSS-var delta records |
| `defineVariant` / `registerVariant` / `getVariant` / `listVariants` | `variants.ts:31/36/40/46` | runtime tenant variants |
| `resolveThemeLayers` / `assertCompleteScheme` / `schemeToCssVars` | `variants.ts:64/81/94` | |
| `MOTION_ALGORITHMS`, `resolveMotionScheme`, `springConfig`, `motionCssVars`, `prefersReducedMotion` | `presets.ts:36`, `motion.ts:44/81/101/116` | motion as data |
| `contrastRatio`, `textRolePairs()`, `uiRolePairs()`, `orphanedRoles()`, `contrastIssues()`, `activeWaivers()` | `contrast.ts:6/109/174/200/219/252` | generated contrast pairs + the orphan law |
| `TONAL_STEPS`, `SPECTRUM_HUES`, `STATUS_TONES`, `TONE_ROLES`, `registerHue`, `getHue`, `makeHueRamp`, `statusTone`, `spectrumTone`, `avatarToneFor`, `userToneFor` | `tones.ts` | the tonal engine |
| `functional`, `functionalTone`, `toneClass`, `resolveFunctionalTone`, `registerFunctionalDomain`, `setFunctionalOverrides` | `functional.ts` | 10 domains / 46 meaning→tone entries |
| `EXPRESSIVE_SHAPES`, `registerExpressiveShape`, `sampleExpressiveShape`, `expressiveShapePath` | `expressive-shapes.ts:113/268/420/441` | 10 decorative morph shapes, 5 families |
| `PROGRESS_INDICATOR_KINDS`, `LOADING_INDICATOR_STYLES`, `FEEDBACK_SHAPES`, `FEEDBACK_SIZE_DP`, `feedbackTiming`, `registerFeedbackVariant`, `resolveFeedbackVariant`, `arcRotations` | `feedback.ts` | the shared loading spec |
| `FOCUS_RING_WIDTH_PX`, `FOCUS_RING_COLOR_ROLE`, `FOCUS_RING_OFFSET_PX` | `focus.ts:18/24/30` | the whole shared focus-ring spec (three constants) |
| `KERN_SIZES` | `sizes.ts:11` | `["sm","md","lg"]` |

**Not exported from the barrel** (internal, consumed by repo gates by absolute path): `src/color.ts` (OKLCH↔sRGB math), `src/kern-roles.ts` (M3 role inventory), `src/kern-elevation.ts` (M3 resting-elevation table). Verified in `dist/index.d.ts`: zero occurrences of `hexToOklch|M3_ROLES|auditElevation`.

### 4.3 Canonical token data [F]

`src/tokens.json` — 1,136 lines. Ten top-level keys: `$comment`, `palettes`, `spectrum`, `base`, `typography`, `shape`, `elevation`, `motion`, `states`, `spacing`.

| Group | Contents |
|---|---|
| `palettes` | 8 semantic families, 51 steps total. `neutral` (11, 50–950), `blue`/`amber` (5), `primary`/`red`/`green`/`m3violet`/`m3rose` (6). **Mixed step scales** — `m3violet`/`m3rose` use M3 tone numbers (10/20/30/40/80/90), the rest 50–950. |
| `spectrum` | 11 Tailwind-named families × 11 steps = **121 gap-free steps** (gray, red, orange, amber, yellow, lime, green, teal, blue, purple, magenta) — the source for the tonal engine. |
| `base` | 5 unstepped one-offs (`background`, `foreground`, `black`, `white`, `surfaceTonal`). |
| `typography` | `scale` 15 entries (display/headline/title/body/label × large/medium/small, each `{size,lineHeight,tracking,weight}`), `scaleEmphasized` 15 (identical geometry, `weight:500`), `roles` 34 camelCase→scale aliases, `family`, `webFamily`, `fontFaces` (3 Inter faces). |
| `shape` | 10 steps. |
| `elevation` | 6 levels `level0..level5`, M3 dp values 0/1/3/6/8/12, each `{dp, shadow}`. |
| `motion` | 7 easings, 16 durations, 6 springs, **2 schemes** (`standard`, `expressive`), 3 legacy keys. |
| `states` | exactly 5 opacities (hover 8 / focus 12 / press 12 / drag 16 / disabled 38). `states.$comment` states a sixth key *"is rejected by check:kern by design"*. |
| `spacing` | 18 steps `space-0` … `space-900` (8dp base). |

Every colour leaf is `{ oklch, srgb }` — the `$comment` at line 2 records the rule: *"OKLCH on familiar 50-950 steps. Each entry carries `oklch` (canonical, used for math…) and `srgb` (compiled output for React Native, which cannot parse oklch)."* This dual encoding is the single most reusable idea in the package.

Four inline `$comment` metadata keys exist (DTCG-style annotations), filtered by every generator via `!key.startsWith("$")`.

### 4.4 Role tables and the resolver [F]

`src/themes/kern.json` (247 lines) is the **only file with tables**: `color.light` (58 roles), `color.dark` (58), `radius` (10), `conventions` (4 free-text), and `contrast.{light-medium, dark-medium, light-high, dark-high}` partial overlays. The role set is 45 M3 + 13 Kern = 58, where every Kern addition is mapped to a **deviation id** (`K2`, `K3`) in `src/kern-roles.ts:163` and registered in `.team/programs/K-01-deviations.md`.

`resolve.ts` derives the TypeScript types *from that JSON*:

```ts
// resolve.ts:13-15
export type ColorRole = keyof typeof kern.color.light;
export type ShapeRole = keyof typeof kern.radius;
export type RoleTable = Record<ColorRole, string>;
```

so a misspelled role is a compile error. Resolution order is explicit and always complete (`resolve.ts:110-117`): **base(mode) → contrast overlay → preset override**.

`varName` hardcodes the Material prefix (`resolve.ts:129-136`):

```ts
export function varName(role: string): string {
  const kebab = role.replace(/(?<!^)(?=[A-Z])/g, "-").toLowerCase();
  return `--sys-color-${kebab}`;
}
```

Presets are **overrides only, never a second table** — enforced by `assertSingleRoleTable` (`pipeline.ts:215`) and by `check:theme-matrix`. `sharp.json` (shape only, all 10 corners angular), `compact.json` (shape only, 0.75×), `brand.json` (colour only, primary→amber), `demo.json` (colour only, secondary→deep green) all carry `extends: "kern"`, and `overridesFor` (`resolve.ts:49-54`) throws on an unknown selection rather than half-theming.

`defineThemePreset` is genuinely strict: id regex, `extends` must canonicalise to `"kern"` (only base), reserved ids rejected, values must be 6-digit sRGB hex (no oklch, no 8-digit), shape must be px/rem, and the preset must pass `contrastIssues` **in both modes at standard contrast** (`resolve.ts:91-100`).

### 4.5 Directory and module structure [F]

```
packages/kern-tokens/
  src/index.ts            pure barrel
  src/tokens.json         canonical data (1,136 lines)
  src/tokens.ts           thin re-export: tokens, themes, * from ./resolve
  src/resolve.ts          types + resolveThemeDetails + defineThemePreset + varName
  src/pipeline.ts         4 named stages + buildThemeMatrix + assertSingleRoleTable
  src/contrast.ts         generated contrast pairs + orphan law
  src/variants.ts         runtime tenant variant registry
  src/presets.ts          MOTION_ALGORITHMS as validated data
  src/motion.ts           scheme/spring/CSS-var projection
  src/tones.ts            spectrum ramps + status/spectrum/avatar/user tones
  src/functional.ts       10 domains of meaning→tone decisions
  src/colors/color.ts     (internal) OKLCH↔sRGB math
  src/kern-roles.ts       (internal) 45 M3 + 13 Kern role inventory + deviation ids
  src/kern-elevation.ts   (internal) M3 resting-elevation table + auditElevation
  src/sizes.ts, focus.ts, feedback.ts, expressive-shapes.ts, seed-theme.ts
  src/themes/  kern.json, sharp.json, brand.json, compact.json, demo.json,
               index.json (catalog), matrix.json (GENERATED, 30 cells)
  src/tokens.css (GEN), tones.css (GEN), motion.css (GEN),
     comp-tokens.css (GEN), tailwind.css (GEN)
  scripts/  gen-css, gen-theme-matrix, gen-tones-css, gen-motion-css,
            gen-comp-css, check-contrast, check-theme-matrix
```

### 4.6 Implementation technology [F]

Plain TypeScript, zero runtime deps except `@fontsource-variable/inter`, zero React/DOM/RN. Built by `tsup src/index.ts --format esm,cjs --dts --dts-resolve`. `tsconfig` needs `resolveJsonModule: true`. Tests run under `vitest` in `environment: "node"`.

### 4.7 Dependencies and dependents [F]

- **Depends on:** `@fontsource-variable/inter` only.
- **Depended on by:** `@xoroh/kern`, `@xoroh/kern-native`, `@xoroh/kern-cli` (via workspace copies), `apps/site`. Consumed through four distinct surfaces: (a) the JS barrel (`resolveThemeDetails`, `tokens`, tones, motion); (b) `./theme` → `tokens.css`; (c) `./tokens.json` and `./themes/*` raw JSON (used by `apps/site` studio and `kern-cli`); (d) direct file-path reads by repo gates (`scripts/check-kern.mjs:7,11` imports `kern-roles.ts` and `kern-elevation.ts` by absolute path) and by `kern-cli/src/add.ts:163-169` which vendors `comp-tokens.css`/`tones.css`/`tailwind.css`/`motion.css` **from the workspace, bypassing the npm `exports` map**.

### 4.8 Current token and styling assumptions [F]

**The schema is Material-shaped, structurally — not merely in its values.** Nine verified places:

1. `ColorRole`/`ShapeRole`/`RoleTable` are `keyof typeof kern.color.light` (`resolve.ts:13-15`). The whole TS type system for roles is derived from a Material file.
2. `--sys-` is hardcoded in `varName`/`shapeVarName` (`resolve.ts:131,135`) and re-hardcoded in `gen-css.mjs`, `gen-comp-css.mjs`, `gen-tones-css.mjs`. **No single constant.**
3. `kern-roles.ts` exists *solely* to police the M3 role space: 45-role M3 target, forbids `errorFixed`, forbids `FixedContainer`, and `auditRoleInventory` treats any role that is neither in `M3_ROLES` nor a registered Kern deviation as a **violation**. That is an M3-conformance gate, not a schema abstraction.
4. `contrast.ts` generates pairs from M3 family rules, hardcoding the quintet `<f>`/`on<f>`/`<f>Container`/`on<f>Container` (`contrast.ts:119-131`). `ACCENT_FAMILIES` is literally "M3's four plus kern's three deviations" (`contrast.ts:27-33`).
5. `states` is closed at five by policy.
6. Elevation is M3-indexed (dp 0/1/3/6/8/12; `kern-elevation.ts` transcribes M3's per-component table).
7. `defineThemePreset` hardcodes `extends: "kern"` as the only possible base (`resolve.ts:61-66`), and `check-theme-matrix` fails any preset that does not canonicalise to kern.
8. The type scale is M3's 15 roles with M3's own sizes; the shape scale uses M3's `none … extra-extra-large … full`.
9. `seed-theme.ts` is explicitly *"M3 dynamic color as a seed configurator"* with M3's secondary/tertiary hue derivation (`seed-theme.ts:136,141`).

**What *is* provider-agnostic today:** the `{oklch, srgb}` leaf format, the hue registry + `makeHueRamp`, `defineThemePreset` validation, the OKLCH math in `color.ts`, `scopedDeltas`, the four-stage pipeline decomposition, the override-only preset mechanism, and the concept of a contrast overlay as a third axis.

**DTCG relevance (§6.1):** the Design Tokens Community Group published its **first stable Design Tokens Specification (2025.10)** on 2025-10-28 as a Final Community Group Report (`$value`/`$type`/`$description`/`$extensions`, groups, aliases via `{token}` curly-brace refs, composite tokens, media type `application/design-tokens+json`), plus a separate Resolver module for theming. Reference implementations: Style Dictionary, Tokens Studio, Terrazzo. Kern already emits DTCG-style `$comment` keys and already has an alias/override/contrast-axis model that maps cleanly onto DTCG's resolver concept — but its *file format* is bespoke and its role names are M3's.

### 4.9 Web and mobile compatibility [F]

Fully platform-free by construction: no React, no DOM, no RN. Web consumes it via `tokens.css` + `applyKernTheme` (`packages/kern/src/web-theme.ts:44-67`, which sets `varName(role)`/`shapeVarName(shape)`/`motionCssVars(motion)` inline and toggles `.dark` + `data-kern-theme` + `data-kern-contrast` + `data-kern-motion`). Native consumes the **JSON + `resolveThemeDetails`** directly and never touches CSS (`packages/kern-native/src/theme.tsx:63-70`).

Two verified frictions:

- **`@fontsource-variable/inter` is a hard runtime dependency** of a "platform-free" package, and the first line of the generated `tokens.css` is `@import "@fontsource-variable/inter";`. A consumer importing `@xoroh/kern-tokens/theme` must resolve that package. `apps/site/src/routes/__root.tsx:8` *also* imports it directly, so the site loads the font twice.
- **Four generated stylesheets are not published.** `package.json` `files[]` is `["dist","src/tokens.css","src/tokens.json","src/themes/*.json","README.md","LICENSE"]` and `exports` only maps `./theme` → `tokens.css`. `tones.css`, `motion.css`, `comp-tokens.css` and `tailwind.css` exist in the repo (and `comp-tokens.css` holds **142 `--comp-*` component tokens**) but are only obtainable by vendoring from a checkout — which is exactly what `kern-cli` does.

### 4.10 Current tests and validation [F]

**86 vitest tests across 9 files, all green in isolation except one** (see §20 for the failing assertion):

| File | Tests | Covers |
|---|---|---|
| `tokens.test.ts` | 9 | pinned approved values in kern.json light+dark, role-name parity between modes, resolver agreement, `varName("primary") === "--sys-color-primary"` |
| `theme.test.ts` | 6 | light/dark, contrast layering, sharp deltas leaving `onSurface` untouched, `defineThemePreset` validation failures |
| `tokens-css.test.ts` | 4 | **drift between the JSON sources and the committed `tokens.css`**, including a rule that no DTCG `$` key may leak into a var name |
| `tones.test.ts` | 13 | golden hash vectors for avatar/user tones, mode-flipped spectrum steps, functional map resolving all 46 keys, plus a **read of `tones.css`** asserting a `.tone-*` class exists for every functional key |
| `motion.test.ts` | 10 | all three algorithms incl. `reduced` suppressing spatial, fail-loud on unknown id |
| `pipeline.test.ts` | 14 | each stage, the **D6 structural-no-op test** ("pipeline stages change no rendered value"), 30-cell cross product, determinism, `assertSingleRoleTable`, scoped deltas |
| `seed-theme.test.ts` | 6 | repaints exactly 12 accent roles, passes the contrast gate in both modes, fail-louds |
| `feedback.test.ts` | 16 | catalog stability, dp metrics, cross-package literal parity with the native suite, registry fail-louds |
| `expressive-shapes.test.ts` | 8 | 10 built-ins, golden byte-identical paths for `flower-8`/`gem`, linear scaling |

Plus repo-level gates: `check:contrast` (**passes**: 53 text + 16 UI generated role pairs across 4 presets × 2 modes × 3 contrast levels = **1,656 checks**; 0 orphan roles; 3 documented waivers: `scrim`, `shadow`, `outlineVariant`), and `check:theme-matrix` (**passes**: 30 cells in sync, single role table, catalog extends kern).

**There is no `contrast.test.ts`** — contrast is only covered by the repo-level gate, not by vitest.

### 4.11 Publishing readiness [F]

`check:publish` = `publint && attw --pack --ignore-rules=no-resolution` (run per package). `scripts/preflight-publish.mjs` packs with **`npm pack`** rather than `bun pm pack` and fails on any `workspace:` specifier in a shipped manifest — a real defect it was written for (comment: the previous bun version *"reported green through every run while `@xoroh/kern` and `@xoroh/kern-native` shipped a manifest that fails a consumer install with EUNSUPPORTEDPROTOCOL"*). `scripts/check-pack.mjs` passes (22 declared `files` entries all exist; LICENSE + description present on every publishable package).

Remaining readiness gaps: version is `0.0.0` and nothing is on npm; four generated stylesheets are unpublished; `check:generated` currently fails on the elevation artifact (§20).

### 4.12 Architectural strengths [F]

1. **One resolver.** `resolveThemeDetails` is the only place a scheme is built, so a token change cannot drift between web and native. This is the property most multi-platform design systems fail to hold.
2. **Contrast is executable law.** 1,656 generated checks with an *orphan law* — a role that no generated pair reaches and that is not explicitly waived is itself a violation (`contrast.ts:192-217`). The three waivers carry written justifications.
3. **Presets cannot become tables.** Override-only, with a matrix artifact that makes "what does this preset change?" a readable diff (`compact` changes eight shape roles and zero colour roles) and two independent gates enforcing it.
4. **Types derived from data.** Misspelled roles fail `tsc`.
5. **OKLCH canonical + sRGB compiled**, which is exactly the right call for an RN target that cannot parse `oklch`.
6. **Seeded theming fails loud.** `themeFromSeed` → `defineThemePreset` will reject a seed that cannot pass contrast in either mode.

### 4.13 Limitations and technical debt [F]

| # | Finding | Evidence |
|---|---|---|
| T1 | `--sys-` prefix hardcoded in ≥5 files with no constant | `resolve.ts:131,135`; `gen-css.mjs`; `gen-comp-css.mjs:323`; `gen-tones-css.mjs:30` |
| T2 | Role types derived from `kern.json` — a second provider must edit that file or bypass the type | `resolve.ts:13-15` |
| T3 | Single-base rule (`extends: "kern"` only) | `resolve.ts:61-66`; `check-theme-matrix.mjs` catalog leg |
| T4 | `palettes` (51 steps of Material ramps) are reachable **only** through the TS `tokens` export / raw JSON — they are never emitted to CSS (0 hits for `neutral`/`palettes` in `tokens.css`) | generator inspection |
| T5 | **10 dangling `--comp-*-size` vars.** `gen-comp-css.mjs:300-306` — `roleExists` short-circuits on `role in ICON_SIZE`, so the earlier branch wins and emits `var(--sys-color-icon-24)`, which `gen-css.mjs` never defines. The `ICON_SIZE` literals (12px…48px) are never emitted. | generated `comp-tokens.css:23,24,31,61,74,121,123,129,143,153` |
| T6 | **12 dangling motion-scheme vars** — `--sys-motion-scheme-*-{spatial,effects}-*` reference `var(--sys-motion-spring-spatial-fast)` etc., but only `-stiffness`/`-damping` halves are emitted | `gen-css.mjs:109-112` |
| T7 | The shape scale exists in **three independent copies** with no cross-file test: `tokens.json.shape` (10), `kern.json.radius` (10), `expressive-shapes.ts:CORE_SHAPE_TOKENS` (10) | verified |
| T8 | `tokenEntries` filtering is per-call-site, not structural — `gen-css.mjs:39` defines the filter but `typography.scale`, `motion.*` and `spectrum` are iterated without it, while the file's own comment claims *"EVERY group must filter, not just elevation"* | `gen-css.mjs:35-39,77,85,99,106,109,113,130` |
| T9 | `compact.json`/`brand.json` carry empty placeholder sub-objects (`color:{light:{},dark:{}}` / `shape:{}`), weakening the structural invariant | file inspection |
| T10 | `conventions` in `kern.json:137-142` is untyped free text read by no code | file inspection |
| T11 | `check-contrast.mjs:72-77` hardcodes a preset list that omits `compact` and duplicates `themeIds()` | file inspection |
| T12 | Font is a hard dependency of a platform-free package; site double-loads it | `package.json:70-72`, `gen-css.mjs:44`, `apps/site/src/routes/__root.tsx:8` |
| T13 | Failing unit test today | `src/tokens.test.ts:55` — expects `light.secondary === "#2563eb"`, gets `"#625b71"` |

**Fourth-order read on T13:** this is not a cosmetic failure. `tokens.test.ts:53-57` pins *"the M3 purple seed primary and a blue secondary"*. The shipped `kern.json` secondary is `#625b71` (M3's neutral-purple secondary), while the test expects `#2563eb` (a blue). Either the test was written against a different seed decision or `kern.json` regressed. Either way it means **the "approved values" pin is currently wrong about Kern's own intent** — which matters a great deal for a package whose job is to be the canonical source. Resolve before publishing.

### 4.14 Recommended future role within Kern [R]

**Keep as the shared token foundation; generalise the schema, do not split.** Concretely, in priority order:

1. Extract the `--sys-`/`--comp-` prefix into a single exported constant and thread it through the generators → **removes T1**.
2. Make the role table *pluggable*: add a `TokenProviderSchema` concept where a provider registers `{ id, roleTable, shapeTable, contrastOverlays, varPrefix }`, keep `kern.json` as the built-in default, and derive `ColorRole` from the *active* schema rather than the file. → **removes T2/T3**, and is the minimum viable seam for Phase D.
3. Add an optional **DTCG export path** (`tokens.json` → `$value`/`$type` DTCG + a resolver document) as an *additional* interchange surface. Do not replace the internal format — the runtime resolver needs the mode/contrast/variant axes that DTCG's resolver module is only now standardising.
4. Publish the four missing stylesheets, or explicitly declare them CLI-vendoring-only in the README.
5. Fix T5–T11 (all small, all gate-detectable).
6. Decide the Inter question: either make `@fontsource-variable/inter` a **peer** (host owns the font, consistent with `kern-native`'s injected-loader design) or document the coupling.

**Do not split.** A split into `kern-tokens-core` + `kern-tokens-m3` would create exactly the "one giant component with conditional rendering" problem the brief forbids — in token form — and would break `check:theme-matrix`'s single-role-table law, the parity contract, the CLI's CSS vendoring, and ~every consumer import, for no gain until a second provider actually exists. Defer to Option C (§16).

---

## 5. Detailed audit — `@xoroh/kern-icons`

### 5.1 Verified purpose [F]

A **multi-set icon system**: a framework-agnostic icon contract and set registry, plus one committed default set (Material Symbols `rounded` weight 400, Apache-2.0), plus thin web and native renderers. Verified from `package.json` description ("set registry, semantic aliases, and web/native Icon renderers") and the source.

### 5.2 Public API [F]

- `src/index.ts` (web) and `src/index.native.ts` (native) — the only two entries, both re-exporting `./core` and `./render/Icon`.
- `src/core/types.ts` — the contract: `IconQualifiedName` (`set:name`), `IconNameInput` (union of `MaterialSymbolsName | IconName | IconSemantic | IconQualifiedName`, **all four compile-time checked**), `ResolvedIconName`, `IconWeight` (100–700 axis, default 400), `IconShape` (`{o, f?, r?}` — FILL 0 path, optional FILL 1 path, optional `evenodd` rule), `IconShapeMap` (**keys are open `string`, deliberately**: *"drop-in sets carry their own names"*), `IconSet`, `IconManifest`, `IconBaseProps`, `IconSize`.
- `src/core/registry.ts` — `DEFAULT_ICON_SET = "material"`, `registerIconSet(set, iconSet)`, `getIconSet(set)`, `listIconSets()`. The default set is registered **at module load** (`registry.ts:34`), then every entry of `EXTRA_SETS`.
- `src/core/semantic.ts` — `IconSemantic`, a **34-alias unification table** (`menu`, `close`, `back`, `forward`, `check`, `add`, `delete`, `edit`, `search`, `settings`, `home`, `mail`, `inbox`, `calendar`, `tasks`, `notifications`, `account`, `logout`, `help`, `info`, `chevronRight/Left`, `more`, `filter`, `refresh`, `download`, `upload`, `share`, `favorite`, `visible`, `locked`, `send`, `attach`, …). Header: *"Same meaning = same symbol, on every surface (web + mobile)… Prefer these aliases over raw glyph names so a re-decision stays a one-line change."*
- `src/core/resolve.ts` — `ICON_VIEW_BOX` (`0 0 24 24`), `getIconShape`, name resolution across all four input forms, fill/weight/size resolution.
- `src/render/Icon.tsx` — `<Icon>` props: `name`, `set?`, `filled?`, `size?` (token or explicit dp/px, default 24), `color?` (default `currentColor`), `title?` (when omitted the icon is `aria-hidden` and treated as decorative — the correct default next to a text label), `testID?`. Everything else passes through to the `<svg>`.
- `src/render/Icon.native.tsx` — same API, renders via `react-native-svg`.

### 5.3 Directory and module structure [F]

```
packages/kern-icons/
  src/index.ts / src/index.native.ts     the two entries
  src/core/{types,registry,naming,semantic,resolve}.ts + resolve.test.ts
  src/render/{Icon.tsx, Icon.native.tsx, useIcon.ts}
  src/sets/index.ts                     GENERATED: EXTRA_SETS (currently {})
  src/sets/material/{manifest.ts, names.ts, symbols.ts} (GENERATED)
  src/sets/material/shapes/index.ts     GENERATED: eagerly spreads all 24 letter chunks
  src/sets/material/shapes/w400/{a..z}.ts   GENERATED: path data per letter
  assets/material/rounded/              7,824 committed source SVGs (7824 counted)
  assets/brand/, assets/sets/           empty (0 SVGs) — reserved
  config/source.json, config/kern-icon-set.txt
  tools/{sync,generate,check}.ts + tools/lib/{catalog,config,emit,naming,path,svg,validate}.ts
  THIRD_PARTY/{Apache-2.0.txt, NOTICE}
```

### 5.4 Implementation technology [F]

Plain TypeScript + React, zero runtime dependencies. Built by `tsup src/index.ts src/index.native.ts --format esm,cjs --dts --dts-resolve`. The commit pipeline is a **code generator**: `tools/sync.ts` (download/pin upstream), `tools/generate.ts` (emit `names.ts`, `symbols.ts`, `manifest.ts`, `shapes/w400/*.ts`, `sets/index.ts`), `tools/check.ts` (verify). `tools/check.ts` runs **five independent legs** — SVG standards, 24-grid bounds, platform boundary, regen freshness (31 generated files byte-match), and name reachability.

The upstream pin (`config/source.json`): `@material-symbols/svg-400` version **0.47.2**, style `rounded`, weight 400, Apache-2.0, source grid 960, viewBox `0 -960 960 960`, filled suffix `-fill`. The `$comment` is explicit that *"a bump is a code change and must go through review."*

### 5.5 Scale [F]

- **1,340 icons** curated into the committed registry (34.3% of the 3,912 upstream glyph names), per `config/kern-icon-set.txt`.
- **875 icons with distinct FILL 0/1 geometry; 465 where the filled state reuses the outline.**
- `ICON_MANIFEST.counts`: `{ total: 1340, material: 1340, brand: 0, filledReusesOutline: 465 }`.
- **Only 46 of the 1,340 curated names are reachable from a first-party consumer** (`icons:check` leg 5). The tool reports this rather than failing it, and its header records *"the P2 audit (2026-10-01) measured 1340 curated icons against 43 consumed."*
- 7,824 SVGs sit under `assets/material/rounded/` as the source-of-truth corpus.

### 5.6 Dependencies and dependents [F]

**Depends on:** nothing at runtime. **Peers:** `react >=18` (hard), `react-native *` and `react-native-svg *` (both marked `optional` so a web-only app never installs them — the right call; note they are unpinned `*`, so nothing prevents a mismatched `react-native-svg` from producing a broken icon).

**Depended on by:** `@xoroh/kern`, `@xoroh/kern-native`, `apps/site`, and `apps/mobile` transitively via `kern-native`. `apps/site` aliases `react-native-svg` to `elements.web.js` for browser previews.

### 5.7 Token and styling assumptions [F]

**The icon layer is deliberately token-free** — this is the correct boundary and mirrors `kern-primitives`' rule. `Icon` takes `size` and `color` as props (`color` defaults to `currentColor` so icons follow the text role), and accepts a size token from `kern-tokens`' sizes vocabulary only as a *value*, never importing it. The upstream grid is re-based to `0 0 24 24` **at build time** so renderers emit a single `<path>` and never scale/translate (`types.ts` comment: *"Path data is already re-based onto the canonical `0 0 24 24` grid at build time, so renderers emit a single `<path>` and never scale, translate, or re-parse anything"*).

`ICON_SIZE` literals (12px…48px) live in `gen-comp-css.mjs:290-297` — but see §4.13 T5: they are never actually emitted.

### 5.8 Web and mobile compatibility [F]

Genuinely both. The same `core/` resolves semantics once and both renderers paint the result (`types.ts:1-8`). The `exports` map nests a `react-native` condition inside `"."` pointing to `dist/index.native.js` — the correct RN-compatible shape. Web renders one inline `<svg><path>` (SSR-safe, no runtime measurement); native renders `react-native-svg`. `sideEffects: false` is declared.

### 5.9 Current tests and validation [F]

- `src/core/resolve.test.ts` — resolution semantics.
- `tools/lib/naming.test.ts`, `tools/lib/path.test.ts` — generator invariants.
- **76 vitest tests, 3 files — all pass.**
- **`bun run icons:check` passes** all five legs, including byte-exact regen freshness of 31 generated files.

Notably, `tools/check.ts` leg 3 is a **platform boundary** check (43 source modules) — the same idea as `check:primitives`, applied to the icon package.

### 5.10 Publishing readiness [F]

`check:publish` runs; `files: ["dist","THIRD_PARTY","README.md","LICENSE"]`; `publishConfig: { access: public, provenance: true }`; `engines.node >= 20.19`; `type: module`; `sideEffects: false`; dual ESM+CJS with split d.ts. **Licensing is handled properly** — `THIRD_PARTY/NOTICE` + the full Apache-2.0 text ship with the package. Version `0.0.0`.

### 5.11 Architectural strengths [F]

1. **The multi-set contract is real and provider-agnostic.** `IconSet` + `registerIconSet`/`getIconSet`/`listIconSets` + **open-string `IconShapeMap` keys** + `EXTRA_SETS` discovery in `assets/sets/` + `set:name` qualification in `IconNameInput`. A second icon language can be dropped in without touching the core. This is the single most provider-ready piece of Kern's foundation.
2. **Semantic aliases above glyph names** — a 34-entry `IconSemantic` layer means a rename is a one-line change, and it is the natural seam for per-provider icon mapping.
3. **Pinned, versioned, licensed upstream** with a committed registry and a freshness gate — no runtime network fetch, no license ambiguity.
4. **Build-time grid normalisation** keeps both renderers trivially thin.
5. **Four compile-time-checked name forms**, so a wrong glyph fails `tsc`.

### 5.12 Limitations and technical debt [F]

| # | Finding | Evidence |
|---|---|---|
| I1 | **The barrel pulls in all 1,340 icons and tree-shaking does not save you.** Measured on the committed `dist/`: `chunk-*.js` = **1,803,308 B (~1.72 MiB) raw / ~368 KB gzip**. | `packages/kern-icons/dist/` |
| I2 | **`sideEffects: false` does not help.** The registry is a *value* consumed by exported functions, not a side effect: `Icon.tsx → useIcon.ts → resolve.ts → registry.ts:10` → `registry.ts:34 registerIconSet(DEFAULT_ICON_SET, { shapes: ICON_SHAPES })`. `ICON_SHAPES` is an argument to a live call; no bundler can drop it. | `src/core/registry.ts:34` |
| I3 | **Per-letter chunking is defeated.** `src/sets/material/shapes/w400/index.ts:39-65` eagerly spreads **all 24 chunks** into one object. The file's own comment concedes: *"a dynamic `<Icon name={…} />` pulls the whole weight, which is why `config/kern-icon-set.txt` stays curated."* | `shapes/w400/index.ts:35-37` |
| I4 | **Zero lazy loading.** `grep -rn "import(\|lazy(\|require(" src/` → **zero matches**. No `Icon.define()`, no per-icon subpath, no async registry. | verified |
| I5 | **The only real size control is curation** — 1,340 of 3,912 names. And 1,294 of those have no consumer at all. | `icons:check` leg 5 |
| I6 | Second-order: a consumer registering its own large set gets *additive* cost — the 1,340 Material icons stay in the bundle even if the app renders exclusively from the custom set. | I2 |
| I7 | `react-native`/`react-native-svg` peers are unpinned `*`. | `package.json:57-64` |
| I8 | `react-native-svg` type-checking works only because the package ships its own types while `tsconfig` `lib` includes `DOM`. | `tsconfig.json` |
| I9 | **The default set is Material and the semantic table is pinned to Material glyphs** — so `IconSemantic` is currently Material-coupled even though the registry is not. | `src/core/semantic.ts:1-6` |
| I10 | 465 icons ship a FILL-1 state that is path-identical to FILL 0 — dead weight in the bundle. | `ICON_MANIFEST.counts.filledReusesOutline` |
| I11 | 3,912-member `MaterialSymbolsName` union makes a 124 KB declaration chunk; slow `tsc` and editor symbol servers. | `dist/useIcon-*.d.ts` |

**The honest summary:** the intent to code-split exists in comments and directory layout, but not in the shipped graph. `kern-icons` is effectively a ~370 KB-gzip icon blob with a well-designed API on top. SSR payloads are unaffected (only the rendered `<path>` is emitted) — that is the one place the design genuinely wins.

### 5.13 Recommended future role within Kern [R]

**Keep the package and its boundary. Split the *distribution*, not the *code*.** `kern-icons` is already two things: a provider-independent icon *infrastructure* (core + set registry + semantic aliases + renderers) and a Material *asset collection*. They are currently co-published, which is exactly right today — the M3 provider needs Material icons, and a second provider can add its own set at runtime.

Changes recommended, in order:

1. **Do nothing structural before a second provider exists.** The multi-set contract is already correct.
2. **Add a per-icon import path** so dynamic consumers can split: e.g. `@xoroh/kern-icons/menu` → a single icon, or an async `iconLoaders` map. This is the one change with a large, measurable payoff (370 KB → ~1 KB for a 3-icon app).
3. **Curate down to what is consumed, plus a small headroom.** 46 of 1,340 consumed is a 29× ratio; the repo's own P2 audit already flagged it.
4. **Make `IconSemantic` a per-set mapping** rather than a Material-pinned table, so a second provider's set can supply its own glyph for `menu`/`close`/etc. without forking the enum. This is the icon analogue of Phase D's missing-component rule.
5. **Pin the RN peers** (`react-native: ">=0.86"`, `react-native-svg: ">=15"`) rather than `*`.

**Do not rename or split.** The cost/benefit is unfavourable: the npm name `@xoroh/kern-icons` is already the one name in the repo that reads correctly under a multi-provider model, the set registry already isolates provider-specific assets, and a split would break every `Icon` import in two renderers plus the CLI and the site.
