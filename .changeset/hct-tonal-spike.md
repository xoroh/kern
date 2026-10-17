---
"@xoroh/kern-tokens": minor
"@xoroh/kern-m3": minor
---

HCT tonal engine cutover for Kern M3 (ADR-021, superseding ADR-016):
- `@xoroh/kern-tokens`: `hct` module backed by `@material/material-color-utilities`
  with 0–100 tonal ramps (`hctTonalRamp`), HCT key colors (`hctKeyColor`),
  and full-scheme role mapping (`hctSchemeRoles` via `SchemeTonalSpot` with
  custom secondary/tertiary seed support).
- `@xoroh/kern-m3`: `themeFromSeed` cuts over to HCT as primary tonal
  engine; removes legacy OKLCH path for M3 with no backward-compatibility
  fallbacks (ADR-020). Resolves full 45 M3 spec roles with golden tests against
  reference output.
