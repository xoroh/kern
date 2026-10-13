# Navigation Family Reference

The complete M3 navigation specification, kern's implementation mapping, and
usage guidance. Sourced from `material-web` v0.192 tokens and
`material-web.dev/components/{tabs,menu}/` (the machine-readable M3 spec —
`m3.material.io` is JS-gated). Navigation bar/drawer/rail have no stable
material-web docs (labs-only); their specs come from token files and the M3
design articles. Reuse this when adding navigation variants, auditing
conformance, or writing component docs.

## Contents

1. [Navigation bar](#1-navigation-bar)
2. [Navigation drawer](#2-navigation-drawer)
3. [Navigation rail](#3-navigation-rail)
4. [Tabs (primary)](#4-tabs-primary)
5. [Tabs (secondary)](#5-tabs-secondary)
6. [Menus](#6-menus)
7. [Toolbar, menubar, pagination](#7-toolbar-menubar-pagination)
8. [State summary](#8-state-summary)
9. [Typography](#9-typography)
10. [Kern naming vs M3 naming](#10-kern-naming-vs-m3-naming)
11. [Kern overrides](#11-kern-overrides)
12. [Usage guidance](#12-usage-guidance-from-material-webdev)
13. [Cross-implementation notes](#13-cross-implementation-notes)

---

## 1. Navigation bar

Compact-screen destination switcher. 3–5 destinations, bottom edge, **80px**
tall, never reflows. One destination list feeds the bar, rail, and drawer.

| Token | Value |
| ----- | ----- |
| Bar height | **80px** |
| Bar fill | `surface-container` |
| Bar elevation | level2 shadow |
| Icon pill | h-8 (32px) w-16 (64px), `corner-full` |
| Selected pill fill | `secondary-container` |
| Selected icon | `on-secondary-container`, 24px |
| Unselected icon | `on-surface-variant`, 24px |
| Selected label | `on-surface`, semibold 12px |
| Unselected label | `on-surface-variant`, medium 12px |
| Badge | upper-trailing inside icon bounds |
| State layers | `on-surface` 8/12/12%; selected uses `on-secondary-container` layers |
| Destinations | min 3 (fewer is a tab strip), max 5 (more becomes a drawer) |
| Disabled | 38% whole (announced, skipped by traversal) |

Keyboard: roving tabindex (one stop), arrows move + auto-activate, Home/End
jump, skips disabled. `aria-current="page"` on active (web);
`accessibilityRole="tab"` + `selected` (native). Optional `floating` slot
above the bar for a FAB dock.

---

## 2. Navigation drawer

Modal side sheet for navigation. **360px** wide (capped at 80vw so tablets keep
content visible), full height, `corner-large` on the content-facing edge,
`surface-container-low` fill. Scrim 40%, Escape closes, focus traps and returns
to the trigger. Header (title + subtitle) + destination list + footer.
Item activation closes the drawer. `aria-modal="true"` set manually.

Items share the `NavigationBarItem` treatment: 56px minimum rows,
`secondary-container` pill + `on-secondary-container` when selected.

---

## 3. Navigation rail

Medium-screen rail. **80px** wide, full height, vertical icon+label buttons
with the same pill indicator as the bar. Optional header slot (menu/FAB).
Same destination data as bar and drawer.

---

## 4. Tabs (primary)

Top of the content pane under the top app bar. Main content destinations.

| Token | Value |
| ----- | ----- |
| Container | `surface`, elevation 0, `corner-none`, **48px** high (64px with icon+label) |
| Indicator | `primary`, **3px**, shape (3px 3px 0 0) |
| Label | `title-small` (14px/20px/500/0.00625rem) |
| Active label/icon | `primary` |
| Inactive label/icon | `on-surface-variant` → `on-surface` on hover/focus/press |
| Icon | 24px |
| State layers | active `primary` 8/12/12%; inactive `on-surface` 8/12% + pressed `primary` 12% |

API: `active` selects, `change` event (cancellable via `preventDefault` on the
triggering key/click), `auto-activate`, `activeTabIndex`, `scrollToTab`.
`inline-icon` renders icons beside labels instead of stacked. Icon-only tabs
require `aria-label`. Every tab references its panel (`aria-controls` +
`role="tabpanel"` + `aria-labelledby`).

---

## 5. Tabs (secondary)

Sub-section switcher inside a primary view. Same behavior, different emphasis:

| Token | Value |
| ----- | ----- |
| Indicator | `primary`, **2px** (not 3px) |
| Active label/icon | **`on-surface`** (not primary) |
| Inactive label/icon | `on-surface-variant` → `on-surface` on interaction |
| State layers | all `on-surface` 8/12/12% |
| Label | `title-small` |

Only the active panel mounts (inactive panels unmount, never hide — hidden
panels still announce). Empty or all-disabled renders no tablist at all.

---

## 6. Menus

Temporary surfaces listing choices, anchored to a trigger. Container
`surface-container`, elevation **level2**, shape `corner-extra-small` (4px),
no border (shadow separates). Selected item: `secondary-container` +
`on-secondary-container`.

Items follow list-item metrics: one-line 56px (kern dense 48px), `body-large`
label `on-surface`, 24px `on-surface-variant` icons, state layers `on-surface`
8/12/12%. Disabled: label 30%, icons 38% (M3 list tokens — note the 30/38
split differs from buttons' 38/12).

Positioning: `absolute` (default, needs `relative` parent), `popover` (top
layer, Chrome 114+/Safari 17+), `fixed` (window, no scroll-with-anchor),
`document` (hoisted DOM). Submenus need `has-overflow`; hover open/close
delays 400ms. Typeahead buffer 200ms. `close-menu` event reports initiator,
reason, and item path. Dividers are `role="separator"` with `tabindex="-1"`.

Accessibility: default `role="menu"`/`menuitem`; adaptable via `type`
(listbox/option for combobox patterns); menu-button pattern per W3C APG.

---

## 7. Toolbar, menubar, pagination

These are host chrome rather than M3 components (M3 has no toolbar or
pagination; menubar follows platform conventions):

- **Toolbar**: floating pill action bar (`corner-full`, `surface-tonal`,
  level2). Buttons 40px round, layers `on-surface`, selected
  `secondary-container`.
- **Menubar**: desktop File/Edit/View strip. Triggers use state layers (not
  fills) for highlight and open states.
- **Pagination**: pill page buttons. Current page fills `primary`;
  everything else layers. Disabled splits 38%.

---

## 8. State summary

| Component | Resting | Hover | Focus | Pressed | Disabled |
| --------- | ------- | ----- | ----- | ------- | -------- |
| Nav bar destination | transparent | 8% layer | 12% layer | 12% layer | 38% whole |
| Nav bar selected | secondary pill | same + layer | same + layer | same + layer | 38% |
| Primary tab | transparent | 8% + on-surface text | 12% + on-surface text | 12% + on-surface text | 38% |
| Secondary tab | transparent | 8% + on-surface text | 12% + on-surface text | 12% + on-surface text | 38% |
| Menu item | transparent | 8% layer | 12% layer | 12% layer | label 30%, icon 38% |
| Toolbar button | transparent | 8% layer | 12% layer | 12% layer | 38% |

---

## 9. Typography

- Nav bar labels: 12px (`label-medium`-ish), medium unselected / semibold selected.
- Tab labels: `title-small` (14px/20px/500/0.00625rem).
- Menu items: `body-large` label, `body-medium` supporting, `label-small` trailing.
- Toolbar/menubar triggers: 14px medium with title-small tracking.

---

## 10. Kern naming vs M3 naming

| M3 name | Kern name | Notes |
| ------- | --------- | ----- |
| Navigation bar | `NavigationBar` + `destinations` | one list feeds bar/rail/drawer |
| Navigation drawer (modal) | `NavigationDrawer` | 360px, scrim, focus trap |
| Navigation rail | `NavigationRail` (in `/start`) | 80px, in AppShell `rail` slot |
| Primary tab | `Tabs` compound | 3px indicator, primary active |
| Secondary tab | `SecondaryTabs` (data array) | 2px indicator, on-surface active |
| Menu / menu item | `Menu` + `menuPopupClass`/`menuItemClass` | shared classes for FabMenu/SplitButton |
| — | `Toolbar` / `Menubar` / `Pagination` | host chrome, not M3 components |

---

## 11. Kern overrides

1. **Menu items 48px** (M3 list one-line is 56px) — dense menus read better; documented here.
2. **Nav bar selected label semibold** — M3 uses medium throughout; semibold adds hierarchy.
3. **No `soft-disabled` / `always-focusable`** — disabled nav items leave the tab order.
4. **No popover/fixed/document positioning modes** on Menu — absolute positioning via Base UI; hosts needing top-layer escape hatch use Dialog/Sheet.
5. **No submenu hover delays** — submenus open on click/Enter, not 400ms hover.
6. **Inter** instead of Roboto for all type.

---

## 12. Usage guidance (from material-web.dev)

### Tabs

- Primary tabs sit under the top app bar for main destinations; secondary tabs
  live inside content for sub-sections. Never mix types in one bar.
- One tab's content shows at a time; tabs never navigate away (that's
  navigation). Three or more tabs; fewer is a segmented control or plain text.
- Icons communicate content type; labels name it. Icon-only tabs must be
  labelled for AT.

### Menus

- Anchor or anchorElement plus a `position: relative` parent are required.
- Keyboard and typeahead come free; inspect `close-menu` details to learn how
  the menu closed. Arrow icons signal submenus.
- Dividers separate groups, never single items. Disabled items stay visible
  but inert so the set reads complete.

### Navigation

- Bar for compact screens (3–5), rail for medium, drawer for many destinations
  or modal contexts. One destination list drives all three.
- Exactly one destination active. Badges mark counts, never decorate.
- FAB docks above the bar, never inside it.

---

## 13. Cross-implementation notes

- **material-web tokens**: primary-tab (43 tokens) vs secondary-tab (30 tokens)
  confirm the 3px/2px indicator split and the primary/on-surface active-text
  split. Menu (8 tokens) delegates everything else to list tokens; list
  disabled is the 30%/38% split found nowhere else.
- **No stable material-web docs** for nav-bar/drawer/rail (labs-only 404s) —
  specs above come from token files, M3 design articles, and the Android
  implementation.
- **Segmented buttons live in `labs/`** (experimental) — see the button-family
  reference for the full segmented spec; do not confuse with chips
  (assist/filter/input/suggestion), which are dynamic groups, not exclusive
  choices.
