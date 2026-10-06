# MUI (Material UI + MUI X) — part-by-part vs kern

**Identity:** React implementation of Material Design **2** (+ Emotion `sx`), 63 component dirs, ~645 demos; docs = data-not-pages + api-docs-builder. **MUI X** = open-core advanced suite: Community MIT (basic grid/charts/pickers/tree) → Pro $299/yr/dev → Premium $599 → Enterprise $1,399.
**Sources:** OSS-DEEP-WEB-material-ui.md; mui.com/material-ui, /x/introduction/licensing, /pricing; ENTERPRISE-R10-gaps.md.

## Parts: they-have / we-will-have
- Core inputs (Button, TextField, Select, Checkbox, Radio, Switch, Slider, Autocomplete): Y / **B** (all; autocomplete B).
- Pickers (date/time/datetime Community; range Pro): Y / **B** minus range (**G**).
- Data Grid (Community → Pro multi-filter/sort/pin → Premium grouping/Excel): Y / **W-basic** (table); advanced = **R/G** (R10 Phase B rent-first spike).
- Charts (Community → Pro advanced → Premium WebGL): Y / **G** (R: theme-don't-build, ECharts/Recharts spike).
- Tree View (Community → Pro dnd/virtualization): Y / **G** (no kern tree).
- Scheduler: Y (Premium) / **G** (on-demand only).
- Feedback (Alert, Snackbar, Dialog, Backdrop, Skeleton, Progress): Y / **B** (all incl. sonner, skeleton).
- Navigation (AppBar, Drawer, Tabs, BottomNavigation, Breadcrumbs, Menu, Pagination, SpeedDial, Stepper, Timeline): Y / **B** most (drawer, tabs, menubar, menu, pagination, navigation-bar/drawer; steppers/timeline/speed-dial = G).
- Surfaces (Card, Paper, Accordion, Container, Grid/Stack/Box): Y / **B** (card, accordion; layout via native layouts + start panes).
- Utils (Modal, Popover, Popper, Portal, Transitions, useMediaQuery, ClickAway): Y / **B** (popover, overlay-surfaces, transitions via motion tokens).
- Theming (`sx`, theme overrides 4-level ladder, `skills/material-ui-styling`): Y / kern-theme + deviations doc (steal the ladder + the skill).
- Templates/blocks: Y (templates with extractable parts) / blocks track planned (shadcn-shape).

## Patterns to carry
Data-not-pages docs; generated API tables; per-demo axe JSON; single `pages.ts` nav; published API-design rules; building-blocks-not-coverage stance. MUI X proves the open-core pricing ladder kern may one day mirror (MIT core + additive paid supersets).
