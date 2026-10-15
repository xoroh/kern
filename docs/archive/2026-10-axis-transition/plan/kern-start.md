# Plan — `@xoroh/kern/start` (web composition layer)

Status: done (2026-09-29) · log kept for revision

The app-frame layer for web apps: top-app-bar, navigation
(sidebar/rail/section-drawer), panes, scaffolds, and the blocks that fill them
(search, settings, status-bar). Naming law: unprefixed, M3-canonical —
`TopAppBar`, `NavigationRail` are the M3 names. Package:
`packages/kern/src/start` (`@xoroh/kern/start`), dependency `@xoroh/kern` only.

## Composition model

Three tiers, one direction of dependency:

| Tier | What it is | Example | Lives in |
| --- | --- | --- | --- |
| Component | one widget, variants + slots, no layout opinion | `Button`, `Dialog` | `kern` / `kern-native` |
| Block | pattern composition, slot-driven, domain-free | `TopAppBar`, `SearchBar` | `/kern/start` (native sibling per [native-composition](native-composition.md)) |
| Scaffold | page frame = named regions + behavior | `AppShell`, `Document` | `/kern/start` |

Rules: lower tier never imports higher · blocks contain no app domain —
those arrive as props/slots · scaffolds are *presets* composed from blocks.

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Shell naming | **One mechanism: `AppShell`** with optional region slots (`topBar`, `rail`, `drawer`, `statusBar`, `content`). Product-shaped shells are *recipes*, not API. Shell height constants → `APP_SHELL_HEIGHTS` |
| Panes split | Mechanism: `Pane`, `Page`, `SplitGrid` (`SplitPanel` columns). Recipes: `ListDetail`, `Inspector`. *Renamed from `Split` on 2026-10-03 to stop colliding with the `Split` primitive — see `.team/reports/kern-split-ruling.md`* |
| Router coupling | `useLinkComponent()`/`LinkProvider` seam |
| Auth/routing coupling | `NotificationsMenu`/`UserMenu`/`AppsMenu` slot-driven |
| Design variation | 3 axes: theme variant, block `variant`/`size`, slots |
| TanStack dep | optional peer — `Document`/default Link only |

## Shipped

`link.tsx` (seam), `blocks.tsx` (`SearchBar`, `SettingsRow`, `StatusBar`,
`ThemeToggle`, `ContrastToggle`), `top-app-bar.tsx` (`TopAppBar`,
`TopAppBarToggle`, `AppTopBar`, `TopBarMenu`, `AppsMenu`, `HelpMenu`,
`NotificationsMenu`, `UserMenu`), `navigation.tsx` (`Sidebar*`, `useSidebar`,
`SIDEBAR_WIDTHS`, `NavigationRail`, `NavigationRailButton`, `SectionDrawer`),
`panes.tsx`, `scaffolds.tsx` (`AppShell`, `Document`), 15 tests.

## Acceptance

- `apps/site` can render a docs shell from `/kern/start` blocks.
- Region permutations (rail-only, drawer-only, full) render without forks.
- Theme variant swap restyles every block (token-only styling).
- No app-domain or product names in source.
