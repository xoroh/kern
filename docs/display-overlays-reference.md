# Display + Overlays Reference

The complete M3 display and overlay specification, kern's implementation
mapping, and usage guidance. Sourced from `material-web` tokens and docs plus
the live `m3.material.io` tabs (cards/specs+guidelines+accessibility,
chips pages, badges overview/specs/accessibility, dialogs/specs+guidelines
via text-extraction proxy). Skeleton, empty-state, meter, and table chrome
are Kern patterns (M3 has none); banner follows M3 banner guidance. Reuse
this when adding display variants, auditing conformance, or writing docs.

## Contents

1. [Chips](#1-chips-assist--filter--input--suggestion)
2. [Cards](#2-cards-elevated--filled--outlined)
3. [Badges](#3-badges)
4. [Lists](#4-lists)
5. [Sheets and drawers](#5-sheets-and-drawers)
6. [Popover and menus](#6-popover-and-menus)
7. [Tooltip, avatar, table, meter](#7-tooltip-avatar-table-meter)
8. [State summary](#8-state-summary)
9. [Kern naming vs M3 naming](#9-kern-naming-vs-m3-naming)
10. [Kern overrides](#10-kern-overrides)
11. [Usage guidance](#11-usage-guidance-from-m3materialio-tabs)
12. [Cross-implementation notes](#12-cross-implementation-notes)

---

## 1. Chips (assist · filter · input · suggestion)

Dynamic groups, never lone actions. 32px high, **8px** shape, 18px icons,
label-large type, 16px side padding (8px with icon). Labels 20 chars max.

| Variant | Container | Label | Selected |
| ------- | --------- | ----- | -------- |
| Assist | `outline` border, transparent | `on-surface` | n/a (action) |
| Filter | `outline` border | `on-surface` | `secondary-container` + `on-secondary-container` + leading check |
| Input | `outline-variant` border | `on-surface` | removable trailing icon |
| Suggestion | `outline` border | `on-surface` | n/a (action) |

Selected filter appends a leading 18px check. Input chips carry a required
trailing remove (48dp target). Avatar 24dp circle where user images apply.
Elevated chips float on images only — never on the page, never for pressed
state (ripple instead). Chip sets are `toolbar` role, horizontal scroll,
never a single chip. Disabled chips leave tab order unless `soft-disabled` /
`always-focusable` keeps them discoverable.

---

## 2. Cards (elevated · filled · outlined)

Single-subject containers. Only the container is required; everything else
(headline, subhead, supporting text, media, buttons, dividers, menus) is
optional and ordered by hierarchy.

| Variant | Container | Elevation |
| ------- | --------- | --------- |
| Elevated | `surface-container-low` | level1 |
| Filled (default) | `surface-container-highest` | none |
| Outlined | `surface` + `outline-variant` border | none |

Shape 12px (`corner-medium`), 16px padding, 8dp max between cards. Directly
actionable cards are one tab stop (button/link role, ripple on tap); otherwise
the card is inert and each control inside tabs separately. Content never
scrolls inside; expand via container transform for hero moments. Swipe one
action per card; drag lifts elevation. Grid/list/carousel collections share
resting elevation.

---

## 3. Badges

Counts and unread marks anchored upper-trailing inside icon bounds.

| Size | Geometry | Colors |
| ---- | -------- | ------ |
| Small dot | 6px (3px radius) | `error` |
| Count | 16px high (8px radius), 16×34px max | `error` + `on-error` label |

Max 4 characters including `+`. Keep the default mapping (3:1 minimum).
Hide once selected. Screen readers announce the count, or "New notification"
for dots, after the destination name.

---

## 4. Lists

One-line rows **56px** (`min-h-14`), `body-large` label `on-surface`,
16px gutters. Supporting text `body-medium`/`on-surface-variant`; 24px
`on-surface-variant` icons; selected trailing icon `primary`. State layers
`on-surface` 8/12/12%. Disabled label 30%, icons 38% (the list split differs
from buttons' 38/12 — both values are M3-tabulated).

---

## 5. Sheets and drawers

Bottom drawer and side sheets: `surface-container-low` fill, level1 shadow (M3 tabulates modal drawer/sheets at level 1),
28px leading-edge rounding, no borders, scrim/32 backdrop. Bottom sheets cap
at 80vh; side sheets fix at 24rem (80vw cap). Content scrolls inside; title
pins top where applicable.

---

## 6. Popover and menus

Temporary anchored surfaces: `surface-container` fill, 4px shape, level2
shadow, no border. Items are 48px dense list rows with state layers (not
fills) and the 38%/30% disabled split.

---

## 7. Tooltip, avatar, table, meter

- **Tooltip**: `inverse-surface` + `inverse-on-surface`, 4px shape, level2.
  Trigger-named, hover/focus revealed.
- **Avatar**: full-circle image or `primary` initial fallback (sm 32 / default
  40 / lg 56).
- **Table**: `outline-variant` wrapper, tonal head row, 48/56px rows.
- **Meter**: measured bar with label + value slots.

---

## 8. State summary

| Component | Resting | Hover | Focus | Pressed | Disabled |
| --------- | ------- | ----- | ----- | ------- | -------- |
| Chip | transparent/border | 8% layer | 12% layer | 12% layer | text 38% |
| Chip selected | secondary-container | same + layer | same + layer | same + layer | 38% |
| Card | per-variant fill | — | ring | — | n/a |
| Badge | error fill | — | — | — | n/a (hides) |
| List row | transparent | 8% layer | 12% layer | 12% layer | label 30% |
| Sheet/drawer | level1 | — | trap | — | n/a (modal) |
| Menu item | transparent | 8% layer | 12% layer | 12% layer | label 30% |

---

## 9. Kern naming vs M3 naming

| M3 name | Kern name | Notes |
| ------- | --------- | ----- |
| Assist/filter/input/suggestion chip | `Chip variant` | filter carries selection + check; input expects trailing remove composed by caller |
| Elevated/filled/outlined card | `Card variant` | filled is default |
| Small/large badge | `Badge variant="dot"/"count"` | 6px / 16px per spec |
| List item | `ListItem` (static/action/href triple) | 56px rows |
| Bottom sheet / side sheet | `Drawer` / `Sheet side` | shared container-low + level1 treatment |
| Menu surface | `menuPopupClass` / `Popover` | shared 4px + level2 treatment |
| Tooltip | `Tooltip` compound | inverse treatment |
| — | `Avatar` / `Meter` / `Table` | Kern patterns beyond M3 |

---

## 10. Kern overrides

1. **Menu/list rows 48px** (M3 one-line is 56px for lists; menus are dense
   by convention — documented here).
2. **No `elevated` chip prop** — elevation on images via `className`, not a
   variant (M3 allows it contextually; kern keeps four flat variants).
3. **No avatar/remove subcomponents on Chip** — compose `Avatar` + trailing
   `IconButton` beside the chip; a combined API is tracked, not shipped.
4. **No `soft-disabled` on chips** — disabled chips leave tab order.
5. **Avatar/meter/table are Kern inventions** — shaped by M3 roles
   with no M3 source to conform to.
6. **Inter** instead of Roboto for all type.

---

## 11. Usage guidance (from m3.material.io tabs)

### Chips

- Chips fork paths for the current task; buttons walk linear steps. Never
  finish a task with a chip ("Save task" is a button).
- Present contextual supplemental options ("Reserve a table"); appear in
  sets that scroll horizontally, never alone.
- Assist for smart cross-app actions (verb-first: Get, Add); filter with
  nouns (never "Exclude X"); input for user-entered discretes (contacts);
  suggestion for dynamic narrowing (replies).
- Labels 20 chars max, skip articles. Filter sets stay single- or
  multi-select per page, never mixed. Input trailing remove is required;
  filter trailing is optional (menu or remove, 48dp target).

### Cards

- One subject per card; scan-first hierarchy (headline → supporting →
  actions). Never force non-card content into cards.
- Directly actionable XOR container-with-actions — never both (no nested
  interactivity). Ripple on tap for actionable cards.
- Overflow menus go upper- or lower-right. Dividers split expandable
  regions (full-width) or related content (inset).
- Never scroll inside; expand to reveal. Never place text on images
  without scrim/bounding shape at contrast.

### Badges

- Anchor upper-trailing inside icon bounds. Four chars max with `+`.
- Keep `error`/`on-error` unless 3:1 is proven otherwise.
- Announce counts; hide on selection.

---

## 12. Cross-implementation notes

- **material-web tokens**: chip container 8px + label-large + per-variant
  outline/fill roles; card per-variant fills; badge error roles + 6/16px
  geometry; list 56/72/88px rows + 30%/38% disabled split; menu 4px +
  level2 + secondary-container selection.
- **M3 dialog measurements** apply to sheets by analogy (28px shape, 24px
  padding); sheets are not separately tabulated in the tokens fetched.
- **No material-web snackbar/tooltip/badge components** — badge values come
  from the m3 spec tabs; tooltip inverse roles from system tokens.
- **Avatar/meter/table** have no M3 source; values are Kern decisions
  recorded here, not conformance claims.
