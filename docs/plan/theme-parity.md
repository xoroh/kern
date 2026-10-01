# Plan — Theme engine in `kern-theme`

Status: done (2026-09-29) · log kept for revision

The full theme engine under the naming law: variant registry, fail-loud
completeness, layer deltas for appliers. Pure TS in `kern-theme` — no React,
no DOM.

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Canonical surface | `resolveThemeLayers`, `defineVariant`/`registerVariant`/`getVariant`/`listVariants`, `assertCompleteScheme`, `varName`/`shapeVarName`, `schemeToCssVars` |
| Tenant variants | `registerVariant(id, overrides)` runtime registry + JSON presets stay static |
| Fail-loud | `assertCompleteScheme` exported; `getVariant` throws on unknown id |
| Scheme deltas | `resolveThemeLayers` returns `{ scheme, deltas }` for appliers |
| Contrast contract | unchanged: overlay deltas, `medium`/`high`, `check:contrast` gate |

## Shipped

- `packages/kern-theme/src/variants.ts`: runtime registry (module Map, fail-loud), deltas =
  changed roles only, CSS var emission.
- Tests: registry semantics, deltas, completeness assertions, unknown-id throws.

## Acceptance

- `registerVariant`/`getVariant` work with fail-loud semantics.
- `check:contrast` + existing tests stay green; + engine tests.
- No bridge names in any barrel.
