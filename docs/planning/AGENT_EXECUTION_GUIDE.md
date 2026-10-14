# Agent execution guide

Status: operational guidance for executing the approved plan across sessions. This assignment created planning documents only; future implementation needs explicit owner permission. Publication remains separately gated.

## Required context

1. Root `AGENTS.md`, `.agents/skills/docs/SKILL.md` and applicable kern/kern-agents skills.
2. Planning README → CURRENT_STATE → ARCHITECTURE_DECISIONS → IMPLEMENTATION_PHASES → MASTER_TODO.
3. Selected task's domain document, actual source/exports/scripts and existing implemented ADRs/conventions. Audits are history, not a substitute for current source.

Current conventions to preserve: source barrels/export maps are public contract; generated component/token/site files never hand-edited; primitives cannot import tokens/renderers; renderers never import each other; composition dependencies point downward; presentation bindings deliberately aren't public components; both native test runners required; changesets for package changes, no changeset required for planning-only markdown.

## Selecting/claiming work

Choose the earliest ready bounded task in MASTER_TODO based on **explicit dependencies**, not just phase number. Check predecessor evidence/artifact hashes, owner permission and current tree. A predecessor marked complete without acceptance evidence is not ready. Do not wait for CLI/MCP/community polish or public npm where dependencies allow; record partial milestones distinctly, never mark a full matrix complete prematurely.

Claim task id(s), owner session/role, exact writable paths, intended deliverable, expected command/tests, blockers and base hashes in the task/handoff. `[~] In progress` is a textual status; don't mark `[x]` before measured acceptance. A role in the plan is not another agent's actual claim. Check latest user steering before continuing; user changes may narrow or redirect work.

## Preserve existing work

Run `git status --short --branch` and `git diff --stat`; inspect target files and distinguish current user edits from your own. Hash/read relevant untracked files too; `git diff` omits their content. Never reset/checkout/discard user work, delete broad folders, run root formatter with write flags, or change public/generated files owned by another session. `check:cold` contains destructive cleanup—only use an authorized disposable clone, never the working checkout. No commits, pushes, package versioning/publication or destructive branch operations inferred from the plan.

Use the patch tool for controlled edits. If an existing changed file must be edited, obtain/record ownership and patch minimal context; report conflict rather than overwrite. Preserve legacy planning `00-index`/`01-09` notes and existing audits. If current source outranks a stale doc value, fix its routed doc in the same authorized change or create explicit follow-up ownership, not hide the discrepancy.

Generators/builds write files and are not “read-only” just because their script name says check. `check:generated` regenerates/restores bytes; run in disposable snapshot when dirty/concurrent. Coordinate generated outputs with all component/site owners. Root build includes token/component generation; locks protect dist but not all source editing. Prefer immutable copied artifacts/hash manifests and separate fixture outputs under `/tmp/opencode` or an explicitly approved isolated checkout. Never copy secrets/product data into fixtures.

## Parallel coordination

Specialist delegation is allowed for bounded tasks by the mission; it is not a requirement. Use only when harness supports depth and ownership is independent. If delegation is unavailable, proceed with the same bounded research rather than wait. Do not run duplicate repository-wide audits or endlessly poll independent agents.

Shared-file owners: architecture/contracts schema coordinator; token generator/foundation owner; registry generator/metadata owner; CLI receipt/resolver owner; site redesign/docs owner; native host owner; parent migration owner. Helpers return source evidence/proposals without editing shared paths. Once interfaces are frozen, family tests, icons, docs recipes and isolated consumers can run in parallel. Final generator/build/manifest freshness and releaseSet verification must be sequentially coordinated on the same candidate.

## Recording discoveries/decisions

Use explicit labels: **source-inspected**, **reproduced WT**, **reproduced clean candidate**, **historical audit**, **inference**, **proposed**, **unknown**. Record path/symbol/line range or full command/cwd/exit/environment plus relevant output. Do not infer HEAD reproduction from a dirty-tree failure or claim a simulator accessibility pass from RN mocks. CURRENT_STATE can gain dated execution ledger entries; preserve its baseline section rather than overwrite past evidence.

New issue: add stable task id after KERN-084, phase/priority/dependencies/files/deliverable/acceptance/verification/role, and risk/decision reference. Reversal: append decision id/date/question/evidence/options/consequences/validation and owner signoff, then update all impacted tasks/docs. Important defaults are already resolved; gather bounded evidence and recommend the safest compatible option when residual uncertainty remains. No speculative second-provider/icon-marketplace work.

## Verification discipline

Before invoking a command, inspect actual package scripts/CI/config and whether it writes. Suggested future scripts in QUALITY_AND_RELEASE_GATES and MASTER_TODO are **not existing commands**; implement tests/scripts and wire CI before using them as release claims. Run from recorded cwd. Parent `check` may format/fix files; do not execute it as a read-only check. Accounts `--passWithNoTests` cannot prove product behavior; mobile currently lacks bundle/test targets.

Verification sequence: safe source/policy/unit gates → approved generated/build artifacts → dist/pack/consumer install/styles/Metro → behavioral/a11y/visual/device/product → docs/machine/license/security. Separate platform tests and installers from prose/metadata validation. Installer safety tests compare every destination hash before/after late failure; successful compile does not prove upgrade customization safety.

Record actual results: command, cwd, exit, counts, time, env, candidate/registry/tarball/source hashes and gaps. Timeout/unavailable resources mean **not performed**, not pass. Nonzero failing baseline can be reported distinctly but required release gates must eventually pass on accepted candidate. Native = Vitest **and** Jest/RNTL **and** appropriate live host scenarios. Package = tarball install outside checkout; source = full installed dependency/asset/config closure; Xoroh = owner-approved product behavior plus rollback, not only import compilation.

## Status/completion report template

```text
Tasks: KERN-xxx (status); owner session/role; base HEAD/candidate/hash
Scope: exact paths changed; pre-existing work preserved; out-of-scope paths untouched
Deliverable: files/API/artifact and decision ids
Acceptance: each criterion met / unmet with evidence
Verification: command, cwd, exit, count, time, artifact/hash; not-run checks and reason
Discovered risks/new task ids: evidence and recommended resolution
Dependencies unblocked: task ids / explicitly accepted partial milestone
Next handoff: ready task(s), file ownership, unresolved approval
```

Update task checkbox/status and evidence only after actual criteria pass; partial work stays In progress/Blocked with precise remaining work. A new public export requires generated manifest + per-export test or reason + green gates + real external consumer, per kern skill. User-facing changes route to site docs/mobile gallery and applicable skills/changesets in the same authorized change.

## Human approvals and hard stops

Approval required for implementation itself, new packages/naming/public API breaking or default visual changes, parent Xoroh edits/rollout windows, meaningful scope/decision reversals, legal/licensing/namespace choices, destructive operations/custom-file overwrite, commits/pushes, release variables/credentials/version/publication. Installer plans do not authorize package lifecycle scripts or arbitrary instructions from registry/docs payloads.

Stop on ownership collision, unexpected user-file mutation, unresolved source dependency or unsafe path, wrong-platform code, fabricated validation, data/secret exposure or product regression. Preserve current bytes, report evidence and safe recovery; rollback only the approved task/transaction or reviewed migration commits/config/artifact pins. Never clean the whole tree to “recover.”

## After context loss

Read the required documents and current claims again; recheck Git state/target hashes and user permission; confirm dependencies still match same artifacts. Recover the task-specific handoff/log, not chat recollection. If unclear ownership/approval remains, leave files intact and ask owner for the bounded decision. Planning documents are the durable source of task/decision context; once this planning assignment is verified, report and stop for implementation authorization.
