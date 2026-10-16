# Kern ideas (not yet decided)

> Rule: the [roadmap](architecture/kern-axis-migration-and-roadmap.md) is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: living list. Date: 2026-10-16. Every entry carries one status: `idea`, `researching`, `accepted to roadmap with link`, or `rejected with reason`. Nothing here is planned work until an ADR moves it to the roadmap.

| Idea | Status | Notes |
| --- | --- | --- |
| AI chat UI primitives and components | accepted to roadmap with link | Placed by ADR [019](decisions/019-ai-chat-in-kern.md): styled chat parts and blocks live in Kern design systems, behavior models in Axis, voice deferred. |
| Component scope review: move design patterns out of Axis | accepted to roadmap with link | Decided by Axis ADR 006 (scope is primitives only; patterns move to Kern design systems), packaged per [017](decisions/017-per-system-packages.md). |
| Shared system-agnostic renderers (`@xoroh/kern-web` + `@xoroh/kern-native` with `@xoroh/kern` as a deprecated compat barrel, M3 as one preset among many) | rejected with reason | Rejected by ADR [017](decisions/017-per-system-packages.md): each design system owns its components — per-system preset package plus per-platform widget packages, no shared widgets across systems. See also [010](decisions/010-kern-m3-rename-and-no-global-registration.md). Source: `.reports/review-structure-scale.md` P0-1. |
| Unfreezing `kern-primitives` (move `libs/kern-primitives` to `packages/` as the home for cross-system shared behavior) | rejected with reason | Rejected by ADR [007](decisions/007-axis-native-foundation.md): `libs/kern-primitives` stays frozen and is dropped once Axis is release-ready — no unfreeze, no `packages/` home. Shared native behavior lives in Axis, web behavior in Base UI. Source: `.reports/review-structure-scale.md` P2-5 / Q8. |
| Renaming `@xoroh/kern` (e.g. `kern` → `kern-web` with a compat alias) | rejected with reason | Misreading of the Axis research R-1 rename: only `kern-material-3` is renamed to `kern-m3` (hard rename, no alias). `@xoroh/kern` is NOT renamed — it stays the M3 web widget package and just stops registering M3 globally, enforced by `check:layers`. Decided in ADR [010](decisions/010-kern-m3-rename-and-no-global-registration.md) and [020](decisions/020-no-backward-compat.md) (no compat aliases pre-publish). |

Rejected ideas stay listed above with their reason; nothing here is planned work until an ADR moves it to the roadmap.
