---
"@xoroh/kern-tokens": minor
"@xoroh/kern": minor
"@xoroh/kern-native": minor
---

Foundations-first M3 coverage: dynamic color as a seed configurator and the expressive motion runtime.

- **`@xoroh/kern-tokens`**: `themeFromSeed(seed, id, { secondarySeed?, tertiarySeed? })` turns one hex into a contrast-validated `CustomTheme` (primary + secondary + tertiary families, both modes, following the checked-in brand pattern; fail-loud via `defineThemePreset`). Motion runtime: `resolveMotionScheme()` (`standard` / `expressive` / `reduced`), `springConfig()` stiffness/damping pairs for `Animated.spring`, `motionCssVars()` inline overrides, `prefersReducedMotion()`. Additive only — no rendered value changes.
- **`@xoroh/kern`**: `applyKernTheme` / `useKernTheme` accept an opt-in `motion` algorithm (sets `data-kern-motion` + easing vars); `themeFromSeed` re-exported for one-call custom themes.
- **`@xoroh/kern-native`**: `useKernMotion()` hook + motion helper re-exports. Seed themes work today via `KernThemeProvider variant={themeFromSeed(...)}`.

Not in this change (next batches): per-component migration to scheme vars, dial time-picker, native `popover`/`combobox`, native wavy/indeterminate progress, 35-shape art kit, XR documentation.
