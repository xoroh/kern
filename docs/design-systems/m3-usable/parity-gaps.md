# M3 → Kern parity gaps (generated, review before use)

_Codes: **B** both renderers · **W** web only · **N** native only · **G** gap · **R** rent/wrap. Generated from the kern tree on 2026-10-10 — verify each row against `docs/design-systems/matrix.md` and the package exports before planning work._

| M3 part | kern name | status | usable spec |
|---------|-----------|--------|-------------|
| app-bars | top-app-bar | **B** | `components/app-bars.md` |
| badges | badge | **B** | `components/badges.md` |
| bottom-sheets | sheet | **B** | `components/bottom-sheets.md` |
| button-groups | button-group | **B** | `components/button-groups.md` |
| buttons | button | **B** | `components/buttons.md` |
| cards | card | **B** | `components/cards.md` |
| carousel | carousel | **B** | `components/carousel.md` |
| checkbox | checkbox | **B** | `components/checkbox.md` |
| chips | chip | **B** | `components/chips.md` |
| date-pickers | calendar | **B** | `components/date-pickers.md` |
| dialogs | dialog | **B** | `components/dialogs.md` |
| divider | separator | **B** | `components/divider.md` |
| extended-fab | extended-fab | **B** | `components/extended-fab.md` |
| fab-menu | fab-menu | **B** | `components/fab-menu.md` |
| floating-action-button | fab | **B** | `components/floating-action-button.md` |
| icon-buttons | icon-button | **B** | `components/icon-buttons.md` |
| lists | list-item | **B** | `components/lists.md` |
| loading-indicator | loader | **B** | `components/loading-indicator.md` |
| menus | menu | **B** | `components/menus.md` |
| navigation-bar | navigation-bar | **B** | `components/navigation-bar.md` |
| navigation-drawer | navigation-drawer | **B** | `components/navigation-drawer.md` |
| navigation-rail | navigation-rail | **B** | `components/navigation-rail.md` |
| progress-indicators | progress | **B** | `components/progress-indicators.md` |
| radio-button | radio-group | **B** | `components/radio-button.md` |
| search | search | **B** | `components/search.md` |
| segmented-buttons | segmented-button | **B** | `components/segmented-buttons.md` |
| side-sheets | sheet | **B** | `components/side-sheets.md` |
| sliders | slider | **B** | `components/sliders.md` |
| snackbar | snackbar | **B** | `components/snackbar.md` |
| split-button | split-button | **B** | `components/split-button.md` |
| switch | switch | **B** | `components/switch.md` |
| tabs | tabs | **B** | `components/tabs.md` |
| text-fields | input/field | **B** | `components/text-fields.md` |
| time-pickers | time-picker | **B** | `components/time-pickers.md` |
| toolbars | toolbar | **B** | `components/toolbars.md` |
| tooltips | tooltip | **B** | `components/tooltips.md` |

## System-level gaps (check, not generated)

- Dynamic color (MCU `code/material-color-utilities/`) — Kern uses a fixed seed by design; track as non-goal or roadmap.
- M3 Expressive variants (toggle buttons, morphing shapes, new sizes) — see per-component `specs` sections.
- Date/time range pickers, data-grid beyond basic table, carousel expressive alignment — see `docs/design-systems/README.md` known gaps.
