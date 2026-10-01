---
"@xoroh/kern-native": patch
---

Split `bottomSheetSurface` out of `sheet-surface.tsx` — step 2 of the ratified
`kern-primitives` extraction order.

`SheetSurface` is the first candidate for extraction into the primitives layer,
whose gate forbids importing `kern-tokens`. It shared a file with
`bottomSheetSurface`, which reads `scheme.color.surfaceContainerLow`, the XL corner
radii and the `space-*` ramp — so extracting the file as it stood would have put
a theme-coupled export inside the first extraction step, and the gate would have
failed on arrival instead of proving the boundary.

`bottomSheetSurface` moves to `components/bottom-sheet-surface.ts`. **No public API
change**: the barrel still exports both, from their new homes. No behaviour, prop,
token, or rendering change.

**Two things the split surfaced, both recorded in the new file's header:**

1. **A single-file gate is not enough.** The obvious home was
   `utils/overlay-styles.ts`, but `SheetSurface` already imports `overlayStyles`
   from there, so putting the theme-coupled function in that module made the
   dependency **transitive** — `sheet-surface` → `overlay-styles` → `kern-tokens`.
   The source file would have looked clean while its dependency graph still crossed
   the gate. `overlayStyles` is also shared by eleven components, so it cannot be
   moved. The new file is a leaf with one importer precisely so the dependency is
   direct and visible. **`check:primitives` must therefore walk the import graph,
   not grep a file** — a per-file check passes here, which is why this is called
   out rather than discovered later.

2. **`SheetSurface` is still transitively coupled, one level down.** It renders a
   `Text` glyph for the close affordance, and `text.tsx` reads
   `tokens.typography` for the type scale and font weight. That is a real visual
   decision, so the component is not extraction-ready yet even with a clean
   source file. It becomes ready when the close affordance takes its label from a
   prop instead of a themed `Text` — a small API change, and better design anyway:
   a close button's appearance is the caller's business.

Verified: `typecheck` PASS · `test:jest` PASS · native vitest PASS. Biome clean on
both touched files.

No extraction performed here — this is the enabling split only, per the ratified
order (gate → `useControllableState` → split → surfaces).
