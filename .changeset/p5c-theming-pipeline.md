---
"@xoroh/kern-tokens": minor
---

Theming pipeline is explicit: seed → map → alias → component stages (`pipeline.ts`), a checked-in mode × contrast × preset matrix (`themes/matrix.json`, gated by `check:theme-matrix`), a shape-only `compact` density preset, and motion algorithms as validated data (`presets.ts`). No rendered value changes — existing schemes resolve byte-identically.
