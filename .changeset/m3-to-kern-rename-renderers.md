---
"@xoroh/kern": minor
"@xoroh/kern-native": minor
---

M3 → kern rename, renderer layer (founder directive, board.md 2026-10-02).

Sits on the token-layer rename (`@xoroh/kern-tokens`: `themes/m3.json` →
`themes/kern.json`, `m3-elevation.ts` → `kern-elevation.ts`,
`check:m3` → `check:kern`). This covers everything the renderers referenced.

### Breaking, and the two kinds are not the same

**1. `themes.m3` is gone — there is no alias for this.**
The exported preset map's keys are now `kern`, `sharp`, `brand`. `themes.m3.x`
reads `undefined` (and is a type error). Use `themes.kern.x`.

**2. The `"m3"` theme id still works at RUNTIME but no longer type-checks.**
`LEGACY_ALIASES` maps `m3 → kern`, so `resolveThemeDetails("m3")` resolves
correctly. But `ThemeId` is now `"kern" | "sharp" | "brand"`, and
`CustomTheme.extends?: "kern"` — so `variant="m3"` compiles nowhere but a
`@ts-expect-error`. Treat the alias as a courtesy for existing published
consumers, not as an API to build on.

### Also renamed

- `check:m3` → `check:kern` in docs, conventions and changesets. The root
  script line is part of the token-layer changeset.
- `m3-gaps.test.tsx` → `kern-gaps.test.tsx`
- `mit-and-m3-guard.md` → `mit-and-kern-guard.md`
- `p2-1-m3-gap-fill.md` → `p2-1-kern-gap-fill.md`
- `variant-and-resting-elevation-m3-verification.md` →
  `variant-and-resting-elevation-kern-verification.md`
- The local `m3` binding in `web-theme.ts` → `kern`.

### Deliberately NOT renamed

The directive keeps "M3" wherever it is a genuine reference to the Google
Material 3 specification, and a blind sed across the 172 files that mention M3
would have destroyed exactly that:

- `m3.material.io/...` URLs (13 files) — spec references.
- `review-m3` (6 files) — an agent handle, not kern code.
- "M3 navigation bar", "M3 loading indicator", "Material 3"/"MD3" prose — M3
  *names* those components, so citing it is a spec reference.

### Parity figures moved with the components

Four native components landed in the same cycle (CheckboxGroup, Meter, Fieldset,
LoadingIndicator), so `check:parity` correctly rejected the stale figures:
**342 rows (web 248, native 94) · 58 shared · 24 native-only · 30 web-only.**
Web-only fell 33 → 30 — exactly the three web-only concepts this ladder closed.

Verified: native jest 208/208 · web vitest 273/273 · `check:parity`,
`check:primitives`, `check:layers`, `check:kern` PASS · typecheck PASS · lint
0 errors.