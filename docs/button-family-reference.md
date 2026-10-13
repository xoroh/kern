# Button Family Reference

The complete M3 button specification, kern's implementation mapping, and usage
guidance. Sourced from `material-web` v0.192 tokens, `material-web.dev`
component pages, AND the live `m3.material.io` tabs (overview/specs/
guidelines/accessibility via text-extraction proxy — including the May 2025
**M3 Expressive** update with toggle, 5 sizes, 2 shapes, and shape morphing).
Reuse this when adding button variants, auditing conformance, or writing
component docs.

## Contents

1. [System tokens](#1-system-tokens)
2. [Common buttons](#2-common-buttons-elevated--filled--tonal--outlined--text)
3. [Icon buttons](#3-icon-buttons)
4. [FABs](#4-fabs)
5. [Extended FAB](#5-extended-fab)
6. [Segmented buttons](#6-segmented-buttons)
7. [Toggle buttons](#7-toggle-buttons)
8. [Split button](#8-split-button)
9. [Button group](#9-button-group)
10. [Loading and link variants](#10-loading-and-link-variants)
11. [State layers](#11-state-layers)
12. [Typography](#12-typography)
13. [Shape](#13-shape)
14. [Elevation](#14-elevation)
15. [Motion and transitions](#15-motion-and-transitions)
16. [Touch targets](#16-touch-targets)
17. [Color role map](#17-color-role-map)
18. [Kern naming vs M3 naming](#18-kern-naming-vs-m3-naming)
19. [Kern overrides](#19-kern-overrides)
20. [Usage guidance](#20-usage-guidance)

---

## 1. System tokens

### State-layer opacities (`md.sys.state`)

| State    | Opacity | Token                         |
| -------- | ------- | ----------------------------- |
| Hover    | **8%**  | `hover-state-layer-opacity`   |
| Focus    | **12%** | `focus-state-layer-opacity`   |
| Pressed  | **12%** | `pressed-state-layer-opacity` |
| Dragged  | **16%** | `dragged-state-layer-opacity` |
| Disabled | 38% label / 12% container | —                      |

> Kern tokens: `--md-sys-state-hover: 8%`, `--md-sys-state-focus: 12%`,
> `--md-sys-state-press: 12%`, `--md-sys-state-drag: 16%`,
> `--md-sys-state-disabled: 38%`.

### Shape (`md.sys.shape`)

| Token              | Value    |
| ------------------ | -------- |
| `corner-none`      | **0px**  |
| `corner-extra-small` | **4px** |
| `corner-small`     | **8px**  |
| `corner-medium`    | **12px** |
| `corner-large`     | **16px** |
| `corner-extra-large` | **28px** |
| `corner-full`      | **9999px** |

### Elevation (`md.sys.elevation`)

| Level   | DP   | Use on buttons                          |
| ------- | ---- | --------------------------------------- |
| level0  | 0dp  | Resting filled / tonal / outlined / text |
| level1  | 1dp  | Elevated resting; filled/tonal hover     |
| level2  | 3dp  | Elevated hover                           |
| level3  | 6dp  | FAB resting                              |
| level4  | 8dp  | FAB hover                                |
| level5  | 12dp | Dragged only (never buttons)             |

### Motion (`md.sys.motion`)

| Token                 | Value                        |
| --------------------- | ---------------------------- |
| `duration-short2`     | **100ms** (state fades)      |
| `duration-short4`     | **200ms** (color/elevation)  |
| `duration-long4`      | **600ms** (focus ring)       |
| `easing-standard`     | `cubic-bezier(0.2, 0, 0, 1)` |
| `easing-emphasized`   | `cubic-bezier(0.2, 0, 0, 1)` |

### Focus ring (`md.comp.focus-ring`)

| Token   | Value       |
| ------- | ----------- |
| Width   | **3px** resting (8px grow peak) |
| Color   | `secondary` |
| Offset  | 0px         |

---

## 2. Common buttons (elevated · filled · tonal · outlined · text)

Shared layout (all five): `inline-flex`, 8px icon gap, **40px** min-height,
**64px** min-width, `label-large` type, `corner-full` shape, centered content,
ellipsis truncation, no wrapping, 48dp touch target.

Padding: **24px** horizontal without icon; **16px** leading with icon.
Text buttons use tighter **12px** padding.

Icon size with label: **18px**.

| Variant | Container | Label | Elevation resting → hover |
| ------- | --------- | ----- | ------------------------- |
| Elevated | `surface-container-low` | `primary` | level1 → **level2** |
| Filled (`primary`) | `primary` | `on-primary` | level0 → level1 |
| Tonal | `secondary-container` | `on-secondary-container` | level0 → level1 |
| Outlined | transparent + 1px `outline` | `primary` | level0 (focus moves border to `primary`) |
| Text (`ghost`) | transparent | `primary` | level0 |

State layers use the `on-*` color at 8% / 12% / 12%.
Disabled: label `on-surface` 38%, container `on-surface` 12% (outlined/text keep
transparent fill, outlined border goes to 12%).

### Kern props

`variant` (5 + `filled`/`text` aliases) · `color` (`primary`/`danger`) ·
`size` (`xs` 28px / `default` 40px / `sm` 32px / `xl` 48px / `icon` 40px square) ·
`shape` (`pill`/`rounded`/`square`) · `block` · `loading` · `icon`/`iconPosition`
· `href` (anchor branch).

---

## 3. Icon buttons

40×40px visual, 48dp touch target (4px margin each side), 24px icon,
`corner-full`. Four treatments:

| Variant  | Container | Icon | Selected (toggle) |
| -------- | --------- | ---- | ----------------- |
| Standard | none | `on-surface-variant` | `primary` icon, no fill |
| Filled   | `primary` | `on-primary` | `primary` fill (unselected: `surface-container-highest` + `primary` icon) |
| Tonal    | `secondary-container` | `on-secondary-container` | `secondary-container` (unselected: `surface-container-highest` + `on-surface-variant` icon) |
| Outlined | 1px `outline` | `on-surface-variant` | `inverse-surface` + `inverse-on-surface`, border removed |

State layers use the matching on-color at 8% / 12% / 12%.
Disabled: icon `on-surface` 38% (container 12% where filled).

Kern sizes: `sm` 32px · `default` 40px · `lg` 48px. Toggle via `toggle` +
`pressed`/`value`. Accessible name (`label`) required; tooltip rendered from it.

---

## 4. FABs

| Size    | Container | Icon | Shape |
| ------- | --------- | ---- | ----- |
| Small   | 40×40px   | 24px | `corner-medium` 12px |
| Regular | 56×56px   | 24px | `corner-large` 16px |
| Large   | 96×96px   | 36px | `corner-extra-large` 28px |

Four colors (container / icon):

| Color     | Container | Icon |
| --------- | --------- | ---- |
| Surface (spec default) | `surface-container-high` | `primary` |
| Primary   | `primary-container` | `on-primary-container` |
| Secondary | `secondary-container` | `on-secondary-container` |
| Tertiary  | `tertiary-container` | `on-tertiary-container` |

Elevation: level3 resting → **level4 hover**. Lowered variant: level1 → level2
with `surface-container-low` fill. FABs disappear rather than show disabled.

Kern: `color` axis (`surface`/`primary`/`secondary`/`tertiary`, default
`primary` for back-compat) · `size` (`sm` 40px / `default` 56px / `medium` 96px /
`large` 128px ext / `icon` 56px square).

---

## 5. Extended FAB

56px high, `corner-large` 16px, level3 → level4 hover, 24px icon,
`label-large` type, 16px leading padding with icon / 20px trailing.
Same four colors as FAB. Collapses to icon FAB on scroll (imperative
`collapse()`/`expand()` handle + controlled `collapsed`).

Kern renders the pill shape (M3-correct `corner-large` would be 16px rounded,
not full — Kern mandates pills; recorded override).

---

## 6. Segmented buttons

40px high, `corner-full`, 1px `outline` shared between 2–5 segments.
Unselected: `on-surface` label/icon, `on-surface` 8%/12% layers.
Selected: `secondary-container` fill, `on-secondary-container` label/icon/layers.
Selected segment with label shows a check glyph. Disabled 38%/12%.
Single-select (radiogroup) or multi-select (checkboxes).

Kern sizes `xs`–`xl` (M3 ships only 40px); otherwise spec-true.

---

## 7. Toggle buttons

Two forms. (a) Icon/segmented toggles: a mode of icon buttons and segmented
items. Standalone `Toggle`: unselected transparent + `on-surface` label;
selected `secondary-container` + `on-secondary-container`. `ToggleGroup` items
share the same treatment inside a `surface-tonal` pill track.

(b) M3 Expressive common-button toggle (`toggle` prop on Button, web +
native): binary selection with round-to-square morph and per-variant selected
colors — elevated→Primary/On-primary, filled unselected→surface-container/
on-surface-variant (selected = default fill), tonal→Secondary/On-secondary,
outlined→inverse-surface/inverse-on-surface with border removed. No toggle
text button. Morph radii per size (12/12/12/16/16/28); square resting morphs
back to pill on select. Reports `aria-pressed` (+ `data-selected` for styling
hooks). Native mirrors via `buttonStyles(..., { toggle, selected })`.

---

## 8. Split button

Primary action + overflow menu as **two separate controls** (M3 forbids one
element with two hit regions). 40px high, `corner-full` halves joined by a 1dp
`outline` divider, `primary` fill both halves. Primary never opens the menu;
overflow reports `aria-expanded`; Escape closes with focus return.

---

## 9. Button group

Layout only: joins buttons into one segmented control by removing inner radii
and collapsing borders. Children keep their own variants.

---

## 10. Loading and link variants

**Loading**: swaps in the progress indicator in the leading slot, keeps label
and footprint (never resizes chrome), reports `aria-busy`, blocks interaction
like `disabled`. Determinate 0–1 or indeterminate loop.

**Link**: the button treatment on an anchor (`role="link"`). A blocked link
drops `href`, leaves the tab order, reports `aria-disabled`.

---

## 11. State layers

An overlay of the `on-*` color at the state opacity over the container. The
label stays full-strength — whole-button dims are a bug except for disabled.

| State    | Opacity | Transition in | Transition out |
| -------- | ------- | ------------- | -------------- |
| Hover    | 8%      | 15ms linear   | 15ms linear    |
| Focus    | 12%     | 15ms linear   | 15ms linear    |
| Pressed  | 12%     | **105ms** linear (+ 450ms radial grow) | **375ms** linear |
| Disabled | 38% / 12% | instant     | instant        |

Kern web implements layers as a `before:` overlay; native uses whole-container
opacity (0.82 press) + Android ripple as the platform-idiomatic equivalent.

---

## 12. Typography

All button labels, extended FAB labels, and segmented labels use
**`label-large`**: 14px / 20px, weight 500, tracking 0.1px.
(Kern: Inter instead of Roboto.)

---

## 13. Shape

All common buttons, icon buttons, and segmented buttons: `corner-full`
(9999px pill). FAB small/medium/large: 12px / 16px / 28px. Extended FAB: 16px.
Kern adds a `shape` axis (`pill`/`rounded` 16px/`square` 0px) as a deliberate
extension; FABs additionally mandate pills (override recorded).

---

## 14. Elevation

| Variant | Resting | Hover | Focus | Pressed | Disabled |
| ------- | ------- | ----- | ----- | ------- | -------- |
| Filled | 0 | 1 | 0 | 0 | 0 |
| Elevated | 1 | **2** | 1 | 1 | 0 |
| Tonal | 0 | 1 | 0 | 0 | 0 |
| Outlined / Text | 0 | 0 | 0 | 0 | 0 |
| FAB | 3 | **4** | 3 | 3 | hide |
| Icon / Segmented | 0 | 0 | 0 | 0 | 0 |

Elevation transitions animate `box-shadow` over **280ms**
`cubic-bezier(0.2, 0, 0, 1)`.

---

## 15. Motion and transitions

| Property | Duration | Easing |
| -------- | -------- | ------ |
| State layer in/out (hover) | 15ms | linear |
| State layer in (press) | 105ms | linear |
| State layer out (press) | 375ms | linear |
| Ripple grow | 450ms (min hold 225ms) | `standard` |
| Elevation | 280ms | `easing-emphasized` |
| Color (label/icon/container) | instant in M3; Kern animates 100–200ms | `standard` |
| Focus ring | 150ms grow to 8px + 450ms shrink to 3px | `emphasized` |
| Extended FAB expand | 400ms size + 200ms label (100ms delay) | `emphasized` |
| Extended FAB collapse | 400ms size + 100ms label (50ms delay) | `emphasized` |

Touch: 150ms press delay distinguishes scroll from tap.

Kern override: utility motion only — `standard` easing at 100–200ms, no shape
morphing, no springs.

---

## 16. Touch targets

48×48dp minimum everywhere. 40px visuals expand via margin/inset (icon buttons:
4px each side; common buttons: `after:` inset). 56px+ controls already exceed.
Native uses `hitSlop` (xs 10, sm 8, default/icon 4, xl 0).

---

## 17. Color role map

| Variant | Container | Label/Icon | Layer | Disabled container | Disabled label |
| ------- | --------- | ---------- | ----- | ------------------ | -------------- |
| Filled | `primary` | `on-primary` | `on-primary` | `on-surface` 12% | `on-surface` 38% |
| Elevated | `surface-container-low` | `primary` | `primary` | `on-surface` 12% | `on-surface` 38% |
| Tonal | `secondary-container` | `on-secondary-container` | `on-secondary-container` | `on-surface` 12% | `on-surface` 38% |
| Outlined | transparent, 1px `outline` | `primary` | `primary` | transparent | `on-surface` 38% |
| Text | transparent | `primary` | `primary` | transparent | `on-surface` 38% |
| Danger filled | `error` | `on-error` | `on-error` | same disabled | same disabled |
| Danger tonal | `error-container` | `on-error-container` | `on-error-container` | same disabled | same disabled |

---

## 18. Kern naming vs M3 naming

| M3 name | Kern name | Notes |
| ------- | --------- | ----- |
| Filled button | `primary` | `filled` accepted as alias |
| Text button | `ghost` | `text` accepted as alias |
| — | `color="danger"` | Error treatment, not a sixth variant |
| — | `shape` axis | `pill`/`rounded`/`square` extension |
| — | `size` xs/sm/xl | M3 ships one 40px height; extensions documented |
| FAB small/medium/large | `sm`/`medium`/`large` (+ `default` 56px, `icon`) | `medium` 96px = M3 large; Kern `large` 128px is an extension |

---

## 19. Kern overrides

Recorded deliberate departures from M3:

1. **Inter** instead of Roboto for all type.
2. **Pills mandated** on FABs and extended FAB (M3 uses 12/16/28px rounded).
3. **No spring physics** — standard easing at 100–200ms only.
4. **`rounded` shape** (16px large) — M3 has only round/square; kept as Kern extension.
5. **Extra compact sizes** (`xs` 28px, `sm` 32px) — below M3's XS band; kept for density.
6. **Native elevated has no shadow** — separates by surface fill; documented.
7. **Native press is whole-opacity + ripple** — no overlay layer (platform idiom).
8. **Focus ring 3px `secondary`** — matches M3 resting outline.
9. **FAB default is `surface`** — matches M3 (changed from `primary` during the button-family audit; demos-only usage made it safe).
10. **`xl` kept at 48px** — sits between M3 M and L; `md` (44px) and `lg` (56px) added for the M/L slots without breaking `xl` consumers.

## 21. M3 Expressive update (May 2025, verified live)

Buttons gained: **toggle** (selection) on 4 of 5 styles (no toggle text),
**5 sizes** (XS/S/M/L/XL, S default), **2 shapes** (round default + square),
**shape morph on press** (both shapes converge to the pressed radius),
**shape morph on select** (round↔square swap), **20dp icons** (was 18px),
**16dp small padding** (24dp no longer recommended).

Toggle colors (unselected → selected):
- Elevated: surface-container-low/Primary → Primary/On-primary
- Filled: surface-container/on-surface-variant → Primary/On-primary
- Tonal: secondary-container/on-secondary-container → Secondary/On-secondary
- Outlined: outline/on-surface-variant → inverse-surface/inverse-on-surface

Corner sizes: round Full all sizes; square XS 12 / S 12 / M 16 / L 28 /
XL 28; pressed XS 8 / S 8 / M 12 / L 16 / XL 16.

Toggle guidance: binary Save/Favorite; outlined icon unselected → filled icon
selected; keep label lengths similar; no toggle text buttons.

Anatomy: label (1–3 words, sentence case, single line, never truncate) +
container (width fits label, may stretch but never long-flat) + optional
single leading icon (never two, never vertical). Outlined/text need
recognizable separation from chips and body text. Text buttons trail-align in
dialogs; never underline (hyperlinked body text carries links).

Accessibility: 3:1 contrast (container for filled styles, label for
outlined/text); 200% text must fit two lines; rapid clicks use a modified
motion curve; Tab navigates, Space/Enter activates; accessible name matches
visible label.

## 22. Cross-implementation notes (verified against source)

### material-web (`material-components/material-web`)

Button structure: host (flex, padding, ripple theme) + `.background` (separate
node so disabled opacity hits only the fill) + `md-focus-ring` + `md-ripple` +
inner `.button` (min-width `calc(64px - leading - trailing)`, so the 64px
minimum is total, not content). Label/icon colors swap per state
(`:hover`/`:focus-within`/`:active` set `--_hover/focus/pressed-label-text-color`);
the background node takes `--_disabled-container-color` at 12% while the label
takes `--_disabled-label-text-color` at 38% — the split, not a dim.

Elevation animates `box-shadow, opacity` over 280ms `easing-emphasized`, applied
in order focused → hovered → pressed → disabled so hover wins after focus.
Disabled sets `transition: none`.

Icon buttons: no container fill on standard; `touch-target="wrapper"` adds
`margin: max(0px, (48px − size) / 2)`; toggle swaps to a `selected` slot icon;
`flip-icon-in-rtl` mirrors directional icons; `aria-label-selected` names the
selected state.

FAB: `touch-target="wrapper"` with 48px minimum; `lowered` swaps to
`surface-container-low` + level1/level2; extended label gap 12px; small can opt
out of the touch target (`touch-target="none"`).

Ripple constants (`ripple/internal/ripple.ts`): touch delay 150ms, minimum
press 225ms, grow 450ms `standard`, origin scale 0.2, padding 10px, soft edge
`max(0.35 × maxDim, 75px)`.

### material-components-android

`MaterialButton` delegates elevation to the shape drawable and animates
`translationZ` (not `elevation`) on press via `mtrl_btn_state_list_anim.xml` —
keep `elevation` constant, lift with `translationZ`. Ripple color sanitized
through `RippleUtils` (collapses 5 states to 3 to avoid aborting the
animation; doubles alpha to cancel the framework's ~50% compositing).
`setBackgroundDrawable` warns on overwrite — the button owns its background.
Toggle uses `state_checkable`/`state_checked` drawable states.

Framework bounds: `TAP_TIMEOUT` 100ms (tap-vs-scroll), `PRESSED_STATE_DURATION`
64ms (minimum visible press). Use web values (150/225/450) for web parity with
these as lower bounds.

### react-native-paper (`callstack/react-native-paper`)

Button modes map 1:1 to M3 (`text`/`outlined`/`contained`/`elevated`/
`contained-tonal`). Elevated animates 1→2 on press with
`theme.motion.duration` — proof elevation works on native; kern-native's
fill-only elevated remains a documented divergence. Disabled uses split
opacities from `tokens.md.sys.state.opacity` (text 38%, background 12% via an
absolute-fill overlay View + content View — the overlay pattern our
hex-alpha approach replicates without restructuring). Icon 18px, label
`theme.fonts.labelLarge`, `minWidth: 64`, text-mode margins 12px vs 24px
contained (matches M3's 12/24 split). `uppercase` defaults false (sentence
case). `compact` prop for dense rows; `buttonColor`/`textColor` overrides;
`contentStyle` with `row-reverse` for trailing icons.

IconButton modes match M3's four exactly, including selected colors
(`contained` selected → `primary`/`onPrimary`;
`contained-tonal` selected → `secondaryContainer`/`onSecondaryContainer`;
`outlined` selected → `inverseSurface`/`inverseOnSurface`;
standard selected → `primary` icon) — identical to kern's implementation,
independently derived. Container = icon size + 16 (PADDING 8 each side):
24px icon → 40px box. `loading` swaps in `ActivityIndicator`. `animated`
cross-fades icon changes.

FAB defaults to `tonalPrimary` (vs M3 `surface` and kern `surface`) — three
implementations, three defaults; all defensible, M3's is canonical. Sizes
default 56 / medium **80** / large 96 — Paper's 80px medium is non-standard
(M3 large is 96); kern's 96px medium matches M3 large. Visibility animates
scale + alpha with springs (`useSharedValue` + `withSpring`); focus ring
matches (thickness + secondary). Elevation state map enabled 3 / hover 4 /
focus 3 / pressed 3 — identical to kern.

### Gaps both references expose in kern (documented, not silently missing)

- `soft-disabled` (disabled but focusable for toolbar discoverability).
- `aria-label-selected` (separate toggle-on name).
- `flip-icon-in-rtl` (directional icon mirroring; kern uses order-not-margin
  which covers layout but not glyph direction).
- Trailing-icon restriction on link buttons (M3 forbids them; kern doesn't
  enforce it).
- Branded FAB (logo icon, no color variants).
- FAB `visible` spring animation (Paper has it; kern mounts/unmounts).
- IconButton `loading` and `animated` crossfade (Paper has them).

---

## 20. Usage guidance (from material-web docs)

### Common buttons — when to use each

- **Filled** — most visual impact after the FAB. Important, final actions that complete a flow: Save, Join now, Confirm. One per screen.
- **Tonal** — middle ground between filled and outlined. A lower-priority button that needs slightly more emphasis than an outline gives: `Next` in an onboarding flow.
- **Outlined** — medium-emphasis. Actions that are important but aren't the primary action on the screen.
- **Text** — lowest priority, especially when presenting multiple options. Dialog secondary actions, inline list actions.
- **Elevated** — essentially a filled tonal with a shadow. Only when the button requires visual separation from a patterned background. Never by default — prevents shadow creep.

### Icon buttons — when to use each

- **Standard** — no background or outline, lowest emphasis. Compact layouts, toolbar actions, overflow menus, search.
- **Filled** — higher visual impact, high-emphasis icon actions.
- **Tonal** — middle ground. A secondary icon action paired with a high-emphasis one.
- **Outlined** — medium emphasis. More than standard, less than filled or tonal.
- **Toggle** — binary on/off choices: favorite, bookmark. Shows a second `selected` icon; announce with `aria-label-selected`.

### FAB — when to use

- The single most important action on the screen. Key actions within reach.
- Exactly one per screen. Clear, understandable icon. 16dp screen margins.
- Persists on scroll (extended FAB collapses to icon FAB instead of scrolling away).
- `surface` default; `primary`/`secondary`/`tertiary` for brand accents.
- `lowered` for a quieter FAB (level1 + `surface-container-low`).
- Extended FABs may omit the icon; branded FABs must always show the logo.
- Small FABs can reduce their touch target (`touch-target="none"`) in dense layouts.

### General rules

- **One primary per screen.** Everything else steps down.
- **Danger is a color, not a variant.** Destructive actions re-paint; they never get their own shape.
- **Buttons do; links go.** Navigation uses anchors, never buttons. (Link buttons cannot carry trailing icons.)
- **Icon-only always named.** `aria-label` required; toggle adds `aria-label-selected`.
- **Loading keeps its footprint.** Never resize chrome for progress.
- **FABs disappear; they never disable.** Disabled toolbars stay focusable via `soft-disabled` for discoverability.
- **Labels are sentence-case actions.** "Save", "Send message", "Delete" — never "Click here".
- **Trailing icons** go at the inline end (`iconPosition="end"`); they flip automatically in RTL. Directional icons opt into `flip-icon-in-rtl`.
