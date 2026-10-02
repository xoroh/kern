# Plan — Icon system (`@xoroh/kern-icons`)

Status: done (2026-09-29) · log kept for revision

A multi-set icon system: one normalized shape format, one renderer pair for
web and native, semantic aliases so shared meanings stay identical on every
surface. Optional package — component slots stay `ReactNode` (any icon
library keeps working) and installing icons is never required.

## Why (the two halves)

- **Half 1 — slots (shipped):** components never contain icons.
  `Button` / `Fab` / `ListItem` take `icon?: ReactNode` on both platforms.
  This is the freedom half and needs no decision — it exists.
- **Half 2 — this package:** one shared kit so web and mobile cannot
  diverge: (1) glyph data normalized to one filled-path format on a 24dp
  grid, read by both renderers; (2) `Icon` web + native twin with identical
  props; (3) 41 semantic aliases so shared meanings (`back`, `close`,
  `check`) resolve to one glyph on every surface.

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Ship icons? | Yes — standalone optional package; slots stay free |
| API shape | Name string: alias \| name \| `set:name` |
| Extensibility | Multi-set registry; add more icon systems over time for web + mobile |
| v1 sets | Multi-set model implemented; **Material Rounded only** shipped |
| Glyph coverage | Standard committed UI set (~1,340 Material glyphs) in one allowlist file; the full Material name union typechecks as input |
| BYO | Empty `assets/brand/` + `assets/sets/` drop-ins + `resolveIconPaint` raw paint |
| License | MIT package; Apache-2.0 attribution embedded for Material-derived data |
| Weight axis | `wght 400` only (opt-in resync path documented) |

Design guidance (skill rule, not code): one family for **UI chrome**
(Material Rounded). Extra sets are for content / branding / expression.

## Architecture

1. **Normalized shape format** — every set becomes `{ o: path, f?: path,
   r?: 'evenodd' }` per glyph on `0 0 24 24`, fill geometry only (the
   cross-platform parity guarantee). Stroke-only sets convert at set-build
   time or stay slot-based; fill-native sets drop in directly.
2. **One renderer pair** — `Icon` + `useIcon`; web = inline `<svg><path>`
   (SSR-safe), native = `react-native-svg`. Props: `name`, `set?`, `filled?`,
   `size?`, `color?` (`currentColor` default), `title?`, `testID?`. Sizes
   16/18/20/24/32/40/48 dp, default 24, touch target 48. Unknown name →
   `null` + one dev warn per name, never throws in render.
3. **Name resolution order** — `set:name` → that set · semantic alias →
   default-set-qualified target · unqualified name → default set (Material)
   · miss → `null`.

**Extension tiers:**

1. Drop-in set: any SVG collection in `assets/sets/<name>/` →
   `bun run icons:generate` → registered, typed set on both platforms.
2. Synced set: pinned upstream + sync adapter (Material in v1).
3. Slots (half 1): unchanged, no conversion needed.

## Package layout

```
packages/kern-icons/                  @xoroh/kern-icons — MIT
  src/
    core/
      types.ts                        shapes / sizes / weights / paint / manifest / props
      registry.ts                     registerIconSet, getIconSet, default set
      naming.ts                       resolveIconName (alias | name | set:name)
      semantic.ts                     41 aliases → material:qualified targets
      resolve.ts                      resolveIconPaint, getIconShape, size/weight/color
    render/
      Icon.tsx                        web
      Icon.native.tsx                 RN (export condition "react-native")
      useIcon.ts
    sets/material/
      source.json                     pin @material-symbols/svg-400@0.47.2, rounded, wght 400
      symbols.ts                      GENERATED input union (Material names)
      names.ts                        GENERATED committed names + guards
      manifest.ts                     GENERATED provenance / counts
      shapes/w400/{…}.ts              GENERATED letter chunks + index
    index.ts                          public surface
  tools/
    sync.ts                           set-aware sync (material adapter)
    generate.ts                       assets → registry (+ brand/brand-set statics)
    check.ts                          standards gate + platform boundary + regen-freshness
    lib/{svg,path,validate,catalog,emit,naming,config}.ts   dep-free
  config/
    kern-icon-set.txt                 committed allowlist
  assets/
    material/                         gitignored sync cache
    brand/                            EMPTY drop-in (custom marks)
    sets/                             EMPTY drop-in (custom sets)
  THIRD_PARTY/
    Apache-2.0.txt + NOTICE           attribution for Material-derived data
  README.md
```

## Out of scope

- Brand marks and product names — apps ship their own assets into
  `assets/brand/` or plain slots. No such assets ever enter this repo.

## Pipeline & CI

- Root scripts: `icons:sync` · `icons:generate` · `icons:check`
  (= standards gate + platform-boundary assert + regen-freshness byte-compare).
- `ci.yml`: `icons:check` step beside `check:kern`; commit coverage is CI's
  `git add -N` + diff gate.
- Regen must be byte-identical (no timestamps/host paths; sorted keys).
- Deps: peers `react`; optional peers `react-native` + `react-native-svg`.

## License

MIT. Path data derived from `@material-symbols/svg-400` (Apache-2.0) →
`THIRD_PARTY/Apache-2.0.txt` + `NOTICE`.

## Tests & verification

- 3 vitest suites: resolve/catalog integrity (registry), naming, path grammar.
- `icons:check` idempotent; typechecks; `build`; publint/attw; boundary assert.

## Deferred

Site / MCP icon wiring · per-icon tree-shakeable statics · second synced set ·
weights ≠ 400 · stroke-expansion converter.
