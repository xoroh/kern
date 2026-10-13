# Master TODO

Status: execution backlog; no implementation authorized by this file. **84 stable tasks**, all Not started. Planning inspection is not completion of refreshed/implemented execution deliverables. Never renumber ids; append future work and record replaced/superseded dependencies. Owners below are responsible **roles**, not concurrently assigned sessions.

Priority: P0 critical consumer/safety/foundation/release blocker; P1 required Preview quality; P2 optional polish. Phase uses the same labels independently. Status syntax: `[ ]` Not started, `[~]` In progress (text marker), `[x]` Completed and verified, `[!]` Blocked, `[?]` Needs investigation. Completion requires command/artifact/evidence linked under the task, not an agent assertion.

| Phase | Tasks | Priority P0 | Priority P1 | Priority P2 |
|---|---:|---:|---:|---:|
| P0 | 6 | 4 | 2 | 0 |
| P1 | 10 | 5 | 5 | 0 |
| P2 | 7 | 6 | 1 | 0 |
| P3 | 9 | 6 | 3 | 0 |
| P4 | 15 | 14 | 1 | 0 |
| P5 | 9 | 4 | 5 | 0 |
| P6 | 7 | 0 | 6 | 1 |
| P7 | 12 | 12 | 0 | 0 |
| P8 | 9 | 7 | 2 | 0 |
| **Total** | **84** | **58** | **25** | **1** |

## Verification shorthand (actual commands, not pass claims)

- **V-TOK:** `bun run --filter @xoroh/kern-tokens test`, `bun run check:contrast`, `bun run check:theme-matrix`.
- **V-WEB:** `bun run --filter @xoroh/kern test`, `bun run --filter @xoroh/kern typecheck`.
- **V-NATIVE:** `bun run test:native`, `bun run test:native:jest`, `bun run --filter @xoroh/kern-native typecheck`.
- **V-BOUNDARY:** `bun run check:layers`, `bun run check:primitives`, `bun run check:consumption`, `bun run check:parity`.
- **V-CLI:** `bun run --filter @xoroh/kern-cli test`, `bun run --filter @xoroh/kern-cli typecheck`.
- **V-MCP:** `bun run --filter @xoroh/kern-mcp test`, `bun run --filter @xoroh/kern-mcp typecheck`.
- **V-PACK:** authorized/disposable `bun run build:locked`, then `bun run check:dist`, `bun run check:dist:types`, `bun run check:pack`, `bun run check:publish`, `bun run preflight:publish`.
- **V-DOCS:** owned/disposable `bun run --cwd apps/site check:docs`, `check:gallery`, `check:snippets`, `typecheck`, `build`; `bun run --cwd apps/mobile typecheck`.
- **V-NEW:** tests/scripts described under task must be **created, wired and executed**; a proposed script name is never accepted as a current command. Gate details/failure criteria in QUALITY_AND_RELEASE_GATES.

## P0 — Baseline intake

- [x] **KERN-001 — Preserve/assign working-tree ownership.** Priority P0; phase P0; status Verified 2026-10-13; owner coordinator.
  - Dependencies: none. Files: read-only Git/root/parent state; planning ownership log.
  - Deliverable: HEAD/dirty file hashes and bounded owner map. Acceptance: every intended writable path has one approved owner; no unrelated diff lost.
  - Verification: `git status --short --branch`, `git diff --stat`, scope/hash comparison before/after; record concurrent site ownership.
- [x] **KERN-002 — Refresh audit discrepancy ledger.** Priority P1; phase P0; status Verified 2026-10-13; owner architecture.
  - Dependencies: KERN-001. Files: two handoffs, CURRENT_STATE/decision evidence.
  - Deliverable: reconcile historical versus current source claims. Acceptance: truncated audit sections not treated as fact; no deferral of required DTCG/native or second-provider scope creep.
  - Verification: cited paths/symbols/commands inspected; each defect labeled WT/HEAD/history/static/reproduced.
- [x] **KERN-003 — Freeze complete public capability inventory.** Priority P0; phase P0; status Verified 2026-10-13; owner component/platform.
  - Dependencies: KERN-001. Files: renderer barrels/manifests/source/tests/content, COMPONENT_AND_FEATURE_INVENTORY.
  - Deliverable: exact export/type/helper/axis/state/test/doc fixture matrix. Acceptance: all 417 baseline UI rows and every non-UI public export covered; unknowns explicit, no approximate counts.
  - Verification: read-only AST export/props scan, generated inventory reconciliation, count/path/entrypoint identity assertions added to execution fixtures.
- [x] **KERN-004 — Freeze bound Xoroh usages.** Priority P0; phase P0; status Verified 2026-10-13; owner migration.
  - Dependencies: KERN-001. Files: parent tsconfig/manifests/static/dynamic/CSS imports and callsites.
  - Deliverable: binding-aware symbol/icon/token/behavior manifest and consumer groups. Acceptance: include static scan's 683/455/138 file sets, dynamic/data inputs/style aliases and tests, no private data published.
  - Verification: AST binding scan plus targeted dynamic/CSS/legacy globals searches; source path samples and counts reproducible.
- [x] **KERN-005 — Capture reproducible command baseline.** Priority P0; phase P0; status Verified 2026-10-13; owner quality.
  - Dependencies: KERN-001, KERN-002. Files: CURRENT_STATE/gate evidence.
  - Deliverable: command/cwd/exit/time/env/bytes ledger. Acceptance: red findings distinguished from pre-existing/concurrent changes; no generated-file race.
  - Verification: safe checks in CURRENT_STATE; CLI/MCP/tokens targeted tests; broader suites only with approved ownership/disposable snapshot.
- [x] **KERN-006 — Validate planning graph and handoff.** Priority P1; phase P0; status Verified 2026-10-13; owner coordinator.
  - Dependencies: KERN-002, KERN-003, KERN-004, KERN-005. Files: docs/planning only.
  - Deliverable: coherent resumed execution plan. Acceptance: 15 docs/links/84 ids/dependencies/priorities reconcile; no cycles, no implementation implied.
  - Verification: Markdown links/files, task count/phase/priority DAG validator and scope diff; owner accepts next bounded work.

## P1 — Approved architecture and initial gate fixes

- [x] **KERN-007 — Obtain implementation/architecture approval.** Priority P0; phase P1; status Verified 2026-10-13; owner architecture/owner.
  - Dependencies: KERN-006. Files: decision register/approval log and existing ADR routing.
  - Deliverable: approvals for package/contracts/CLI/CSS/DTCG/native scope and parent edit windows. Acceptance: explicit approval, publication HOLD still intact.
  - Verification: owner response linked; new package/source work cannot start on assumed authorization.
- [x] **KERN-008 — Correct composition manifest test ownership.** Priority P0; phase P1; status Verified 2026-10-13; owner metadata/quality.
  - Dependencies: KERN-007. Files: `packages/mcp/src/manifest.test.ts`, generator entrypoint model.
  - Deliverable: SearchBar checked against `/start`, not component-only barrel. Acceptance: no exclusion of real compositions or false public import metadata.
  - Verification: V-MCP plus fixture removing a `/start` export must fail; entrypoint/schema additions completed in KERN-049.
- [x] **KERN-009 — Correct binding coverage classification.** Priority P1; phase P1; status Verified 2026-10-13; owner behavior/quality.
  - Dependencies: KERN-007. Files: `scripts/check-coverage.mjs`, renderer presentation binding tests.
  - Deliverable: reasoned exemption for nonpublic bindings with real behavior coverage. Acceptance: no unwanted barrel export/no wholesale presentation-layer exclusion.
  - Verification: `bun run check:coverage`, V-WEB/V-NATIVE binding scenarios; missing true component negative fixture fails.
- [x] **KERN-010 — Remove prose/import-gate false positives.** Priority P1; phase P1; status Verified 2026-10-13; owner quality.
  - Dependencies: KERN-007. Files: `scripts/check-kern.mjs` and new script fixtures; site prose owned separately.
  - Deliverable: parser-based import/preset detection. Acceptance: studio prose allowed, actual forbidden preset import still rejected; true elevation/shape findings remain assigned.
  - Verification: new gate unit positives/negatives, `bun run check:kern` result reconciled with KERN-026.
- [x] **KERN-011 — Rule default versus Xoroh theme values.** Priority P0; phase P1; status Verified 2026-10-13; owner design/owner.
  - Dependencies: KERN-003, KERN-004, KERN-007. Files: token theme/test/skill references and compatibility spec.
  - Deliverable: approved default value tables + Xoroh preset policy. Acceptance: blue/muted secondary disagreement resolved with visual evidence, no silent branding change.
  - Verification: V-TOK expectation updated only to approved snapshot; light/dark/contrast screenshots/source comparison signed off.
- [x] **KERN-012 — Repair actual mobile CI bundle command.** Priority P0; phase P1; status Verified 2026-10-13; owner native/CI.
  - Dependencies: KERN-007. Files: `apps/mobile/package.json`, `.github/workflows/ci.yml`.
  - Deliverable: real Metro/Expo export script and CI invocation. Acceptance: command exists, bundles native assets and uses safe output location.
  - Verification: new `bundle` implementation executed in disposable host; mobile typecheck/CI workflow checks exit0, output inspected.
- [x] **KERN-013 — Finalize pure contracts schema/API.** Priority P1; phase P1; status Verified 2026-10-13; owner architecture/metadata.
  - Dependencies: KERN-003, KERN-007. Files: ADR/spec/new contracts design.
  - Deliverable: provider/component/block/icon/dependency/evidence schema and parity typing plan. Acceptance: present consumers documented, no React/test-runner/upward dependency.
  - Verification: minimal renderer/CLI/MCP schema prototype fixtures and negative metadata cases; compare dependency graph.
- [x] **KERN-014 — Finalize graph/DTCG/theme interchange spec.** Priority P1; phase P1; status Verified 2026-10-13; owner foundations.
  - Dependencies: KERN-007, KERN-011. Files: foundations spec and schema ADR.
  - Deliverable: every token group/type/reference/unit/context/loss mapping. Acceptance: canonical authoring chosen, bidirectional DTCG Phase2, unsupported extension behavior explicit.
  - Verification: standards-valid color/dimension/type/shadow/duration fixture review, complete foundation mapping coverage.
- [x] **KERN-015 — Finalize delivery/receipt/icon contracts.** Priority P1; phase P1; status Verified 2026-10-13; owner distribution/icons.
  - Dependencies: KERN-007, KERN-013. Files: distribution/icon/peer/registry/receipt design.
  - Deliverable: ordinary CSS, source hybrid/snapshot, native assets, releaseSet, transaction/config schema. Acceptance: no hidden zero-dependency or checkout promise; one Material family.
  - Verification: API/peer/import/asset flow review against add/closure/source config and target consumer matrix.
- [x] **KERN-016 — Approve early product migration/rollback design.** Priority P0; phase P1; status Verified 2026-10-13; owner migration/owner.
  - Dependencies: KERN-004, KERN-007, KERN-011, KERN-015. Files: Xoroh migration scenarios/artifact adapter plan.
  - Deliverable: canary apps, product used slice, rollback pins/owners and legal/public source boundaries. Acceptance: P7A starts on foundation readiness, not after public release; domain helpers stay app-owned.
  - Verification: explicit product windows/acceptance scenarios and rollback review; no parent changes yet.

## P2 — Foundations

- [x] **KERN-017 — Snapshot all approved foundation outputs.** Priority P0; phase P2; status Verified 2026-10-13; owner foundations/quality.
  - Dependencies: KERN-011, KERN-014. Files: token/native/CSS golden fixtures.
  - Deliverable: palettes/type/shape/elevation/motion/state/spacing and 30 contexts/TS API goldens. Acceptance: complete baseline includes aliases/extensions, not color-only.
  - Verification: V-TOK plus new deterministic output/consumer fixture tests with approved artifact hashes.
- [x] **KERN-018 — Implement versioned token graph/schema/references.** Priority P0; phase P2; status Verified 2026-10-13; owner foundations.
  - Dependencies: KERN-017, KERN-013. Files: new token schema/graph/resolver modules and source metadata.
  - Deliverable: typed normalized graph, safe alias/type/unit validation. Acceptance: missing/cyclic/invalid/collision refs fail with path; old resolver outputs preserved; DTCG group type inheritance/root/extends/local RFC6901 pointers supported.
  - Verification: V-TOK and new cycle/missing/unit/color/prototype/depth, group merge/type/root/pointer escaping/property/array fixtures; KERN-017 goldens match.
- [x] **KERN-019 — Implement full DTCG export.** Priority P0; phase P2; status Verified 2026-10-13; owner foundations.
  - Dependencies: KERN-018. Files: token DTCG exporter/generator/artifacts/tests.
  - Deliverable: valid 2025.10 documents with aliases/context/extension provenance. Acceptance: every foundation represented; no invented standard type/modes.
  - Verification: standards schema/fixture validation, deterministic export and all-group mapping tests; V-TOK.
- [x] **KERN-020 — Implement safe DTCG import/roundtrip.** Priority P0; phase P2; status Verified 2026-10-13; owner foundations.
  - Dependencies: KERN-018, KERN-019. Files: importer/diagnostics/external fixture tests.
  - Deliverable: semantic roundtrip into canonical graph, typed loss/unsupported errors. Acceptance: alias/value/extension preservation and bounded untrusted input; valid standard composites preserved even without renderer projection; no silent drop.
  - Verification: new external-valid/malformed/all-standard-composite/chained-reference/group/required-local-pointer/unsupported fixtures and graph→DTCG→graph goldens; V-TOK.
- [x] **KERN-021 — Remove hidden foundation value duplication.** Priority P1; phase P2; status Verified 2026-10-13; owner foundations.
  - Dependencies: KERN-018. Files: token JSON/theme refs, `gen-css.mjs` dark elevation constants.
  - Deliverable: canonical shadow/reference ownership. Acceptance: existing approved renderer values unchanged, deliberate one-offs documented, sparse ramps retained.
  - Verification: V-TOK + full CSS/native snapshot comparison and source duplication scan.
- [x] **KERN-022 — Project stable TS/CSS/native artifacts from graph.** Priority P0; phase P2; status Verified 2026-10-13; owner foundations/distribution.
  - Dependencies: KERN-019, KERN-020, KERN-021. Files: token exports/generators/CSS/JSON/projection tests.
  - Deliverable: ordinary theme CSS + explicit adapters and typed schemes. Acceptance: old names/ids/alias/source subpaths preserved; every output traced to graph.
  - Verification: V-TOK, new full foundation and 30-cell reproducibility/variable/type golden tests; generated freshness only in authorized snapshot.
- [x] **KERN-023 — Verify custom/seed/host themes and Xoroh preset.** Priority P0; phase P2; status Verified 2026-10-13; owner foundations/migration.
  - Dependencies: KERN-022, KERN-016. Files: seed/preset/scope/context tests, compatibility preset fixture.
  - Deliverable: tested overrides/contrast/seed/scoped projection and private-compatible theme conversion. Acceptance: no role holes/invalid contrast/OS/theme drift.
  - Verification: V-TOK + new custom/nested/contrast/seed web/native integration goldens; owner appearance comparison.

## P3 — Material implementations

- [x] **KERN-024 — Ship pure contracts and Material metadata.** Priority P1; phase P3; status Verified 2026-10-13; owner architecture/metadata.
  - Dependencies: KERN-013, KERN-018. Files: new contracts package, provider exports/parity type imports/build-order/CI.
  - Deliverable: schema/runtime validators + additive providerManifest. Acceptance: no UI/test runner/runtime service registry deps and no public export removal.
  - Verification: V-BOUNDARY + new contracts positive/negative tests, package type/build/preflight consumer fixtures.
- [x] **KERN-025 — Add export/variant/state preservation fixtures.** Priority P0; phase P3; status Verified 2026-10-13; owner components/quality.
  - Dependencies: KERN-003, KERN-022, KERN-024. Files: renderer/family/public API fixture tests.
  - Deliverable: each module/export/helper and actual axes linked to test/reason. Acceptance: Button md/lg and IconButton widths/sizes gaps resolved or explicitly mapped; no useful behavior removed.
  - Verification: V-WEB/V-NATIVE, generated export/props comparison, disabled/loading/controlled/ref/slot negatives.
- [x] **KERN-026 — Resolve elevations/shape rulings with accurate measurement.** Priority P0; phase P3; status Verified 2026-10-13; owner design/quality.
  - Dependencies: KERN-010, KERN-017, KERN-025. Files: elevation source/registry/gates/public deviation ledger and family tests.
  - Deliverable: per-variant/state measurements, explicit design rulings, no parent `.team` dependence. Acceptance: seven current findings and report-only/open cases dispositioned without conflating hover/lowered states.
  - Verification: `bun run check:kern`, `bun run check:elevation-parity`, parser negatives + renderer resting/hover variant style goldens.
- [x] **KERN-027 — Preserve field/selection/overlay behavior.** Priority P0; phase P3; status Verified 2026-10-13; owner components/a11y.
  - Dependencies: KERN-025, KERN-009. Files: input/field/OTP/number/select/calendar/menu/dialog/sheet family tests/source.
  - Deliverable: label/error/value/disabled/keyboard/paste/clamp/modality/focus/back contracts. Acceptance: all used generic APIs and required native behavior preserved; true missing capabilities implemented.
  - Verification: V-WEB/V-NATIVE + family axe/keyboard/ref/controlled and negative scenario fixtures.
- [x] **KERN-028 — Preserve navigation/start/shell seams.** Priority P0; phase P3; status Verified 2026-10-13; owner composition/migration.
  - Dependencies: KERN-025, KERN-016. Files: start/native navigation/pane/scaffold/toolbar tests/source.
  - Deliverable: selection/slots/link adapter/responsive/drill/ref mapping for product slices. Acceptance: lower layers never import compositions; domain/auth/catalog injected, not baked in.
  - Verification: V-WEB/V-NATIVE/V-BOUNDARY plus RTL/focus/resizing/disabled/navigation fixtures and private API mapping.
- [x] **KERN-029 — Prove real native hosts/fonts/themes/gestures.** Priority P0; phase P3; status Verified 2026-10-13; owner native/a11y.
  - Dependencies: KERN-023, KERN-027, KERN-028, KERN-012. Files: native components/host examples/font/theme tests.
  - Deliverable: controlled/OS/storage adapter compatibility, fonts/keyboard/back/modal/sheet/device evidence. Acceptance: no module-scope theme captures/Expo coupling, RN-web not substituted for device.
  - Verification: V-NATIVE + Expo bundle/host simulator or device scenarios and screen-reader manual evidence.
- [x] **KERN-030 — Test/fix actual icon render/accessibility parity.** Priority P0; phase P3; status Verified 2026-10-13; owner icons/native.
  - Dependencies: KERN-015, KERN-022. Files: icon web/native/core render tests and behavior.
  - Deliverable: alias/fill/size/RTL/missing/currentColor/decorative/name parity. Acceptance: every semantic alias valid; no duplicate announcement or wrong native meaning.
  - Verification: icon test/types + new DOM SSR/browser and native SVG RNTL/device render tests; `bun run icons:check`.
- [x] **KERN-031 — Measure icon assets/licenses/bundle strategy.** Priority P1; phase P3; status Verified 2026-10-13; owner icons/distribution.
  - Dependencies: KERN-030. Files: icon catalog/generator/static entrypoint option/THIRD_PARTY/packed fixtures.
  - Deliverable: pinned reproducible glyph payload/notice and measured web/native dynamic/static bundle cost. Acceptance: no fake tree-shaking claim; only justified static API addition, legacy dynamic API retained.
  - Verification: `bun run icons:check`, negative missing asset/name fixtures, actual packed bundler byte reports and license payload inspection.
- [x] **KERN-032 — Reconcile exact parity and exception policy.** Priority P1; phase P3; status Verified 2026-10-13; owner platform/metadata.
  - Dependencies: KERN-025, KERN-026, KERN-027, KERN-028, KERN-029, KERN-030. Files: parity contract/gate/platform docs/generated inventory.
  - Deliverable: capability-based classification for every one-sided row/actual variant gap. Acceptance: all counts reconcile, no stale already-present native gaps, all exceptions have rationale/alternative/test.
  - Verification: V-BOUNDARY + metadata false-claim negatives and exact inventory diff; generated outputs only through generator.

## P4 — Distribution/install

- [x] **KERN-033 — Deliver public compiled CSS/theme entries.** Priority P0; phase P4; status Verified 2026-10-13; owner distribution/styles.
  - Dependencies: KERN-015, KERN-022, KERN-025. Files: web/token CSS generation/export/files/sideEffects/style fixtures.
  - Deliverable: `theme` compatible vars/animations + compiled `styles`, separate Tailwind/font adapters. Acceptance: stale kern-theme import gone; no source scanning/reset/font surprise.
  - Verification: CSS import resolution/at-rule/keyframe/variable/class checks and new packed computed-style/override fixture; V-PACK.
- [x] **KERN-034 — Make CLI independently packageable.** Priority P0; phase P4; status Verified 2026-10-13; owner distribution/CLI.
  - Dependencies: KERN-015, KERN-024. Files: CLI manifest/build/bin/files/templates/bundled payload/build-order/CI.
  - Deliverable: publishable CLI with runtime/engine/bin contract, no checkout path reads by default. Acceptance: packed bin/help/init/add launches outside Kern; no private:false until artifact verified.
  - Verification: V-CLI/V-PACK plus spawned packed CLI no-checkout test and declaration/runtime payload file inspection.
- [x] **KERN-035 — Implement app-scoped CLI config/init.** Priority P1; phase P4; status Verified 2026-10-13; owner CLI/DX.
  - Dependencies: KERN-034. Files: CLI kern/config/init/starters/option parser.
  - Deliverable: typed kern.json, workspace/app/renderer/mode/style selection and web/native starters. Acceptance: deps/config target selected app, force/options explicit, no absolute developer paths.
  - Verification: V-CLI + standalone/nested-app/ambiguous/invalid option/init ownership fixtures; created starter builds in consumer tasks.
- [x] **KERN-036 — Complete typed dependency/asset/platform resolver.** Priority P0; phase P4; status Verified 2026-10-13; owner CLI/registry.
  - Dependencies: KERN-015, KERN-024. Files: CLI closure/resolution/manifest graph tests.
  - Deliverable: full static relative/index/js→ts/JSON/CSS/asset/self/npm/platform closure and declared dynamic dependency policy. Acceptance: unresolved edges fail, no path/symlink escape or accidental whole-provider import.
  - Verification: V-CLI + new missing/index/self/native/dynamic/cycle/version conflict/path traversal fixtures; compare copied source import graph.
- [x] **KERN-037 — Make installation transactionally safe.** Priority P0; phase P4; status Verified 2026-10-13; owner CLI/safety.
  - Dependencies: KERN-036, KERN-035. Files: add/init/transaction/staging filesystem layer.
  - Deliverable: resolve/preflight/stage/commit rollback with all conflicts validated first. Acceptance: late conflict/version/missing asset/custom CSS error leaves destination and receipt byte-identical.
  - Verification: V-CLI + fault-injection and custom-file hash regression tests; explicit consent separate from dependency install.
- [x] **KERN-038 — Version receipts/shared file ownership.** Priority P0; phase P4; status Verified 2026-10-13; owner CLI.
  - Dependencies: KERN-036. Files: receipt v2/schema/migration/add/init tests.
  - Deliverable: releaseSet/per-file baseline/current hashes/owners/assets/licenses/config and v1 conversion. Acceptance: identical skipped files still recorded; repeated identical add idempotent; block history preserved.
  - Verification: V-CLI + v1/v2/mixed/shared/readd/corrupt receipt fixtures and exact file closure hash comparisons.
- [x] **KERN-039 — Complete full snapshot runtime/style semantics.** Priority P0; phase P4; status Verified 2026-10-13; owner CLI/foundations.
  - Dependencies: KERN-036, KERN-037, KERN-038, KERN-022. Files: AST import rewrites/tokens/primitive/icon snapshot/asset installation.
  - Deliverable: self-contained snapshot includes runtime foundations and styles together, explicit external third-party deps. Acceptance: no hidden Kern import/value drift; customized snapshot CSS protected.
  - Verification: V-CLI + graph/import leak tests and snapshot theme/TS/native value fixtures; consumer builds in KERN-045/046.
- [x] **KERN-040 — Install block package/source dependency closure.** Priority P0; phase P4; status Verified 2026-10-13; owner registry/CLI.
  - Dependencies: KERN-036, KERN-037, KERN-038. Files: block manifest/generation/CLI addBlock/import mapping.
  - Deliverable: explicit package-backed versus complete source-backed graph, token/icon/assets/provider/renderer requirements. Acceptance: all three blocks install required dependencies; self-contained instructions match actual copied files.
  - Verification: V-CLI + three-block both-mode builds and incompatible/missing/cyclic dependency negatives; existing block gate maintained.
- [x] **KERN-041 — Implement native source installation/config/assets.** Priority P0; phase P4; status Verified 2026-10-13; owner native/CLI.
  - Dependencies: KERN-036, KERN-037, KERN-038, KERN-039, KERN-029, KERN-030. Files: native payload/platform resolver/starters/Metro/font/SVG assets.
  - Deliverable: native row selection before lookup, complete native/source closure and host setup. Acceptance: no web source copied for shared name; package/hybrid/snapshot native supported, no permanent web-only refusal.
  - Verification: V-CLI/V-NATIVE plus spawned native installer/platform assets negative cases and real Metro builds in KERN-046.
- [ ] **KERN-042 — Validate export/runtime/peer compatibility.** Priority P0; phase P4; status Not started; owner packaging.
  - Dependencies: KERN-024, KERN-025, KERN-030, KERN-015. Files: manifests/tsup externals/release policy/preflight/conditional exports.
  - Deliverable: public paths/types, compatible internal singleton peers/release ranges, native SVG host dedupe. Acceptance: no workspace/file/alias leakage, duplicate context/React proof; docs/code agree.
  - Verification: V-PACK plus duplicate-instance/context/native condition tests and TS5.9/parentTS6 consumer declarations.
- [ ] **KERN-043 — Prove standalone package consumers.** Priority P0; phase P4; status Not started; owner consumer quality.
  - Dependencies: KERN-033, KERN-042. Files: new isolated web/RN package fixtures/CI runner.
  - Deliverable: installs from tarballs without checkout aliases, actual types/SSR/build/runtime. Acceptance: styles/entrypoints/peers/dynamic icons work, declared ranges tested beyond local overrides.
  - Verification: fixture package install+typecheck+build+render commands captured with tarball hashes; V-PACK; native artifact host coverage completed KERN-046.
- [ ] **KERN-044 — Prove nested workspaces and CSS overrides.** Priority P0; phase P4; status Not started; owner consumer/styles.
  - Dependencies: KERN-033, KERN-042. Files: nested two-app workspace fixture and browser style tests.
  - Deliverable: hoisting-independent app CSS/paths and className override behavior with/without Tailwind. Acceptance: variants/states/keyframes/themes visible from tarballs, no private @source needed.
  - Verification: isolated workspace installs/build/types and computed CSS/color/geometry assertions; document layer/override order and measured CSS size.
- [ ] **KERN-045 — Prove web source consumers/upgrades.** Priority P0; phase P4; status Not started; owner consumer/CLI quality.
  - Dependencies: KERN-035, KERN-039, KERN-040, KERN-044. Files: standalone/workspace hybrid/snapshot/block fixtures.
  - Deliverable: complete copied code/npm/theme/style configuration builds. Acceptance: no private self imports/missing assets; custom edits and shared ownership preserved.
  - Verification: packed bin init/add/dry-run fixture builds/types/browser styles, fault injection hashes and actual receipt closure validation.
- [ ] **KERN-046 — Prove native package/source artifacts on Metro.** Priority P0; phase P4; status Not started; owner native consumer.
  - Dependencies: KERN-029, KERN-030, KERN-042; KERN-041 for full source-mode exit (early package milestone may precede it). Files: Expo/RN standalone/workspace artifact fixtures/native asset tests.
  - Deliverable: package artifact host proof first, then source modes once KERN-041 completes. Acceptance: Metro/font/SVG/native conditions singleton and actual device smoke; source-mode acceptance cannot be complete before KERN-041.
  - Verification: packed package Metro export + RN smoke, then hybrid/snapshot native install/build with assets, theme/icon/device evidence. Partial early package milestone explicitly recorded for P7A.
- [ ] **KERN-047 — Implement safe list/info/plan/diff/upgrade/validate CLI.** Priority P0; phase P4; status Not started; owner CLI/safety.
  - Dependencies: KERN-035, KERN-037, KERN-038, KERN-039, KERN-040, KERN-041. Files: CLI verbs/three-way merge/config/evidence reporters.
  - Deliverable: real referenced commands with dry-run/consent/backup/conflict handling. Acceptance: no custom overwrite/deletion, unsupported capabilities/verification unavailable explicit.
  - Verification: V-CLI + spawned packed CLI upgrade/rollback/custom conflict/mixed version tests; actual validation exit/evidence records.

## P5 — Registry and AI

- [x] **KERN-048 — Generate one versioned registry payload.** Priority P0; phase P5; status Verified 2026-10-13; owner metadata.
  - Dependencies: KERN-024, KERN-036. Files: registry source/generator/JSON schema/integrity payload.
  - Deliverable: components/compositions/blocks/foundations/icons/deps/assets/config/test/doc metadata shared by all consumers. Acceptance: no runtime regex TS parsing; schema/releaseSet/version provenance.
  - Verification: schema positives/negatives and deterministic AST generation/freshness tests in disposable snapshot, no renderer execution import.
- [x] **KERN-049 — Make entrypoints/props/capabilities match actual exports.** Priority P0; phase P5; status Verified 2026-10-13; owner metadata/platform.
  - Dependencies: KERN-008, KERN-032, KERN-048. Files: generator/MCP/site/CLI registry consumers and public types.
  - Deliverable: exact package/subpath/renderer/variant/default API metadata. Acceptance: SearchBar import `/start`, no helper/component misclassification or unsupported capability claims.
  - Verification: all export-map/barrel/source identity tests, prop/type fixtures, deliberate missing export/falsified capability failures; V-MCP.
- [x] **KERN-050 — Bundle MCP source/token/theme payloads.** Priority P0; phase P5; status Verified 2026-10-13; owner MCP/distribution.
  - Dependencies: KERN-048, KERN-042. Files: MCP reader/package/payload/version/source unavailable errors.
  - Deliverable: offline discovery/source/theme access outside checkout. Acceptance: no ../../../ package root reliance by default; optional dev override explicit and bounded.
  - Verification: V-MCP/V-PACK plus spawned packed server from isolated empty consumer, all declared payload hashes checked.
- [x] **KERN-051 — Correct and regression-test native source routing.** Priority P0; phase P5; status Verified 2026-10-13; owner MCP/platform.
  - Dependencies: KERN-050, KERN-049. Files: MCP tools/source reader/renderer path tests.
  - Deliverable: selected renderer owns source bytes and declared import. Acceptance: native/button equals native source, not web; native-only paths available, no package path escape.
  - Verification: V-MCP and web/native byte/source hashes/unknown renderer/path traversal tests; packed mode and dev override exercised.
- [x] **KERN-052 — Add theme/DTCG/icon discovery.** Priority P1; phase P5; status Verified 2026-10-13; owner AI/foundations/icons.
  - Dependencies: KERN-019, KERN-020, KERN-030, KERN-049, KERN-050. Files: MCP tools/protocol schemas/registry metadata.
  - Deliverable: contexts/aliases/Material mapping/fill/decorative/license queries and valid token formats. Acceptance: no unsupported extra family/weight/mode promises.
  - Verification: V-MCP plus spawned stdio query/error/schema/version fixture tests and alias/context golden agreement.
- [x] **KERN-053 — Add real block discovery/graph validation.** Priority P1; phase P5; status Verified 2026-10-13; owner registry/AI.
  - Dependencies: KERN-040, KERN-049, KERN-050. Files: block registry/MCP discovery/validation tools.
  - Deliverable: platform/mode/component/token/icon/npm/asset dependency metadata for real blocks. Acceptance: advertised native block has actual source/preview/test, unsupported errors explicit.
  - Verification: V-MCP plus all three current block graph/refusal/stdin query fixtures, CLI/MCP closure matches.
- [ ] **KERN-054 — Implement deterministic installation planning.** Priority P1; phase P5; status Not started; owner AI/CLI.
  - Dependencies: KERN-047, KERN-052, KERN-053. Files: shared plan schema/MCP/CLI resolver reporting.
  - Deliverable: no-write plan by context/layout/mode/version/style, missing inputs/conflicts/verification requirements. Acceptance: unknown environment not assumed; graph/versions identical to CLI.
  - Verification: V-MCP/V-CLI + deterministic plan snapshots across consumer matrix and incompatible version/platform/custom-file negatives.
- [ ] **KERN-055 — Add truthful setup/design validation reporting.** Priority P1; phase P5; status Not started; owner AI/quality.
  - Dependencies: KERN-054. Files: MCP/CLI evidence/status/error reporting and design audit metadata.
  - Deliverable: passed/failed/not-run with command/cwd/exit/hash/time and expected versus measured design categories. Acceptance: static checklist/maturity never becomes install/a11y success; no arbitrary shell tool.
  - Verification: injected failing/unavailable/partial commands and untrusted docs payload tests; V-MCP/V-CLI.
- [ ] **KERN-056 — Verify full discover→plan→install→validate agreement.** Priority P1; phase P5; status Not started; owner integration quality.
  - Dependencies: KERN-045, KERN-046, KERN-051, KERN-055. Files: stdio/CLI/consumer/docs shared end-to-end fixtures.
  - Deliverable: successful and failed workflows recorded on actual artifacts. Acceptance: metadata matches installed imports/source/styles/assets/versions and final report is truthful.
  - Verification: spawned packed MCP and CLI in standalone/workspace web/native fixtures, nonempty tests and error evidence; matrix scripts added to CI.

## P6 — Documentation and preview experience

- [ ] **KERN-057 — Write verified installation/upgrade recipes.** Priority P1; phase P6; status Not started; owner docs/DX.
  - Dependencies: KERN-043, KERN-044, KERN-045, KERN-046, KERN-047. Files: site getting-started/guides/package READMEs.
  - Deliverable: both layouts/platforms/modes/styles/font/icon/native/upgrade config recipes. Acceptance: all snippets tied to real successful fixture setup, prerelease publication status honest.
  - Verification: V-DOCS + recipe fixture replays from tarballs, link/import command audits.
- [ ] **KERN-058 — Complete capability/foundation/icon/block references.** Priority P1; phase P6; status Not started; owner docs/component owners.
  - Dependencies: KERN-023, KERN-032, KERN-049, KERN-052, KERN-053. Files: site content/demos/foundation docs/mobile gallery/reference skills.
  - Deliverable: every public capability/axis/exception/customization has correct API/example. Acceptance: no stale variant/gap/value counts; real demo sources same as blocks.
  - Verification: V-DOCS + inventory/props/test evidence reconciliation and actual rendered page checks.
- [ ] **KERN-059 — Promote accessibility and screenshot measurements.** Priority P1; phase P6; status Not started; owner visual/a11y quality.
  - Dependencies: KERN-027, KERN-029, KERN-030, KERN-033. Files: e2e visual/a11y suites and approved baselines/native evidence.
  - Deliverable: asserted visual diffs and broadened actual axe/keyboard/native accessibility. Acceptance: seeds/expectations aren't passes; fonts/theme/RTL/text-scale/reduced-motion measured.
  - Verification: `bun run test:e2e` with actual screenshot/axe assertions added; device/screen-reader scenarios and baseline approval recorded.
- [ ] **KERN-060 — Repair preview/gallery/native integration.** Priority P1; phase P6; status Not started; owner site/native preview.
  - Dependencies: KERN-029, KERN-030, KERN-049. Files: owned site preload/RN-SVG/gallery and apps/mobile sections.
  - Deliverable: real native previews render, bundler alias workaround scoped/documented. Acceptance: gallery error reproduced/fixed or correctly environment-labeled; mobile required sections present.
  - Verification: V-DOCS and mobile bundle/native host, browser preview evidence; RN-web never claimed equivalent to device.
- [ ] **KERN-061 — Synchronize machine docs and registry.** Priority P1; phase P6; status Not started; owner docs/AI.
  - Dependencies: KERN-049, KERN-052, KERN-053, KERN-058. Files: site llms/page-md/mcp-index generators and generated outputs.
  - Deliverable: current machine pages/installation metadata and stable links/schema. Acceptance: exact renderer/entrypoint/limitations preserved, no manual generated edits.
  - Verification: V-DOCS machine checks and byte/schema/route/source inventory comparison after owned regeneration.
- [ ] **KERN-062 — Update contributor/skills/release guidance.** Priority P1; phase P6; status Not started; owner docs/coordinator.
  - Dependencies: KERN-042, KERN-057, KERN-058, KERN-061. Files: docs architecture/releases/platform/conventions/root references/skills.
  - Deliverable: correct package count/peers/token pointer/gate commands/extension/changesets/agent usage. Acceptance: stale public package/private CLI/check:m3 and ADR-004 proposed-status claims resolved with governance approval, without erasing historical audits.
  - Verification: file/path/script checks, V-DOCS, `bun run lint`, `bun x changeset status` parsing only; no version/publish.
- [ ] **KERN-063 — Polish community/troubleshooting DX.** Priority P2; phase P6; status Not started; owner docs/DX.
  - Dependencies: KERN-057, KERN-062. Files: owned site help/community/examples/support links.
  - Deliverable: scannable troubleshooting/sample repository paths and contribution prompts. Acceptance: no speculative support claims, product-required install docs already complete.
  - Verification: link/route/accessibility content checks and V-DOCS; explicitly optional polish, not native/source deferral.

## P7 — Immediate and complete Xoroh adoption

- [ ] **KERN-064 — Establish product behavior/callsite baseline.** Priority P0; phase P7; status Not started; owner migration/product quality.
  - Dependencies: KERN-004, KERN-016. Files: parent test/screens/usage manifest and sanitized fixtures.
  - Deliverable: all used private APIs and canary/rollout scenarios with existing failure ledger. Acceptance: actual product interaction/theme/icon/storage/native gestures captured; no secret data upstream.
  - Verification: binding-aware scan and owner-reviewed scenario/screenshot recordings on current parent state before switches.
- [ ] **KERN-065 — Build public-only compatibility/codemod mapping.** Priority P0; phase P7; status Not started; owner migration/web/native.
  - Dependencies: KERN-064, KERN-024, KERN-025, KERN-028. Files: parent adapter package/codemod/shared usage maps.
  - Deliverable: symbol-by-symbol direct/adapter/generic gap/domain classification, private prefix imports phased out. Acceptance: unmapped names fail clearly; adapters import only public artifacts, no parent-only behavior in tokens.
  - Verification: before/after AST fixture tests, public export typecheck and used callback/ref/state scenarios; no broad textual replacement.
- [ ] **KERN-066 — Migrate theme/token/native style compatibility.** Priority P0; phase P7; status Not started; owner foundations/migration.
  - Dependencies: KERN-023, KERN-064, KERN-065. Files: parent token aliases/theme storage/provider adapters/styles.
  - Deliverable: Xoroh preset and private old roles/style-number/type aliases, object→positional resolver conversion, storage/OS/tenant behavior. Acceptance: no unapproved purple switch, live contexts and host persistence preserved.
  - Verification: bound token usage/role context diffs, web first-paint/native persistence/system fixtures and approved screenshots.
- [ ] **KERN-067 — Migrate all used Material names/fill/tones.** Priority P0; phase P7; status Not started; owner icons/migration.
  - Dependencies: KERN-030, KERN-064, KERN-065. Files: parent icon callsites/data aliases/adapter and public missing mappings.
  - Deliverable: every static/dynamic legacy icon resolves same intended meaning, filled-default and color behavior explicit. Acceptance: missing literals/domain glyphs classified; no silent null navigation icon.
  - Verification: actual catalog resolver scan/alias fixtures plus web/native screenshot/meaning/accessibility comparisons; license preserved for vendored shapes.
- [ ] **KERN-068 — Pin verified package artifacts and CI resolution.** Priority P0; phase P7; status Not started; owner migration/packaging.
  - Dependencies: KERN-043, KERN-044, KERN-065. Files: parent manifests/lockfile/tsconfig artifact aliases/CI.
  - Deliverable: canary artifact hashes/compatible set, TS6 declarations and no private source resolution. Acceptance: developer checkout absence works; rollback manifests/pins retained; public npm not required.
  - Verification: parent canary artifact install/typecheck/build and path leak scanner; no workspace/source alias masking.
- [ ] **KERN-069 — Configure web CSS and native Metro/fonts safely.** Priority P0; phase P7; status Not started; owner migration/platform.
  - Dependencies: KERN-033, KERN-066, KERN-067, KERN-068. Files: parent CSS entries/Metro/theme/font/navigation adapter configuration.
  - Deliverable: public compiled styles and native compatible host setup. Acceptance: private CSS scans removed in accepted apps, React/SVG/contexts deduped, Paper/Gorhom retained only when legitimately used.
  - Verification: canary browser computed styles/SSR/first paint and packed native Metro/font/SVG smoke; no mass dependency deletions.
- [ ] **KERN-070 — Accept early web accounts/shared-flow canary.** Priority P0; phase P7; status Not started; owner web migration/product.
  - Dependencies: KERN-027, KERN-066, KERN-067, KERN-068, KERN-069. Files: parent accounts/flows adapters/product fixtures.
  - Deliverable: real migrated settings/auth/OTP/form/shell/loading/disabled canary. Acceptance: owner scenarios pass, no private generic source dependency; feedback begins immediately.
  - Verification: inspected accounts build/test plus new **nonempty** interaction/a11y/screenshots and parent types; compilation alone rejected.
- [ ] **KERN-071 — Accept early native desk slice.** Priority P0; phase P7; status Not started; owner native migration/product.
  - Dependencies: KERN-029, KERN-066, KERN-067, KERN-069. Files: parent desk messaging/settings/sheet adapters/device fixtures.
  - Deliverable: native canary with artifact-only generic UI, preserved keyboard/back/snap/scroll/accessibility/theme behavior. Acceptance: P4 package portion of KERN-046 proven before acceptance; source-mode remainder need not delay package canary.
  - Verification: real parent Expo/Metro/device tests with fonts/SVG/gestures/screen reader and screenshots; existing mobile script gaps filled only with authorization.
- [ ] **KERN-072 — Roll out grouped web/domain consumers.** Priority P0; phase P7; status Not started; owner web migration/product.
  - Dependencies: KERN-070, KERN-058. Files: all inventoried parent web apps and start/shared domain libraries.
  - Deliverable: approved group rollout with dispatch/fleet/booking/accounts/balance/cloud/studio scenarios. Acceptance: every used generic capability mapped, domain wrappers intentional, no hidden private style/barrel path.
  - Verification: per-app existing target inspection/build/nonempty product tests/a11y/screenshots and binding/import leak scan; record remaining group blockers.
- [ ] **KERN-073 — Roll out native/domain consumers.** Priority P0; phase P7; status Not started; owner native migration/product.
  - Dependencies: KERN-071, KERN-058, KERN-046. Files: six parent mobile apps and expo/react domain libraries.
  - Deliverable: staged rollout with booking/maps/messaging/notifications/payments shell behavior preserved. Acceptance: all private generic symbols accounted, real modal/gesture/navigation/font/theme behavior accepted.
  - Verification: each app Metro/device/simulator product matrix and peer/path checks, no RN-web-only evidence.
- [ ] **KERN-074 — Enforce artifact-only migration CI/closure.** Priority P0; phase P7; status Not started; owner migration/quality.
  - Dependencies: KERN-072, KERN-073, KERN-045, KERN-056. Files: parent CI/type/test/consumer path scanners and source/block fixtures.
  - Deliverable: no generic private source/style alias in accepted rollout, nonempty actual product tests, artifacts pinned coherently. Acceptance: customized blocks/source modes tested where used; broad scan plus runtime evidence.
  - Verification: parent cold/disposable artifact builds/test/types/Metro, leak scanner negative fixture, relevant source installation regression matrix.
- [ ] **KERN-075 — Rehearse rollback and upstream feedback closure.** Priority P0; phase P7; status Not started; owner migration/coordinator/owner.
  - Dependencies: KERN-070, KERN-071, KERN-074. Files: rollback config/pins/product acceptance/feedback tickets.
  - Deliverable: reversible reviewed migration change with prior artifacts/config restored in rehearsal, upstream repro ownership. Acceptance: product data intact, no resets/private generic fork; owner accepts completed scope.
  - Verification: actual rollback/restore rehearsal on disposable canary, repeat key product scenarios and map feedback to tested Kern tasks.

## P8 — Release readiness (not publication)

- [ ] **KERN-076 — Run complete immutable candidate gate matrix.** Priority P0; phase P8; status Not started; owner release quality.
  - Dependencies: KERN-056, KERN-059, KERN-060, KERN-061, KERN-062, KERN-075. Files: CI/gate runner/evidence ledger.
  - Deliverable: all current/new checks on exact candidate bytes/artifacts. Acceptance: CLI/MCP/contracts included, both native runners, no missing script/empty tests/old audit passes reused.
  - Verification: QUALITY_AND_RELEASE_GATES full matrix; command/cwd/exit/count/time/artifact evidence retained, changes invalidate affected runs.
- [ ] **KERN-077 — Verify licensing/IP/NOTICE and source redistribution.** Priority P0; phase P8; status Not started; owner legal/release.
  - Dependencies: KERN-016, KERN-031, KERN-042. Files: LICENSE/THIRD_PARTY/NOTICE/SBOM/fonts/dependency/artifact inventory.
  - Deliverable: MIT ownership/Material Apache/font/dependency rights and actual attribution/notice payload. Acceptance: no private domain data/secrets/copied restricted assets; owner licensing approval.
  - Verification: upstream pinned asset/license evidence, tarball/source snapshot notice scan and dependency-license report; unknown rights blocks release.
- [ ] **KERN-078 — Close security/accessibility/native release risks.** Priority P0; phase P8; status Not started; owner security/a11y/native.
  - Dependencies: KERN-037, KERN-047, KERN-055, KERN-059, KERN-075. Files: dependency review/input/path safety/a11y/device evidence.
  - Deliverable: bounded input/security review, critical/serious a11y closure, supported native risk acceptance. Acceptance: no data-safety/critical dependency issue or fake measured claim waived as polish.
  - Verification: negative traversal/oversized/untrusted payload/install-script tests, dependency audit and real screen-reader/gesture evidence; owner exceptions documented.
- [ ] **KERN-079 — Validate final artifact contents/baselines/releaseSet.** Priority P0; phase P8; status Not started; owner packaging/visual quality.
  - Dependencies: KERN-043, KERN-044, KERN-045, KERN-046, KERN-059, KERN-077. Files: release artifact inventories/hashes and visual approvals.
  - Deliverable: complete JS/types/CSS/source/native/font/icon/license/bin payload and compatible ranges with approved screenshots. Acceptance: exact files resolve outside checkout, baselines intentional.
  - Verification: V-PACK, final tarball listing/hash/condition/range/consumer reruns and screenshot diff assertions; no publication.
- [ ] **KERN-080 — Check changeset/version/receipt upgrade compatibility.** Priority P0; phase P8; status Not started; owner release/distribution.
  - Dependencies: KERN-047, KERN-049, KERN-079. Files: changesets/releaseSet/schema/receipt migration fixtures.
  - Deliverable: first 0.1.0 compatible set/upgrade path previewed in disposable copy. Acceptance: per-package version/subpath reality, CLI/contracts included, no working-tree versioning or publish.
  - Verification: `bun x changeset status` read-only parsing; version dryrun in disposable authorized snapshot plus old→new receipt/API/consumer fixture tests.
- [ ] **KERN-081 — Write truthful Preview release/upgrade notes.** Priority P1; phase P8; status Not started; owner docs/release.
  - Dependencies: KERN-062, KERN-075, KERN-079, KERN-080. Files: release notes/changelogs/known limits/upgrade guides.
  - Deliverable: supported matrix, compatibility/risk/deprecation/rollback/0.x instability and approved visuals. Acceptance: no nonexistent install/test/publication claims; intentional exceptions actionable.
  - Verification: source/artifact/script/link checks and owner review against gate/product evidence.
- [ ] **KERN-082 — Approve governance/support/security namespace readiness.** Priority P1; phase P8; status Not started; owner maintainer/owner.
  - Dependencies: KERN-007, KERN-077, KERN-078. Files: GOVERNANCE/CONTRIBUTING/SUPPORT/SECURITY and release ownership.
  - Deliverable: MIT contribution/decision/support/security process, npm names/permissions/provenance ownership. Acceptance: no unsupported SLA, rights/credentials approval recorded without secrets.
  - Verification: policy/namespace/permission review by owner, artifact provenance prerequisites documented; do not enable release variables.
- [ ] **KERN-083 — Sign Preview NO-GO checklist and rollback readiness.** Priority P0; phase P8; status Not started; owner quality/product/owner.
  - Dependencies: KERN-076, KERN-077, KERN-078, KERN-079, KERN-080, KERN-081, KERN-082. Files: final gate checklist/approval ledger.
  - Deliverable: signed accepted candidate scope and all required tasks verified. Acceptance: DTCG/native/source/standalone/AI/Xoroh preserved; only truly optional P2 polish may remain.
  - Verification: task acceptance evidence audit against release checklist, product signoff and rollback rehearsal hashes; unresolved P0/P1 blocks.
- [ ] **KERN-084 — Obtain separate version/publication authorization.** Priority P0; phase P8; status Not started; owner release owner.
  - Dependencies: KERN-083. Files: approval record only until authorized.
  - Deliverable: explicit decision to keep HOLD or authorize specified candidate/version/npm operation. Acceptance: no automatic commit/push/version/publish triggered by plan or green CI.
  - Verification: owner instruction and exact releaseSet/artifact hashes recorded; publication, if requested later, is a separately scoped operation with receipt/registry verification.

## Verified completions (2026-10-13 first/second implementation pass)

Marked `[x]` only where the acceptance criterion was measured, not where work
was attempted. Each links to the command that proves it:

- **KERN-002** — audit vs source reconciliation recorded in CURRENT_STATE.md
  §Sources and audit reconciliation; every historical claim labelled
  WT/HEAD/history.
- **KERN-005** — command baseline ledger in CURRENT_STATE.md §Commands actually
  run for this plan, extended by the dated execution ledgers.
- **KERN-008** — `bun test packages/mcp/src/manifest.test.ts` → 5 pass / 0 fail.
  The manifest now carries `entrypoint` and the test resolves `./start` through
  `export *` rather than the component barrel.
- **KERN-009** — `bun run check:coverage` passes; the `presentation` exemption is
  reasoned (nonpublic binding host, real colocated suite) rather than a
  wholesale presentation-layer exclusion.
- **KERN-010** — `bun run check:kern` passes. The preset-read leg is
  scanner-based and comment/string-aware; the two REAL shape findings were fixed
  to shape-scale tokens.
- **KERN-012** — `apps/mobile` has `bundle` (`expo export --platform all`) and CI
  now verifies per-platform bundles, assets and `dist/metadata.json`. Executed:
  iOS 14.5s / Android 18.0s.
- **KERN-026** — `bun run check:elevation-parity` passes. Resting vs
  interaction-only levels separated; native Snackbar dp corrected; native FAB
  `lowered` added; two stale rulings re-opened with evidence.

KERN-001, -003, -004, -006 remain planning-ledger work rather than source work
and are recorded in CURRENT_STATE, so they are left unchecked until their own
acceptance evidence is recorded.
