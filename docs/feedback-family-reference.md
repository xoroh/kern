# Feedback Family Reference

The complete M3 feedback specification, kern's implementation mapping, and
usage guidance. Sourced from `material-web` tokens and docs plus the live
`m3.material.io` tabs (dialogs/specs+guidelines, snackbar/specs+overview via
text-extraction proxy). Skeleton and empty-state are Kern patterns (M3 has
neither); banner follows M3 banner guidance. Reuse this when adding feedback
variants, auditing conformance, or writing component docs.

## Contents

1. [Dialogs (basic)](#1-dialogs-basic)
2. [Dialogs (full-screen)](#2-dialogs-full-screen)
3. [Alert dialogs](#3-alert-dialogs)
4. [Snackbar](#4-snackbar)
5. [Progress indicators](#5-progress-indicators)
6. [Banner, skeleton, empty state](#6-banner-skeleton-empty-state)
7. [State summary](#7-state-summary)
8. [Typography](#8-typography)
9. [Kern naming vs M3 naming](#9-kern-naming-vs-m3-naming)
10. [Kern overrides](#10-kern-overrides)
11. [Usage guidance](#11-usage-guidance-from-m3materialio-tabs)
12. [Cross-implementation notes](#12-cross-implementation-notes)

---

## 1. Dialogs (basic)

Modal windows for critical information or decisions. Interruptive by design —
use sparingly; menus and snackbars cover the rest.

Anatomy: container · optional icon · optional headline · supporting text ·
optional divider · button labels · scrim (7 parts).

| Token | Value |
| ----- | ----- |
| Container | `surface-container-high`, **28dp** (`corner-extra-large`), width min 280 / max 560, padding 24px all sides |
| Headline | `on-surface`, `headline-small` (24px/32px/400), start-aligned (center with icon) |
| Supporting | `on-surface-variant`, `body-medium` (14px/20px) |
| Icon | 24dp |
| Divider | 1px |
| Scrim | `scrim` role at 32% |
| Elevation | level3 |

Spacing: padding 24px; title–body 16px; icon–title 16px; body–actions 24px;
buttons gap 8px. Title wraps to two lines max, then truncates. Content scrolls
with title pinned top and buttons pinned bottom; never scrolls the page
behind. Buttons trail-align (confirm closest to edge; RTL mirrors); max two
actions (single = acknowledgement only); never a third navigating action
(use inline expansion instead).

API: `open`/`show()`/`close()` with open/opened/close/closed/cancel events;
`returnValue` identifies the closing button; `type="alert"` announces
`alertdialog`; `no-focus-trap` opts out (not recommended); `autofocus` picks
the initial focus. Full-screen variant: 0dp shape, 56px header + bottom bar,
close X only, compact breakpoints only, unsaved-close confirms via a basic
dialog.

---

## 2. Dialogs (full-screen)

Entire-screen tasks (multi-step creation flows). Container 0dp shape, header
56px, bottom action bar 56px, max 560px width. Save/Cancel semantics (never
vague Done/OK); field errors inline, never blocking the confirm; dismissing
confirms discard via a basic dialog. Compact breakpoints only — larger
screens get a basic dialog. Only surface over which other dialogs may appear.

---

## 3. Alert dialogs

`type="alert"` on the dialog contract: error confirmations and action prompts
requiring response. Labelled by headline or explicit `aria-label`. Same
container treatment as basic dialogs.

---

## 4. Snackbar

Short updates at the bottom; low importance, optional action, may
auto-dismiss. Never interrupt like a dialog.

Anatomy: container · optional close icon · optional action · supporting text.
Five configurations: single/two-line, with/without action, longer action.

| Token | Value |
| ----- | ----- |
| Container | `inverse-surface`, 4px (`corner-extra-small`) |
| Supporting | `inverse-on-surface` |
| Action | `inverse-primary` |
| Elevation | level3 |

Managed via toast manager (`Provider`/`Viewport`/`List` + `add`/`close`);
action fires and dismisses; `aria-live="polite"`, atomic announcements.

---

## 5. Progress indicators

Ongoing-process status. Determinate (known fraction) or indeterminate (loop);
four-color cycling for brand moments; linear buffer for known+unknown mixes.

| Token | Value |
| ----- | ----- |
| Circular size | **48px** default, 8.333% indicator arc |
| Circular color | `primary` (four-color cycles primary → primary-container → tertiary → tertiary-container over 5.332s) |
| Linear track | `surface-container-highest`, 4px, `corner-none` |
| Linear indicator | `primary`, 4px |
| Linear loop | 2s linear infinite, two offset bars |
| Linear buffer | dots behind the bar at 24% primary |

API: `value`/`max` (default 1), `indeterminate`, `fourColor`, `buffer`,
`aria-label` required. Determinate reports `aria-valuenow`; indeterminate
reports `status`. Determinate value changes animate `stroke-dashoffset` over
500ms.

---

## 6. Banner, skeleton, empty state

- **Banner**: inline notice with icon, text, and actions. Kern pattern (M3
  banners are full-width surfaces; kern renders the compact form).
- **Skeleton**: accessible placeholder (`aria-label` names what loads).
  Kern pattern — M3 has no skeleton component.
- **Empty state**: title + body + action for zero-content views. Kern
  pattern — M3 has no empty-state component. Name what is missing, show the
  one action that fills it.

---

## 7. State summary

| Component | Resting | Hover | Focus | Pressed | Disabled |
| --------- | ------- | ----- | ----- | ------- | -------- |
| Dialog | level3, scrim 32% | — | trap | — | n/a (modal) |
| Snackbar | level3 inverse | — | — | — | n/a (transient) |
| Linear determinate | 4px track + bar | — | — | — | track 12% / bar 38% |
| Linear indeterminate | 2s loop | — | — | — | n/a |
| Circular | 48px arc | — | — | — | n/a |

---

## 8. Typography

- Dialog headline: `headline-small` (24px/32px/400).
- Dialog supporting: `body-medium` (14px/20px, `on-surface-variant`).
- Snackbar text: 14px on `inverse-on-surface`; action medium weight.
- Progress labels: via `aria-label`, not visible text.

---

## 9. Kern naming vs M3 naming

| M3 name | Kern name | Notes |
| ------- | --------- | ----- |
| Basic dialog | `Dialog` compound (Root/Trigger/Content/Title/Description/Close) | `modal` prop mirrors root; `aria-modal` set manually |
| Alert dialog | `AlertDialog` compound | `type="alert"` semantics |
| Full-screen dialog | composed from Dialog + app chrome | no dedicated component; documented pattern |
| Snackbar | `Snackbar` (Provider/Viewport/List + manager) | toast architecture, not a single mount |
| Circular/linear progress | `CircularProgress` / `LinearProgress` | `value` omitted = indeterminate; `fourColor`, `buffer` |
| Banner / Skeleton / EmptyState | same names | Kern patterns beyond M3 |

---

## 10. Kern overrides

1. **No `soft-disabled` equivalents** on feedback surfaces (transient/modal
   surfaces are never disabled — they dismiss instead).
2. **`min-w`/`max-w` via arbitrary values** (280/560px) rather than tokens —
   M3 tabulates dp, Tailwind needs the same numbers inline.
3. **Scrim 32%** — within M3's scrim range; matches the drawer scrim family.
4. **Banner/skeleton/empty-state are Kern inventions** — shaped by M3 roles
   but with no M3 source to conform to.
5. **Inter** instead of Roboto for all type.

---

## 11. Usage guidance (from m3.material.io tabs)

### Dialogs

- Use for blocking prompts and critical information requiring a task,
  decision, or acknowledgement. Sparingly — interruption is the point.
- Headlines: brief specific questions, never apologies/alarm/ambiguity
  ("Use location service?", never "Are you sure?").
- Max two actions: single = acknowledgement; pair = confirm + dismiss with
  confirm closest to the trailing edge. Dismissive actions are never disabled;
  disable confirm until prerequisites hold.
- Snackbar vs dialog: low importance + optional action + auto-dismiss =
  snackbar; high importance + required action = dialog.

### Snackbar

- Bottom of screen, short updates, never interruptive. Dismiss on their own
  or persist for action — never block.
- One action max, in `inverse-primary`. Two lines max.

### Progress

- Determinate for known fractions; indeterminate loops for unknown waits.
- Four-color for brand moments, not every spinner.
- Buffer where part of the work is measurable and part is not (streaming).
- Always label for AT (`aria-label`); determinate reports value, loop
  reports status.

---

## 12. Cross-implementation notes

- **material-web tokens**: dialog (container `surface-container-high`,
  headline `headline-small`, supporting `body-medium`); circular (48px,
  8.333% arc, `primary`); linear (track `surface-container-highest` 4px
  `corner-none`, indicator `primary` 4px). Snackbar has no material-web
  component — values come from the m3 spec tabs.
- **M3 dialog measurements** (specs tab): 28dp shape, 280/560 width,
  24dp padding, 16/16/24dp internal gaps, 8dp button gap, 24dp icon.
- **No motion page** on material-web.dev; progress loop timings
  (2s linear, 5.332s four-color cycle, 500ms determinate) come from the
  motion token research in the button-family pass.
- **Snackbar elevation**: M3 does not tabulate snackbar in the elevation
  table (stays K11 unassigned); level3 chosen as the floating-surface value
  matching dialog/FAB prominence.
