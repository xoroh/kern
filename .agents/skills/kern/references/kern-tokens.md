# Kern Tokens — the MD3 role mapping

Kern is founded on Material Design 3. This file maps every MD3 `md.sys` role to its Kern value. Read the MD3 canon in the sibling `references/*` files for structure and rules; read **this** file to translate that structure into Kern's expression. The canonical token values live in `packages/kern-tokens/src/tokens.json`, exposed as `tokens.ts` (re-exported by `@xoroh/kern/tokens`) and `tokens.css`, both generated from that source.

Kern keeps MD3's **roles, color system, pairing rules, adaptive layout, and accessibility**. The chrome base is neutral (black / white / gray); functional color is used the way M3 prescribes it (Kern blue secondary for links, focus, and active accents; error / success / warning / info for status). Kern overrides MD3's **defaults** in expression only: no dynamic color, 9999px pills, Inter, and utility-only motion.

> **Deliberate M3 deviation (mirrored in the design source):** Kern Primary is pure black (`#000000` light / `#FFFFFF` dark), NOT M3 blue. Blue lives in the Secondary role (`#2563eb` light / `#60a5fa` dark). Surfaces are flat neutral with no tint and no off-white — cards pure white. Tertiary is neutral gray (no teal in chrome).

> **Step scale law:** ramps run 11 steps (`50–950`); pure endpoints sit outside ramps as `1000` (black) / `0` (white). Tonal rows carry endpoints (13 cells); the Spectrum reference panel shows source-native 10 steps (`50–900`). Code palettes are 11 keys; endpoints are literals.

---

## 1. Color roles → Kern values

Every fill uses its matching `on-*` color. Never pair outside these pairs.

### Light scheme

| MD3 role | Kern value | Notes |
|----------|-----------|-------|
| `primary` | `#000000` | Pure black — links use Secondary blue; primary is reserved for buttons/active chrome (M3 deviation) |
| `on-primary` | `#ffffff` | Text/icons on black |
| `primary-container` | `#E5E5E5` | Tonal gray fills (selected states, highlights) |
| `on-primary-container` | `#000000` | Text/icons on tonal gray |
| `secondary` | `#2563eb` | Kern blue — links, focus rings, active accents |
| `on-secondary` | `#ffffff` | |
| `secondary-container` | `#dbeafe` | Tonal blue fills (e.g. nav rail indicator) |
| `on-secondary-container` | `#1e3a8a` | |
| `tertiary` | `#737373` | Neutral gray by intent — hue lives in secondary + status roles |
| `on-tertiary` | `#ffffff` | |
| `tertiary-container` | `#F5F5F5` | |
| `on-tertiary-container` | `#171717` | |
| `error` | `#dc2626` | Kern red — validation, danger actions |
| `on-error` | `#ffffff` | |
| `error-container` | `#fee2e2` | Light error fill (validation banners) |
| `on-error-container` | `#7f1d1d` | |
| `success` | `#15803c` | Kern green — healthy/go states (AA on white; small text: green-900 `#14532d`) |
| `on-success` | `#ffffff` | |
| `success-container` | `#dcfce7` | |
| `on-success-container` | `#14532d` | |
| `warning` | `#a16207` | Kern yellow — caution (small text: yellow-900 `#713f12`) |
| `on-warning` | `#ffffff` | |
| `warning-container` | `#fef9c3` | |
| `on-warning-container` | `#713f12` | |
| `info` | `#2563eb` | Same hue as secondary — neutral information |
| `on-info` | `#ffffff` | |
| `info-container` | `#dbeafe` | |
| `on-info-container` | `#1e3a8a` | |
| `surface` | `#ffffff` | Cards, sheets, menus |
| `on-surface` | `#262626` | Primary text/icons |
| `on-surface-variant` | `#525252` | Secondary text, labels, muted foreground |
| `surface-container-lowest` | `#ffffff` | |
| `surface-container-low` | `#FAFAFA` | Subtle fills, menu outer shells |
| `surface-container` | `#f5f5f5` | Role value; also the page canvas |
| `surface-container-high` | `#e5e5e5` | |
| `surface-container-highest` | `#d4d4d4` | |
| `surface-dim` | `#d4d4d4` | |
| `surface-bright` | `#ffffff` | |
| `outline` | `#d4d4d4` | Interactive boundaries |
| `outline-variant` | `#e5e5e5` | Dividers, subtle card outlines |
| `inverse-surface` | `#000000` | Snackbars, tooltips |
| `inverse-on-surface` | `#ffffff` | |
| `inverse-primary` | `#dbeafe` | Actionable text on inverse surface |

### Dark scheme

| MD3 role | Kern value |
|----------|-----------|
| `primary` / `on-primary` | `#FFFFFF` / `#000000` |
| `primary-container` / `on-primary-container` | `#262626` / `#FFFFFF` |
| `secondary` / `on-secondary` | `#60a5fa` / `#172554` |
| `secondary-container` / `on-secondary-container` | `#1e3a8a` / `#dbeafe` |
| `tertiary` / `on-tertiary` | `#A3A3A3` / `#000000` |
| `tertiary-container` / `on-tertiary-container` | `#404040` / `#FFFFFF` |
| `error` / `on-error` | `#f87171` / `#450a0a` |
| `error-container` / `on-error-container` | `#7f1d1d` / `#fecaca` |
| `surface` / `on-surface` | `#000000` / `#ffffff` |
| `on-surface-variant` | `#d4d4d4` |
| `surface-container-lowest` | `#000000` |
| `surface-container-low` | `#0a0a0a` |
| `surface-container` | `#171717` |
| `surface-container-high` | `#171717` |
| `surface-container-highest` | `#262626` |
| `surface-dim` / `surface-bright` | `#000000` / `#262626` |
| `outline` / `outline-variant` | `#737373` / `#262626` |
| `inverse-surface` / `inverse-on-surface` / `inverse-primary` | `#ffffff` / `#000000` / `#000000` |

**Not used in Kern:** dynamic color (`dynamicLightColorScheme`, content-based seeds) and the fixed-accent role group. Kern's seed is fixed: a neutral chrome base with M3 functional color.

## Neutral vs neutral-variant (Kern law)

M3 separates them by chroma; Kern keeps both achromatic and separates by **value**: `variant(step) = neutral(step − 1)` — variant is always one stop darker than the ground it sits on. Neutral owns surfaces + primary text; variant owns outlines, dividers, secondary text. No tint anywhere, so the rule needs no judgment calls.

## Contrast modes (medium / high)

All four contrast modes are specified (light/dark × medium/high); rules in `theming-and-dynamic-color.md` § High Contrast. Headline values: medium pushes text roles to pure black/white and outlines to `#545454`/`#a3a3a3`; high flattens surfaces (white/black) with pure `#000000`/`#ffffff` outlines. Standard pairings above are the default; never pair outside them at any contrast level.

> Dark scheme: same ramp, mirrored assignments (see table). Both schemes match the TS tokens exactly.

---

## 2. Typography → Inter

Kern uses **Inter** for every MD3 typeface role (both `brand` and `plain`). The MD3 5-category scale still applies; Kern's common roles:

| MD3 style | Inter size / weight | Kern usage |
|-----------|--------------------|------------|
| Headline Small | 24px / 600 | Page hero (rare) |
| Title Large | 20px / 600 | Page title (`text-xl font-semibold`) |
| Title Medium | 16px / 600 | Section heading, card title |
| Body Large | 16px / 400 | Text field input |
| Body Medium | 14px / 400 | Body / UI text (`text-sm`) |
| Label Large | 14px / 500 | Buttons, nav items, chips |
| Body/Label Small | 12px / 400–600 | Captions, labels |
| Label Small | 11px / 600 | Micro / chip text — uppercase + tracking for category labels |

Font smoothing: `-webkit-font-smoothing: antialiased`. Reserve uppercase + wide tracking (`tracking-[0.2em]`) for category/section markers only.

---

## 3. Shape → Kern corners

| MD3 token | Value | Kern usage |
|-----------|-------|-----------|
| `none` | 0px | — |
| `extra-small` | 4px | — |
| `small` | 8px | **Cards** (`rounded-lg`) |
| `medium` | 12px | **Dropdowns / menus / popovers** (`rounded-xl`) |
| `large` | 16px | Large surfaces / sheets |
| `large-increased` | 20px | Card-group rows (`rounded-[20px]`) |
| `extra-large` | 28px | Dialogs, sheets |
| `extra-large-increased` | 32px | Large dialogs |
| `extra-extra-large` | 48px | Full-screen sheets |
| `full` | 9999px | **All interactive elements** — buttons, chips, nav items, pills, toolbar buttons |

No shape morphing. Interactive elements are always `full`.

---

## 4. Elevation → M3 levels, dp heights, component mapping

Kern uses M3's elevation system as prescribed: tonal surfaces plus the 5-level shadow ramp. Resting chrome stays flat (tonal ladder only); shadows render per level on floating layers. Shadows render per level (black, two-layer). Hover/focus lifts exactly one level. Code: `elevation.level1–level5` (+ `elevationDp` heights). Surface roles are decoupled from levels — levels set stacking/interaction, roles set containment; overlapping areas must differ.

| Level | dp | Shadow | Use cases |
|-------|----|--------|-----------|
| `level0` | 0dp | none | Page, lists, filled buttons, cards at rest, tabs |
| `level1` | 1dp | `0px 1px 2px + 0px 1px 3px` | Elevated cards/sheets, banners, chips |
| `level2` | 3dp | `0px 1px 2px + 0px 2px 6px` | Menus, nav bar, scrolled app bar, toolbars, tooltips |
| `level3` | 6dp | `0px 1px 3px + 0px 4px 8px` | FAB, dialogs, dropdowns, date/time pickers, search |
| `level4` | 8dp | hover/lift states | Hovered/focused level-3 elements |
| `level5` | 12dp | dragged/emphasized | Dragged elements (resting max is 3; 4–5 are interaction-only) |

---

## 5. Motion → utility only

Use MD3 **standard** easing for state changes; skip the expressive/spring system and all decorative animation.

| Token | Value | Use |
|-------|-------|-----|
| easing | `cubic-bezier(0.2, 0, 0, 1)` (standard) | Hover, focus, open/close |
| duration | `100–200ms` | Keep it fast; operators don't wait |

No shape morphing, no spring physics, no bounce, no entrance animation on content.

---

## 6. CSS token bridge

Kern ships two token vocabularies. Author against either; keep them in sync.

- **MD3 roles:** `--md-sys-color-*`, `--md-sys-shape-corner-*`, `--md-sys-typescale-*` (portable MD3 layer).
- **Kern app tokens:** `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--destructive`, `--radius`, plus the `--sidebar*` set (`--sidebar`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, and their `-foreground` pairs). Each is a `var(--md-sys-*)` alias generated into `tokens.css` — they carry no values of their own.

## 7. Theme system

Values live in `packages/kern-tokens/src/` (`tokens.json` source → `tokens.ts` + generated `tokens.css`); the **mechanism** is `resolveThemeDetails(mode, contrast, variant)` in `resolve.ts`, with role tables in `themes/kern.json` and override-only presets (`sharp`, `brand`, `compact`) catalogued in `themes/index.json`. The stages are named in `pipeline.ts` (`seedStage` / `mapStage` / `aliasStage` / `componentStage`), and every mode × contrast × preset context is flattened into the checked-in `themes/matrix.json` (`check:theme-matrix` holds it in sync — read it before running the app to review a preset). `applyKernTheme()` + `useKernTheme()` (web) live in `packages/kern/src/web-theme.ts`; `KernThemeProvider` + `useKernScheme()` (native) live in `packages/kern-native/src/theme.tsx`. Web projects the table as CSS vars (`@xoroh/kern/theme` stylesheet + `.dark` class); native resolves the same table to objects. Both take the identical `(mode, contrast, variant)` triple, so one selection renders identically on both. Full architecture: [`theming-and-dynamic-color.md`](theming-and-dynamic-color.md); authoring: [`theme-variants.md`](theme-variants.md).

The app-token bridge mirrors the same roles. Mapping:

| Kern app token | MD3 role |
|----------------|----------|
| `--background` / `--foreground` | `surface` / `on-surface` |
| `--card` | `surface` |
| `--primary` / `--primary-foreground` | `primary` (`#000000` pure black) / `on-primary` |
| `--secondary` / `--muted` / `--accent` | `surface-container-high` (neutral tonal fills) |
| `--muted-foreground` | `on-surface-variant` |
| `--border` | `outline-variant` |
| `--destructive` | `error` |
| `--radius` | `shape-corner-small` (cards) |
