# Architecture decision register

Status: recommendations resolved for planning; **not implementation authorization**. `Decided` means the blueprint uses that recommendation consistently; owner approvals remain explicit in README/risks. Append reversals with evidence/date/task, never silently rewrite history. Existing ADRs in `docs/adr/` retain authority over implemented history; these planning decisions must be reconciled/promoted there during authorized work (`KERN-007`, `KERN-013`–016).

Every entry includes options, recommendation/reason/evidence, tradeoffs, migration/compatibility, validation/risk and reversal trigger. Evidence paths are relative to Kern unless parent-prefixed. No second provider is necessary to validate the current single-provider scope.

## ADR-P01 — Package boundaries and composition

**Question/options:** retain renderer/foundation packages and `/start`; split composition; universal facade; monolithic platform branches.
**Decision: decided.** Retain packages, web `/start`, native root composition; add contracts and make CLI publishable. `kern/src/start/index.ts` has six cohesive modules; `check:layers` verifies composition → web and no renderer cross-imports. No independent composition release/dependency requirement was found.
**Benefits/cost:** small stable graph and no import churn; asymmetric composition export packaging remains but is metadata-declared. Splitting now adds release/consumer overhead without a real present consumer need.
**Migration/compatibility:** preserve root/native and web subpaths; no move of source during planning; package additions have changesets and build graph registration.
**Risk/validation:** duplicate runtime dependencies/entrypoint mistakes; test packed tree-shaking, public exports and block closure. Reverse only if measured independent version/renderer coupling makes `/start` ownership problematic.

## ADR-P02 — Contracts package

**Question/options:** repository-only `parity/`; add to primitives; add to MCP; small new package.
**Decision: decided**, approval required for new published package. Add `@xoroh/kern-contracts`, pure types/schema/data/validation. Renderers, tokens/icon metadata, CLI/MCP/registry have present common schema consumers; placing it in primitives violates behavioral focus; MCP-only ownership makes runtime consumers depend on tooling.
**Evidence:** duplicated `ManifestRow`/`BlockRow` versus MCP/site row types, `parity/contract.ts` data-only, SearchBar wrong barrel/import classification.
**Benefits/cost:** one versioned metadata vocabulary and negative tests; another package to build/license/version. Do not ship React/test runners in it or a generic service registry.
**Migration/compatibility:** type parity data through schema without duplicating instances; keep renderer test adapters repo-owned; source snapshots include needed types/schema.
**Risk/validation/reversal:** circular imports or overbroad runtime API; verify no dependency/upward edges and standalone schema consumer. Reconsider if all consumers can demonstrably consume one generated schema without independent runtime/types package benefits.

## ADR-P03 — Material naming/ownership

**Question/options:** rename `kern` to `kern-material-web`, move facade to kern, or retain names with explicit identity.
**Decision: decided.** Keep names; provider id `m3`, label Material 3 and spec/evidence metadata on both renderers. No neutral facade or provider selector.
**Evidence:** current exports, hundreds of repo imports and private Xoroh migration already needing three legacy name mappings; no second provider implementation.
**Benefits/cost:** avoids gratuitous churn; generic Kern name needs precise descriptions/metadata. Rename provides limited benefit for one provider, but breaks all consumers/tooling.
**Migration/compatibility:** additive `providerManifest`; clarify theme provider versus design provider. Registry/machine APIs return provider+renderer.
**Risk/validation/reversal:** ambiguous imports; test human/AI installation choices. Reopen only upon a real independently owned second provider and measured identity ambiguity.

## ADR-P04 — Canonical tokens and DTCG now

**Question/options:** DTCG authoring rewrite; custom only/deferred export; versioned Kern graph plus bidirectional adapter.
**Decision: decided.** Keep Kern canonical authoring and normalized graph; mandatory DTCG 2025.10 export/import/validation/roundtrips in Phase 2.
**Evidence:** current tokens JSON lacks `$type/$value`, runtime/import/generators/presets rely on custom shapes, springs/feedback require namespaced extension metadata.
**Benefits/cost:** stable consumers plus real interchange; adapter maintenance and supported-loss policy required. Export-only is insufficient for the requested interoperability.
**Migration/compatibility:** preserve role/CSS/TS/theme outputs with approved goldens; add schema version and DTCG artifacts, do not author two mirrors.
**Risk/validation/reversal:** unsupported composites/color units, alias/cycle losses; standards fixtures/all-foundation semantic roundtrips plus 30-cell renderer goldens. Reopen canonical storage only if real tooling makes adapter cost higher than a tested authoring migration.

## ADR-P05 — Theme ownership/defaults/extensions

**Question/options:** separate provider token package; foundation with Material-owned values; arbitrary role-table themes.
**Decision: provisionally decided** only on visual baseline approval; structural policy decided. Tokens owns infrastructure plus current Material data; presets override known roles, app namespaced tokens separate. Retain OSS current Material baseline subject to owner approval; create explicit Xoroh compatibility preset.
**Evidence:** `resolve.ts` base→contrast→preset, five ids/30 cells; private Xoroh neutral primary/blue secondary versus WT OSS purple/muted values.
**Benefits/cost:** preserves one resolver and branding separation; compatibility preset/contrast context validation adds work.
**Migration/compatibility:** keep old ids and `m3` alias; host theme storage/scope behavior mapped, not silently reset to default.
**Risk/validation/reversal:** brand regression/failing high contrast after overrides; compare all source values/context and product screenshots. Owner visual ruling resolves provisional part; change only with explicit approved visual release/migration, never by editing expected test alone.

## ADR-P06 — Shared web/native behavioral contracts

**Question/options:** identical component prop/render APIs; renderer obligations with explicit mappings; no shared contract.
**Decision: decided.** Share semantic/behavior obligations, not DOM/StyleSheet anatomy. Canonical callbacks/variant meanings retained; true platform differences documented/tested.
**Evidence:** parity data and suites, web array segmented values/native scalar API, Base UI versus RN Modal.
**Benefits/cost:** protects meaningful parity without unnatural platforms; adapters/test interfaces need maintenance.
**Migration/compatibility:** preserve existing aliases and flat/multipart APIs; additions require per-side contract fixture.
**Risk/validation/reversal:** weak lowest-common denominator; mutation-negative tests must reject capability false claims. Reopen individual mappings only upon real platform limitation/product behavior evidence.

## ADR-P07 — Parity exceptions

**Question/options:** equate export counts; duplicate every multipart component; classify capability/equivalence/intentional/missing.
**Decision: decided.** Reconcile all actual rows/concepts with supported behaviors; every remainder needs reason/evidence/alternative. Preserve native-only art and web Sonner.
**Evidence:** 300/117 rows yet 92 shared, stale platform gap prose lists already implemented native components.
**Benefits/cost:** accurate feature preservation; requires explicit matrix rather than a flattering count.
**Migration/compatibility:** Xoroh-used missing functionality blocks that slice; intended asymmetry does not justify deleting its existing feature.
**Risk/validation/reversal:** parser misclassification; compare generated inventory and behavior fixtures, all gap counts reconciled. Reopen exception when real native/web product need appears.

## ADR-P08 — Material icon API/asset line

**Question/options:** keep SVG Material Symbols; font ligatures; swap classic Icons/library; multi-family marketplace.
**Decision: decided** on implementation; terminology approved before release. Keep one `Icon`/mapping and separate web/native SVG emitters, Material Symbols Rounded 400 existing asset line.
**Evidence:** pinned source config, 1340 glyphs/42 semantic aliases, native conditional exports and Apache notice.
**Benefits/cost:** deterministic offline meaning and existing API; dynamic whole-catalog bundle may be large, native color/decorative behavior needs proof.
**Migration/compatibility:** keep names/aliases, explicit private filled-default adapter; strict build missing-name checks, production null fallback preserved.
**Risk/validation/reversal:** asset/license/meaning loss; render/SSR/native/RTL/alias/fill/license and bundle tests. Change assets only with owner visual approval and matching mapping/screenshot migration.

## ADR-P09 — Styling/public CSS

**Question/options:** consumer scans checkout; scan package dist; precompiled CSS default with optional Tailwind adapter.
**Decision: decided.** Publish ordinary theme CSS and deterministic component CSS (`@xoroh/kern/styles`); retain `theme` compatibility with tokens/animations. Optional host Tailwind recipe separate.
**Evidence:** site source scan, tarball files exclude component source; theme.css stale import; token CSS mixes font/Tailwind directives.
**Benefits/cost:** standalone works without hidden scan; CSS size/cascade/utility collisions and generation need test budgets.
**Migration/compatibility:** preserve variable names, no implicit reset; explicit fonts; source mode scans installed destination or compiles local styles.
**Risk/validation/reversal:** missing class/state/keyframes and override order; packed browser computed styles with/without host Tailwind, SSR and workspace CSS tests. Reopen only if tested CSS size/cascade failure cannot be fixed without a demonstrably reliable alternate delivery contract.

## ADR-P10 — Source installation and foundations

**Question/options:** single-file copies; package-only; hybrid closure; full snapshot.
**Decision: decided.** Support hybrid default and explicit full snapshot, with closure/runtime/assets/config. Full snapshot rewrites foundational imports and freezes runtime/CSS together; never market CSS-only as zero dependency.
**Evidence:** `closure.ts` static relative traversal/bare npm collection, `add.ts` self-contained copies only CSS today.
**Benefits/cost:** app-owned UI plus consistent foundations; full snapshot/AST rewrite more complex but bounded and testable.
**Migration/compatibility:** receipt v1 conversion, preserve custom files; third-party host dependencies remain. Source-installed `/start`/blocks support declared mode without provider barrel leaks.
**Risk/validation/reversal:** silent missing dependencies/drift; complete isolated source builds and import-leak detector, native assets. Narrow advertised snapshot scope only with explicit owner approval, truthful renamed semantics and retained old behavior migration.

## ADR-P11 — Blocks/registry closure

**Question/options:** examples only; runtime block package; versioned source payload with two component modes.
**Decision: decided.** Source blocks first-class, package-backed or source-backed closure explicit; one schema/payload with capabilities, provider/renderer/npm/token/icon/assets.
**Evidence:** three real source blocks/site manifest; addBlock ignores component closure and self-contained CSS copy.
**Benefits/cost:** customization/no extra package; deterministic graph/upgrade/source payload ownership work.
**Migration/compatibility:** retain names/source snippets/previews; move registry build ownership away from site runtime only when authorized.
**Risk/validation/reversal:** cycles/version conflicts/unsupported native installs; negative graph tests and all current blocks in both modes. Add block runtime package only if measured independent version reuse justifies overhead.

## ADR-P12 — CLI configuration/mutation architecture

**Question/options:** private checkout tool; public bundled payload; remote-only arbitrary registry.
**Decision: decided**, public addition owner-approved. Independent CLI with bundled versioned registry, explicit optional trusted registry override, app/workspace config, dry-run/install plan, transaction receipts/diff/upgrade/validate.
**Evidence:** private manifest no build/files contract, `init` file paths, add writes before late conflicts and referenced nonexistent verbs.
**Benefits/cost:** offline standalone safety; staging/version/schema and bin tests required.
**Migration/compatibility:** keep init/add development override and receipt migration; force is not unrestricted user-file permission.
**Risk/validation/reversal:** data loss/path traversal/lifecycle scripts; byte-identical rollback failure tests, hash/path guards and owner-customized upgrades. Reopen distribution transport only if measured package-size/security need, not a new provider marketplace.

## ADR-P13 — MCP metadata/validation

**Question/options:** source scraping/renderer imports; common generated payload; replace existing MCP.
**Decision: decided.** Evolve five existing tools and add discovery/planning/evidence validation over shared payload. MCP no arbitrary execution/mutation by default; host agent uses authorized CLI.
**Evidence:** native returns web source, `/start` import wrong, checkout token reads, static checklist.
**Benefits/cost:** correct platform/installation without replacing useful tools; protocol/schema and bundle source work.
**Migration/compatibility:** retain names/default aliases; typed unavailable/errors, no maturity→success inference.
**Risk/validation/reversal:** untrusted docs instructions or false verified claims; stdio/packed/malformed/error tests and CLI agreement. Reopen only for concrete SDK/tool contract incompatibility.

## ADR-P14 — Monorepo and standalone

**Question/options:** workspace-first only; standalone later; equal artifact-based support.
**Decision: decided.** Both layouts first-class for web/native package/source; fixtures cannot import private source aliases.
**Evidence:** site workspace aliases, CLI checkout paths, parent Nx/TS6/Metro versus library TS5.9 source success.
**Benefits/cost:** real OSS consumer proof; matrix/time maintenance.
**Migration/compatibility:** local verified tarballs for immediate dogfood; registry resolution proves release ranges too.
**Risk/validation/reversal:** hoisting/source masks missing exports/styles/peers; cold disposable fixtures plus tarball content/import checks. No deferral without explicit product-scope change.

## ADR-P15 — Versioning/dependency compatibility

**Question/options:** fixed versions all packages; independent changesets + compatible releaseSet; unrestricted peers.
**Decision: decided.** Retain independent changesets; registry pins compatible releaseSet, schema/receipt/spec coordinates separate. Singleton context/theme/extension runtime peers with compatible ranges; pure dependency exceptions require tested policy update. No `workspace:*` in shipped fields.
**Evidence:** changesets config independent, current ^0.0.0 dependencies versus release docs peers, tsup externalization differences.
**Benefits/cost:** targeted releases; need cross-package compatibility fixtures and docs correction.
**Migration/compatibility:** 0.1 preview clearly unstable, but changes still documented with explicit upgrade/receipt guidance; recommend adopting proposed ADR-004's post1.0 one-minor deprecation window only with founder sign-off. Reconcile GOVERNANCE's hard-cut/no-alias language with existing semantic/theme aliases; no new private-prefix public facades.
**Risk/validation/reversal:** duplicate primitive/context/React and too-broad ranges; multi-copy runtime/packed range tests. Introduce linked versions only after real incompatibility burden is measured.

## ADR-P16 — Testing/release gates

**Question/options:** passing typecheck; current gates only; complete behavior/artifact/native/accessibility matrix.
**Decision: decided.** Keep/fix current gates and add missing foundation/interchange/icons/CLI/MCP/source/artifact/product tests; both native runners mandatory, screenshot assertions promoted from seeds.
**Evidence:** red checks, root omits CLI/MCP tests/types, single sampled axe file, mobile missing bundle script.
**Benefits/cost:** measurable safety; CI runtime/environment resources and approved baselines needed.
**Migration/compatibility:** maintain baseline provenance, reject cosmetic exemptions hiding defects; new gates added with actual scripts/CI ownership.
**Risk/validation/reversal:** nonexistent-script gates or false green empty suites; inspect scripts, negative tests/CI run and non-empty counts. Relax a gate only with documented temporary scope/evidence/owner and no release-required capability left unverified.

## ADR-P17 — Xoroh timing and rollback

**Question/options:** migrate after public release; immediately rewrite all apps; early canary then grouped rollout.
**Decision: decided.** P7A starts on P2 + used P3 slice + verified CSS/artifact subset; P7B before release, not after. Xoroh owns compatibility/domain wrappers and reversible artifact pins.
**Evidence:** 683/455/138 static import files/private aliases, theme/signature/shell/Gorhom differences.
**Benefits/cost:** product feedback early, preserves functionality; adapters/canary approval/rollback work.
**Migration/compatibility:** no default visual switch, no private source/path leaks in accepted slices; preserve old lockfile/config as reviewed rollback artifact.
**Risk/validation/reversal:** product outage/auth/sheet/keyboard regression; product scenarios/device tests/rollback rehearsal. Pause rollout on concrete regression, not defer indefinitely awaiting tooling polish.
**Status 2026-10-14:** RESTORED AS PLANNING SPECIFICATION — Phase P7 defines the sequenced canary and rollout plan for the future migration, which remains BLOCKED pending explicit written owner authorization; planning-only mandate strictly maintained.

## ADR-P18 — OSS licensing/governance

**Question/options:** existing license labels sufficient; MIT Kern plus verified upstream notices/legal review.
**Decision: decided** structurally; redistribution/title/namespace approval must be verified by owner. Keep MIT Kern; respect Material Apache-2.0 and font/dependency licenses, include required attribution/license payloads.
**Evidence:** manifests/root LICENSE, icons THIRD_PARTY/NOTICE/config; actual upstream redistribution completeness not yet verified.
**Benefits/cost:** clear OSS contributions/security/support; asset provenance and ownership signoff work.
**Migration/compatibility:** no private code/data/secrets/domain contracts published accidentally; retain upstream attribution for vendored snapshots. This mission authorizes Xoroh planning references, while GOVERNANCE currently forbids downstream references in public docs; owner must approve how these planning materials are exposed without leaking private product context.
**Risk/validation/reversal:** incomplete licenses/IP or name rights; SBOM/tarball notice scan/owner approval blocks release. Change license only by explicit legal/owner decision with contribution rights analysis.

## ADR-P19 — Documentation/previews

**Question/options:** new Storybook; existing site/mobile; approximate feature pages.
**Decision: decided.** Keep site/mobile as real preview hosts, generate docs/machine surfaces from registry/source examples. Concurrent site redesign is separate implementation ownership.
**Evidence:** live site gallery/block sources/machine pages and Expo app already exist.
**Benefits/cost:** no duplicate demo infrastructure; RN-web interop must not masquerade as device testing; metadata regeneration coordination.
**Migration/compatibility:** maintain route/import snippets/AI links, add both install/layout/native recipes and every actual capability's examples.
**Risk/validation/reversal:** stale generated claims/non-rendering pages; docs/gallery/Markdown/LLM checks plus browser native host evidence. New preview platform only if current host cannot meet measured requirements.

## ADR-P20 — 0.1.0 Preview criteria

**Question/options:** small web subset now; complete scoped platform Preview with honest caveats.
**Decision: decided.** All mission-required foundations/Material/icons/native/distribution/registry/AI/Xoroh paths must meet measurable acceptance before Preview; optional design-provider marketplace/grid expansion excluded.
**Evidence:** current 0.0.0/HOLD, incomplete consumer support and red gates; existing rich functionality must be preserved.
**Benefits/cost:** useful real-app Preview, not scope-trimmed marketing; requires native/artifact/product/legal evidence.
**Migration/compatibility:** releases remain owner-authorized; no version/publish in planning; documented prerelease/upgrade compatibility and known intentional exceptions.
**Risk/validation/reversal:** release pressure hides failures; signed gate ledger and rollback acceptance, all P0/P1 tasks plus required P2 deliverables verified. Owner can change scope explicitly but cannot label unperformed checks passed.
