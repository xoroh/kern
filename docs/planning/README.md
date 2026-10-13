# Kern OSS transformation plan

Status: planning baseline — OSS transformation implementation and publication are **not authorized**. The separately authorized site redesign is complete.
Evidence date: 2026-10-13; inspected HEAD: `d5007b755106c7b3b7183293471381dec4aa139a` on `main` (ahead of origin by two commits), with substantial pre-existing uncommitted work. This plan describes the working tree, not a clean release candidate.

## Mission and direction

Make the existing system a complete, usable OSS platform; preserve useful capabilities, support web and React Native, package and source delivery, standalone and workspace consumers, and migrate Xoroh immediately when its foundation slice is ready. Material is the only design-system provider; Google's Material Symbols Rounded assets are the existing Material icon implementation. No second provider or icon marketplace is required.

Recommended architecture: keep the seven existing package names and renderer split; retain `@xoroh/kern/start` as an in-package composition subpath; add a small platform-free `@xoroh/kern-contracts` metadata/schema package; make provider identity `m3` explicit; keep the Kern authoring model canonical with mandatory, bidirectional DTCG interoperability **in Phase 2**, not later. Publish compiled component CSS and ordinary token CSS; do not require consumers to scan Kern's checkout. Make the presently private CLI independently distributable with a bundled, versioned source registry. Complete native source installation and safe upgrade handling before Preview release.

These are planning decisions, not claims that the APIs already exist. The authoritative register is [ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md). Existing [00-index.md](00-index.md) and `01-` through `09-` program notes remain intact as historical workstream context; this document set is the new OSS execution blueprint, not a replacement of their files.

## Read next

| Document | Purpose |
|---|---|
| [CURRENT_STATE.md](CURRENT_STATE.md) | Source evidence, audit reconciliation, measured failures |
| [TARGET_ARCHITECTURE.md](TARGET_ARCHITECTURE.md) | Package graph, responsibilities, public boundaries |
| [COMPONENT_AND_FEATURE_INVENTORY.md](COMPONENT_AND_FEATURE_INVENTORY.md) | Export/module inventory and preservation obligations |
| [FOUNDATIONS_AND_DTCG.md](FOUNDATIONS_AND_DTCG.md) | Canonical model, interchange, themes, output migration |
| [PROVIDERS_COMPONENTS_AND_ICONS.md](PROVIDERS_COMPONENTS_AND_ICONS.md) | Material identity, renderer contracts, icon behavior |
| [DISTRIBUTION_CLI_AND_REGISTRY.md](DISTRIBUTION_CLI_AND_REGISTRY.md) | Packages, source closure, blocks, upgrades, consumers |
| [AI_AND_MCP.md](AI_AND_MCP.md) | Machine metadata and truthful installation planning |
| [XOROH_MIGRATION.md](XOROH_MIGRATION.md) | Actual private imports, mapping, rollout, rollback |
| [QUALITY_AND_RELEASE_GATES.md](QUALITY_AND_RELEASE_GATES.md) | Existing commands versus tests that must be added |
| [ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md) | Decisions, alternatives, consequences, reversals |
| [IMPLEMENTATION_PHASES.md](IMPLEMENTATION_PHASES.md) | Ordered deliverables and the early migration branch |
| [MASTER_TODO.md](MASTER_TODO.md) | Stable, dependency-linked execution tasks |
| [RISKS_AND_OPEN_QUESTIONS.md](RISKS_AND_OPEN_QUESTIONS.md) | Remaining uncertainty and escalation rules |
| [AGENT_EXECUTION_GUIDE.md](AGENT_EXECUTION_GUIDE.md) | Safe execution, ownership, evidence, handoffs |

## Current phase and blockers

Current phase: **P0 planning**. No implementation task is completed by creating this plan. Begin with `KERN-001` through `KERN-006`; owner approval `KERN-007` unlocks architecture implementation. The task statuses intentionally remain Not started until an authorized executor records acceptance evidence.

Approval needed: the small contracts package and public CLI addition, release/namespace ownership, the approved default-versus-Xoroh theme policy, and product migration windows. Technical recommendations are resolved here; these approvals do not justify leaving naming, CSS delivery, DTCG, or native distribution unspecified.

Highest risks: red local gates; CSS's stale package import; MCP serving web source for native; a checkout-dependent CLI/MCP; source installs that can write before a late conflict; hundreds of legacy Xoroh imports and private shell/domain helpers. A concurrent site redesign means site-related results may move during this snapshot. Do not repair those files as part of planning.

## Completion and resumption

Planning completion means fifteen coherent documents, source-grounded inventories, explicit defaults, actionable dependency-linked tasks, and a truthful baseline. Implementation completion means all required capabilities preserved or explicitly mapped, DTCG round trips, web/native and source/package consumer tests, Xoroh product scenarios passing, and all release gates satisfied. Compilation alone is not migration acceptance.

After context loss: read this file, the decision register, current state, phases, then the relevant TODO tasks and domain document. Recheck Git state and dependencies; claim a bounded task before editing. Never reset, delete user changes, run mass formatting, invoke `check:cold` in this checkout, or publish without explicit authorization. Follow [AGENT_EXECUTION_GUIDE.md](AGENT_EXECUTION_GUIDE.md).

Planning verification: all fifteen requested files exist; local Markdown links resolve; 84 unique tasks have required fields, valid references and an acyclic dependency graph; phase/priority totals and twenty decision ids reconcile; new-file whitespace/code fences checked. `git diff --check -- docs/planning` was also run (untracked files separately inspected). Actual code checks and limitations are in CURRENT_STATE; no full build/consumer/device/release pass is implied.

## Owner direction and final handoff

The owner authorized the site redesign alongside this planning assignment, chose
Material 3's purple palette, and explicitly retained top-header navigation rather
than an app rail. The completed site's build, TypeScript, scoped lint, and full
21-test browser suite passed; see [site verification](../site-design.md).
These results do not make the package/product release gates green.

After planning, the owner explicitly requested committing **all current changes**,
including the pre-existing working-tree work, after verification and a secret
check. That authorization does not include pushing, publishing, implementing this
transformation, or modifying Xoroh. The owner subsequently authorized fixing the
existing elevation-audit commit blocker (without bypassing the hook), a bounded
exception rather than approval of the full transformation. The task backlog remains an implementation
roadmap, not a record of completed package transformation.
