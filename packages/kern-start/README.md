# `@xoroh/kern-start`

Status: current

Web composition for Kern: the app-frame layer (top app bar, navigation, panes,
scaffolds) built from `@xoroh/kern` components. M3 patterns, Kern expression.
No app domain — auth, routing, and tenancy arrive as props and slots.

```bash
bun add @xoroh/kern-start @xoroh/kern react react-dom
```

## Composition model

| Tier | What it is | Example | Lives in |
| --- | --- | --- | --- |
| Component | one widget, variants + slots | `Button`, `Dialog` | `@xoroh/kern` |
| Block | pattern composition, slot-driven, domain-free | `TopAppBar`, `SearchBar` | here |
| Scaffold | page frame = named regions + behavior | `AppShell`, `Document` | here |

Lower tiers never import higher. Apps may compose their own frame from the
same blocks and skip scaffolds entirely.

## Router seam

```tsx
import { LinkProvider, useLinkComponent, Link } from "@xoroh/kern-start";
import { Link as TanStackLink } from "@tanstack/react-router";

<LinkProvider component={TanStackLink as any}>{children}</LinkProvider>;
```

All links inside the blocks render through `useLinkComponent()`. Without a
provider they are plain `<a>` elements.

## AppShell recipes (not API — compose regions)

**Flat app** — top bar + one sidebar:

```tsx
<AppShell topBar={<AppTopBar wordmark="Acme" actions={<UserMenu items={…} />} />}>
  <div className="flex min-h-0 flex-1">
    <Sidebar>
      <SidebarContent>
        <SidebarItem label="Home" href="/" active />
      </SidebarContent>
    </Sidebar>
    <Page>…</Page>
  </div>
</AppShell>
```

**Multi-region app** — all regions:

```tsx
<AppShell
  topBar={<TopAppBar leading={<TopAppBarToggle open={open} onToggle={toggle} />}>Title</TopAppBar>}
  rail={<NavigationRail header={<ThemeToggle mode={mode} onToggle={flip} />}>…</NavigationRail>}
  drawer={<Sidebar>…</Sidebar>}
  statusBar={<StatusBar>Ready</StatusBar>}
>
  <ListDetail list={<span>list</span>} detail={<span>detail</span>} />
</AppShell>
```

Two shell shapes, one mechanism: fill regions differently or omit them.

## Measures

Top app bar `56px` (`APP_SHELL_HEIGHTS.topBar`), status bar `32px`, rail
`80px` (`NAVIGATION_RAIL_WIDTH`), sidebar widths `72/256/320`
(`SIDEBAR_WIDTHS`), section drawer `360px`. 24dp icons, 48dp targets.

## License

MIT — see `LICENSE`.
