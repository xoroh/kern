# 0.1.0 Preview readiness audit — Kern

Date: 2026-10-16. Baseline: `main` at `3929ac81` (merge of PR #37, cutover —
Kern consumes `@xoroh/axis` via vendored tarball). CI green on HEAD
(CI + Release + Deploy workflows `success`, run `38915886057` family).
Zero open PRs. No pushes/merges/publishes beyond this track's own PRs.
Release hold intact: no publish, no version bumps, no tags
(all manifests still `0.0.0`).

Scope notes. The archived `0.1.0-preview-redesign.md` is superseded; the
authoritative plan is `docs/architecture/kern-axis-migration-and-roadmap.md`
(§references below are to that doc). Out of scope for this track by owner
direction: the `xoroh/axis` repo, `libs/kern-primitives` deletion (separate
deletion PR, other thread), and `vendor/axis/*` (frozen tarball).
`docs/design-systems/` is research-only with NO implementation
(founder directive, its README) — multi-design-system expansion is deferred,
so "each design system owns its own components" is audited at M3 scope.

## Requirement verdicts

### 1. Design-system / provider registry and capability layer — PARTIAL

Done (metadata layer):
- `packages/kern-contracts/src/component.ts` — `ComponentRecord` with
  `capabilities: Record<string, CapabilityState>` (`verified|unverified|
  unsupported`), `registryKey(renderer, name)`, validators + tests.
- `parity/contract.ts` — foundation-neutral observable semantics plus
  per-foundation `nativeContract` / `testedBy` on every row.
- Channels exist: MCP `ComponentEntry.platform`, CLI `renderer→platform`,
  `adoption.json` + `check:consumption` ledger pattern.

Missing (deferred by decision, not by neglect):
- No runtime provider/foundation registry: a second foundation cannot
  register today. D-FOUNDATION-CHOICE keeps the platform extensible through
  "documented contracts + registration" but no second implementation is
  built now. The registration contract itself is unwritten.
- Work item: write the foundation-registration contract doc (shapes only,
  no implementation) — PR-4 below.

### 2. Each design system owning its own components — DONE (M3 scope)

- `@xoroh/kern` (web, Base UI behavior + Tailwind v4) and
  `@xoroh/kern-native` (StyleSheet + tokens) are separate implementations;
  `check:layers` enforces the boundary and is green on HEAD.
- M3 implementations untouched in behavior by the cutover (import-only
  rewrites, 30 runtime `@xoroh/axis` imports across both packages).
- Multi-DS expansion deferred per founder directive — no violation.

### 3. M3 completeness, web + native — PARTIAL (core done, advanced gaps deferred)

Done:
- `docs/components.md`: **418 real rows, 0 stubs** (generated, reconciles
  with MCP manifest 419 platform rows).
- Web: 84 component files; native: 87 component files.
  `docs/platform-parity.md` Status: current.
- Kern leads in native sheets family; 92-row shared baseline + classified
  exceptions per roadmap §F.4 (invariants green on HEAD).

Known gaps (standing G/R codes from `docs/design-systems/matrix.md`,
unchanged — need a Preview-scope decision record, PR-5):
- Advanced data grid (basic table is W; advanced is rent), charts (rent),
  tree-advanced, scheduler/Gantt, RTE/file-manager/pivot/diagram (gaps),
  range pickers, breadcrumbs, form-validation lib (basic only).

### 4. Tokens — DONE

- Canonical `packages/kern-tokens/src/tokens.json` (palettes, spectrum,
  base roles, typography, shape, elevation, motion, states, spacing).
- DTCG 2025.10 interchange (`src/dtcg/*`, `dtcg.json` projection,
  round-trip fixtures green).
- Presets via `@xoroh/kern-material-3` themes catalog
  (material-3, sharp, compact, demo + matrix); generators emit CSS vars,
  comp-tokens, tones/motion CSS, Tailwind adapter.
- `check:contrast` (1656 checks), `check:theme-matrix` (30 cells) green.

### 5. Blocks — PARTIAL (infrastructure done, content thin)

Done: `apps/site/src/blocks/manifest.ts`, CLI `blocks.json` registry,
`kern add/upgrade/list/diff` block paths, MCP `list_blocks`/`get_block`,
site blocks pages.
Thin: **3 blocks shipped** (`settings-screen`, `auth-form`, `empty-search`);
matrix still codes blocks "planned". Needs a Preview content decision
(PR-5: commit to a Preview block list or record thin-as-Preview).

### 6. Package install AND shadcn-style source vendoring via CLI — DONE

- `packages/kern-cli/src/kern.ts`: `create`, `init`, `add`, `list`, `diff`,
  `upgrade` (+ `feedback`); Mode 1 vendored source / Mode 2 depended package.
- Receipt v2, dry-run upgrades, dual-namespace (component vs block)
  collision guard, `closure.ts` dependency resolution, `registry.json`
  (version + releaseSet + rows).
- `check:pack` + registry-paths + packed-outside-checkout proofs green.

### 7. AI-first metadata / MCP / CLI / dependency resolution / validation — DONE

- MCP `packages/mcp`: **12 tools** (`list_components`, `get_component`,
  `get_tokens`, `get_dtcg`, `list_themes`, `design_audit`, `list_icons`,
  `get_icon`, `list_blocks`, `get_block`, `install_plan`,
  `validate_install`); generated manifest; `zero-to-screen.test.ts` loop.
- Machine surfaces: `/llms.txt` (297 lines), 205 per-page `.md`
  (96 web + 101 mobile + 8 foundations), `/mcp/index.json`.
- Skills `kern`, `kern-agents`, `docs` current; validators in
  `kern-contracts` (+ `install.ts`, `feedback.ts`); `preflight:publish`
  (no `workspace:*` in shipped fields).

### 8. Docs site + playground — DONE

- `apps/site`: 205 `.md` pages, llms.txt + generator/check scripts,
  `/playground` route (hydration fix landed, e2e green on HEAD),
  `check:docs` family + `check:gallery` green.
- `apps/mobile` (Expo 57): gallery sections per native component; `bundle`
  (`expo export` + artifact asserts) green.
- E2E 26/26 locally; hosted CI green at HEAD.

### 9. CI / release flow — DONE (process), HOLD (authorization)

- CI green on HEAD; `cold-install` required check; SHA-pinned actions;
  `permissions: contents: read` default.
- Release workflow gated on `main` + `RELEASE_CHANGESSETS=true` (repo
  variables list is empty — unset) + `npm-publish` environment approval.
  TODO.md credential items still open — correctly open under the hold.

### 10. Changesets — PARTIAL

- 74 pending entries. `changeset status` still exits 1 with ONE remaining
  invalid-tree line: `@xoroh/kern-mcp` depends on skipped private
  `@xoroh/kern-cli` without being ignored. (The kern/kern-native→
  primitives lines are gone — cutover fixed those.)
- Fix (config-only, no versions): add `@xoroh/kern-mcp` to `ignore` in
  `.changeset/config.json` — or resolve the mcp→cli coupling per H-17.
  PR-3 below. Stale-identity entries (`kern-primitives-publish-metadata.md`,
  `primitives-*.md`, `repoint-*.md`) need per-file audit in the same PR;
  deletion of the primitives package itself stays with the other thread.

## Reconciliation of archived planning (owner-requested, 2026-10-16 evening)

Method: read-only pass over `docs/archive/2026-10-axis-transition/planning/*`
(MASTER_TODO, QUALITY_AND_RELEASE_GATES, NO_GO, XOROH_MIGRATION, AI_AND_MCP,
DISTRIBUTION_CLI_AND_REGISTRY, FOUNDATIONS_AND_DTCG,
COMPONENT_AND_FEATURE_INVENTORY, IMPLEMENTATION_PHASES,
RISKS_AND_OPEN_QUESTIONS, plus PROVIDERS, TARGET_ARCHITECTURE,
INDEPENDENT_COMPLETION_AUDIT, AUDIT_REMEDIATION_REPORT, CURRENT_STATE,
ARCHITECTURE_DECISIONS, 00–09 tracks), the `docs/planning/README.md` and
`docs/plan/README.md` stubs, and the open items in the live roadmap. The
archive is untouched history — nothing below edits it; the live roadmap
(`docs/architecture/kern-axis-migration-and-roadmap.md`) stays the single
source of truth, and its §F re-verification rule is what this section
executes for Preview scope. Every "done" below was re-evidenced on `main`
at `3929ac81` today, not trusted from old `[x]` marks.

### Done in the live tree (re-evidenced)

- Planning ledger KERN-001/004/006/007/016: dispositions already recorded in
  roadmap §F.1/F.2 (Phase-0 log, downscoped product scan, plan-creation
  sign-off, owner approval of the migration plan). No further action except
  the PR-2 link-check/ID-reconciliation tail of KERN-006.
- KERN-003 primitives slice: `docs/architecture/axis-extraction-inventory.md`
  (Phase 0.3). Remainder (non-primitives capability inventory) is still valid
  → folded into PR-4.
- KERN-012 mobile bundle: `apps/mobile` `bundle` script
  (`expo export --platform android --platform ios`) exists; CI bundle green.
- DTCG program (ex KERN-017–023, P2 exit): `packages/kern-tokens/src/dtcg/`
  (`export/import/validate/shared/retained`) + `dtcg.test.ts` +
  token-graph/preset/elevation tests + MCP `get_dtcg`. Largely done; the
  `check:dtcg` gate script and full-foundation goldens were never created →
  still valid, PR-6.
- `@xoroh/kern-contracts` (TARGET_ARCHITECTURE "not built"): exists, tested,
  wired into root `check:publish`/`typecheck`/`test` fan-outs. Two live gaps:
  `docs/releases.md` omits it ("Six packages publish" is stale — it is the
  seventh) and the CI `pkg` matrix has no contracts leg → PR-3.
- CSS entries (ex KERN-033/044): `@xoroh/kern/theme` + `@xoroh/kern/styles`
  shipped and documented. P4A dogfood: vendored Axis tarball + `check:pack`
  packed-outside-checkout proofs green.
- `kern.json` is written AND read (`init` writes, `add` reads
  renderer/platform — `add.ts:92,100-110`); the "written never read" defect
  is fixed. Renderer-first lookup fixed (platform selected before lookup,
  `add.ts:15-17`). SearchBar `/start` entrypoint fixed (registry rows +
  barrel routing + `manifest.test.ts`). Block `registryDependencies` closure
  installed (`blocks.ts`). Receipt v2 (`schemaVersion "2"`).
- Elevation audit: generated `docs/elevation-audit.md` shows GAP 0 —
  the 11-unregistered-levels FAIL is remediated.
- `account-balance` glyph: present in the material names registry
  (the XOROH_MIGRATION null-resolution gap is closed).
- AI_AND_MCP missing tools: all 12 MCP tools exist, including
  `list_icons`/`get_icon`, `list_blocks`/`get_block`, `install_plan`,
  `validate_install`.
- Advisory triage (NO_GO/KERN-078 ex "19 GHSA"): reconciled — 0 open alerts
  on kern (roadmap H-12); the archived figure is historical. Remaining:
  code-scanning decision + device runs → owner-gated.
- 00-index D19 naming ("Primitives" vs "RN"): superseded by the Axis
  decision (`@xoroh/axis`). DISTRIBUTION "publishable CLI, six→eight":
  superseded by the H-17 privacy ruling (CLI stays `private: true`).
  01–09 tracks: all boxes landed, no open items.
- KERN-007/016 approvals: superseded by owner approval of the migration
  plan (roadmap §F.2).

### Still valid → folded into the PR plan

- Proposed gates never created as scripts: `check:dtcg`,
  `check:contracts`, `check:tokens-schema`, `test:icons:render`,
  `test:consumers`, `check:licenses`/SBOM → PR-6 (adopt or explicitly defer
  with owner sign; never silently dropped).
- `designAudit()` still returns a static category checklist
  (`packages/mcp/src/tools.ts:447`) — the measured-evidence critique stands
  → PR-6. MCP packed-stdio/offline + spawned-protocol tests → verify in PR-6.
- CLI packed-bin spawned tests + full consumer matrix + advertised native
  block sources → verify in PR-6.
- Icons F-04: no native-renderer test executes `Icon.native.tsx`
  (`Icon.test.tsx` explicitly punts to kern-native suites + `icons:check`)
  → PR-6.
- `scopedDeltas` nested preset+contrast + F.3 theming-audit stages →
  theming backlog, PR-6 tail. H-18 check-props drift (474 vs 471):
  content lane, tracked.
- KERN-063 community polish → Phase 6 tail (noted, not scheduled).
- Site decisions D18 (deploy paths), D20 (5-tab IA confirm), redirect-alias
  stubs, KERN-011 (default-vs-Xoroh preset), KERN-030 (icon license wording),
  KERN-042 (peers-vs-deps), CSS/icon budgets, ADR-P05/004/P18/P20 →
  verify-cheap in PR-2, escalate leftovers to the PR-5 owner decision list.
- CSS consumer fixture (packed styles under Vite/SSR) → verify-or-defer,
  PR-6.

### Owner-gated (publish, HOLD lift, product canaries)

- KERN-083 NO-GO unsigned, KERN-084 publication authorization, TODO.md
  credentials (`NPM_TOKEN`, `RELEASE_CHANGESSETS`), HOLD lift — all pending
  explicit owner action. No PR in this track touches them.
- KERN-064–075 (P7) and every XOROH_MIGRATION item (callsite classification,
  parent TS/RN/Metro resolution, style match, scenario passes, canaries
  070/071, rollouts 072/073, rollback rehearsal 075): excluded, require
  separate written authorization. This track neither implements nor depends
  on them.
- KERN-029/059 device/screen-reader runs: interim bar per D-DEVICE (RNTL +
  Expo-host export, honestly labeled); physical runs pending an
  owner-approved matrix-or-waiver.

### Tracked in the axis thread (not this track)

- Roadmap §G package-readiness checklist, Axis CI extension, Axis docs-site
  stages, Axis release prep (D-NAME checks), Axis coverage batches, the DTCG
  native-value input contract on the Axis side, and the Axis adoption ledger
  for `collection`/`mergeRefs`. Named here only so the split is auditable.

### Tokens in DTCG format styling Axis parts (Axis stays token-free)

- Kern tokens are authored once (`packages/kern-tokens/src/tokens.json`,
  canonical) and projected as DTCG 2025.10 (`src/dtcg/*`, `dtcg.json`,
  `get_dtcg`, `defineMotionAlgorithm`/preset data in `presets.ts`).
- The styling split is observable in every cut-over consumer (30 runtime
  `@xoroh/axis` importers), e.g. `packages/kern-native/src/components/
  switch.tsx`: behavior (`useControllableState`) comes from `@xoroh/axis`;
  every visual value (colors, shape, comp tokens) comes from
  `@xoroh/kern-tokens` (`ResolvedTheme` scheme). No Axis part resolves its
  own theme; theming stays consumer-side in Kern renderers.
- Axis itself is token-free: the shipped `dist/index.js` wired into this
  tree contains zero `--*` CSS-variable strings (scanned the installed copy
  read-only; the tarball itself untouched), and the retargeted
  `check-primitives` boundary gate enforces the split in CI.
- Carry: per-context resolved-DTCG consumer docs → scoped into PR-4.

## Quality findings (owner mandate — active sweep, 2026-10-16 evening)

Standard: green CI on the current tree is the floor, not the verdict. Each
item below was verified on `main` at `3929ac81` today. Fixes ride in the
small PRs listed; anything needing an architecture or product-direction call
is flagged instead of assumed.

- **QF-1 — Live docs point at an archive stub for the "system law" and the
  build tracker (P1, fix in PR-2).** `docs/README.md` ("Plans" + reading-order
  step 5), `docs/platform-parity.md:20`, and `docs/architecture.md:190` cite
  `plan/README.md` for the naming/system law and "what is being built next" —
  but `docs/plan/README.md` is now an archive stub holding none of that. The
  law text itself survives in `docs/conventions/parity.md` (and
  `parity-contract.md`), so nothing is lost; the pointers are wrong. Why it
  is wrong: a newcomer following the documented reading order lands on a stub
  and concludes the law/tracker do not exist. Fix: repoint the three live
  references at `docs/conventions/parity.md` (law) and the live roadmap
  (tracker/next), and update the `docs/README.md` Plans section to name the
  roadmap as the plan. `check:stale-refs` stays green today because it checks
  file existence, not content — note as a check-coverage gap, do not weaken
  the check.
- **QF-2 — `docs/conventions/primitives.md` is a stale pre-cutover spec
  still linked as convention (P1, fix in PR-2).** Dated 2026-10-02, it
  describes the extraction as running ("~40%", "the asymmetry this spec has
  to fix") and feeds a P2c-3 extraction step that has since executed (cutover
  merged PR #37, kernel frozen). `docs/README.md` reading order step 3a sends
  every newcomer to it. Why wrong: it teaches the old two-layer world as
  current. Fix: rewrite it as the post-cutover Axis-boundary convention
  (what the frozen `libs/` means, what `@xoroh/axis` owns, where the gates
  live) or archive it with the other superseded planning and repoint the
  reading order. Docs-only either way.
- **QF-3 — `@xoroh/kern-native` ships a duplicate `./native` subpath (P2,
  fix in PR-3).** `./native` resolves to the identical `dist` files as `.`
  (same types, same ESM/CJS) with zero consumers anywhere in the repo
  (verified by grep over src/apps/e2e/parity/scripts/docs). Why wrong: two
  names for one entry doubles the API surface reviewers, agents, and
  `attw`/`publint` must reason about, and invites divergent imports. Fix:
  remove the `./native` condition with a changeset (pre-1.0, no real-world
  consumers to break) and re-run `check:publish`.
- **QF-4 — `packages/mcp/` directory does not match its package name
  `@xoroh/kern-mcp` (P3, fix in PR-8 or document the exception).** Every
  other package dir matches its manifest name. 67 files reference the
  `packages/mcp` path, so a `git mv` rename is high-churn for low value;
  schedule it as its own mechanical PR (rename + reference sweep +
  full CI), and if the sweep proves disproportionate, record the exception
  in one line under `docs/conventions/` instead. No behavior change either
  way.
- **QF-5 — CI `pkg` matrix omits `@xoroh/kern-contracts` (P1, fix in
  PR-3).** Root `check:publish`/`typecheck`/`test` fan-outs all include
  contracts, but `.github/workflows/ci.yml` matrix legs cover only six
  dirs + `libs/` — contracts gets no isolated build/test/typecheck/publish
  leg. Why wrong: the per-package isolation the matrix exists to prove has a
  hole exactly on the package the CLI/MCP depend on for schemas. Fix: add
  the `packages/kern-contracts` leg. Same PR updates `docs/releases.md`,
  which still says "Six packages publish" and omits contracts entirely.
- **QF-6 — `designAudit()` is the static checklist the archive warned
  about (P2, fix in PR-6).** `packages/mcp/src/tools.ts:447` returns twelve
  category strings; it cites no measurements (contrast values, token
  provenance, export identities). The archived AI_AND_MCP critique
  ("replace/augment with measured-evidence distinction") still stands.
  Fix: bind each category to an existing measured source or mark the tool
  advisory-only in its description. No new measurement infrastructure
  without owner sign.
- **QF-7 — Parity surface drift is unmeasured since the cutover (P2,
  verify in PR-6).** Filename intersection today: 84 web / 87 native files,
  66 same-named. `check:parity` is green and the parity doc is Status:
  current, so classification exists — but no turn since PR #37 has
  re-asserted that every web-only/native-only file maps to a classified
  exception. Fix: one verification pass (file → parity-row mapping), not a
  code change; file the result, burn down real gaps only with owner-visible
  changesets.
- **Explicitly not findings:** `.team/` watchdog droppings (gitignored
  scratch, per its README); `vendor/axis/*.tgz` committed tarball
  (sanctioned owner-directed mechanism, roadmap Phase 4); TODO.md credential
  items (correctly open under the release hold); skill peer-range wording
  ("0.86–0.88" vs `>=0.86 <0.89` — consistent, `<0.89` caps at 0.88.x).

## Ordered work plan (small PRs)

- [x] **PR-1 (this report):** land `.reports/preview-readiness.md`, refresh
  `.reports/latest.md`. Docs-only, zero risk.
- [ ] **PR-2: roadmap freshness + QF-1/QF-2 docs repair.** `kern-axis-migration-and-roadmap.md`
  §§B/H/J still pin `f0774ae7`, PRs #18–20 open, red-CI forensics as current.
  Update to `3929ac81` / CI-green / PR states (#18 closed, #19/#20/#23–37
  merged, zero open), record H-01/H-02/H-03 hosted-green; repoint the three
  live `plan/README.md` references (QF-1) and rewrite-or-archive
  `docs/conventions/primitives.md` (QF-2). No architecture change; keeps §F
  re-verification honest.
- [ ] **PR-3: changeset + release-hygiene.** Fix the mcp→cli invalid-tree line
  (config `ignore`, with H-17 note) + audit stale primitives-identity
  entries (remove superseded, rewrite the rest to the Axis identity) +
  `docs/releases.md` seventh-package row for `@xoroh/kern-contracts` +
  CI `pkg`-matrix leg for `packages/kern-contracts` (QF-5) + remove the
  duplicate `./native` export from `@xoroh/kern-native` with a changeset
  (QF-3, zero consumers verified).
  Must NOT touch versions, publish config, or `libs/`. Verify with
  `bun x changeset status` exit 0.
- [ ] **PR-4: foundation-registration contract (shapes only).** Document the
  registration surface a future second foundation would implement
  (contracts + registry + gates), no implementation, no Axis changes.
  Inputs: the KERN-003 non-primitives capability-inventory remainder and
  the per-context resolved-DTCG consumer docs. STOP + report if this
  drifts toward a product-direction decision.
- [ ] **PR-5: Preview scope decisions record.** Owner-visible record: M3
  advanced-part gaps (grid/charts/tree/scheduler/RTE) deferred post-Preview
  with rent/build/never positions; Preview block list committed (3 shipped
  + named additions, or thin-as-Preview); owner decision list carried from
  the archive (KERN-011 preset approval, KERN-030 icon wording, KERN-042
  peers-vs-deps, CSS/icon budgets, ADR-P05/004/P18/P20, D18/D20/site stubs
  leftovers from PR-2). STOP + report for any
  build/ship commitment — product direction, needs owner sign.
- [ ] **PR-6: adopt-or-defer gate backlog.** For each never-created proposed
  gate (`check:dtcg`, `check:contracts`, `check:tokens-schema`,
  `test:icons:render`, `test:consumers`, `check:licenses`/SBOM), the
  `designAudit` measured-evidence critique (QF-6), MCP packed-stdio/offline tests,
  CLI packed-bin + consumer-matrix parts, icons F-04, `scopedDeltas`
  nesting + F.3 theming stages, CSS consumer fixture, parity surface
  re-assertion (QF-7): either land the
  check/test or record an explicit owner-signed deferral. Never silently
  dropped, never weakened to pass.
- [ ] **PR-8: `packages/mcp` → `packages/kern-mcp` rename (QF-4) or
  documented exception.** Mechanical `git mv` + 67-file reference sweep +
  full CI; fall back to a one-line convention note if the sweep proves
  disproportionate. No behavior change either way.
- [ ] **PR-7 (deferred, other thread):** `libs/kern-primitives` deletion +
  stale-link cleanup (`packages/*/node_modules/@xoroh/kern-primitives`
  link, `apps/site/src/generated/changelog.ts` + `scripts/check-layers.mjs`
  legacy-name refs). NOT this track — tracked here only so nothing is lost.

Standing rules for every PR: keep trees clean and pushed, update the roadmap
reference + `.reports/latest.md` each turn, merge routine PRs only when CI
is green, never delete unmerged work, no publish/version bumps/tags.
