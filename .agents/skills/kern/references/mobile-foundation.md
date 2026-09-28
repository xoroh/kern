# Mobile foundation

What native is built on: self-owned components on plain React Native +
Kern tokens, with `@rn-primitives/*` for complex behavior only
(dialogs, sheets, selects, popovers). Behavior and accessibility stay
upstream; everything visible is Kern code.

Simple components take no dependency and cannot break upstream. The
primitives surface is a few tiny packages — forkable if ever needed.

## Adoption snapshot (2026-09)

`roninoss/rn-primitives`, MIT: ~940 stars, `@rn-primitives/portal`
~310k weekly downloads, actively maintained, and a hard dependency of
React Native Reusables — shared incentive to keep it alive.

## Re-evaluation triggers

- Unmaintained 6+ months → vendor/fork the used primitives.
- React Native ships oklab/P3 color → revisit the native color compile.
