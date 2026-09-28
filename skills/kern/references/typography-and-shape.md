> **Kern note:** MD3 canon for type, shape, elevation, and motion. Kern overrides: **Inter** replaces Roboto for all typeface roles; interactive elements use `full` (9999px), cards `small` (8px), dropdowns `medium` (12px); elevation is flat + a single whisper shadow; motion is utility-only (standard easing, ≤200ms). See [`kern-tokens.md`](kern-tokens.md).

# MD3 Typography, Shape, Elevation, and Motion

Reference for Material Design 3's visual token systems beyond color.

## Typography

### Type Scale

MD3 uses 15 baseline styles + 15 emphasized styles organized in 5 categories (Display, Headline, Title, Body, Label) with 3 sizes each (Large, Medium, Small).

#### Baseline Type Scale (Default Values)

> **Kern:** substitute `Inter` for the `Roboto` font column below; the sizes/weights/line-heights carry over.

| Style | Font | Weight | Size (sp) | Size (rem) | Line Height | Tracking |
|-------|------|--------|-----------|------------|-------------|----------|
| Display Large | Roboto | 400 | 57 | 3.5625 | 64sp / 4rem | -0.25px |
| Display Medium | Roboto | 400 | 45 | 2.8125 | 52sp / 3.25rem | 0 |
| Display Small | Roboto | 400 | 36 | 2.25 | 44sp / 2.75rem | 0 |
| Headline Large | Roboto | 400 | 32 | 2 | 40sp / 2.5rem | 0 |
| Headline Medium | Roboto | 400 | 28 | 1.75 | 36sp / 2.25rem | 0 |
| Headline Small | Roboto | 400 | 24 | 1.5 | 32sp / 2rem | 0 |
| Title Large | Roboto | 400 | 22 | 1.375 | 28sp / 1.75rem | 0 |
| Title Medium | Roboto | 500 | 16 | 1 | 24sp / 1.5rem | 0.15px |
| Title Small | Roboto | 500 | 14 | 0.875 | 20sp / 1.25rem | 0.1px |
| Body Large | Roboto | 400 | 16 | 1 | 24sp / 1.5rem | 0.5px |
| Body Medium | Roboto | 400 | 14 | 0.875 | 20sp / 1.25rem | 0.25px |
| Body Small | Roboto | 400 | 12 | 0.75 | 16sp / 1rem | 0.4px |
| Label Large | Roboto | 500 | 14 | 0.875 | 20sp / 1.25rem | 0.1px |
| Label Medium | Roboto | 500 | 12 | 0.75 | 16sp / 1rem | 0.5px |
| Label Small | Roboto | 500 | 11 | 0.6875 | 16sp / 1rem | 0.5px |

#### Emphasized Type Styles (Expressive Update)

The 15 emphasized styles mirror the baseline scale but with **higher weight** and minor adjustments. Emphasized is **opt-in, never default** — M3 components do not use emphasized by default; swap the token explicitly. Use for:
- Selected/active states in components
- Primary action buttons, badges, extended FAB
- Selected list / menu items
- Headlines needing emphasis
- Unread/important content

Weight (already-bold text) and context (selected/unread) may combine.

To use: swap the baseline token for the emphasized version:
- Baseline: `md.sys.typescale.display-large`
- Emphasized: `md.sys.typescale.emphasized.display-large`

**Subset rule:** do not use all 15 styles. Pick a subset with clear size contrast between roles (M3 Major Second scale, base 14). Too many similar sizes destroy hierarchy.

**Customizing type:** change the brand/plain typeface tokens first; adjust line-height/tracking as needed; **never change size** — size changes break reflow and component metrics. Mirror changes in both baseline and emphasized sets. Heavier weight → wider tracking. Long ascenders/descenders (e.g. localized scripts) → new line-height.

**Letter-spacing formula (web):** `letter-spacing = tracking-px / font-size-px` (em). Line-height ratios: ~1.2× for display/headline/title, ~1.5× for body/label. Use tabular numerals for tables, clocks, and aligned numbers.

**Links and defaults:** default body text uses `on-surface` (`on-surface-variant` as alt). Links use `primary` (or `tertiary` when less prominent) **plus underline** — color alone is not enough.

**Fallback chain:** brand/plain → system fallback → Noto (150+ scripts). Use monospace for code and aligned numbers. Language-height: M3 auto-adapts line-height per language group (small/medium/large/x-large, default medium); audit fixed-height components — Burmese/Telugu/Nastaliq break without it. Web typesetting uses bounding-box + half-leading + padding (automate via Sass/CSS).

### CSS Custom Properties

Each type style maps to individual axis tokens:

```css
/* Example: Body Large (Kern: font = Inter) */
--md-sys-typescale-body-large-font: 'Inter', sans-serif;
--md-sys-typescale-body-large-weight: 400;
--md-sys-typescale-body-large-size: 1rem;        /* 16sp */
--md-sys-typescale-body-large-line-height: 1.5rem; /* 24sp */
--md-sys-typescale-body-large-tracking: 0.03125rem; /* 0.5px */

/* Example: Label Large (used for buttons) */
--md-sys-typescale-label-large-font: 'Inter', sans-serif;
--md-sys-typescale-label-large-weight: 500;
--md-sys-typescale-label-large-size: 0.875rem;
--md-sys-typescale-label-large-line-height: 1.25rem;
--md-sys-typescale-label-large-tracking: 0.00625rem;
```

### Typeface Customization

MD3 uses two typeface roles:
- **Brand**: Used for Display and Headline styles (expression-focused)
- **Plain**: Used for Title, Body, and Label styles (readability-focused)

Both default to Roboto. **Kern sets both to Inter:**

```css
:root {
  --md-ref-typeface-brand: 'Inter', sans-serif;
  --md-ref-typeface-plain: 'Inter', sans-serif;
}
```

### Font Size Units

| Platform | Unit | Conversion |
|----------|------|------------|
| Android | sp | 1:1 |
| Web | rem | sp / 16 = rem (assuming 16px root) |

Examples: 10sp = 0.625rem, 12sp = 0.75rem, 14sp = 0.875rem, 16sp = 1rem, 24sp = 1.5rem

### Component Type Usage

| Component | Type Style |
|-----------|-----------|
| Button label | Label Large |
| Card title | Title Medium |
| Card body | Body Medium |
| Top app bar title | Title Large |
| Navigation label | Label Medium |
| Dialog headline | Headline Small |
| Dialog body | Body Medium |
| Chip label | Label Large |
| Text field input | Body Large |
| List headline | Body Large |
| List supporting text | Body Medium |
| Snackbar text | Body Medium |
| Tooltip text | Body Small |
| Tab label | Title Small |
| Badge count | Label Small |

## Shape

### Corner Radius Scale

> **Kern usage:** `full` for buttons/chips/nav/pills, `small` for cards, `medium` for dropdowns/menus. No shape morphing.

| Token | Value (dp) | Value (px/CSS) | Default components | Kern usage |
|-------|-----------|----------------|-------------------|-----------|
| `none` | 0 | 0px | — | — |
| `extra-small` | 4 | 4px | Snackbar | — |
| `small` | 8 | 8px | Text fields, menus, chips | **Cards** |
| `medium` | 12 | 12px | Cards | **Dropdowns / menus / popovers** |
| `large` | 16 | 16px | FAB, extended FAB, nav drawer | Large surfaces / sheets |
| `large-increased` | 20 | 20px | (Expressive update) | — |
| `extra-large` | 28 | 28px | Dialogs, bottom sheets, side sheets | — |
| `extra-large-increased` | 32 | 32px | (Expressive update) | — |
| `extra-extra-large` | 48 | 48px | (Expressive update) | — |
| `full` | — | 9999px | Buttons, badges, pills, sliders | **All interactive elements** |

### CSS Custom Properties

```css
:root {
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-large-increased: 20px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-extra-large-increased: 32px;
  --md-sys-shape-corner-extra-extra-large: 48px;
  --md-sys-shape-corner-full: 9999px;
}
```

### Corner Tokens vs Corner-Value Tokens

Corner tokens round **all** corners uniformly. Corner-**value** tokens address individual corners — use them for asymmetric shapes and **inner corners** on grouped items (menus, split buttons, segmented groups) where the nested edge needs a smaller radius than the outer edge.

### Customizing Shape

Customize at the **style level** (remap all components using a style) or the **component level** (remap one component to a different style token) — never invent a new radius. The rounded family is default; the cut family (straight edges) is allowed with extra padding, but never use large/full cut on info-dense containers like cards.

### Optical Roundness

Nested radii must shrink: `inner = outer − padding` (e.g. a 48px outer with 14px padding → 34px inner). Never nest equal radii — the inner edge looks fatter than the outer.

### Shape Library and Principles

The M3 shape library (35 decorative shapes) is decorative only — use sparingly, never on text-heavy containers. Shape carries no semantics (wavy ≠ progress). Keep shape+type harmony; tension via square+round pairings; abstract shapes sparingly for aesthetic moments (graphics, crops, avatars). Morph signals interaction state / in-progress action / environment change.

### Shape Morphing (Expressive)

> **Kern:** not used — no shape morphing, no interaction-driven radius changes. This is a deliberate override: M3 Expressive morphs button-group selection, loading-indicator attention, and press states (Compose API only, Web unavailable). Kern pins static radii.

## Elevation

> **Kern:** Kern keeps the tonal `surface-container` ladder for resting hierarchy but uses a **single whisper shadow** for floating layers instead of the MD3 shadow ramp. See [`kern-tokens.md`](kern-tokens.md) § Elevation.

### Elevation Levels

| Level | DP Height | Use |
|-------|-----------|-----|
| 0 | 0dp | Most resting components |
| 1 | 1dp | Elevated variants (cards, sheets) |
| 2 | 3dp | Menus, nav bar, scrolled app bar |
| 3 | 6dp | FAB, dialogs, search, date/time pickers |
| 4 | 8dp | Hover/focus increase only |
| 5 | 12dp | Hover/focus increase only |

### Tonal Elevation (Not Shadows)

MD3 uses **tonal surface color** to communicate elevation, not shadows — but surface roles are **decoupled from elevation levels**. Levels set stacking and interaction (hover/focus lifts +1; +4/+5 interaction-only); containment uses surface roles independently. Overlapping areas must use different surface roles regardless of level.

Reference ladder (containment only, not a level binding):
- Flattest: `surface`
- Low: `surface-container-low`
- Default containers: `surface-container`
- High: `surface-container-high`
- Highest: `surface-container-highest`

### Shadow and Scrim Rules

Shadows depict distance (bigger/softer = farther). Use shadows only to **protect** content on busy backgrounds or to **encourage** interaction — hover/focus/select lifts exactly +1, consistently; lower the element when a higher one appears. Scrim uses the `scrim` role at 32% under modals and expanded navigation.

Component→level reference (M3 canon): L3 dialogs / FAB / date-time pickers / search; L2 scrolled app bar / menus / nav bar / rich tooltip / toolbar; L1 banner / modal sheet / elevated button+card+chips / modal drawer; L0 unscrolled bar / filled-tonal-outlined buttons+cards / lists / nav rail / tabs / sliders / segmented / split. Do not change component defaults.

### Kern Shadow Values

Kern uses one shadow for floating layers (not the MD3 ramp):

```css
/* Card / dropdown */
box-shadow: rgba(0,0,0,0.12) 0px 4px 16px;
/* Modal / overlay */
box-shadow: rgba(0,0,0,0.16) 0px 4px 16px;
```

## Motion

> **Kern:** utility motion only. Kern pins the legacy Standard system for utility motion (deliberate override) — M3 default is now the Expressive physics system (springs: stiffness + damping + velocity, with interruption/retargeting; expressive vs standard scheme per product). Use `standard` easing at short durations (100–200ms). No spring physics, no expressive/bounce, no decorative animation, no shape morphing.

### Spatial vs Effects

Spatial tokens move position/rotation/size/corners (may overshoot); effects tokens change color/opacity (never overshoot). Speed is device-relative (watch/phone/tablet differ) and scales with travel distance: fast for small elements (switches, buttons), default for partial-screen, slow for full-screen. Enter and persistent durations run longer than exit; iOS/Web fall back to Standard curves.

### Easing and Duration (Transitions)

**Standard** (Kern's default):
| Type | CSS Cubic-bezier | Use |
|------|-----------------|-----|
| Standard | `cubic-bezier(0.2, 0, 0, 1)` | Begin and end on screen |
| Standard Decelerate | `cubic-bezier(0, 0, 0, 1)` | Enter the screen |
| Standard Accelerate | `cubic-bezier(0.3, 0, 1, 1)` | Exit the screen |

**Emphasized** (MD3 default for expressive transitions — Kern avoids for decoration):
| Type | CSS Cubic-bezier |
|------|-----------------|
| Emphasized | `cubic-bezier(0.2, 0, 0, 1)` |
| Emphasized Decelerate | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| Emphasized Accelerate | `cubic-bezier(0.3, 0, 0.8, 0.15)` |

#### Duration Scale (Kern uses Short 2–Short 4)

| Token | Value | Use |
|-------|-------|-----|
| Short 1 | 50ms | Micro-interactions |
| Short 2 | 100ms | Small transitions (Kern default) |
| Short 3 | 150ms | Small transitions |
| Short 4 | 200ms | Exit / state transitions (Kern max) |
| Medium+ | 250ms+ | MD3 larger transitions — avoid in Kern chrome |

### CSS Implementation

```css
:root {
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-short4: 200ms;
}

/* Kern state change (hover/focus/open) */
.kern-interactive {
  transition: background-color var(--md-sys-motion-duration-short2)
              var(--md-sys-motion-easing-standard);
}
```
