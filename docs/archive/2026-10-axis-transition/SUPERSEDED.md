# Superseded plan notice

- Superseded file: `architecture/0.1.0-preview-redesign.md` (in this archive;
  originally `docs/architecture/0.1.0-preview-redesign.md`).
- Date superseded: 2026-10-16.
- Reason: the Kern–Axis transition replaces the preview-redesign program with
  a unified migration and roadmap plan. The old file's §10 modeled Axis as a
  standalone project with **no dependency in either direction** and an
  intended package name of **`xoroh-axis`** (`@xoroh/axis` only as a
  fallback). The new architecture instead extracts the approved primitives
  into Axis as **`@xoroh/axis`** and has Kern consume Axis through its public
  package interface. Task-level detail, phase gates, and inventory data in the
  old file are preserved here as evidence but are no longer authoritative.
- Replacement: `docs/architecture/kern-axis-migration-and-roadmap.md` — the
  single active source of truth. Deviations from the old plan and the owner
  approvals they require are recorded in its §I (decision register).
- Rule: do not implement from this archived file. Historical task states
  (`[x]`/`[!]`), verification claims, and §13 progress logs describe the
  pre-extraction repository and must be re-verified under the new plan.
