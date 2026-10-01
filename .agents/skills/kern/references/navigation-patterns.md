> **Kern note:** MD3 navigation selection logic. Kern's default shell is a **56px topbar + 220px sidebar + scrollable content** (see § Kern Sidebar below). Use the decision tree below for adaptive/mobile cases; apply Kern values (white chrome, `border-black/10` dividers, `bg-black text-white rounded-full` active nav).

# MD3 Navigation Patterns

Guide for choosing and implementing Material Design 3 navigation components.

## Navigation Component Selection

### Decision Tree

```
How many primary destinations?
├── 2 destinations → Tabs (primary)
├── 3–5 destinations
│   ├── Compact screen (<600dp) → Navigation Bar (bottom)
│   ├── Medium screen (600–839dp) → Navigation Rail (side)
│   └── Expanded+ screen (840dp+) → Navigation Drawer (side) or Rail
├── 6+ destinations
│   ├── Compact → Navigation Drawer (modal)
│   ├── Medium → Navigation Drawer (standard) or Rail + overflow menu
│   └── Expanded+ → Navigation Drawer (standard)
└── Hierarchical (nested sections)
    └── Navigation Drawer with sections
```

### Quick Reference

| Component | Destinations | Screen Size | Persistence | Position |
|-----------|-------------|-------------|-------------|----------|
| Navigation Bar | 3–5 | Compact | Persistent | Bottom |
| Navigation Rail | 3–7 | Medium | Persistent | Side (start) |
| Navigation Drawer | Unlimited | Expanded+ | Standard or Modal | Side (start) |
| Tabs | 2+ related views | Any | Persistent | Top (below app bar) |

## Kern Sidebar (the default drawer)

Kern uses a persistent standard drawer as its primary navigation:

```
w-[220px] shrink-0 bg-white border-r border-black/10 sticky top-14
```

Nav item states:

| State | Background | Text |
|-------|-----------|------|
| Default | transparent | `#000000` |
| Hover | `#efefef` | `#000000` |
| Active | `#000000` | `#ffffff` |

Item: `h-14 px-3 rounded-full flex items-center gap-2 text-sm font-medium` (M3 drawer active indicator, 56dp).

M3 drawer canon: standard (persistent) vs modal (+ scrim, swipe-to-dismiss, blocked background). Measures: 360dp wide, full height, one-sided rounding (0,16,16,0); active indicator 56dp pill inset 12dp; 24dp icons; 28dp side padding. Content: headline + divider-separated sections; items = optional icon + required label + badge slot.
M3 Expressive: standard drawer deprecated → use expanded navigation rail. Kern 220px sidebar follows the 360dp-canon proportions; add the modal variant + scrim/dismiss, section/divider structure, and badge slot when adopting.

## Navigation Bar (compact)

**Use when**: 3–5 primary destinations on compact (mobile) screens; bottom, always visible; height 80dp; active item shows filled icon + indicator pill that expands from the icon center; tap triggers top-level screen transition. Always show labels. Elevation level 2 (in Kern: flat + `border-t border-black/10`). Anatomy: icon + label + active-indicator pill + optional small/large badges. FAB sits above the bar; never rail + bar together; bar may hide/show on scroll.
M3 Expressive: baseline bar deprecated → **flexible** nav bar (shorter; vertical items on compact, horizontal items on medium windows); full-width equal segments.

## Navigation Rail (medium)

**Use when**: 3–7 destinations on medium screens; start edge, width 80dp; optional top-aligned menu + FAB/extended FAB; active item shows indicator pill (`secondary-container` = `#efefef` in Kern); icon + label + indicator + small/large badges. Touch target spans the full rail width; nested FAB rests at elevation L0; rail must be the sole nav element; centered config when paired with a vertical floating toolbar; optional divider vs scrolling content. Expanded rail opens from the menu icon (icon swaps) and the page reflows.
M3 Expressive: baseline rail deprecated → **collapsed rail** (+ expanded rail replacing the drawer).

## Top App Bar

| Variant | Title | Height | Scroll Behavior |
|---------|-------|--------|----------------|
| Center-aligned | Center | 64dp | Elevates on scroll |
| Small | Start | 64dp | Elevates on scroll |
| Medium | Bottom, start | 112dp | Collapses to 64dp |
| Large | Bottom, start | 152dp | Collapses to 64dp |

> **Kern topbar:** 56px (`h-14`), `bg-white`, `border-b border-black/10`, `sticky top-0 z-10`, padding `0 24px`. Left: wordmark + context switcher pill. Right: toolbar icon buttons (`#efefef` pills).

## Tabs

- **Primary tabs**: top-level content switching.
- **Secondary tabs**: sub-sections within primary content.

Connect tabs to panels with `aria-controls` / `role="tabpanel"`.

## Responsive Navigation Pattern

The key MD3 pattern: the navigation component transforms across breakpoints.

```
Compact (<600dp):   Navigation Bar (bottom)
Medium (600–839dp): Navigation Rail (side)
Expanded (840dp+):  Navigation Drawer (side, standard)  ← Kern default
```

### Responsive Shell (Kern-flavored)

```css
.kern-app { display: flex; min-height: 100vh; background: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface); }
.kern-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.kern-body { flex: 1; padding: 32px 24px; overflow-y: auto; }

/* Compact: bottom bar */
@media (max-width: 599px) {
  .kern-app { flex-direction: column; }
  .kern-nav-rail, .kern-nav-drawer { display: none; }
  .kern-nav-bar { display: flex; order: 1; border-top: 1px solid rgba(0,0,0,0.1); }
}
/* Medium: rail */
@media (min-width: 600px) and (max-width: 839px) {
  .kern-nav-bar, .kern-nav-drawer { display: none; }
  .kern-nav-rail { display: flex; }
}
/* Expanded+: sidebar drawer */
@media (min-width: 840px) {
  .kern-nav-bar, .kern-nav-rail { display: none; }
  .kern-nav-drawer { display: flex; }
}
```

## Web and native (platform shells)

Kern shells map to the drawer pattern above on expanded screens: the web shell (`@xoroh/kern`) uses the persistent sidebar drawer; the native shell (`@xoroh/kern-native`) uses the bottom navigation bar on compact screens and the rail/drawer as space allows. Destinations stay single-select with the active indicator in every shell.

**The M3 navigation primitives now exist on both renderers** (D11: the counterpart rule forces *existence*, not renames — `Sidebar` / `NavigationRail` / `SectionDrawer` keep their kern names). One `NavigationDestination[]` feeds every container:

| Concept | Web (`@xoroh/kern`) | Native (`@xoroh/kern-native`) |
| --- | --- | --- |
| Navigation bar | `NavigationBar` — `role="navigation"`, `aria-current="page"` on the active destination, roving tabindex with Arrow/Home/End that wraps and skips disabled, 80dp, `floating` slot for a FAB | same, `accessibilityRole="tab"` + `accessibilityState.selected` |
| Navigation drawer (modal) | `NavigationDrawer` — `role="dialog"` + `aria-modal`, scrim, Escape, focus returns to the trigger; **picking a destination reports it and dismisses** | `NavigationDrawer` 360dp, `Modal` + scrim, same select-then-dismiss |
| Destination row | `NavigationBarItem` — 56dp, `secondaryContainer` pill when selected | `NavigationBarItem`, same |
| Secondary tabs | `SecondaryTabs` — `role="tablist"`, `aria-selected`, roving tabindex, inactive panels unmounted | `SecondaryTabs`, same data-array shape |

Never hand-roll a nav bar's roving tabindex: the bar is **one** tab stop with arrow traversal inside it. A bar whose five destinations are all in the tab order is the most common nav bug on the web.
