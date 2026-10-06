# Mantine — part-by-part vs kern

**Identity:** 119 core components + 82 hooks + dates/form/charts/schedule verticals + x/ extensions; configurator demos; local Fuse search; LLM-first landing.
**Sources:** OSS-DEEP-WEB-mantine.md; mantine.dev.

## Parts: they-have / we-will-have
- Core 119 (inputs, overlays, nav, display, feedback incl. app-shell, action-icon, dropzone-ish inputs): Y / **B** for the M3-overlapping ~70; extras (app-shell→start panes have; spotlight→command B) mapped individually.
- Hooks 82 (use-disclosure, use-click-outside, use-color-scheme…): Y / **G** — kern has no hooks-as-docs-track; decide: scoped hooks library or per-component hooks only.
- Dates 16 / Form 16: Y / **P** (calendar/time-picker/field/form B; validation library = G).
- Charts 23: Y / **R** (theme-don't-build).
- Schedule 14: Y / **G**.
- x/ extensions 10 (carousel, modals, notifications, spotlight, tiptap…): Y / model for kern ext: tier placement.
- Theming (colors, primaryShade, defaultRadius, DEFAULT_THEME readability): Y / kern-theme (role-based, not xs–xl — keep M3 roles, steal readability).
- Styles system (css-variables, styles-api, `data-variant` custom-variant escape hatch): Y / steal the escape-hatch idea for kern variants.

## Patterns to carry
Configurator demos (live prop editing); simplest docgen pipeline; interactive install picker; LLM/skills CTA on landing; single readable DEFAULT_THEME.
