# Consolidate decision records into docs/decisions/ — report

Date: 2026-10-16. Branch: `docs/consolidate-decisions` (from `origin/main`).
Scope: docs-only. No publish, no version bumps, no tags, no changeset (docs-only change per `docs/conventions/changesets.md`).

## What changed

- `git mv docs/adr/001–006` → `docs/decisions/001–006` (byte-identical; numbers preserved, so no clashes with the existing `decisions/007–020` — one continuous 001–020 record).
- Merged `docs/adr/007-no-backward-compat-pre-1.0.md` and `docs/decisions/020-no-backward-compat.md` into a single canonical `docs/decisions/020-no-backward-compat.md`: keeps the 004 relationship, the pre-1.0 operationalization, the first-sweep pattern, the D-BUTTON-NAMES / D-URLS consequences and the expiry clause, plus the 020 "applies to everything" line (008 redirects dropped, 010 no alias, 014 hard cut). Records the merge provenance inline.
- Removed the now-empty `docs/adr/`.
- Link sweep (every live reference; archive history and `.team/` scratch intentionally untouched — prose history stays correct per the `check:stale-refs` contract):
  - `docs/decisions/README.md` — single canonical index 001–020, old `../adr/` line removed.
  - `docs/README.md` — Decisions section rewritten to `decisions/` with a full 001–020 table.
  - `docs/VISION.md` — past-decisions line points at `decisions/` only.
  - `docs/architecture.md` — `decisions/005-theming-pipeline.md`.
  - `docs/conventions/documentation.md`, `GOVERNANCE.md`, `SUPPORT.md`, `.agents/skills/docs/references/change-routing.md` — `docs/decisions/`.
  - `scripts/check-generated-census.mjs` — comment reference updated to `docs/decisions/003`.
  - Roadmap verified: only numeric `ADR-00N` refs (002, 006, 001), still valid — numbers preserved, no path links to fix.
  - `AGENTS.md` and root `README.md` verified — already point at `docs/decisions/`, no change needed.
- `docs/IDEAS.md`:
  - Direction rule now links the roadmap (`architecture/kern-axis-migration-and-roadmap.md`).
  - Three explicit `rejected with reason` rows: shared system-agnostic renderers (→ 017, source review-structure-scale P0-1); unfreezing `kern-primitives` (→ 007, source P2-5/Q8); renaming `@xoroh/kern` / Axis R-1 misreading — only `kern-material-3` → `kern-m3`, `@xoroh/kern` is NOT renamed (→ 010 + 020).

## Verification

- `check:stale-refs` — pass (no dead rules).
- `check:workflow` — pass (all gates wired).
- `check:generated-freshness`, `check:generated:census` — pass.
- Relative-link resolver over all edited files — every link resolves. (Two stale links in `docs/architecture.md` — `plan/native-composition.md`, `kern-start.md` — are pre-existing on `origin/main` and untouched by this change.)
- Site `check:docs` chain — all gates pass EXCEPT `extract-prop-names.test.mjs` ("union member-only props are collected (Chip shape)", 5s timeout). Reproduced on clean `origin/main` with this branch stashed: pre-existing, unrelated to this docs-only change. Recorded here so the PR reviewer does not need to re-bisect.

## Follow-ups (not this PR)

- The pre-existing `extract-prop-names` timeout and the two stale `docs/architecture.md` links belong to their owning lanes.
