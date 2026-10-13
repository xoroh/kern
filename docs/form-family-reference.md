# Form Family Reference

The complete M3 form specification, kern's implementation mapping, and usage
guidance. Sourced from `material-web` v0.192 tokens and `material-web.dev`
component pages (the machine-readable M3 spec — `m3.material.io` is JS-gated).
Reuse this when adding form variants, auditing conformance, or writing
component docs.

## Contents

1. [Text fields](#1-text-fields-filled--outlined)
2. [Checkbox](#2-checkbox)
3. [Radio](#3-radio)
4. [Switch](#4-switch)
5. [Slider](#5-slider)
6. [Select](#6-select)
7. [State summary](#7-state-summary)
8. [Typography](#8-typography)
9. [Kern naming vs M3 naming](#9-kern-naming-vs-m3-naming)
10. [Kern overrides](#10-kern-overrides)
11. [Usage guidance](#11-usage-guidance-from-material-webdev)
12. [Cross-implementation notes](#12-cross-implementation-notes)

---

## 1. Text fields (filled · outlined)

Functionally identical — pick by surface. Filled separates on lower surfaces;
outlined works everywhere.

### Filled

| Token | Value |
| ----- | ----- |
| Container | `surface-container-highest` |
| Shape | `corner-extra-small-top` (4px top only) |
| Active indicator | 1px `on-surface-variant`; 2px `primary` on focus; 1px `on-surface` on hover |
| Input/label type | `body-large` (16px/24px) |
| Placeholder/prefix/suffix/icons | `on-surface-variant`, 24px icons |
| Supporting text | `on-surface-variant`, `body-small` |
| Label populated | shrinks to `body-small` |
| Caret | `primary` |

### Outlined

| Token | Value |
| ----- | ----- |
| Shape | `corner-extra-small` (4px all) |
| Outline | 1px `outline`; 2px `primary` on focus; 1px `on-surface` on hover |
| Input/label type | `body-large` |
| Icons | `on-surface-variant`, 24px |

### Disabled

| Element | Filled | Outlined |
| ------- | ------ | -------- |
| Container | `on-surface` 4% | transparent |
| Indicator/outline | `on-surface` 38%, 1px | `on-surface` 12%, 1px |
| Text/label/icons/supporting | `on-surface` 38% | `on-surface` 38% |

### Error (both)

Indicator/outline/label/supporting/trailing icon move to `error`;
input text stays `on-surface`; leading icon stays `on-surface-variant`.
Focus variants mirror with `error` in the focus slots.

### Features

Floating `label` (aligns with input, floats on focus/value, sets the
accessible name unless `aria-label` overrides); `placeholder` (hint, never
floats); external label requires `aria-label` (no `aria-labelledby` support).
Leading/trailing icons; `prefix-text`/`suffix-text`; `supporting-text` (replaced
by `error-text` on error); `maxlength` counter; `rows`/`cols` for textarea
(defaults 2/20, CSS `resize` controls behavior); `required` asterisk (opt out
with `no-asterisk`); constraint validation (`reportValidity`) preferred,
manual (`error` + `error-text`) for app-state logic.

### Kern props

`variant` (`outlined`/`filled`) · `error`/`errorMessage` (message implies
state, renders live `FieldMessage`, associates via `aria-describedby`) ·
all native input props pass through.

---

## 2. Checkbox

One type. Standalone, pre-checked, or indeterminate. 18px box, **2px** shape,
18px icon, 40px full state layer.

| State | Outline/border | Container | Icon | Layer |
| ----- | -------------- | --------- | ---- | ----- |
| Unselected | `on-surface-variant` 2px | transparent | — | `on-surface` 8/12/12% |
| Selected | none (0px) | `primary` | `on-primary` | `primary` 8/12%, `on-surface` 12% pressed |
| Indeterminate | — | `primary` | `on-primary` dash | same as selected |
| Disabled selected | none | `on-surface` 38% | `surface` | — |
| Disabled unselected | `on-surface` 38%, 2px | — | — | — |

Focus moves the unselected outline to `on-surface` (not `primary`).
Error variants repaint container/icon/outline in `error`/`on-error`.

Labels wrap in `<label>` but **never auto-name** — always pass `aria-label`
(b/294081528). Touch target via wrapper to 48dp.

---

## 3. Radio

One-of-many, grouped by shared `name`. 20px icon.

| State | Icon |
| ----- | ---- |
| Unselected | `on-surface-variant` |
| Selected | `primary` |

Place in `role="radiogroup"` with a visible label. Every radio needs
`aria-label` (never auto-labelled). **Never wrap radios inside `<label>`** —
it stops screen readers announcing the group count; use `for`/`id` instead.

---

## 4. Switch

On/off toggle. Track 52×32, 2px outline, full shapes, 40px full state layer.

| State | Handle | Track |
| ----- | ------ | ----- |
| Unselected | 16px `outline` | `surface-container-highest` + `outline` border |
| Selected | 24px `on-primary` | `primary` |
| Pressed handle | 28px | — |
| With-icon handle | 24px | — |

Icons 16px: unselected `surface-container-highest`, selected
`on-primary-container`. Optional `icons` (both) or `show-only-selected-icon`.

Disabled: selected handle `surface` + track `on-surface` 12%; unselected
handle `on-surface` 38% + track `surface-container-highest` with `on-surface`
outline.

Labels wrap in `<label>` but always need `aria-label`. Fires `input` + `change`
(non-bubbling in material-web).

---

## 5. Slider

Value or range along a track. Continuous, discrete (`step` + `ticks`), range
(two handles), `labeled` value bubble.

| Token | Value |
| ----- | ----- |
| Active track | `primary`, full shape |
| Inactive track | `surface-container-highest`, full shape |
| Handle | `primary`, full shape |

API: `min`/`max` (0/100), `value`/`valueStart`/`valueEnd`, `step` (1),
`ticks`, `labeled`, `range`, `disabled`, `name`, per-handle `aria-label` and
`aria-valuetext`. Fires `input` + `change`.

---

## 6. Select

Fixed-list choice, like a native `<select>`. Filled and outlined mirror the
text-field treatments (container `surface-container-highest` / 1px `outline`,
4px shape, `body-large` input text). Menu surface themed via `::part(menu)`.

API: `required`, `error`/`error-text`, `label`, `supporting-text`,
`menu-positioning` (`popover`/`absolute`), `clamp-menu-width`, `menu-align`,
`typeahead-delay`, `value`/`selected-index`, `options`; `select`/`selectIndex`/
`reset` methods; `change`/`input` + `opening`/`opened`/`closing`/`closed`
menu events. Options carry `value`, `selected`, `disabled`, headline slot.

---

## 7. State summary

| Component | Resting | Hover | Focus | Pressed | Disabled |
| --------- | ------- | ----- | ----- | ------- | -------- |
| Filled field | container-highest + 1px indicator | indicator → on-surface | indicator 2px primary | — | container 4%, rest 38% |
| Outlined field | 1px outline | outline → on-surface | outline 2px primary | — | text 38%, outline 12% |
| Checkbox | 2px on-surface-variant | outline → on-surface + 8% | outline → on-surface + 12% | inverted layers 12% | 38% split |
| Radio | on-surface-variant ring | 8% | 12% | 12% | 38% |
| Switch | 16px handle / track | 8% | 12% | 28px handle + 12% | 12% track / 38% handle |
| Slider | primary fill | 8% | 12% + ring | 12% | 38% / 12% |
| Select | text-field treatment | same | same | — | same |

---

## 8. Typography

- Input/label: `body-large` (16px/24px).
- Floating label populated: `body-small`.
- Supporting text: `body-small` (`on-surface-variant`).
- Checkbox/radio/switch labels: inherited body text via wrapping `<label>`.

---

## 9. Kern naming vs M3 naming

| M3 name | Kern name | Notes |
| ------- | --------- | ----- |
| Filled text field | `variant="filled"` | opt-in; `outlined` is default |
| Outlined text field | `variant="outlined"` (default) | 4px shape per spec |
| `error` + `error-text` | `error` + `errorMessage` | message implies state |
| `supporting-text` | `Field.description` / `FieldMessage` | composed via Field |
| Checkbox `checked`/`indeterminate` | same | `mixed` ARIA for indeterminate |
| Radio `checked` + `name` group | `RadioGroup` `value` + items | controlled group API |
| Switch `selected` | `checked` (Base UI) | same behavior |
| Slider `value`/`range`/`ticks`/`labeled` | same | compound Root/Thumb/Label/Value |
| Select filled/outlined | `SelectTrigger variant` | menu via Base UI popup |

---

## 10. Kern overrides

1. **Outlined is the default field treatment** (M3 presents filled first).
2. **No `soft-disabled` / `always-focusable`** — disabled fields leave the tab order.
3. **No `maxlength` counter UI** — `maxLength` passes through natively.
4. **No `prefix-text`/`suffix-text` props** — compose with adornments via `className`.
5. **Switch thumb uses size steps** (16→24→28px via classes) rather than M3's exact handle tokens — visually identical.
6. **Native input has no filled variant** — outlined treatment only; documented gap.
7. **Inter** instead of Roboto for all type.

---

## 11. Usage guidance (from material-web.dev)

### Text fields

- Filled and outlined are functionally identical — pick by surface.
- Label every field: floating `label`, `placeholder`, or external label with `aria-label`.
- Leading icons describe input method (search) or add function (clear); trailing icons express errors or toggle visibility (password).
- `prefix-text`/`suffix-text` add value context (`$`, `.00`).
- Supporting text explains use; error text replaces it on validation.
- Prefer constraint validation (`reportValidity`, native `invalid` events, `<form>` integration); manual (`error` + `error-text`) for app-state logic.

### Checkbox / radio / switch

- Checkbox: one or more independent options; single box for separate agreement.
- Radio: exactly one of a set; group by `name`; label the `radiogroup`.
- Switch: one on/off that applies immediately (Wi-Fi, Bluetooth).
- All three always need `aria-label` — never auto-labelled by wrappers.

### Slider / select

- Slider: volume, brightness, filters; continuous for subjective ranges, discrete + ticks for fixed steps, range for min/max, labels where the number drives decisions.
- Select: fixed closed lists (6+ options or tight space); radios/segmented for 2–5 visible choices; combobox for filter-as-you-type; autocomplete for free text with suggestions.

---

## 12. Cross-implementation notes

- **material-web source**: text-field container tokens, checkbox 2px shape, switch exact handle/track/dimensions, slider 6 tokens, select filled/outlined mirroring text-field — all values above are verbatim from `tokens/versions/v0_192/`.
- **No motion page** on material-web.dev (404) and no `motion.md` in theming docs — motion tokens come from `_md-sys-motion.scss` directly (short 50–200ms, medium 250–400ms, long 450–600ms, extra-long 700–1000ms; standard/emphasized/legacy/linear easings).
- **Segmented buttons live in `labs/`** (experimental, no docs page) — `md-outlined-segmented-button`, 40px, 1px outline, `secondary-container` selected. Distinct from chips (assist/filter/input/suggestion), which are dynamic groups, not exclusive choices.
