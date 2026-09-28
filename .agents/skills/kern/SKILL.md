---
name: kern
description: Kern UI by Xoroh — M3-based design system for @xoroh/kern (web React + native). Use as the primary design reference for UI, component, layout, color, typography, shape, or theming work with Kern tokens and MD3 structure.
license: Apache-2.0
---

# Kern — Xoroh Design System (Material 3 foundation)

**Kern** is the Xoroh design system. It is built on Google's **Material Design 3 (MD3 / Material You)** token architecture — `md.sys` color roles, the type scale, shape corner tokens, elevation, and motion — but expressed through a **flat, high-contrast, operator-first** lens: a neutral black/white/gray base with M3 functional color, Inter everywhere, 9999px pills, M3 elevation levels, and colorful categorization for quick visual parsing.

Kern takes MD3's **structure, color system, and rigor** (semantic color roles, tonal pairing, adaptive layout, accessibility) and applies it with a deliberately restrained expression. Where MD3 defaults to tonal shadows and spring motion, Kern chooses neutral/canvas contrast, M3 elevation levels, and utility-only motion. Functional color follows M3 roles: secondary blue for links, focus, and active accents; status roles for error / success / warning / info. **Kern embraces color for iconography and classification** (e.g. green for tasks, blue for calendar, purple for ticketing) to help operators scan dense information instantly.

## Source of truth

- **`packages/kern/src/theme/tokens.{json,ts,css}`** is the canonical Kern token source (single source → TS role tables + CSS vars). Always consult it before making design decisions.
- **[`references/kern-tokens.md`](references/kern-tokens.md)** — the Kern **MD3 role mapping** for every role (light + dark). Read this to translate any MD3 guidance into Kern.
- **`references/*`** — the vendored MD3 canon (color, typography/shape, components, navigation, layout, theming). Use these for MD3 structure; then apply the Kern overrides.

## When to use me

- Creating new UI components, pages, or layouts
- Updating existing components to match design standards
- Any question about colors, typography, spacing, shape, elevation, or theming
- Before writing custom CSS or styling from scratch
- Auditing a screen for design-system compliance

## Philosophy

Kern is a working tool, not a showcase. It is used by people doing real work — ops consoles, customer apps, field tools. Every decision is filtered through one question: **does this help the user move faster and make fewer mistakes?**

Domain needs are never baked into the core. A use case (mobility, fleet, retail…) ships as a **block**: composed components + a preset theme on top of the neutral core (`packages/kern/src/blocks/<usecase>/`). Blocks depend on core; core never depends on blocks.

MD3 gives Kern three things it keeps:
- **Semantic roles** — never hardcode a hex; use a role (`primary`, `on-surface`, `surface-container`, `outline`) so light/dark and contrast modes just work.
- **Tonal pairing** — every fill has a matching `on-*` color; only use colors in their intended pairs.
- **Adaptive layout** — breakpoints, scaffold (bars/rails/panes), canonical layouts (feed, list-detail, supporting pane), and 48dp touch targets.

MD3 defaults Kern **overrides** (see below and `kern-tokens.md`):
- **Layered Surface Shell** — Use the tonal container ladder for depth: `surface-container` (`#f6f6f6`) canvas behind `surface` (`#ffffff`) card groups. White card groups on the gray canvas create clean visual separation without borders. Only go fully seamless white (`surface` everywhere) for content-dense dashboards where every pixel matters.
- **Colorful Iconography & Badges** — Icons and badges should use distinct, vibrant colors (WhatsApp style) to differentiate categories and unread states.
- **Shadowless priority** — The resting UI is completely flat. Card groups use `gap` (typically 2px) between white items on the gray canvas for separation; reserve hairline borders for structural chrome (topbar/sidebar). Kern uses a single structural shadow (`rgba(0,0,0,0.12) 0px 4px 16px`) ONLY for floating layers (dropdowns, FABs).
- **9999px pills & MD3 chips** — `full` shape on buttons and navigation pills. Card group items use `20–28px` radius (soft rounded-rect). Cards use `small` (8px), dropdowns `medium` (12px).
- **Inter, one family** — replaces Roboto/Roboto Flex for both MD3 brand and plain typeface roles.
- **Utility motion only** — MD3 `standard` easing at short durations (100–200ms) for state changes; no expressive spring/bounce, no decorative animation.

## Decision tree

```
Color / role / dark mode      → references/color-system.md + references/kern-tokens.md
Type sizes / weights          → references/typography-and-shape.md (Inter mapping in kern-tokens.md)
Corner radius / pills         → references/typography-and-shape.md § Shape
Elevation / shadows           → references/typography-and-shape.md § Elevation + kern-tokens.md § Elevation
A component (button, card…)    → references/component-catalog.md → then apply Kern values from kern-tokens.md
Navigation (topbar/sidebar)   → references/navigation-patterns.md (§ Kern Sidebar)
Responsive / breakpoints      → references/layout-and-responsive.md (breakpoints / adaptive design, scaffold, RTL)
Theme tokens (CSS vars)       → references/theming-and-dynamic-color.md + kern-tokens.md § CSS token bridge
Theme variants / re-skinning  → references/theme-variants.md
States / selection / gestures → references/interaction-states.md
Mobile foundation (Paper vs primitives) → references/mobile-foundation.md
Icons                         → references/icons.md
Content / writing / a11y copy → references/content-design.md
```

## Kern token summary (the MD3 role mapping)

The full mapping lives in [`references/kern-tokens.md`](references/kern-tokens.md). Highlights:

| MD3 role | Kern (light) | Kern (dark) |
|----------|--------------|-------------|
| `primary` / `on-primary` | `#000000` / `#ffffff` (pure — deliberate M3 deviation, mirrors the design source) | `#FFFFFF` / `#000000` |
| `primary-container` / `on-` | `#e5e5e5` / `#000000` | `#262626` / `#FFFFFF` |
| `secondary` / `on-secondary` | `#2563eb` / `#ffffff` (Kern blue) | `#60a5fa` / `#172554` |
| `secondary-container` / `on-` | `#dbeafe` / `#1e3a8a` | `#1e3a8a` / `#dbeafe` |
| `surface` / `on-surface` | `#ffffff` / `#262626` | `#000000` / `#ffffff` |
| `on-surface-variant` | `#525252` | `#d4d4d4` |
| `surface-container-low → highest` | `#fafafa → #d4d4d4` | `#0a0a0a → #262626` |
| `surface-container` (role) / canvas | `#f5f5f5` / `#F6F6F6` canvas convention | `#171717` |
| `outline` / `outline-variant` | `#d4d4d4` / `#e5e5e5` | `#737373` / `#262626` |
| `error` / `on-error` | `#dc2626` / `#ffffff` (Kern red) | `#f87171` / `#450a0a` |
| `success` / `on-success` | `#16a34a` / `#ffffff` (Kern green) | — |
| `warning` / `on-warning` | `#a16207` / `#ffffff` (Kern yellow) | — |
| `inverse-surface` / `on-` | `#000000` / `#ffffff` | `#ffffff` / `#000000` |

Shape: `full` = 9999px (interactive), `small` = 8px (cards), `medium` = 12px (dropdowns). Type: **Inter** at 400 body / 500 UI / 600 headings.

## Anti-patterns

Kern inherits MD3's anti-patterns and adds its own:

- **Don't hardcode colors** — use `var(--md-sys-color-*)` roles or the Kern app tokens (`--primary`, `--secondary`, `--muted`). Raw hex breaks dark mode and contrast. Except for specific category icons where distinct, colorful branding is required.
- **Closed set (max colors)** — every shipped color must exist in `packages/kern/src/theme/tokens.ts` (generated from `tokens.json`, 1:1 with the design source: 220 spectrum swatches — 11 hues × 10 steps × light/dark). Roles for chrome/status; spectrum mirrors (gray, red, orange, amber, yellow, lime, green, teal, blue, purple, magenta) for icons/illustrations/charts/badges only. A hue with no palette entry doesn't ship.
- **Don't introduce hue into the chrome background** — the backgrounds, app bars, and structural chrome stay neutral (black / white / gray). Functional color follows M3 roles: `primary` blue for links, focus, and active accents; status roles for error / success / warning / info; plus color for icons, badges, charts, and data elements.
- **Don't break tonal pairing** — only pair a fill with its `on-*` color.
- **Don't use heavy or layered shadows** — shadows are strictly for floating elements (max opacity `0.16`), never for standard cards on the page.
- **Don't nest white card groups on other white card groups** — use the tonal container ladder (`surface-container` `#f6f6f6` canvas → `surface` card groups) for depth. White-on-white layering with borders creates visual noise; the gray canvas provides clean separation.
- **Don't use expressive spring/bounce motion or decorative animation** — utility transitions only.
- **Don't apply MD3's "avoid Roboto" caveat** — Kern uses **Inter** by design, replacing all MD3 typeface roles.

## Compliance audit

When asked to audit/review a screen, score 0–10 across these categories and produce a report (see `references/*` for what each entails), adapted to Kern:

| Category | Kern check |
|----------|-----------|
| Color roles | Uses `--md-sys-color-*` / Kern tokens; neutral base + correct `on-*` pairing; containers never text/icons; same region→role across breakpoints; hue only via M3 roles (`primary`, status, categorization) |
| Typography | Inter; correct MD3 scale role for the element; emphasized opt-in only; subset with size contrast |
| Shape | `full` on buttons/nav pills, `20–28px` on card group items, `small` cards, `medium` dropdowns — no magic radii; inner = outer − padding |
| Elevation | M3 levels + dp heights; resting max 3, hover +1; surfaces decoupled from levels; scrim 32%; no shadow stacks |
| Components | Matches component-catalog.md specs + kern-tokens.md values; no dead Expressive variants; dialog 2-action law, sheet 50% cap, field error-swap |
| Layout | Topbar/sidebar/content shell = scaffold bars/rails/panes; adaptive breakpoints; RTL mirrored; readable max width on wide screens |
| Navigation | Sidebar nav states enabled/disabled/hover/focus/press/selected (single-select) per navigation-patterns.md; badges anchored upper-trailing in icon |
| Motion | Utility easing only, ≤200ms; spatial vs effects split; no decorative animation |
| Accessibility | 4.5:1 text (3:1 large/UI); 48dp targets; visible focus + focus order + skip/ARIA; disabled exempt; semantic elements first |
| Theming | Roles resolve in light + dark + contrast levels; comp→sys→ref chain, `md.*` naming; no hardcoded hex |
| States | State layers hover 8 / focus 10 / press 10 / drag 16; 40dp layer; inheritance matrix honored |
| Content | Sentence case; scannable headings; alt text ≤140 chars; truncation with fallback; notification caps |

## Reference documents

- [`references/kern-tokens.md`](references/kern-tokens.md) — **Kern MD3 role mapping** (read first)
- [`references/color-system.md`](references/color-system.md) — MD3 color roles, tonal palettes, pairing rules
- [`references/typography-and-shape.md`](references/typography-and-shape.md) — Type scale, shape corners, elevation, motion
- [`references/component-catalog.md`](references/component-catalog.md) — MD3 components and structure (incl. Expressive migrations)
- [`references/navigation-patterns.md`](references/navigation-patterns.md) — Navigation selection and adaptive shells
- [`references/layout-and-responsive.md`](references/layout-and-responsive.md) — Breakpoints, scaffold, canonical layouts, RTL, foldables
- [`references/theming-and-dynamic-color.md`](references/theming-and-dynamic-color.md) — Theme architecture, ref→sys→comp, contexts, CSS custom properties
- [`references/theme-variants.md`](references/theme-variants.md) — Variant registration and re-skinning
- [`references/interaction-states.md`](references/interaction-states.md) — State layers, selection, gestures, inputs
- [`references/mobile-foundation.md`](references/mobile-foundation.md) — Why native mirrors web (primitives, not Paper)
- [`references/icons.md`](references/icons.md) — Material Symbols, sizes, pairing, a11y
- [`references/content-design.md`](references/content-design.md) — Writing, notifications, alt text, truncation

MD3 canon is distilled from the [Material 3 skill](https://github.com/hamen/material-3-skill) and [m3.material.io](https://m3.material.io/).

## Using Kern in code

- Web (React): `@xoroh/kern` — components + theme.
- Native: `@xoroh/kern/native` — mobile components + theme hooks.
- Shared theme: `@xoroh/kern/theme` (CSS vars) + `@xoroh/kern/tokens` (TS role tables, generated from `tokens.json`).
- Use **Kern** (this skill) for design decisions, tokens, and MD3 structure; implement with the package components.
