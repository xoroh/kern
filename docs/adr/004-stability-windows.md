# 004. 1.0 stability carve-out (hard cuts before 1.0; deprecation window from 1.0)

Status: proposed (pending founder sign-off — R8 batch, drafted 2026-10-04)

## Context

Pre-1.0 (`0.x`) kern moves fast: exports are renamed, removed, or reshaped with no
compatibility promise — everything is `0.0.0` and every maturity chip reads Preview.
Enterprise consumers will not adopt past evaluation without a named stability promise
that starts at a named version. The promise must therefore draw a hard line at `1.0.0`:
unlimited velocity before it, a contracted deprecation discipline after it.

## Decision

**Before 1.0, removed means deleted: no shims, no aliases.** From `1.0.0`, breaking
changes ship only as majors with a **one-minor deprecation window**: the old export stays
(deprecated, documented) for one minor, then is removed. Every breaking change ships
migration notes in the changeset body (what retired, what replaces it, codemod if one
exists). `check:publish` + `changeset status` remain gates; the deprecation window is
enforced by review, not by a gate.

## Consequences

- Pre-1.0 work (including the P3 `./start` split and any R10 gap-component landings)
  may delete and rename freely — but every such change must still ship migration notes,
  because 1.0 consumers will read the changelog, not the commit history.
- From 1.0.0, any PR that removes or renames a public export without a
  deprecation-window changeset fails review even when all gates are green.
- Reviewers (`review-lead`, `review-m3`) gain a version-aware rule: pre-1.0 they check
  that removals are total (no leftover shims/aliases); post-1.0 they check that removals
  are absent without a window.
- No LTS before 1.0 — `0.x` is unstable by definition (LTS window is the companion
  `docs/releases.md` section, same R8 draft).
