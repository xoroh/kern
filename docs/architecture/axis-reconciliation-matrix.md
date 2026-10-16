# Kern–Axis reconciliation matrix

Date: 2026-10-16. Scope: Kern–Axis primitives-extraction workstream only
(Xoroh product migration, Atlas, and general Kern OSS rows excluded except
where they constrain extraction). Archive root:
`docs/archive/2026-10-axis-transition/`. Canonical plan:
`docs/architecture/kern-axis-migration-and-roadmap.md` ("Plan" below),
inventory (`.../axis-extraction-inventory.md`), contract
(`.../axis-contract.md`).

Dispositions: **Carried forward** / **Completed** / **Intentionally deferred**
/ **Superseded / obsolete** / **Missing / unresolved**. Zero rows are
Missing / unresolved.

## A. Superseded authority (`architecture/0.1.0-preview-redesign.md`)

| ID | Historical source | Original obligation | Hist. status | Canonical mapping | Disp. | Evidence | Gap / follow-up |
|---|---|---|---|---|---|---|---|
| R-01 | §10: AX0 audit | Map sources→consumers/tests/licenses/history before transfer | Planned | Plan §E Phase 1, inventory doc | Carried forward | AX0 complete in Phase 1 report; inventory + contract docs landed | Phase 2 execution |
| R-02 | §10: AX1 scope/charter | Approve charter, maintainers, API, release policy | Planned | D-NAME + contract doc | Carried forward | Contract drafted, approval pending | Owner approval |
| R-03 | §10: AX2 transfer | Transfer AX0-approved material w/ metadata/tests/docs/CI; preserve history where practical | Planned | Plan §E Phase 2 | Carried forward | Awaiting D-NAME/D-NOGO | None yet |
| R-04 | §10: AX3/§10.4 verification gates | Clean-clone matrix, zero-dep scan, packed consumer proof, docs build, version dry-run, per-platform tests | Planned | Plan §G checklist | Carried forward | §G covers all; docs-build checkbox added 2026-10-16 | None |
| R-05 | §10: AX4 name/domain/trademark | Availability checks block release | Planned | D-NAME | Carried forward | Read-only checks done; confirmation pending | Owner confirmation |
| R-06 | §10: AX5 release join | Axis verified before alpha/beta gate | Planned | Plan REL gate | Carried forward | Gate text present | None |
| R-07 | §10.2/:242/:562/:625/:641/:666 no-dependency model | No Kern↔Axis dependency either direction | Owner-directed (then) | D-DEP | Superseded / obsolete | Later owner instruction: Kern Native → Axis public API | None; must not be restored |
| R-08 | :238/:278/§10.3/§11: `xoroh-axis` primary, `@xoroh/axis` fallback | Package-name intention | Owner-directed (then) | D-NAME | Superseded / obsolete (as primary; retained as fallback) | Task direction prefers `@xoroh/axis` | Owner confirmation |
| R-09 | §10.6 per-symbol cleanup | Prune/adopt per call-site evidence; nothing auto-transfers | Observation | AX0 zero-consumer table | Carried forward | Dispositions assigned, evidence-backed | Phase 2 execution |
| R-10 | :626/:665 N9 `libs/` move | Internal move, never Axis-driven | Complete | Plan notes N9 done | Completed | `65eadac1`, gates green | None; cutover-deletion is separate Phase 4 work |
| R-11 | AUD-010 publication boundary | Decide publishability of primitives | Confirmed finding | H-17 (fixed) + D-NAME/D-RELEASE | Carried forward | CLI `private:true`; publish via Axis by design | Release confirmation |
| R-12 | AUD-009 (`:27` stale path) | Correct `packages/` vs `libs/` in archived doc | Confirmed finding | — (frozen record) | Superseded / obsolete | Archive immutable by design | None |
| R-13 | DC-03 orphaned exports | Per-symbol prune-or-adopt | Finding | AX0 table | Carried forward | Same as R-09 | Phase 2 execution |
| R-14 | :174 Axis≄Kern-Native proof separation | Axis verification neither substitutes nor contributes to Kern Native device/parity claims | Requirement | **Added to Plan §C.4 2026-10-16** (was missing) | Carried forward | Guardrail now explicit | None |
| R-15 | :169 Axis owns manifest/generator; CLI/MCP don't consume it | Standalone registry ownership | Planned | Plan §D.3, contract §4 | Carried forward | Rows present | None |
| R-16 | :174 iOS unverifiable on Linux host | Needs macOS/device lab | Limitation | H-10, D-DEVICE | Carried forward | Recorded | Methodology decision |

## B. Primitives lane (`planning/01-primitives.md`)

| ID | Obligation | Hist. status | Mapping | Disp. | Evidence |
|---|---|---|---|---|---|
| R-17 | G1 barrel-only ruling | Ruled 2026-10-09 | Contract §2 one-entry design | Carried forward | Constraint honored |
| R-18 | G2/G3/G4/G5/G6/P0-truth/G8/D-031 docs-site landings | All `[x]` landed | — (site evidence) | Completed | `primitives-nav.ts`, 16 module pages, `check-primitives-docs` 81/81 |
| R-19 | G7 binding doc half | Landed (`docs/binding-contract.md`); publish half founder-gated | Contract references bindings | Completed | Doc exists; HOLD intact; publish half tracked under D-RELEASE, not here |
| R-20 | Reusables adapter recipe (not dependency) | Landed | Context only | Completed | README mapping + live-verify tests |

## C. Backlog and decisions (`planning/MASTER_TODO.md`, `ARCHITECTURE_DECISIONS.md`)

| ID | Obligation | Hist. status | Mapping | Disp. | Evidence |
|---|---|---|---|---|---|
| R-21 | V-BOUNDARY gates (layers/primitives/consumption/parity) | Command defs | Plan §J + §F.4 | Carried forward | All green 2026-10-16 |
| R-22 | KERN-003 capability inventory | `[ ]` (primitives slice done; full 417-row UI inventory open per Plan §F) | Extraction inventory doc + Plan §F KERN-003 row | Carried forward | Primitives slice evidenced; remainder stays Phase 0/§F work |
| R-23 | KERN-007 arch approval | `[!]` owner action | Plan approval + D-NOGO | Carried forward | Pending owner |
| R-24 | KERN-009 presentation exemption | `[x]` | Consumption posture + contract | Carried forward | Gate green, exemption reasoned |
| R-25 | KERN-029 device validation | `[!]` never ran | D-DEVICE | Carried forward | Pending methodology |
| R-26 | KERN-043–046 standalone fixtures | `[x]` verified | Phase 3/5 proof patterns | Carried forward | Patterns referenced in §G |
| R-27 | KERN-078/083/084 | `[!]` blocked | D-GHSA/D-NOGO/D-RELEASE | Carried forward | Pending owners |
| R-28 | KERN-016 migration/rollback | `[!]` | Re-scoped Phase 4 rollback | Carried forward | Owner authorization still needed for execution |
| R-29 | P02 new-package approval rule | Decided | D-NAME/D-SPLIT process | Carried forward | Process followed |
| R-30 | P06 semantic sharing | Decided | Contract design | Carried forward | Model/binding split throughout |
| R-31 | P14/P15 standalone-first + changesets | Decided | §G + Phase 7; `changeset status` Phase 5 gate | Carried forward | Gate added |
| R-32 | R11 duplicate-React policy | Risk rule | §G packed-consumer proof | Carried forward | Proof specified |

## D. Approvals, NO-GO, risks, audits

| ID | Obligation | Hist. status | Mapping | Disp. | Evidence |
|---|---|---|---|---|---|
| R-33 | Push/publish/versioning NOT authorized; P7 blocked | 2026-10-13 approval | HOLD + exclusions + §10 prohibitions | Carried forward | Respected by all tasks |
| R-34 | NO-GO blockers (GHSA→0-open verified; device→D-DEVICE; 070–075→excluded; 084→D-RELEASE) | Unsigned | D-GHSA/D-NOGO/D-RELEASE | Carried forward | Reconciled, pending owners |
| R-35 | R02/R05/R06 no-masking rules | Risk rules | Gate posture (no weakening anywhere) | Carried forward | Honored (K11/hydration left red) |
| R-36 | Boundary law (React-only, transitive gate, 81/70/11) | Finding | Contract + gates | Carried forward | Green 2026-10-16 |
| R-37 | H1:416 contracts-as-package | Recommendation | `@xoroh/kern-contracts` exists | Completed | Package present, no UI deps |
| R-38 | H2:28/H3:49,63 provider-registry placement | Deferred proposal | **Added to Plan §I non-blocking row 2026-10-16** | Intentionally deferred | May live neither in Axis (not neutral) nor `libs/` (deleted); trigger: a workstream needing it; blocks nothing |
| R-39 | H1:148 reusables recipe; H1:173 Base UI boundary | Findings | Context | Completed | No action needed |

## E. `plan/` roadmap + execution report

| ID | Obligation | Hist. status | Mapping | Disp. | Evidence |
|---|---|---|---|---|---|
| R-40 | Row 11 shell-docs page open (other rows done, noted as context) | `in progress` | Plan §F | Carried forward | Row 11 in §F |
| R-41 | Baseline commits + PR #24 + CI fixes (run `38833031513`) | Reported | Verified this task; PR review + CI residuals tracked in Plan H-register | Carried forward | Commits done and pushed; latest run `38833675023`: all pkgs + cold-install + dist-gates + typecheck green | PR #24 review/merge; residuals = lint, check-docs K11, e2e #418 |
| R-42 | K11 errors, lint, hydration, changeset-status, mobile/bundle/gallery unverified | Reported exceptions | Plan H-register + Phase 5 | Carried forward | No gate weakened; owners assigned |

Counts: 42 obligations — Carried forward 32 (R-01–R-06, R-09, R-11, R-13–R-17, R-21–R-36, R-40–R-42), Completed 6 (R-10, R-18–R-20, R-37, R-39), Intentionally deferred 1 (R-38), Superseded/obsolete 3 (R-07, R-08 as primary, R-12), Missing/unresolved **0**. Corrected 2026-10-16: R-22 moved to Carried forward (KERN-003 full inventory still open per Plan §F); R-19/R-40/R-41 given single primary dispositions (R-41 carries forward on its open PR-review + CI-residual follow-ups).
