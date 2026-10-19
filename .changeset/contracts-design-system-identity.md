---
"@xoroh/kern-contracts": minor
---

**BREAKING — component and block records carry design-system identity instead of the hardcoded Material provider.**

- `ComponentRecord.provider: "m3"` is replaced by `designSystem: DesignSystemId` (any kebab id, e.g. `"material-3"` — validated by shape, never by value).
- `ComponentRecord` gains optional `replaces` (a `renderer/name` registry key) and `dependencies.components` (same key shape).
- `BlockRecord` gains required `designSystem`.
- `CONTRACT_SCHEMA_VERSION` moves `1.0.0` → `2.0.0`; `schema.json` mirrors the new shapes.
- `provider.ts` (`PROVIDER_ID`, `defineProvider`) is unchanged and still tested; its removal is scheduled separately and is not part of this change.

> Bump note (release lane): was `major`; corrected to `minor` per
> `docs/conventions/changesets.md` ("While on 0.x, treat breaking changes as
> normal and land them as minors") and `docs/releases.md` (first release per
> package is `0.1.0`). A `major` on `0.0.0` would publish `1.0.0` — a
> stability promise this repo has not made.
