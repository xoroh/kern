# Kern 0.1.0 Preview — Independent Full-Repository Audit (2026-10-15)

- **Report path:** `docs/audits/kern-0.1.0-preview-full-audit-2026-10-15.md` (this file; the `docs/audits/` directory did not exist and was created for this report only)
- **Branch / HEAD at audit start:** `main` @ `b59245f8746a63780ab428e1b5d41d87bc1478fc` (ahead of `origin/main` by 40 commits)
- **Mode:** read-only audit. No source, docs, config, dependency, or Git-state modification was performed except creating this report.
- **Canonical authority:** `docs/architecture/0.1.0-preview-redesign.md` (sole execution authority; `docs/planning/` frozen historical evidence)

---

## 1. Executive summary

The repository is mid-flight through at least five overlapping workstreams (A4-1 web comp wiring, A4-2 shared comp contract, N8 native decoupling, N9 primitives move, C1 CLI create/init) plus post-N8 maintenance (icons, playground). The **implementation quality of the work itself is high**: A4-1/A4-2/N8/N9/C1-core are all substantively implemented with tests, and first-hand re-verification confirms the headline claims (zero `resolveThemeDetails` in native components, comp validation/merge/DP conversion, 5-slot web wiring with fallbacks, staged `git mv` preserving identity, `create` delegating to `initScaffold`).

What blocks stabilization is **integration and gating debt, not implementation failure**:

1. `check:kern` is **red** (exit 1) with 8 violations that are all the intended new `var(--comp-*,var(--sys-*))` syntax — a scanner false-positive that fails CI until the shape law is updated (AUD-001, High).
2. Four load-bearing files are **untracked** (`e2e/comp-overrides.spec.ts`, `packages/kern-cli/src/create.ts`, `create.test.ts`, `packages/kern-native/src/theme-comp.test.tsx`) — the A4-1 browser proof, the C1 contract, and the A4-2 provider-propagation proof are invisible to CI until tracked (AUD-006, AUD-008, AUD-011).
3. The staged N9 rename (39 files) plus 113 modified files plus lockfile/docs churn require a **sequenced commit plan**, not a single squash — the freeze artifacts (`inventory-freeze.json`, `per-file-decisions.json`) have expected post-A2/A3/N8 deltas that must be regenerated in a disposable copy, never committed as-is (AUD-019, AUD-020).
4. C1 is **core-complete but surface-incomplete**: programmatic export missing, README/description stale, no starter matrix, and the pre-existing `kern.json` renderer-persistence defect still live (AUD-011, AUD-012).
5. Two authority docs (`docs/architecture.md`, `docs/releases.md`) are stale on package count, generated surface, and publication boundary, and the publication boundary for internal-only primitives is **undecided** (releases.md still promises public `@xoroh/kern-primitives` vs §1(7) internal-only) (AUD-010, AUD-015, AUD-016).

No secrets, no Kern↔Axis code coupling, no web↔native runtime imports, and no primitives-boundary violations were found. `check:layers`, `check:parity`, `check:primitives`, `check:stale-refs`, `check:registry-paths`, `check:ts-policy`, `check:theme-matrix`, `check:contrast`, and `icons:check` all pass first-hand.

- **Stabilization readiness: NOT READY** (one red gate + untracked proof files + freeze/commit sequencing must close first; all are small and scoped).
- **C-series + F1 readiness: NOT READY** (C1 surface gaps, `kern.json` defect, contracts `schema.json` gaps, registry P3 fields, starter-matrix and F1 transport decisions all outstanding).

---

## 2. Repository baseline and safety verification

### 2.1 Baseline captured at audit start

| Item | Value |
|---|---|
| Branch | `main` |
| HEAD | `b59245f8746a63780ab428e1b5d41d87bc1478fc` (`docs(architecture): record post-audit corrections`) |
| Upstream | ahead of `origin/main` by 40 commits (do not push; release HOLD active) |
| `git status --short` lines | 156 total: **4 untracked (`??`)**, **113 modified (`M`)**, **38 renamed (`R`)**, **1 renamed+modified (`RM`)** |
| Staged files | 39 (the N9 `packages/kern-primitives` → `libs/kern-primitives` move) |
| Unstaged files | 114 (A4/N8/C1/icons/playground/scripts/docs/`bun.lock`) |
| Untracked files | 4: `e2e/comp-overrides.spec.ts`, `packages/kern-cli/src/create.test.ts`, `packages/kern-cli/src/create.ts`, `packages/kern-native/src/theme-comp.test.tsx` |
| Stashes (unmodified, preserved) | `stash@{0}: wip-preserve`, `stash@{1}: WIP on main: e565c7f …` |
| Other worktrees | `.worktrees/p1-g5` exists (excluded from searches; untouched) |
| Recent commits | `b59245f8` post-audit corrections → `6aca904b` contracts/dist/publish preflight → `6024eede` A3 material-3 extraction → `03ae685f` A2 completion record → `d1e36924` A2 engine → `07084b48` A1 completion record → `95fd87c8` A1 contracts → `b2ca9175` N4 preset migration |
| Branches | `main` + ~24 `polly/*` branches (site/themes/agents/starters work); no work was touched on any branch |

### 2.2 Safety method

- Only `read`, `grep` (via `shell`), `git diff/log/status/show`, and read-only gate scripts were used.
- `check:generated` / `check:cold` / any generator / `bun install` / formatters / codemods were **never run** (see §3 limitations and AUD-019).
- After each gate group, `git status --short` was re-checked; counts were stable (156 lines before and after).
- The only filesystem write in the repository is this report (new file under new `docs/audits/` directory). Final verification in §21.

---

## 3. Scope, methodology, limitations, and tools used

### 3.1 Scope

Architecture, package boundaries, A4-1/A4-2/N8/N9/C1/post-N8 verification, components/foundations/tokens/themes/icons/blocks/parity, build/test/typecheck gates, CLI/templates/MCP/AI-first, security/supply-chain, docs/hygiene, dead code, performance/maintainability — per the mission brief §§5–12.

### 3.2 Methodology

1. Read the canonical plan end to end (§§0–14, incl. §§11, 13.4 DAG, 13.5, 14) plus `docs/architecture.md`, `docs/releases.md`, root `package.json` scripts, and all package manifests.
2. Four parallel read-only specialist sweeps (A4 tokens, N8/N9 native+primitives, C1/CLI/MCP/playground/icons, architecture/docs/security) — findings below were **re-verified first-hand** (greps, diffs, gate runs) before being admitted; subagent-only claims are marked as such.
3. First-hand gate runs (safe only): `check:layers`, `check:parity`, `check:primitives`, `check:kern`, `check:stale-refs`, `check:registry-paths`, `check:ts-policy`, `check:theme-matrix`, `check:contrast`, `icons:check`.
4. Targeted first-hand greps: `resolveThemeDetails` fan-out, `packages/kern-primitives` staleness, `check-kern` shape regex, `createApp` exports, CLI README, MCP `TOKEN_PRESETS`/README, `registerPreset` validation, `schema.json` coverage, catalog `extends` prose.

### 3.3 Limitations (unverified areas)

- **NOT run (unsafe on dirty checkout):** `check:generated` / `check:generated:census` (AUD-019 restore-before-exit defect — a stale-path crash exits before restore and leaves partial writes; the plan's disposable-copy procedure in §11.A is recorded but unvalidated here), `check:cold`, `bun install`, `bun run build`, full `typecheck`, full unit suites, Playwright e2e. Suite counts below are inherited from the canonical progress log and subagent observation, **not** re-run by this audit.
- **NOT verifiable on this host:** iOS simulator/device, Android emulator boot, TalkBack/VoiceOver, low-end-device perf, screenshot matrix (§4.3 honest matrix — documented limitation, not a finding).
- **NOT queried:** npm/DNS/trademark state (`xoroh-axis` availability, `axis.xoroh.org`, external-consumer count) — treated as "no evidence", per plan §11.2-F.
- Sampling: ~64-file N8 diff verified by pattern + 8-file sample + full grep counts (0 remaining component importers), not line-by-line review of all 64.

### 3.4 Tools used

`read`, `shell` (`git`, `grep`, `sed`, `bun run <gate>`), `subagent` (4 read-only explore agents), `write` (this report only). No network fetch was needed; all evidence is in-repo.

---

## 4. Canonical requirements and acceptance-criteria traceability

Authoritative stack: (1) `docs/architecture/0.1.0-preview-redesign.md` — sole execution authority; (2) `docs/architecture.md` — current-system description (stale in places, AUD-015); (3) `docs/planning/` — frozen historical evidence, never edited; (4) `docs/releases.md` — release policy (stale package table, AUD-016).

| Plan requirement | Status (this audit) | Evidence |
|---|---|---|
| Generic `--sys/ref/comp` grammar (R1/B1–B3) | Implemented + verified | Zero dangling refs per history; `check:kern` sys-role leg passes; only the shape-law leg FPs on new syntax (AUD-001) |
| Deterministic generation + freshness gates (§4.2) | Implemented; **checker defective** | 19 generators/24 outputs per plan; `check-generated-freshness.mjs` early-exit defect (AUD-019); freeze deltas pending scratch regen (AUD-020) |
| `material-3` preset identity, clean break (B4/N1–N3) | Implemented; catalog prose stale | `packages/kern-material-3/src/themes/{material-3,sharp,brand,compact,demo}.json` exist; resolver default `material-3`; but 3 catalog descriptions still read "Extends kern" + `check-theme-matrix.mjs` comments say `kern` (AUD-018) |
| DTCG 2025.10 export/validate | Implemented (not re-run) | `dtcg.json` + suite per log; no contrary evidence |
| Web renderer CSS-var-first, no provider | Implemented + verified | 0 web files import `resolveTheme*` (history; consistent with A4 diff touching only 5 components) |
| Native renderer + parity | Implemented; device unverified | `check:parity` passes first-hand (92 shared / 34 web-only / 9 native-only / 0 stubs / 6 deliberate); device matrix open (AUD-021) |
| Icons catalog + dual renderers + licenses | Implemented + verified | `icons:check` passes first-hand: 1342 icons, freshness byte-match, reachability ok |
| Blocks as registry-installable source | Partial (planned) | 3 blocks; closure install exists; version/provenance fields outstanding per plan §13.2 #8 |
| CLI `init/add/list/diff/upgrade` + receipts | Implemented (not re-run) | Per log 26 tests; no contrary evidence; `kern.json` defect live (AUD-012) |
| CLI `create` + starters (C1/C1-S, §13.5) | **Core implemented, untracked, surface-incomplete** | `create.ts`/`create.test.ts` untracked; no programmatic export; README stale (AUD-011) |
| MCP 12 tools + AI discovery | Implemented; docs stale | `TOKEN_PRESETS` = `base/material-3/sharp/brand/compact` in code but README documents `kern/…/demo + m3 alias` (AUD-013) |
| Universal contracts A1 (`designSystem`, deps, capabilities, `replaces`) | Implemented (A1 commit in log); `schema.json` partial | `component.ts` has `designSystem`/`replaces`/deps; `schema.json` covers only `provider`+`component` (AUD-014); `provider.ts` retained until P3 (AUD-023) |
| Universal engine A2 (`preset.ts`, `pixel`) | Implemented (A2 commit in log) | Registry-driven resolver; default `material-3`; `pixel` fixture per log |
| `@xoroh/kern-material-3` package A3 | Implemented (A3 commit in log) | Package exists with 7 theme JSONs; renderers register via side-effect import; missing from `docs/releases.md` + `docs/architecture.md` (AUD-015/016) |
| Selective `--comp-*` wiring A4 | **Implemented, gate red** | 5 slots wired + tested (A4-1/A4-2 logs); `check:kern` FP (AUD-001); web projection gap (AUD-002) |
| Native decoupling N8 | **Implemented + verified** | 0 `resolveThemeDetails` in `components/` first-hand; `theme.tsx` sole importer (AUD-007/008 notes only) |
| Primitives `libs/` move N9 | **Implemented + verified** | 39/39 staged `git mv`, identity preserved; tooling scans both areas; publication boundary open (AUD-009/010) |
| Site/playground parity | Partial; 1 known e2e exception class | `site-design.spec.ts` carve-outs are architecturally sound; phone-width usability caveat (AUD-022) |
| Release HOLD, no publication | Active | All manifests `0.0.0`; HOLD gate retained; no publish performed |
| Axis standalone (§10) | Planned, not extracted/verified | Zero code coupling first-hand; prose governance only |
| F1 feedback (§14) | Planned; 3 owner decisions open | Transport, CLI-vs-CLI+MCP scope, retention/pseudonym unresolved |

Conflicts resolved in favor of the canonical plan; where the plan conflicts with itself (baseline §0 row vs §2.2/§13.4 on primitives path), it is recorded as AUD-009 rather than silently rewritten.

---

## 5. Workstream-by-workstream verification

### 5.1 A4-1 — Web component-variable overrides: IMPLEMENTED, gate red on scanner

- **Files:** `packages/kern/src/components/{button,card,chip,input,switch}.tsx` + 5 test files + `display-overlays-m3`/`form-family-m3` mirrors + untracked `e2e/comp-overrides.spec.ts`.
- **Observed:** base classes now `rounded-[var(--comp-button-container-shape,var(--sys-shape-corner-full))]` (`button.tsx:10`), card medium (`card.tsx:6`), chip small (`chip.tsx:8`), text-field both variants + affix box (`input.tsx:100-101,110-111,149`), switch track-only (`switch.tsx:54`, thumb stays `rounded-full:61` — correct). Fallbacks match `tokens.css:143-152` emitted values (full 9999px, medium 12px, small 8px, extra-small 4px).
- **Tests:** jsdom wiring assertions (class presence + old-class absence) in all 5 suites + e2e 5-case real-browser proof (fallback resolves → ancestor override applies; 400 ms settle covers the 200 ms transition).
- **Blocker:** `check:kern` shape law (AUD-001) matches the new bracket syntax with its scan regex but none of its three allow patterns — 8 violations, exit 1, first-hand reproduced. Sys-role leg passes (fallbacks resolve). This is a **scanner defect, not an implementation defect**.
- **Divergence:** web toggle-morph-to-pill hardcodes `rounded-(--sys-shape-corner-full)` (`button.tsx:194-199`) while native uses comp-aware `pillRadius` (AUD-003).

### 5.2 A4-2 — Shared component-token contract: IMPLEMENTED with 3 gaps

- **Files:** `packages/kern-tokens/src/resolve.ts` (`CompTable:26`, `ThemeOverrides.comp:28-32`, `ResolvedTheme.comp:47-57` absent-when-empty, `PresetTables.comp:64-72`, validation `:192-202` kebab keys + px/rem lengths with deliberate no-membership-check, merge `:274-280` per-key override-wins, `cssLengthToDp:301-321` rem×16/never-NaN), `preset.test.ts:226-317` (6 tests: byte-identical comp-free, partial merge, unknown-but-wellformed inert, malformed throws, DP conversions), native `theme.tsx:99` exported `defaultScheme` + 5 style fns + `styles.test.ts:170-220`/`button.test.ts:173-191` + untracked `theme-comp.test.tsx` (4 provider-propagation tests).
- **Backward compat:** proven — no shipped preset carries `comp` (`grep '"comp"' packages/kern-material-3/src/themes` empty per sweep; comp-free resolves byte-identically by test).
- **Gaps:** no web theme-application path for `comp` (`projectToCssVars`/`applyKernTheme`/`clearKernTheme`/`scopedDeltas`/matrix/`gen-preset-css` all ignore it — web override today is manual `style.setProperty`, AUD-002); `registerPreset` skips `comp` validation that `defineThemePreset` enforces (AUD-004); intermediate `extends`-chain `comp` merge is leaf-plus-ultimate-base with an untested parity claim (AUD-005).

### 5.3 N8 — Native theme-resolver decoupling: COMPLETE (2 notes)

- **First-hand:** `grep -rn resolveThemeDetails packages/kern-native/src/components/` → **0 hits**; whole-`src/` hits only `theme.tsx:9,40,68,99,119` + untracked oracle test `:22,80`. The ~64-file diff is a mechanical `resolveThemeDetails(…)` → `defaultScheme` default-param swap with unchanged signatures; `bottom-sheet-surface.ts`, `shell.tsx`, `web-parity.tsx` correctly transformed; no import cycle (`theme.tsx` imports no components).
- **Signature drift:** none — old call sites were all the static light triple; `defaultScheme = resolveThemeDetails("light")` is byte-equivalent; context type tracks the engine via `ReturnType`.
- **Notes:** `useKernTheme()` fallback keeps a second direct `resolveThemeDetails(mode)` with OS mode (AUD-007 — intentional asymmetry vs `useKernScheme()` static-light fallback, but duplicated resolution logic inside the one allowed importer); the oracle test's two hits mean a naive `src/`-wide zero-grep fails — scope the gate to `src/components/` with an allowlist (AUD-008).
- **IconButton "fix":** the `icon-button.tsx` diff is N8-only (4 lines, import + defaults); no logic fix present. Any IconButton defect beyond the N8 import churn is either already closed or never landed in this diff — the plan's "IconButton typecheck" pre-existing error (web fixture `icon` prop) is a separate, still-open item (§16).

### 5.4 N9 — Internal primitives restructuring: COMPLETE as physical move (2 items)

- **Identity:** `libs/kern-primitives/package.json` vs `git show HEAD:packages/kern-primitives/package.json` = 1-line diff (`repository.directory` → `libs/kern-primitives`); name/version/exports/`publishConfig`/peers/scripts/src all byte-identical; barrel sha unchanged. No `private:true` flip.
- **Tooling:** `package.json` workspaces += `libs/*`; `build-order`, `check-layers` (+`TSCONFIG_ROOTS`), `check-pack`, `check-dist-exports`, `check-ts-policy` generalized to both areas; `check-primitives`/`check-consumption`/`check-parity`/`preflight-publish`/`generate-inventory-freeze`/`verify-consumer`/CODEOWNERS/CI/`init.ts`/`check-primitives-docs`/`generate-legal`/`modules.ts`/`legal.ts` all repointed. First-hand `check:layers`/`check:primitives` pass; `bun.lock` diff is 19+/19- (symlink churn only).
- **Staleness:** zero live-code hits for `packages/kern-primitives` outside history; remaining hits are frozen planning docs, obsolete HANDOFF papers, and canonical-plan baseline row `:27` (AUD-009).
- **Boundary decision:** correctly left open — flipping `private:true` + `releases.md` Public cell belongs to the release workstream, but `releases.md:12` still promises public primitives in direct tension with §1(7) internal-only (AUD-010, owner decision).

### 5.5 C1 — CLI `create` versus `init`: CORE-COMPLETE, surface-incomplete, untracked

- **New (untracked):** `create.ts:1-38` — thin `createApp(name, opts)` over `initScaffold` (`CreateOptions = Omit<InitOptions,"force">`, existing path refused with a message naming `init`, empty name rejected); `create.test.ts:14-65` — 4 cases (scaffold set + receipt + `renderer==web`, file-set equivalence, existing-dir refusal leak-free, empty-name error). Test 2 compares `files` only, not `kern.json` content (`target` necessarily differs) — adequate but imprecise.
- **Wiring:** `kern.ts:4,38-43,85-99` — help line + `create` branch (`--from`, `--registry`, same receipt/instructions shape); `init.ts` diff is N9-only (1 line). No duplicated copy-tree logic.
- **Remaining:** no `createApp`/`CreateOptions` export from `index.ts` (binary-only API); `package.json` description + `README.md:3-9` document only `init`; no `create` docs/man/completion; `create --registry` path untested beyond shared `initScaffold`; both commands still hardcode `renderer:web`, `mode:source-hybrid` with no native scaffold (AUD-011). C1-S/C2/C3 (starter matrix, configurability, upgrade safety) untouched by design.

### 5.6 Post-N8 maintenance

- **Icon-set validation: FIXED, verified.** `crop-square` added to `kern-icon-set.txt:174` + `manifest.ts:17-18` (1341→1342) + `names.ts` + `shapes/w400/c.ts:333-336`; playground underscore call-sites kebab-fixed (`:1387,1480,1785`). First-hand `icons:check` passes (1342 icons, freshness byte-match, reachability ok). Residual: `packages/mcp/src/tools.ts:191` "1340 glyphs" comment stale (AUD-013).
- **Playground viewport: RESOLVED as designed, with a usability caveat.** Route renders no `SiteLayout` by design (full-bleed workbench: rail 80px + editor 360px + `flex-1` preview, each pane self-scrolling); `#main` absence and `data-kern-theme` absence are architecturally correct (playground spreads computed `vars` inline, never calls `applyKernTheme`); `site-design.spec.ts:4-15,91-125` carve-outs are sound. Caveat: at 390px viewport the fixed 440px chrome collapses the preview to ~0 width with key switcher controls `hidden sm:/lg:` — e2e-green but phone-unusable (AUD-022). Not a stabilization blocker for desktop-first Preview, but must not be claimed as responsive.

### 5.7 Other concurrent work in the worktree

The full diff was classified: A1/A2/A3/N-series fallout (material-3 extraction, preset-id migration, token CSS namespace), A4/N8 component churn, N9 path rewiring, C1 wiring, icon glyph + playground icon-name fixes, `site-design.spec.ts` carve-outs, inventory/decision JSON deltas, `bun.lock` symlink churn, and `docs/architecture.md`/`docs/releases.md` partial updates. No undocumented feature work, no competing implementation of the same slot, and no destructive operation was found. The one scope question — whether the web `IconButton icon` typecheck error is fixed in-tree — answers **no** in the current diff (§16).

---

## 6. Architecture and package-boundary findings

- **Dependency direction holds** (first-hand `check:layers` exit 0): rank-0 `primitives/tokens/icons/contracts`, rank-1 `material-3 → tokens`, rank-2 `kern/kern-native → tokens+primitives+material-3`, tooling `kern-cli/kern-mcp` aside; acyclic build graph; no renderer↔renderer edge; no undeclared bare imports.
- **Multi-design-system boundary respected:** M3 assumptions are explicit and gated (single `material-3` system until a second ships both renderers); generic grammar + `ResolvedTheme` + `preset.ts` schema are the neutral layer; `pixel` fixture proves non-M3 resolution per log. Registry `designSystem` absence is planned P3 work (AUD-024), not drift.
- **Primitives neutrality holds** (first-hand `check:primitives` exit 0): zero token/renderer/DOM/RN runtime imports; only policy comments mention the forbidden names; 7 orphaned exports remain per-symbol P4 decisions (AUD-027 context).
- **Axis separation holds:** ~100 `axis` hits are all `StateAxis`/CVA-axis/geometry/icon-data/prose-governance; zero `from.*axis`/`@xoroh.*axis`/workspace/cross-repo imports; no `packages/*axis*` dir; Axis remains planning-only with a release-join gate, correctly decoupled from implementation lanes.
- **Doc-vs-manifest drift (Low):** plan §2.2 says renderers depend on contracts (types-only) but only CLI declares it — either P3-aspirational or a missing `dependencies` entry (AUD-025).

---

## 7. Components, foundations, tokens, themes, icons, blocks, platform parity

- **Parity verified first-hand:** `check:parity` exit 0 — 92 shared / 34 web-only / 9 native-only / 0 stubs / 6 deliberate (`sonner`, `create-sonner-manager`, `kbd`, `native-select`, `link`, `preview-card`) + canaries (`segmented-button`, `command`, `snackbar`, `input-otp`). `preview-card` absence on native is a documented P4 decision.
- **A4 wiring is shape-only by allowlist** (5 slots of 234 in `comp-tokens.css`): button/card/chip/switch-track/text-field-shape. Everything else (heights, label typography, icon sizes, fab, card color, switch colors/sizes, button-group/fab-menu) is deliberately reserved — must be stated as scope, not discovered as omission (AUD-027).
- **Tokens/themes:** matrix 30 cells + contrast 1656 checks pass first-hand; catalog `extends` semantics correct, prose stale (AUD-018); comp `typography` 5-var expansion + Tailwind spacing fixes retained per history.
- **Icons:** 1342 glyphs, dual renderers, license payload, freshness byte-match — healthiest surface in the repo.
- **Blocks:** 3 blocks + closure install preserved; version/provenance metadata still planned (plan §13.2 #8) — not re-audited beyond registry-shape confirmation.
- **A11y/behavior:** mandatory-label/reduced-motion/indeterminate-`aria` rules preserved per A4-0/§4.1; no new a11y regression evident in the 5-file diff (thumb/track scoping correct, filled-zero-bottoms preserved). Full a11y suite re-run is outstanding (§16).

---

## 8. Build, tests, typechecks, generated artifacts, validation gates

### 8.1 First-hand gate results (exact commands, outcomes)

| Command | Outcome | Notes |
|---|---|---|
| `bun run check:layers` | **PASS** (exit 0) | 7 layers + tooling printed; no upward/renderer edges |
| `bun run check:parity` | **PASS** (exit 0) | 92/34/9/0/6 + 4 canaries |
| `bun run check:primitives` | **PASS** (exit 0) | 33/33 reachable, 0 forbidden |
| `bun run check:kern` | **FAIL** (exit 1, 8 violations) | All 8 are A4 `var(--comp-*,var(--sys-*))` shape classes — scanner FP (AUD-001). Sys-role + hex legs pass |
| `bun run check:stale-refs` | **PASS** (exit 0) | 2 biome globs, 51 CODEOWNERS, 7/7 workflow pathspecs, 42 script paths |
| `bun run check:registry-paths` | **PASS** (exit 0) | 418 real paths resolve |
| `bun run check:ts-policy` | **PASS** (exit 0) | TS 5.9.3 pinned everywhere |
| `bun run check:theme-matrix` | **PASS** (exit 0) | 30 cells in sync (message still says "extends kern"/alias — AUD-018 prose only) |
| `bun run check:contrast` | **PASS** (exit 0) | 1656 checks, 3 spec-waived roles with rationale |
| `bun run --filter @xoroh/kern-icons check` | **PASS** (exit 0) | 1342 icons, 31 files byte-match, 61/1342 reachable (catalogue, reported not failed) |

Git state was identical before/after (156 status lines) — no gate wrote tracked files.

### 8.2 Not run (with reason)

`check:generated` + census (AUD-019 destructive-on-failure), `build`, `typecheck`, unit suites, e2e — all would take minutes-to-tens-of-minutes and the first two risk writes on this dirty checkout. Suite counts cited (tokens 66, M3 102, web 820, native 101/103 + jest 449, CLI 26, MCP 29, primitives 194, contracts 27) are inherited from the canonical progress log + sweeps, not re-proved here. The stabilization task must re-run the full matrix from a clean disposable copy (§18).

### 8.3 Known items disposition

- `check:kern` FP → AUD-001 (scanner defect, not A4 defect — confirmed by inspecting scan regex vs allow-list).
- CLI/MCP timeouts under parallel load → not reproduced here (sequential runs); log records them as environmental (11/11 with timeout). Stabilization must confirm with a quiet serial re-run rather than raising timeouts as the fix.
- Playground viewport → by design + phone caveat (AUD-022).
- Icon validation → fixed + green (§5.6).

---

## 9. CLI, templates, MCP, AI-first capability audit

Agent workflow walkthrough (discover → compatibility → deps → select → install/vendor → configure → validate → recover → docs):

1. **Discover:** MCP 12 tools live; `TOKEN_PRESETS` correct in code; README stale (AUD-013); registry 418 rows resolve (first-hand). `demo` correctly `template:true` in catalog but still listed in README discovery values — must be removed from AI discovery per §11.2-C.
2. **Compatibility:** registry rows carry `{name,export,platform,entrypoint,path,status}` with **no `designSystem`/`preset`** — P3 addition (AUD-024). `platform`→`renderer` rename is P3; the `kern.json` writer/reader split is N6 (AUD-012).
3. **Dependencies:** closures precomputed; `assets: []` always (closure assets dropped — known per §0.4, needs P3 file-list work, not re-verified).
4. **Select without mixing systems:** single-system Preview makes this trivially safe today; the guard for system #2 is the P3 `designSystem` field.
5. **Install/vendor:** `add` (vendored) + package modes exist; `upgrade` has no block path; MCP byte tools degrade outside checkout (bundled manifest/maturity only, no sources by design — correctly documented).
6. **Configure:** `init` stamps `kern.json`; renderer choice does not persist (AUD-012); `preset` pin is an open owner decision (§17).
7. **Validate:** `validate_install` errors without CLI beside the server (correctly labelled degradation).
8. **Recover:** refusal/overwrite/version-mismatch paths exist in `init`; `create` refusal names `init` (good); conflict fixtures for C3 outstanding.
9. **Docs:** CLI README + package description stale on `create` (AUD-011); `schema.json` missing 3 record kinds (AUD-014).

No MCP scaffold tool exists (`create`/`init` are CLI-only) — acceptable if documented; F1 scope decides whether MCP gains a submit path.

---

## 10. Security, reliability, supply-chain findings

- **Secrets: CLEAN** (first-hand + sweep): `git grep -E "AKIA|ghp_|gho_|npm_|BEGIN .*PRIVATE KEY|sk-(live|test)-|xox[bap]-"` → zero hits. `NPM_TOKEN` appears only as `secrets.NPM_TOKEN` wiring + empty `env.example` placeholder + prose. `.env` untracked/ignored; only `env.example` tracked. No secret values printed anywhere including this report.
- **Shell construction: SAFE** — sole `execFileSync("tar", ["-xzf", tarball, "-C", tmp])` (`add.ts:26,149`) is argv-array, no shell, fixed binary, `mkdtemp` dir, `package/` root check. Residual `tar` symlink-traversal risk only matters for untrusted tarballs (AUD-026 hardening, Low, Preview-retain).
- **Path traversal / interpolation: SAFE for trusted-registry posture** — `closure.ts:mirrorPath` rejects non-`src/`; `commitPlan` preflights before first write; `file.out` derives from in-repo mirror map, not user input; `copyTree` + `__KERN_*__` substitution are literal replaces, no eval/shell. Add an `out`-normalization guard only if the registry ever becomes remote/untrusted (AUD-026).
- **CI permissions: least-privilege** — `ci.yml`/`deploy.yml` `contents: read`; `release.yml` `contents+pull-requests+id-token: write` justified (changesets PRs + npm provenance); no `write-all`, no token in logs.
- **Supply chain:** all manifests `0.0.0` unpublished; HOLD intact; `publishConfig.provenance:true`; `preflight-publish` covers 7 packages (M3 added per log); `^0.0.0` + `workspace:*` is the documented convention (release-semantics decision owned by K-05, not this audit).
- **Reliability:** the freshness-checker restore defect (AUD-019) is the only reliability red; CLI/MCP parallel-load timeouts are environmental until proven otherwise.

---

## 11. Documentation and repository-hygiene audit

- **Authority map (retain, don't delete):** canonical plan > `docs/architecture.md` (current-system, stale AUD-015) > `docs/releases.md` (policy, stale table AUD-016) > `docs/planning/` (frozen evidence — `CURRENT_STATE.md:20`, `01-primitives.md:7,46` staleness is correct history) > HANDOFF working papers (obsolete, move don't delete).
- **Stale in live docs:** `docs/architecture/0.1.0-preview-redesign.md:27` primitives path (AUD-009); catalog "Extends kern" ×3 + matrix-script comments (AUD-018); MCP README + glyph-count comment (AUD-013); CLI README + description (AUD-011); `docs/architecture.md` package/generated/gates tables (AUD-015); `docs/releases.md` seven-package table (AUD-016); `docs/README.md` Plans section omits canonical file + planning freeze (cleanup P3).
- **Moves owed (per plan §9, not yet done):** `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF*.md` (3) + `docs/binding-contract.md` + `docs/parity-contract.md` out of `docs/` root; root `KERN_*_AUDIT_REPORT.md` triplicates (retain as evidence, relocate with provenance).
- **`docs/plan/` vs `docs/planning/`:** both exist; `plan/README.md` tracker does not name the canonical file — cross-ref gap (P3).
- **Root clutter:** moderate (AGENTS/CODE_OF_CONDUCT/CONTRIBUTING/GOVERNANCE/SECURITY/SUPPORT/TODO + 3 KERN reports + CHANGELOG repo-level-only). No removal recommended before stabilization except the §9 moves.

---

## 12. Dead-code and unnecessary-file candidates

| # | Path | Verdict | Evidence | Action / risk |
|---|---|---|---|---|
| DC-01 | `packages/kern-contracts/src/provider.ts` (`PROVIDER_ID="m3"`) | Superseded, 0 producers | A1 replaced by `designSystem`; plan says P3 delete | **Remove at P3** (mapped then deleted). Risk: none today |
| DC-02 | `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF*.md`, `docs/binding-contract.md`, `docs/parity-contract.md` | Obsolete/draft in live root | Plan §9 move order | **Move** out of `docs/`, never delete. Risk: low |
| DC-03 | `libs/kern-primitives` 7 orphaned exports (`createFocusTrapModel`, `createPressModel`, `resolveFloatingOrigin`, `clampRectToViewport`, `nextPresenceState`, `composeEventHandlers`, `createCollectionModel/useCollection`) | Unadopted per §0.4 | `adoption.json` + `check:consumption` gating | **Per-symbol prune-or-adopt at P4**, never bulk-delete. Risk: medium if rushed |
| DC-04 | `packages/kern/src/components/loader.tsx` vs `loading-indicator.tsx`; `loading-button.tsx`; `circular-progress` indeterminate path | Duplicates per §4.1 identity map | Behavior-verified map | **Fold with codemod + a11y suites** (§4.1). Risk: medium |
| DC-05 | `docs/design-systems/m3-archive/` | Large vendored reference corpus | M3-usable verification source | **Retain**; check pack excludes if size bites. Risk: low |
| DC-06 | `demo` preset | Sole tenant-switch proof | `template:true`, MCP discovery exclusion planned | **Retain**. Risk of deletion: high (loses proof) |
| DC-07 | Root `KERN_*_AUDIT_REPORT.md` ×3 | Historical evidence duplicates | Superseded by this audit + plan log | **Relocate with provenance**, never delete. Risk: low |
| DC-08 | `.worktrees/p1-g5` | Separate worktree mirror | Excluded from audit searches | **Retain, ignore**. Risk: none |

No dead-code deletion is authorized in stabilization except DC-01 at its scheduled P3 slot; DC-03/DC-04 are post-stabilization folds.

---

## 13. Full findings register with evidence and severity

Severity: Critical/High/Medium/Low/Informational. Confidence: Confirmed / Strongly suspected / Needs verification.

| ID | Sev / Conf | Category / Workstream | Location | Observed vs Expected | Impact | Remediation (minimal) + Validation |
|---|---|---|---|---|---|---|
| AUD-001 | **High** / Confirmed | Gates / A4-1 | `scripts/check-kern.mjs:789-799`; violators `packages/kern/src/components/{button.tsx:10,card.tsx:6,chip.tsx:8,input.tsx:100-149,switch.tsx:54}` | Shape-law scan regex matches new `rounded-[var(--comp-*,var(--sys-*))]` but no allow-branch accepts it → 8 violations, exit 1 (reproduced first-hand). Expected: intended syntax passes | CI red; blocks every stabilization commit | Allow `rounded(-t)?-\[var\(--comp-[a-z0-9-]+,var\(--sys-shape-corner-[a-z-]+\)\)\]` alongside existing branches. Validate: `bun run check:kern` exit 0 + negative control (off-scale radius still fails). Blocks stabilization: **yes**. New (A4-induced scanner lag) |
| AUD-002 | Medium / Confirmed | Tokens-themes / A4-2 | `packages/kern-tokens/src/pipeline.ts:89-105,127-207,287-309`; `packages/kern/src/web-theme.ts:44-83`; `packages/kern-tokens/scripts/gen-preset-css.mjs:36-37`; `check-theme-matrix.mjs:72-223` | All ignore `comp`: `defineThemePreset({comp})` reaches native `scheme.comp` but has no web delivery (no `--comp-*` emission, no apply/clear, no scoped deltas, no matrix leg). Expected: decided contract | Theme-authored comp silently no-ops on web; manual `style.setProperty` is the only path | **Owner decision:** (a) document "web comp is manual-var only" or (b) project `--comp-<slot>: <length>` per resolved theme + apply/clear + scoped deltas + matrix coverage. Validate per choice. Blocks stabilization: only the decision; C-series: yes if theme-driven comp is in scope. New |
| AUD-003 | Low / Confirmed | Components / A4 | `packages/kern/src/components/button.tsx:194-199` vs `packages/kern-native/src/components/button.tsx:167-169` | Web toggle-morph-to-pill hardcodes `rounded-(--sys-shape-corner-full)`; native uses comp-aware `pillRadius`. Expected: same slot honored on both renderers | Web ignores comp on one pill path | Use the comp var with full fallback on the morph path. Validate: unit + e2e override on morph state. Stabilization: should-fix if cheap. New |
| AUD-004 | Medium / Confirmed | Contract / A4-2 | `packages/kern-tokens/src/resolve.ts:87-109` vs `:143-202` | `registerPreset` validates id/shape/policy but never `comp`; `defineThemePreset` does. Malformed comp via `registerPreset` stays silent until `cssLengthToDp` fallback. Expected: fail loud at registration | Silent malformed preset data | Validate `tables.comp` in `registerPreset` with the same key/value regexes. Validate: negative test via `registerPreset`. Stabilization: yes (small). New |
| AUD-005 | Low / Confirmed | Contract / A4-2 | `packages/kern-tokens/src/resolve.ts:274-278` | Merge is leaf-plus-ultimate-base; intermediate `extends` nodes' `comp` dropped (same as color/shape). Comment claims parity, untested. Expected: tested semantics | Future multi-level preset silently loses comp | Add chain test (3-level comp) or doc leaf-only semantics. Stabilization: should-fix (test-only). New |
| AUD-006 | Low / Confirmed | Tests / A4-1 | `e2e/comp-overrides.spec.ts` (untracked, 87 lines); `tokens.css:152` (`full:9999px`) | Spec untracked so CI never runs it (`testMatch` would pick it up once tracked); fallback probe `"999px"` is a substring of actual `9999px`. Expected: tracked + exact | Proof invisible; weak assertion | `git add` the spec; probe `9999px`; prefer polling assertion over fixed 400 ms. Validate: Playwright run. Stabilization: yes (add-only). New |
| AUD-007 | Low / Confirmed | Architecture / N8 | `packages/kern-native/src/theme.tsx:109-133` | `useKernScheme` falls back to static light while `useKernTheme` re-resolves OS mode — asymmetric, and the latter duplicates resolver logic inside the allowed importer. Expected: one documented fallback policy | Misuse risk outside provider | Document the asymmetry at the call sites or unify fallbacks. Validate: typecheck + provider tests. Stabilization: no; P3 polish. Pre-existing pattern, newly visible |
| AUD-008 | Low / Confirmed | Gates / N8+A4-2 | `packages/kern-native/src/theme-comp.test.tsx:22,80` | Oracle legitimately imports `resolveThemeDetails`, so a literal `src/`-wide zero-grep fails though `components/` is clean. Expected: gate matches intent | False red if gate is widened | Scope N8 gate to `src/components/` + allowlist the oracle file. Validate: gate script run. Stabilization: yes (config-only). New |
| AUD-009 | Low / Confirmed | Docs / N9 | `docs/architecture/0.1.0-preview-redesign.md:27` | Baseline table still reads `packages/kern-primitives` while §2.2/§13.4/log read `libs/`. Expected: one path (or explicit "pre-N9" marker) | Canonical-plan self-contradiction | One-cell fix or "(pre-N9)" annotation. Validate: grep. Stabilization: yes (trivial). New |
| AUD-010 | Medium / Confirmed | Release policy / N9 | `libs/kern-primitives/package.json` (no `private`, `publishConfig.public`) vs plan §1(7) internal-only; `docs/releases.md:12` Public=yes | Move complete but publication boundary unenforced and promised public. Expected: owner-resolved boundary | Accidental publication of internal kernel | **Owner decision** (§17): internal-only (`private:true` + releases row flip at release workstream) vs future-public. Do not decide in stabilization. Blocks C-series: no; blocks REL: yes. Pre-existing tension, newly sharp |
| AUD-011 | Medium / Confirmed | CLI / C1 | `packages/kern-cli/src/create.ts`, `create.test.ts` (untracked); `src/index.ts` (no `createApp` export); `README.md:3-9`; `package.json:3` description | C1 core done but untracked, binary-only, docs stale; `create --registry` untested; renderer/mode hardcoded. Expected: tracked + exported + documented | C1 cannot be called complete; AI/programmatic consumers lack `create` | Track files; export `createApp`/`CreateOptions`; update README + description; add `create --registry` case. Validate: CLI fixtures in clean dirs. Blocks stabilization: partially (track+export); blocks C-series: yes (C1-S builds on it). New |
| AUD-012 | Medium / Confirmed | CLI / N6 (pre-existing) | `packages/kern-cli/src/init.ts:160-165` writes `renderer`; `src/add.ts:84-110` reads `platform` | Renderer choice silently does not persist. Expected: `CliConfig {target,renderer,mode}` round-trip | Wrong-renderer installs | Fix in N6 (writer + reader + `platform` removal); registry `platform`→`renderer` stays P3. Validate: round-trip fixture. Blocks C-series: yes. Pre-existing |
| AUD-013 | Low / Confirmed | MCP/docs | `packages/mcp/README.md:26`; `packages/mcp/src/tools.ts:191` | README documents `get_tokens` values `kern/…/demo + m3 alias`; code is `base/material-3/sharp/brand/compact`, no alias, no demo. Comment says 1340 glyphs; 1342 shipped. Expected: docs match code | Agent tries removed ids/alias | Update README values; fix count comment. Validate: docs grep + MCP test. Stabilization: yes (trivial). New |
| AUD-014 | Medium / Confirmed | Contracts | `packages/kern-contracts/src/schema.json:7-189` vs `src/{block,icon,install}.ts` | `schema.json` covers only `provider`+`component`; block/icon/install validators have no JSON-schema counterparts. Expected: 4 record schemas per §0.4 | JSON consumers validate nothing for 3 kinds | Add the 4 missing record schemas or cut the unwired validators before 1.0 (plan's wire-or-cut). Validate: schema fixtures. Blocks C-series (A1/P3 metadata): yes. Pre-existing |
| AUD-015 | Medium / Confirmed | Docs | `docs/architecture.md:27,30,36,41-63,155-184` | Omits `material-3`/`contracts` (+`primitives` now fixed `:27`), stale `-theme` import, 5-file generated list vs 19/24, gates subset, "five typed packages". `check:layers` prose is correct — the doc is not. Expected: doc matches code | Authority drift; contributors follow wrong map | Update tables in the same change as next code touch. Validate: `check:docs` + grep. Stabilization: should-fix. Pre-existing, worsened by A3 |
| AUD-016 | Medium / Confirmed | Docs/release | `docs/releases.md:5-17` | "Seven packages publish" omits `@xoroh/kern-material-3` (root `check:publish` already covers 8). Expected: 8 rows + HOLD | Release run misses a package | Add M3 row, keep HOLD. Validate: `preflight-publish`. Stabilization: yes (trivial). New (A3-induced) |
| AUD-017 | Low / Confirmed | Hygiene | `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF*.md` ×3, `docs/binding-contract.md`, `docs/parity-contract.md`, root `KERN_*_AUDIT_REPORT.md` ×3, `docs/README.md` Plans, `docs/plan/` vs `planning/` | Obsolete papers/drafts in live roots; cross-refs omit canonical file. Expected: §9 moves + cross-refs | Navigation confusion; accidental reliance on drafts | **Move** (never delete) per §9; fix cross-refs. Validate: `check:stale-refs` + link check. P3 cleanup. Pre-existing |
| AUD-018 | Low / Confirmed | Tokens/docs | `packages/kern-material-3/src/themes/index.json` (compact/brand/demo descriptions "Extends kern"); `packages/kern-tokens/scripts/check-theme-matrix.mjs:8-14` comments | Descriptions/comments name the deleted `kern` id though enforcement requires `material-3`. Expected: prose matches ids | Cosmetic drift; future confusion | Reword 3 descriptions + 2 comment lines. Validate: grep zero `"Extends kern"`. Stabilization: yes (trivial). New |
| AUD-019 | Medium / Confirmed (plan-recorded; not re-run here) | Reliability/tooling | `scripts/check-generated-freshness.mjs:109-160` | `process.exit(1)` fires before restore; header claims temp copy but impl uses `cwd: ROOT`. Expected: restore-first + disposable copy | Running it on this checkout can leave partial writes | Apply recorded ~10-line restore-first fix only with owner auth + 5-step disposable-copy validation; **never run on dirty checkout until then**. Blocks stabilization verification: yes (procedure). Pre-existing |
| AUD-020 | Medium / Confirmed | Generated artifacts | `docs/architecture/inventory-freeze.json`, `per-file-decisions.json` (uncommitted deltas) | Deltas are expected A2/A3/N8 outputs but ungated. Expected: scratch regen + compare (counts/releaseSet/manifests stable; ids may change) | Premature commit bakes drift | Regen to scratch path, compare, then accept (N3-authorized exception). Validate: freeze compare. Stabilization: yes (sequencing). New |
| AUD-021 | Medium / Needs verification | Native/perf/devices | `packages/kern-native/src` (52 inline `style={{}}` vs 8 `StyleSheet.create`); §4.3 matrix | Inline-alloc cost unprofiled; no emulator/simulator/device run; iOS impossible on Linux host. Expected: measured + honestly marked | Perf regression risk; unsupported support claims | Profile low-end Android + screenshot matrix (both OS × light/dark) + SR passes; mark iOS unverified until macOS/device gate. Pre-existing |
| AUD-022 | Low / Confirmed | Site/UX | `apps/site/src/domains/playground/playground.tsx:743-746,868-871,1343-1359,1376-1416` | 440px fixed chrome collapses preview at 390px viewport; switcher controls hidden on small screens. Expected: honest capability claim | Phone-unusable workbench though e2e green | Desktop-first documented limitation for Preview; revisit layout in site workstream. Pre-existing |
| AUD-023 | Informational / Confirmed | Contracts/vocab | `packages/kern-contracts/src/provider.ts` (`PROVIDER_ID="m3"`) | Retained until P3 by plan; overlaps `designSystem: "material-3"`. Expected: P3 map-then-delete | Terminology split until P3 | Remove at P3, not before. Planned |
| AUD-024 | Informational / Confirmed | Registry/P3 | `packages/kern-cli/src/registry.json` row shape; `packages/mcp/src/*` | No `designSystem`/`preset` fields by design today (P3 addition). Expected: P3 schema work | None today | Implement at P3 with generator + MCP params + site. Planned |
| AUD-025 | Low / Strongly suspected | Deps/docs | `packages/kern/package.json:117-124`, `packages/kern-native/package.json:76-80` vs plan §2.2/§12.5 | Renderers lack declared `@xoroh/kern-contracts` (types-only) though plan lists it. Expected: doc or manifest aligned | Aspirational drift only | Decide at P3: add types-only dep or correct plan. Informational for stabilization. Pre-existing |
| AUD-026 | Low / Confirmed | Security hardening | `packages/kern-cli/src/add.ts:149`; `commitPlan:289-345` | `tar -xzf` + `mkdir+write` safe for trusted registry; no `out`-normalization guard for untrusted registries. Expected: defense in depth later | Only if threat model expands | Add `--no-same-owner`/symlink audit + `relative(dest,out)` guard if remote registries arrive. Retain for Preview. Pre-existing posture |
| AUD-027 | Informational / Confirmed | Scope statement | `packages/kern-tokens/src/comp-tokens.css` (234 slots) vs 5 wired | 229 slots deliberately reserved (scales, state colors, heights, typography). Expected: explicit allowlist statement | Scope misread as omission | Record A4 allowlist + reserved rationale in stabilization notes. Planned |
| AUD-028 | Informational / Confirmed | Contract edge | `resolve.ts:192-202` vs `:301-321` | `defineThemePreset` rejects `" 4px"` (no trim) while `cssLengthToDp` trims then falls back; `"0"` unitless rejected in both (consistent with `none:0px`). Expected: documented | None — sane as-is | Document; no change. New observation |

Counts: **High 1, Medium 10, Low 11, Informational 6** (28 findings). Confidence: **Confirmed 26, Strongly suspected 1, Needs verification 1**. No Critical.

---

## 14. Prioritized remediation backlog with dependencies

### P0 — Critical (immediate)

*None.* No secret leak, data-loss path, or release-integrity breach was found. If AUD-019's checker is run despite the warning, it could create partial writes — the control is "do not run", listed under P1.

### P1 — Stabilization blockers (must resolve before the committed baseline)

1. **AUD-001** scanner allow-list (~5 lines, no component change) → re-run `check:kern`. No dependency.
2. **AUD-006 + AUD-008 + AUD-011(track part):** `git add` the 4 untracked files (separate commits: A4-1 spec; C1 pair; A4-2 test). No dependency.
3. **AUD-020 + AUD-019:** scratch-regen freeze + compare (counts/releaseSet/manifests stable) via validated disposable copy; never commit current freeze as "fresh". Depends on owner auth for the copy procedure.
4. **AUD-004** `registerPreset` comp validation + **AUD-005** chain test (test-only additions). Depends on AUD-001 green to see the gate clearly.
5. **AUD-013/016/018/009** trivial doc/prose fixes (README values, releases row, "Extends kern", plan cell). Bundle as one docs commit after code gates green.
6. **AUD-002 decision:** record (a) manual-var-only vs (b) projection. Implementation of (b) is **not** stabilization — only the decision + doc sentence.

Order: 1 → 2 → 4 → 5 → 3 (freeze last, so it fingerprints the fixed tree) → 6 (decision recorded alongside).

### P2 — Required before C-series/F1

- AUD-011 (export + README + `create --registry` test), AUD-012 (`kern.json` N6 fix), AUD-014 (`schema.json` 4 records or wire-or-cut), AUD-024 (registry `designSystem`/`preset` + `platform`→`renderer` P3), AUD-010 decision (primitives publication boundary), AUD-003 (morph-path comp), F1 transport/scope/retention decisions (§17).
- C1-S starter set approval must precede any advertised template; only `starters/web` (Vite+React candidate) + `apps/mobile` (Expo reference) exist as seed surfaces.

### P3 — Valuable cleanup

AUD-015 (`architecture.md` tables), AUD-017 (§9 moves + cross-refs), AUD-007 (fallback policy note), AUD-023 (P3 provider deletion), DC-03/DC-04 folds (post-stabilization, with codemods + suites), phone-workbench revisit (AUD-022), `tar`/`out` hardening (AUD-026, only if threat model expands).

### P4 — Deferred (explicit)

- AUD-021 device matrix completion beyond the honest-matrix minimum (needs macOS/device lab for iOS) + icons-bundle optimization pending measurement + second-provider implementation (explicitly not Preview) + dashboard/analytics-class F1 scope.
- Must-fix vs should-fix vs defer: §14 items marked "must fix before stabilization" are P1 only; AUD-003/AUD-015 are should-fix-if-safe; everything else follows its lane.

---

## 15. Work that is verified complete

- A4-1 5-slot web wiring + fallbacks + unit tests (first-hand file:line + gate leg analysis).
- A4-2 `comp` contract: validation, merge, DP conversion, provider propagation, backward compat (first-hand + 6+6+4 tests).
- N8: zero component-layer `resolveThemeDetails` (first-hand grep: 0 in `components/`, sole importer `theme.tsx`).
- N9: 39/39 staged move, identity/exports/deps preserved, both-area tooling, lockfile symlink churn only.
- C1 core: `create` command + delegation + refusal contract + 4 tests (implementation read; execution inherited from log).
- Icons 1342 + playground icon-name fixes (first-hand `icons:check` green).
- Layer/primitives/parity/registry-paths/ts-policy/theme-matrix/contrast/stale-refs gates (first-hand green).
- No-regression confirmations: no web↔native runtime edge, no primitives violation, no Axis coupling, no secrets, CI least-privilege.

---

## 16. Work that remains incomplete or unverified

- **Incomplete:** AUD-001 fix; tracking 4 files; AUD-004/005; AUD-011 export/docs; AUD-012 N6; AUD-014 schemas; AUD-024 P3 fields; AUD-002 decision (+ optional projection); AUD-015/016/017/018 doc updates; AUD-020 freeze accept; web `IconButton icon` typecheck error (plan-recorded pre-existing; no fix in current diff — still open); `upgrade` block path; MCP bundled-vs-checkout degradation docs; F1/C1-S/C2/C3; AXIS AX0+.
- **Unverified by this audit (inherited, must re-run at stabilization):** full unit suites (counts cited, not executed), `build` 9/9, `typecheck` all workspaces, e2e incl. new comp spec, `check:generated` post-fix, device/perf/SR matrix, packed-tarball installs, site/mobile builds.

---

## 17. Decisions required from the project owner

1. **AUD-002:** web `comp` delivery — (a) manual-var-only (document) or (b) theme projection (schedule work). Blocks C-series scope.
2. **AUD-010:** primitives publication — internal-only (`private:true` + releases flip, release workstream) vs future-public. Blocks REL, not stabilization.
3. **F1 (§14.7):** transport ((a) GitHub Issue Form fallback vs (b) validated Xoroh endpoint vs (c) self-hosted), Preview scope (CLI-only vs CLI+MCP), retention + pseudonym policy. Blocks F1.
4. **C1-S (§13.3/13.5):** preview starter set (Next.js / TanStack Start / Vite+React / React Router / Expo); monorepo tooling (Bun workspaces/Turbo baseline vs Nx/pnpm); `@xoroh/kern-cli` publication timing; `packages/mcp` → `packages/kern-mcp` rename; `kern info` in Preview or not. Blocks C-series.
5. **N6 (§11.6 #1):** `kern.json` gains `preset` pin vs runtime-only presets. Small; affects N6 only.
6. **Axis (§10.3–10.4):** charter/maintainers/API/release policy before AX1; `xoroh-axis` vs fallback name after npm/domain/trademark checks. Blocks REL join only.
7. **AUD-019/020 procedure:** authorize the disposable-copy freshness validation + freeze-accept run (separate from implementation auth).
8. **Playground route (§11.6 #3):** confirm "Playground" single name; no `/showcase`→`/blocks` without approval. Trivial but must be explicit.

No decision is invented here; each names its lane and blocker scope.

---

## 18. Recommended stabilization sequence

1. Preserve: re-capture `git status`, stash list, HEAD (already in §2); confirm no reset/clean/stash/push.
2. Land AUD-001 scanner fix → `check:kern` green. (Smallest possible diff; unblocks signal.)
3. Track the 4 untracked files in 3 commits (A4-1 spec / C1 pair / A4-2 test) + AUD-011 export + trivial docs (AUD-009/013/016/018).
4. Land AUD-004 + AUD-005 (contract validation + chain test, no behavior change to shipped presets).
5. Record AUD-002 + AUD-010 + §17 decisions in the plan log (no code beyond the above).
6. Full matrix from a **disposable copy first**: layers/primitives/parity/kern/theme-matrix/contrast/registry-paths/ts-policy/pack/dist/consumption + unit suites serially (quiet) + typechecks + build + `check:generated` only post-AUD-019-fix + Playwright (desktop) + packed-tarball install probe.
7. Scratch-regen freeze + compare (AUD-020); accept only if counts/releaseSet/manifests stable.
8. Commit sequencing: N9 staged move as its own commit → A4/N8/C1/icons/playground/spec hunks reviewed per-file → docs/freeze last. Never squash the rename with edits; never `checkout .` over pre-existing hunks (§11.A rollback rules).
9. Re-capture Git state (§21) and cut the stabilization commit(s). HOLD stays; no tag/publish/push without explicit release auth.

---

## 19. Readiness assessment for the stabilization-and-commit task

**Verdict: NOT READY.**

Blockers (all small, all scoped): AUD-001 red gate; 4 untracked proof files; AUD-004/005 contract gaps; AUD-020 freeze accept + AUD-019 procedure auth; §17 decisions #1 (comp delivery) and #7 (validation procedure) at least recorded. Conditions: sequential quiet re-run of the full matrix must be green (CLI/MCP flakiness dispositioned as environmental only after a clean serial pass), and the N9 rename must land isolated from content edits. The tree must not be called ready merely because 9/10 sampled gates pass — the one red gate is on the exact syntax the stabilization would commit.

---

## 20. Readiness assessment for the subsequent C-series + F1 task

**Verdict: NOT READY.**

Blockers: C1 surface gaps (AUD-011) + `kern.json` defect (AUD-012) + contracts `schema.json` gaps (AUD-014) + registry P3 identity fields (AUD-024) + starter-set/tooling/publication/`info`/rename decisions (§17 #4) + F1 transport/scope/retention (#3) + `preset`-pin choice (#5). Architecture itself is stable enough (layering, neutrality, Axis separation all hold), and F1's C1+A1-only dependency is correctly scoped — but starting C-series before the C1 contract is tracked/exported/documented and the N6 defect fixed would bake the persistence bug into every starter and template. Complete P1, then P2, then authorize C1-S.

---

## 21. Final Git-state verification and confirmation that no existing work was modified

- Pre-report `git status --short` line count: **156** (4 `??` + 113 `M` + 38 `R` + 1 `RM`). Post-report expectation: **157** (the same 156 + 1 new `??` line for this report under `docs/audits/`).
- Stashes untouched: `stash@{0}` (`wip-preserve`), `stash@{1}` (`e565c7f`) — never listed with intent to drop; no `stash` subcommand was run.
- No `add/reset/commit/checkout/clean/push/publish/tag/release` was executed by this audit. No generator, build, install, formatter, or codemod was run. The 10 executed gates are read-only (verified identical status output before/after).
- Post-write verification command for the stabilization agent: `git status --short | sort > /tmp/opencode/audit-after.txt` and diff against the §2 baseline; the only delta must be `?? docs/audits/kern-0.1.0-preview-full-audit-2026-10-15.md`.
- **Confirmation:** no fixes, no cleanup, no deletions, no dependency/lockfile/manifest changes, no publication-setting changes, and no interference with concurrent-agent work were performed. The single created file is this report.

---

*End of audit. Stabilization may proceed only through §18 after the P1 blockers (§14) and owner decisions (§17 #1, #7) close.*
