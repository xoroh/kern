# Plan — Branded feedback kit (web + native)

Status: done (2026-09-29) · log kept for revision

The branded loading/progress language — `BRAND_TRIO` shapes, `heritage` style,
tenant overrides, boot handoff — for `kern` (web) and `kern-native`, one
shared spec in `kern-theme`. Naming law: unprefixed, M3-canonical.

## Why

Kern today has functional `Loader`/`Progress`/`Skeleton`/`EmptyState` but none
of the system language: 9 loader styles, 6 feedback shapes, `BRAND_TRIO`,
`feedbackTiming`, `registerFeedbackVariant(tenantId, config)`, pre-JS critical
loader + `useAppReady` handoff, `BootIndicator`. Every app boots through this.

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Spec home | `packages/kern-theme/src/feedback.ts` — pure data + registry, both renderers consume |
| Names | M3 canonical, unprefixed: `CircularProgress`, `LinearProgress`, `LoadingButton` (M3 progress-indicator canon). No legacy or bridge names anywhere — hard cut |
| Styles shipped now | web: `spinner`, `dots`, `bar`, `shapes` (≈`heritage`); remaining 5 styles stubbed in spec, rendered later |
| Critical loader | web-only constants (`CRITICAL_LOADER_CSS/HTML`) + `useAppReady`/`markAppReady` in `kern` |
| Tenant registry | `registerFeedbackVariant`/`resolveFeedbackVariant` in the spec (module Map) |
| Mobile brand-kit | `MilestoneTrio`, `SuccessTransform`, `ShapeArt` — in `kern-native` |

## Shipped

1. Spec: `feedback.ts` + tests in `kern-theme`.
2. Web: `CircularProgress`, `LinearProgress`, `LoadingButton`, `BootIndicator`,
   `PageLoader`, `CRITICAL_LOADER_*`, `useAppReady`/`markAppReady`.
3. Native: mirror + `Shape` primitive; brand-kit trio.
4. Styles: `motion.css` keyframes (`kern-loader-{dot,bar,shape}`) generated
   from `feedbackTiming` (Biome-formatted output).

## Acceptance

- Both renderers resolve identical variants from one spec (snapshot test).
- Boot handoff works in `apps/site` and `apps/mobile`.
- Public surface contains only M3-canonical names.
