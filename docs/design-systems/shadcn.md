# shadcn/ui — part-by-part vs kern

**Identity:** not a library — copy-own components (Radix/Base UI/Aria bases) + registry distribution (`npx shadcn add`) + blocks (28) + charts (71, Recharts) + TanStack Start install target.
**Sources:** OSS-DEEP-WEB-shadcn-ui.md; ui.shadcn.com/docs, /blocks, /docs/registry.

## Parts: they-have / we-will-have
- Form controls (button, input, textarea, select, checkbox, radio, switch, slider, input-otp, combobox, date-picker, field): Y / **B** (all incl. input-otp, combobox, calendar-backed pickers).
- Overlays (dialog, alert-dialog, sheet, drawer, popover, hover-card, tooltip, context-menu, dropdown-menu, menubar, command): Y / **B** except hover-card (kern ruled out on native; web has preview-card) and command (**B**).
- Navigation (breadcrumb, navigation-menu, pagination, sidebar, tabs): Y / **B** (navigation-menu/bar/drawer, pagination, tabs/secondary-tabs).
- Data display (avatar, badge, card, carousel, chart, table, data-table, calendar, empty, skeleton, separator, typography, kbd): Y / **B** most (empty-state B; data-table advanced = R/G; chart = R/G).
- Feedback (alert, sonner/toast, progress, skeleton, badge): Y / **B**.
- Blocks (dashboard-01, sidebar-01, login-01…05, …28): Y / planned (kern blocks track, same `add` shape).
- Registry-as-distribution (components, hooks, pages, config, rules; "not limited to React"): Y / kern registry (mcp manifest) — mirror the framing.
- Install paths (create → CLI → existing; TanStack Start first-class): Y / mirror the 3-path shape for kern init.

## Patterns to carry
Chromeless `/view` demo endpoints + screenshot capture; local offline search; copy-page-as-Markdown; one-preview-per-variant; CLI-vs-manual install tabs. Do NOT copy hand-written API tables or the missing a11y template.
