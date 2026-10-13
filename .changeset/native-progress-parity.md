---
"@xoroh/kern-native": minor
---

Native `LinearProgress` at web parity: `wavy` (SVG sine at the 3×40dp platform geometry), `indeterminate` (two bars, 2s linear `Animated.loop`), `fourColor` (8s primary → primary-container → tertiary → tertiary-container), `buffer` wash, `value` now optional. Reduced motion holds mid-cycle positions via `useKernMotion().suppressSpatial`. Resolves the `@open` indeterminate item; `stop`/`buffer`/`wavy` ignored when indeterminate, mirroring web.
