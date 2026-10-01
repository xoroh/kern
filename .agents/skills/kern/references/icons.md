# Icons

Status: shipped — `@xoroh/kern-icons` (optional package)

Use the Material Symbols Rounded family for UI chrome. Icon support is two
halves, and half one is the default:

1. **Slots (always):** Kern components never contain icons. Pass any icon
   node — `icon?: ReactNode` on web and native. Any icon library keeps
   working without installing Kern's.
2. **`@xoroh/kern-icons` (optional):** one shared kit so web and mobile
   cannot diverge — normalized filled-path geometry on a 24dp grid, an `Icon`
   component with identical props on both renderers, and semantic aliases so
   shared meanings resolve to one glyph on every surface.

## Usage

```tsx
import { Icon } from "@xoroh/kern-icons";

<Icon name="search" />; // default set (material)
<Icon name="back" />; // semantic alias → material:arrow_back
<Icon name="material:search" />; // qualified name
<Icon name="close" filled size={20} color="var(--md-sys-color-primary)" />;
```

- Sizes: `16 | 18 | 20 | 24 | 32 | 40 | 48` dp (or number), default 24.
  Icon-only actions need `title` (or `aria-label` on the control) and a 48dp
  target (`ICON_TOUCH_TARGET`).
- Color defaults to `currentColor` — pass a role var, never hardcoded hex.
- `filled` marks selected/active states (M3 semantics).
- Unknown name renders `null` with one dev warning; it never throws in render.
- Custom renderers: `resolveIconPaint({ name, filled, size, color })` →
  `{ d, fillRule, size, color, … }` (canvas, OG images, favicons).

## Multi-set tiers

1. **Presets:** Material Rounded ships as data (wght 400, fill pair).
2. **Drop-in set:** any SVG collection in `assets/sets/<name>/` →
   `bun run icons:generate` → registered, typed, both platforms.
3. **Synced set:** pinned upstream + sync adapter (see `config/source.json`).
4. **Brand marks:** drop SVGs into `assets/brand/` (ships empty) or render
   your own nodes in slots.

Contract is **filled outlines** (`{ o, f?, r? }` on `0 0 24 24`) — the
cross-platform parity guarantee (stroke rendering differs between DOM and RN
rasterizers). Stroke-only sets convert at set-build time or stay slot-based.

## Design rules

- One family for **UI chrome** (Material Rounded). Extra sets are for
  content, branding, and expression.
- Match icon size and visual weight to adjacent text and control density.
- Prefer 24dp standard; 20dp dense rows; 40/48dp display actions.
- Semantic color roles for status/action icons; category hues via the tone
  layer (`@xoroh/kern-tokens`), never one-off hex.
- Semantic aliases (`back`, `close`, `check`, …) are the unification table —
  add one only when a second surface shares the meaning.

## Pipeline

`bun run icons:sync` (pinned fetch) · `bun run icons:generate` (byte-identical
codegen) · `bun run icons:check` (standards gate + boundary + regen freshness —
wired into CI). Generated code is committed; staleness fails the build.
