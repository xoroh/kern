# @xoroh/kern-icons

Material Symbols icon registry with web and React Native renderers.

Icons ship as a committed TypeScript registry: every glyph is a `d` string
already re-based onto the canonical `0 0 24 24` grid, so a renderer emits one
`<path>` element and never scales, translates, or fetches anything at runtime.

```tsx
import { Icon, SEMANTIC_ICONS, registerIconSet } from "@xoroh/kern-icons";

<Icon name="search" />;
<Icon name="menu" filled size="large" title="Open navigation" />;
<Icon name="material:arrow-back" />;
```

## Naming

`name` accepts four shapes, all compile-time checked:

| Form | Example | Meaning |
| ---- | ------- | ------- |
| semantic alias | `back` | one pinned glyph per meaning |
| glyph name | `arrow_back` | upstream Material Symbols (snake_case) |
| canonical name | `arrow-back` | committed registry name (kebab-case) |
| qualified name | `material:search` | `set:name` |

Resolution order: `set:name` → that set · semantic alias → its pinned target ·
unqualified name → the requested or default set · miss → `null` (plus one dev
`console.error` per unknown name).

## Sets

The default set (`material`) is registered at load. Additional sets are named
bags of shape data:

```tsx
import { registerIconSet, type IconSet } from "@xoroh/kern-icons";

registerIconSet("acme", acmeSet);
<Icon name="acme:logo" />;
```

## Renderers

- `Icon` — web: inline `<svg><path>`, SSR-safe, `currentColor` by default
- `Icon` (react-native condition) — `react-native-svg`
- `useIcon` — hook-form paint resolution for custom renderers

`filled` marks selection and active navigation (M3), and defaults to `false`.
Sizes are `16 | 18 | 20 | 24 | 32 | 40 | 48` (default `24`); interactive
icon buttons get a `48`dp touch target (`ICON_TOUCH_TARGET`).

## Pipeline

```bash
bun run sync      # fetch the pinned Material Symbols tarball (cached, offline afterwards)
bun run generate  # emit src/sets/** from the local assets (deterministic)
bun run check     # SVG standards, 24-grid bounds, platform boundary, regen freshness
```

The upstream extraction is pinned in `config/source.json` and the shipped
subset is curated in `config/kern-icon-set.txt`. Path data is derived from
Material Symbols — see `THIRD_PARTY/` for the Apache-2.0 terms and the
`NOTICE` attribution.
