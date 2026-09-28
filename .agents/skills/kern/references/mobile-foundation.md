# Mobile foundation

Why native is built the same way as web (behavior upstream, expression
owned) — and what "upstream" is on mobile.

## Why not react-native-paper

Paper is a full M3 implementation: opinionated components plus its own
theming API. Adopting it means adopting M3's *expression* — every Kern
difference (pills, flat chrome, sharp theme, custom roles) becomes a
theming-API workaround that the next Paper upgrade can break. Kern wants
M3's rules, not M3's look. Paper bundles both.

## What native uses instead

- **Simple components** (Button, Input, Text, …): self-owned on plain
  React Native + Kern tokens. No dependency, nothing to break.
- **Complex behavior only** (dialogs, sheets, selects, popovers):
  `@rn-primitives/*` — style-agnostic headless primitives, the mobile
  equivalent of Base UI / Radix. Behavior and a11y stay upstream;
  everything visible is Kern code.

## Adoption snapshot (2026-09)

`roninoss/rn-primitives`, MIT: ~940 stars, `@rn-primitives/portal`
~310k weekly downloads, actively maintained, and a hard dependency of
React Native Reusables (8.4k stars) — which needs it alive as much as we
do. Solid and growing; not Base-UI-scale. The scoped use (overlays only)
keeps the blast radius to a few tiny packages.

## Re-evaluation triggers

- Unmaintained 6+ months → vendor/fork the used primitives (small surface).
- React Native ships oklab/P3 color → revisit the native color compile.
- A backing-backed headless alternative appears → compare, don't chase.
