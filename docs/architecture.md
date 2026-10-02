# Architecture

Status: current

Kern is a Material Design 3 design system for web and native, published as a
set of independent npm packages. This page explains the shape: what each
package owns, why the split exists, and how a change flows through the repo.

For design canon, see `.agents/skills/kern/`. For what may import what, see
[`conventions/file-ownership.md`](conventions/file-ownership.md).

## The one-sentence version

The system language — tokens, themes, tones, feedback spec, icon registry —
is written **once** in platform-free TypeScript. Widgets and composition are
implemented per **renderer family**: DOM and React Native. Both renderers
resolve the same scheme, so a token change lands everywhere at once.

## Packages

| Package | Directory | Renderer | Owns |
| --- | --- | --- | --- |
| `@xoroh/kern-tokens` | `packages/kern-tokens` | platform-free | `tokens.json` (canonical source), theme presets, contrast overlays, tones, feedback spec, variant registry, generated CSS |
| `@xoroh/kern` | `packages/kern` | web (DOM) | The web component set, the web theme runtime, `cn` helpers |
| `@xoroh/kern/start` | `packages/kern/src/start` | web (DOM) | Composition: blocks, top app bar, navigation, panes, scaffolds, link seam |
| `@xoroh/kern-native` | `packages/kern-native` | native (RN) | The React Native component set and the native scheme hook |
| `@xoroh/kern-icons` | `packages/kern-icons` | both | Material Symbols registry + `Icon` renderer (web and native) |
| `@xoroh/kern-mcp` | `packages/mcp` | node | MCP server so agents can list components, fetch source, read tokens, audit screens |
| `@xoroh/cli` | `packages/cli` | — | Private placeholder for a future `kern add` installer. Not implemented, not published |

Plus two apps:

| App | Directory | What |
| --- | --- | --- |
| kern.xoroh.org | `apps/site` | The documentation site. Imports and dogfoods `@xoroh/kern`, `-theme`, `-icons`, `-start` |
| Kern (Expo) | `apps/mobile` | Empty Expo host wiring the native theme and fonts |

## Dependency direction

```
                    kern-tokens  (tokens, themes, tones, feedback)
                   /     |      \
                  v      v       v
              kern    kern-native   (peers — never import each other)
                |
                v
            /kern/start

            kern-icons  (independent; peers react / react-native)
            kern-mcp    (reads everything, imports nothing from it)
```

`kern-tokens` imports nothing from the other packages. `kern` and
`kern-native` are peers around it: genuinely shared logic belongs in
`kern-tokens` (pure) or in the consuming app, never duplicated across the
renderers.

`/kern/start` depends on `kern` and nothing else. Native composition lives
inside `kern-native` rather than in a parallel package, because it needed no
Expo-only peer — the sheets are built on RN primitives, so
`@xoroh/kern-native` still imports only `react`, `react-native`, and
`@xoroh/kern-tokens`. See [plan/native-composition.md](plan/native-composition.md).

## Why the split

**Renderer families, not languages.** The alternative — one codebase with
`if (isNative)` branches — produces components that are half-real on each
platform. Splitting by renderer family keeps every shipped component honest
on the platform it targets, and keeps the shared language free of both
`window` and `View`.

**Independent versioning.** Each package releases on its own bump. A change
to `kern-tokens` tokens should not force a `kern-icons` version, and a fix in
`/kern/start` should not re-version the component set. Consumers pay only for
what they depend on.

**Optional peers over bundled dependencies.** `@xoroh/kern` lists
`react`, `react-dom`, `@base-ui/react`, and `@xoroh/kern-tokens` as peers, so
a host app controls versions and gets no duplicate React.
`@xoroh/kern-icons` marks `react-native` and `react-native-svg` as
*optional* peers, so a web-only app never installs them.

**Barrels are the contract.** Deep `src/` paths are blocked by each
package's `exports` map. Internal structure can move freely; the public
surface is what versions.

## The token pipeline

```
tokens.json  (canonical: {oklch, srgb} per step)
     |
     +--> tokens.ts    TS role tables          (all three renderers)
     +--> tokens.css   --md-sys-* custom props  (web)
     +--> m3.json / sharp.json / brand.json   role overrides per preset
                    |
                    v
        resolveThemeDetails(mode, contrast, variant)
                    |
        +-----------+-----------+
        v                       v
  applyKernTheme()        KernThemeProvider
  writes CSS vars,        resolves to objects,
  toggles .dark           read by useKernScheme()
  (web)                   (native)
```

One resolver, `resolveThemeDetails(mode, contrast, variant)` in
`@xoroh/kern-tokens`, is the only place a scheme is built. Web projects the
result as CSS custom properties; native reads the same object. That is why a
token change cannot drift between the two.

Contrast is a third input, not a separate scheme: `standard` / `medium` /
`high` overlays apply on top of the mode's base table.

## Component composition tiers

| Tier | What | Web | Native |
| --- | --- | --- | --- |
| Component | one widget, variants + slots, no layout opinion | `@xoroh/kern` | `@xoroh/kern-native` |
| Block | pattern composition, slot-driven, domain-free | `@xoroh/kern/start` | `@xoroh/kern-native` (`NavigationBar`, `NavigationDrawer`, `MenuScreen`, `BottomSheet`, …) |
| Scaffold | page frame = named regions + behavior | `@xoroh/kern/start` (`AppShell`, `Document`) | `@xoroh/kern-native` (`BootSplash`, `Pane`, `ListDetail`) |

Lower tiers never import higher. Blocks carry no app domain: auth, routing,
and tenancy arrive as props and slots. Product-shaped shells are *recipes*
built from the same regions, not new API.

Web composition is a separate package because it is a separate dependency
edge from `@xoroh/kern`; native composition ships in the same package
because it needed no peer the component package did not already have. The
tier model and the names are the same on both sides — `TopAppBar` is
`TopAppBar` on both.

See [`plan/kern-start.md`](kern-start.md) for the web tier model and
[`platform-parity.md`](platform-parity.md) for how the tiers correspond
across renderers.

## Generated surface

Six files are generated and must never be hand-edited:

| File | Command |
| --- | --- |
| `packages/kern-tokens/src/tokens.css` | `bun run generate:tokens` |
| `packages/kern-tokens/src/tones.css` | `bun run generate:tones` |
| `packages/kern-tokens/src/motion.css` | `bun run generate:motion` |
| `packages/mcp/src/manifest.ts` | `bun run generate:components` |
| `packages/mcp/src/component-sources.ts` | `bun run generate:components` |
| `docs/components.md` | `bun run generate:components` |

`bun run build` runs all of them, so a clean build proves the generators are
reproducible.

## Repository gates

| Command | What it protects |
| --- | --- |
| `bun run lint` | Biome: lint, format, import order |
| `bun run typecheck` | `tsc --noEmit` across the five typed packages |
| `bun run test:all` | vitest (theme, web, icons, start) + native render tests |
| `bun run check:kern` | Roles complete in every scheme; tokens only; shape scale only |
| `bun run check:contrast` | 4.5:1 text and 3:1 UI across presets × modes × contrast |
| `bun run check:publish` | `publint` + `are-the-types-wrong` on all six publishable packages |
| `bun run icons:check` | Committed icon registry matches its source |

`check:kern` and `check:contrast` are the design law made executable — the M3
semantics in [`plan/README.md`](plan/README.md) "System law" are not a
guideline a reviewer has to remember.

## Adding a component

1. Pick the M3-canonical name. No prefix, no bridge name, no product name.
2. Implement it on the renderer family that owns your change.
3. Freeze the `variant` meaning and add it to the variant-law table in
   [`platform-parity.md`](platform-parity.md).
4. Export it from the package barrel with its props type — a stub is never
   wired (see [`conventions/stubs.md`](conventions/stubs.md)).
5. Add tests beside the file: `*.test.tsx` web, `*.rntest.tsx` native.
6. Add a changeset ([`conventions/changesets.md`](conventions/changesets.md)).
7. `bun run generate:components` and update the parity tables.
8. Update the site page if it is user-facing.

Full checklists in [`conventions/parity.md`](conventions/parity.md).