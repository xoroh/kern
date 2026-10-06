# kern as a multi-design-system — research track

**Status:** research only, NO implementation (founder directive). A design to decide later.
**Question answered here:** for every major open-source design system, part by part — what do they have, and what will kern have for that part (same token design + kern branding)?

## Files
- `matrix.md` — the comparison matrix (all systems × part families, compact codes).
- `<system>.md` — one file per system: identity, component inventory, tokens, patterns, per-part they-have / we-will-have.
- Systems: m3-material-web, mui, shadcn, base-ui, mantine, chakra, ant, carbon, fluent, tamagui, rn-paper, nativebase, gluestack.

## Codes (matrix + per-part tables)
- They-have: **Y** = have · **P** = partial/narrow · **–** = absent.
- kern we-will-have: **B** = both renderers · **W** = web only · **N** = native only · **G** = gap (decide later) · **R** = rent/wrap engine, kern skin (charts, grid, scheduler class).

## kern inventory baseline (2026-10-03, first-hand)
Web ~70 (`packages/kern/src/components/`), native ~65 (`packages/kern-native/src/components/`): accordion, alert-dialog, autocomplete, avatar, badge, banner, button(+group), calendar, card, carousel, checkbox(+group), chip, circular/linear-progress, collapsible, combobox, command, context-menu, country-select, dialog, drawer, empty-state, extended-fab, fab(+menu), field(+fieldset, message), form, icon-button, input(+otp), kbd, label, list-item, loader(+button), menubar, menu, meter, native-select, navigation-bar/drawer/menu, number-field, pagination, popover, preview-card, progress, radio-group, search, secondary-tabs, segmented-button, select, separator, sheet family, skeleton, slider, snackbar/sonner, split-button, switch, table (basic), tabs, text/textarea, time-picker, toggle(+group), toolbar, tooltip — plus native-only sheets (bottom/snap/dock/picker/entity), layouts, shell, menus, top-app-bar, pressable, shape-art, milestone-trio.
Known gaps: data grid (beyond basic table), charts, range pickers, scheduler/Gantt, RTE, file manager, pivot, tree-advanced, diagram (see ENTERPRISE-R10-gaps.md).
