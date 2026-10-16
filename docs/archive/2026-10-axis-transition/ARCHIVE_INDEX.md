# Archive index — superseded Kern planning effort

Date archived: 2026-10-16.
Reason: replaced by the single authoritative plan
`docs/architecture/kern-axis-migration-and-roadmap.md`, which covers the
remaining Kern roadmap, the Kern–Axis extraction, Axis native-mobile package
readiness, Kern integration, and independent project operations.
Status of everything below: **historical evidence only. Must not be used as
active implementation instructions.**

## What was archived (49 files, moved with `git mv`, bodies byte-identical)

| Original path | Archive path |
|---|---|
| `docs/planning/00-index.md` | `planning/00-index.md` |
| `docs/planning/01-primitives.md` | `planning/01-primitives.md` |
| `docs/planning/02-components.md` | `planning/02-components.md` |
| `docs/planning/03-docs.md` | `planning/03-docs.md` |
| `docs/planning/04-blocks.md` | `planning/04-blocks.md` |
| `docs/planning/05-playground.md` | `planning/05-playground.md` |
| `docs/planning/06-foundations.md` | `planning/06-foundations.md` |
| `docs/planning/07-demos.md` | `planning/07-demos.md` |
| `docs/planning/08-correctness.md` | `planning/08-correctness.md` |
| `docs/planning/09-onboarding.md` | `planning/09-onboarding.md` |
| `docs/planning/AGENT_EXECUTION_GUIDE.md` | `planning/AGENT_EXECUTION_GUIDE.md` |
| `docs/planning/AI_AND_MCP.md` | `planning/AI_AND_MCP.md` |
| `docs/planning/APPROVALS.md` | `planning/APPROVALS.md` |
| `docs/planning/ARCHITECTURE_DECISIONS.md` | `planning/ARCHITECTURE_DECISIONS.md` |
| `docs/planning/AUDIT_REMEDIATION_REPORT.md` | `planning/AUDIT_REMEDIATION_REPORT.md` |
| `docs/planning/COMPONENT_AND_FEATURE_INVENTORY.md` | `planning/COMPONENT_AND_FEATURE_INVENTORY.md` |
| `docs/planning/CURRENT_STATE.md` | `planning/CURRENT_STATE.md` |
| `docs/planning/DISTRIBUTION_CLI_AND_REGISTRY.md` | `planning/DISTRIBUTION_CLI_AND_REGISTRY.md` |
| `docs/planning/FOUNDATIONS_AND_DTCG.md` | `planning/FOUNDATIONS_AND_DTCG.md` |
| `docs/planning/IMPLEMENTATION_PHASES.md` | `planning/IMPLEMENTATION_PHASES.md` |
| `docs/planning/INDEPENDENT_COMPLETION_AUDIT.md` | `planning/INDEPENDENT_COMPLETION_AUDIT.md` |
| `docs/planning/MASTER_TODO.md` | `planning/MASTER_TODO.md` |
| `docs/planning/NO_GO.md` | `planning/NO_GO.md` |
| `docs/planning/PREVIEW_NOTES.md` | `planning/PREVIEW_NOTES.md` |
| `docs/planning/PROVIDERS_COMPONENTS_AND_ICONS.md` | `planning/PROVIDERS_COMPONENTS_AND_ICONS.md` |
| `docs/planning/QUALITY_AND_RELEASE_GATES.md` | `planning/QUALITY_AND_RELEASE_GATES.md` |
| `docs/planning/README.md` | `planning/README.md` |
| `docs/planning/RISKS_AND_OPEN_QUESTIONS.md` | `planning/RISKS_AND_OPEN_QUESTIONS.md` |
| `docs/planning/TARGET_ARCHITECTURE.md` | `planning/TARGET_ARCHITECTURE.md` |
| `docs/planning/XOROH_MIGRATION.md` | `planning/XOROH_MIGRATION.md` |
| `docs/plan/README.md` | `plan/README.md` |
| `docs/plan/data-heavy-backlog.md` | `plan/data-heavy-backlog.md` |
| `docs/plan/feedback.md` | `plan/feedback.md` |
| `docs/plan/kern-icons.md` | `plan/kern-icons.md` |
| `docs/plan/kern-start.md` | `plan/kern-start.md` |
| `docs/plan/kern-tones.md` | `plan/kern-tones.md` |
| `docs/plan/native-composition.md` | `plan/native-composition.md` |
| `docs/plan/theme-parity.md` | `plan/theme-parity.md` |
| `docs/plan/web-extras.md` | `plan/web-extras.md` |
| `docs/architecture/0.1.0-preview-redesign.md` | `architecture/0.1.0-preview-redesign.md` |
| `docs/architecture/inventory-freeze.json` | `architecture/inventory-freeze.json` |
| `docs/architecture/per-file-decisions.json` | `architecture/per-file-decisions.json` |
| `KERN_ICONS_AUDIT_REPORT.md` (repo root) | `audits/KERN_ICONS_AUDIT_REPORT.md` |
| `KERN_PREVIEW_ARCHITECTURE_AUDIT.md` (repo root) | `audits/KERN_PREVIEW_ARCHITECTURE_AUDIT.md` |
| `KERN_THEMING_AUDIT_REPORT.md` (repo root) | `audits/KERN_THEMING_AUDIT_REPORT.md` |
| `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF.md` | `audits/KERN_ARCHITECTURE_AUDIT_HANDOFF.md` |
| `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF2.md` | `audits/KERN_ARCHITECTURE_AUDIT_HANDOFF2.md` |
| `docs/KERN_ARCHITECTURE_AUDIT_HANDOFF3.md` | `audits/KERN_ARCHITECTURE_AUDIT_HANDOFF3.md` |
| `docs/audits/kern-0.1.0-preview-full-audit-2026-10-15.md` | `audits/kern-0.1.0-preview-full-audit-2026-10-15.md` |

All paths above are relative to this directory
(`docs/archive/2026-10-axis-transition/`), except the "Original path" column,
which is relative to the repository root.

## Relationship between the archived effort and the new plan

- `planning/` (30 files) was the OSS-transformation execution blueprint:
  15 planning documents, `MASTER_TODO.md` (84 stable tasks KERN-001–084),
  audit remediation, risk and decision registers. Its task statuses
  (`[x]`/`[!]`/`[ ]`) describe the pre-extraction architecture and must be
  re-verified against the new plan — see the new plan §F.
- `plan/` (9 files) was the earlier per-topic roadmap tracker (recorded
  2026-09-29, reviewed 2026-10-01). All rows were `done` except row 11
  (site shell/scaffold docs page, `in progress`). Open row-11 work is carried
  in the new plan §F.
- `architecture/0.1.0-preview-redesign.md` was the sole execution authority
  from 2026-10-14 until this archive date. It is superseded — see
  `SUPERSEDED.md`. Its §10 (Axis extraction as a no-dependency standalone
  with intended name `xoroh-axis`) is explicitly overridden by the new plan
  (extraction with Kern consuming `@xoroh/axis`); the deviation and the owner
  approvals it requires are recorded in the new plan §I. The two JSON
  inventory overlays are preserved alongside it because later phases reuse
  their row-level data.
- `audits/` (7 files) are point-in-time audit evidence. Their defect lists
  remain useful as checklists; their verdicts and statuses do not transfer.

## Deliberately NOT archived (still live)

- `docs/adr/` (001–006) — active decision records; the new plan references
  ADR-002 (Base UI) and ADR-006 (distribution/DTCG) as standing authority.
- `docs/architecture.md`, `docs/components.md`, `docs/parity-contract.md`,
  `docs/platform-parity.md`, `docs/binding-contract.md`, `docs/releases.md`,
  `docs/versioning.md`, `docs/verification-limits.md`, family references,
  `docs/conventions/`, `docs/design-systems/` — live product documentation.
- `.team/briefs/`, `.team/reports/` — operational agent coordination notes,
  not part of the planning effort.
- `.changeset/*.md` — release history inputs; append-only, never rewritten.

## Exclusions

No identified planning file was excluded: every file matching
`docs/planning/*`, `docs/plan/*`, the preview-redesign authority plus its two
generated inventory overlays, the three root `KERN_*` audit reports, the three
`docs/KERN_ARCHITECTURE_AUDIT_HANDOFF*.md` working papers, and the full
preview audit under `docs/audits/` is preserved above.

## Known dangling references (follow-up for new-plan Phase 0)

These live files reference archived paths. They were intentionally left
untouched (changesets are immutable history; governance/skill docs are outside
planning scope). Phase 0 of the new plan repairs them:

- `SUPPORT.md:19`, `GOVERNANCE.md:18`,
  `.agents/skills/docs/references/change-routing.md:30` → `docs/plan/README.md`
- `.agents/skills/kern/references/mobile-foundation.md:50,58`,
  `apps/mobile/src/fonts.ts:4` (comment), `apps/mobile/App.tsx:22`
  (comment — found by audit 2026-10-16, not in the original list),
  `.changeset/native-composition-and-fonts.md:8` → `docs/plan/native-composition.md`
- `docs/conventions/documentation.md:36` → `docs/plan/` (directory)
- `docs/binding-contract.md:4` → `docs/planning/01-primitives.md`
- `scripts/codemod-xoroh-imports.mjs:13` (comment) → `docs/planning/XOROH_MIGRATION.md`
- Redirect stubs left at `docs/plan/README.md` and `docs/planning/README.md`
  keep the two most-referenced entry points resolving.
