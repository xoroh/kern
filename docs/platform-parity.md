# Platform parity (web ↔ native)

Status: current

Kern ships one system language across two renderer families:

- **Web** — `@xoroh/kern` (components) + `@xoroh/kern/start` (composition),
  DOM, React.
- **Native** — `@xoroh/kern-native`, React Native.

Both resolve the *same* scheme from `@xoroh/kern-tokens`, so a role value, a
corner radius, or a contrast level cannot differ between platforms for the
same theme selection. What differs is the renderer: DOM on one side,
`StyleSheet` + RN primitives on the other.

This page is the truth for **naming** and **coverage**. Where the two sides
disagree, the disagreement is recorded here rather than left implicit.

Naming follows the naming law (unprefixed, M3-canonical — see
[`plan/README.md`](plan/README.md) "System law"). No `Native` prefix on a
component name, no bridge names, no product names.

## Package and import names

| Package | Import | Renderer |
| --- | --- | --- |
| `@xoroh/kern` | `@xoroh/kern` | web |
| `@xoroh/kern/theme` | CSS custom properties (side-effect import) | web |
| `@xoroh/kern/tokens` | TS role tables, re-exported from `kern-tokens` | web + native |
| `@xoroh/kern/utils` | `cn` and pure helpers | web |
| `@xoroh/kern-tokens` | tokens, themes, tones, feedback, variant registry | both |
| `@xoroh/kern-native` | React Native components | native |
| `@xoroh/kern-icons` | icon registry + `Icon` (web + native) | both |
| `@xoroh/kern/start` | web composition (blocks, navigation, panes, scaffolds) | web |

`@xoroh/kern/native` is **not** an export of `@xoroh/kern`. Native lives in
its own package, `@xoroh/kern-native` (which also accepts a `/native`
subpath for symmetry with the old single-package layout).

## Composition tiers

| Tier | Web | Native |
| --- | --- | --- |
| Component | `@xoroh/kern` | `@xoroh/kern-native` |
| Block (pattern composition, slot-driven) | `@xoroh/kern/start` (`TopAppBar`, `SearchBar`, `Sidebar`, `NavigationRail`, …) | `@xoroh/kern-native` (`NavigationBar`, `NavigationDrawer`, `MenuScreen`, `BottomSheet`, …) |
| Scaffold (page frame = named regions) | `@xoroh/kern/start` (`AppShell`, `Document`) | `@xoroh/kern-native` (`BootSplash`, panes) |

Same tier model, same names, different package boundary: web composition
lives in `@xoroh/kern/start` because it is a separate dependency edge from
`@xoroh/kern`, while native composition lives inside
`@xoroh/kern-native`. Where both sides ship a concept the names match —
`TopAppBar` is `TopAppBar` on both.

## Variant law

The meaning of `variant` is **frozen per component** and identical across
platforms. One prop name never carries two meanings.

| Component | `variant` means | Values |
| --- | --- | --- |
| `Button` | **colour configuration** | `elevated`, `primary` (filled), `tonal`, `outlined`, `ghost` (text) |
| `Card` | elevation treatment | `filled`, `outlined`, `elevated` |
| `Text` | type-scale role | `body`, `label`, `title`, `headline` |
| `FieldMessage` | intent | `description`, `error` |
| `Badge` | shape | `dot`, `count` |
| `Chip` | kind | `assist`, `filter`, `input`, `suggestion` |
| `Fab` | **size** — M3 has no FAB emphasis axis | *(`variant` removed; use `size`)* |

**Verified against the M3 spec pages, 2026-10-01** (this table previously rested on secondary
summaries and three rows were wrong):

- **`Button`** — m3.material.io/components/buttons/overview: *"Five color options: elevated,
  filled, tonal, outlined, and text."* The old row listed four values including
  **`destructive`, which M3 does not define for buttons** — an error-coloured button is a
  filled button on the error roles, so it is the caller's colour choice, not a sixth axis.
  `tonal` now uses `secondaryContainer` (M3's filled tonal), not kern's `surfaceTonal`.
- **`Chip`** — m3.material.io/components/chips/overview: *"Four variants: assist, filter,
  input, and suggestion."* **`input` was missing** on both renderers.
- **`Fab`** — m3.material.io/components/floating-action-button/overview: *"Three variants:
  FAB, medium FAB, large FAB."* That is a **size** axis, so `variant: primary | tonal`
  asserted an axis M3 does not define. The emphasis axis moved to `size`
  (`default`/`medium`/`large`) and the FAB is `primaryContainer`, per M3.

`Card`, `Text`, `FieldMessage` and `Badge` were checked against their spec pages and are
**correct as written** — no change.

`size` is a separate prop and never overloaded onto `variant`:
`Button`/`Fab` take `size`, `Avatar`/`Loader` take `size`, and
`Separator`/`ButtonGroup` take `orientation`.

## Coverage

Counts are **exported names** per concept, from the generated inventory in
[`components.md`](components.md). Web exports multipart component APIs
(`DialogRoot` / `DialogContent` / …) where Base UI composes; native exports a
single component per concept where RN composes internally. A count of 1 vs 7
is therefore usually an API-shape difference, not a missing feature.

| Concept | Web exports | Native exports |
| --- | --- | --- |
| `accordion` | 6 | 1 |
| `alert` | 7 | 1 |
| `avatar` | 4 | 1 |
| `badge` | 1 | 1 |
| `banner` | 2 | 1 |
| `boot` | 1 | 1 |
| `button` | 2 | 2 |
| `calendar` | 1 | 1 |
| `card` | 1 | 1 |
| `checkbox` | 4 | 1 |
| `chip` | 1 | 1 |
| `circular` | 1 | 1 |
| `collapsible` | 4 | 1 |
| `command` | 9 | 1 |
| `context` | 6 | 1 |
| `country` | 7 | 1 |
| `create` | 1 | 1 |
| `dialog` | 7 | 1 |
| `empty` | 1 | 1 |
| `fab` | 1 | 1 |
| `field` | 6 | 2 |
| `input` | 4 | 1 |
| `label` | 1 | 1 |
| `linear` | 1 | 1 |
| `list` | 1 | 2 |
| `loader` | 1 | 2 |
| `loading` | 1 | 1 |
| `menu` | 7 | 4 |
| `menubar` | 6 | 1 |
| `navigation` | 7 | 4 |
| `progress` | 4 | 1 |
| `radio` | 2 | 2 |
| `search` | 1 | 1 |
| `segmented` | 3 | 1 |
| `select` | 9 | 1 |
| `separator` | 1 | 1 |
| `sheet` | 7 | 2 |
| `skeleton` | 1 | 1 |
| `slider` | 5 | 1 |
| `snackbar` | 9 | 1 |
| `switch` | 1 | 1 |
| `table` | 8 | 1 |
| `tabs` | 5 | 1 |
| `text` | 1 | 1 |
| `textarea` | 1 | 1 |
| `toggle` | 4 | 2 |
| `toolbar` | 5 | 1 |

Totals: **236** web exports, **78** native exports, **47** shared concepts.
Every export is `real`; there are no stubs in the tree.

### Naming exceptions (both sides)

| Web | Native | Rule |
| --- | --- | --- |
| `RadioGroupItem` | `RadioGroupItem` | canonical M3 name wins over `Radio` |
| `Separator` | `Separator` | canonical M3 name wins over `Divider` |
| `CircularProgress` | `CircularProgress` | not `Spinner` |
| `LinearProgress` | `LinearProgress` | not `ProgressBar` |

No `Native*` component prefixes exist. `Native*Props` **type** prefixes do
exist where React Native event and style types force them
(`NativeButtonProps`, `NativeTextVariant`) — that is a type-name convention,
not a component-name one.

## Known gaps (honest list)

These are real differences in the current tree. None is a naming violation.

**Web-only concepts** (16): `autocomplete`, `combobox`, `drawer`, `fieldset`,
`form`, `kbd`, `meter`, `native-select`, `number-field`, `page-loader`,
`pagination`, `popover`, `preview-card`, `scroll-area`, `sonner`, `tooltip`.

Most have an RN equivalent in the platform itself rather than a Kern
component: `native-select` maps to RN `Picker`, `scroll-area` to RN
`ScrollView`. `tooltip` and `kbd` are web-interaction concepts with no mobile
analogue.

`input-otp` is **not** in this list: it is part of the shared `input` concept
(row above), which ships on both platforms.

### Deliberate asymmetry: `Sonner` has no native counterpart

`sonner` is a **deliberate asymmetry, not a gap** — ruled 2026-10-01
(`.team/reports/S1-rulings.md` §S1.3). Two reasons, both structural:

1. **M3 expresses transient messaging as `Snackbar`**, which already ships on
   both platforms. A second native component under a second name would break
   the naming law ("unprefixed, M3-canonical, one name per concept").
2. **`Sonner` is not a separate surface at all.** On web it is the *imperative*
   API over the **same** Base UI `Toast` manager that backs web `Snackbar`:
   `snackbar.tsx:137` exports `createSnackbarManager =
   ToastPrimitive.createToastManager`, and `sonner.tsx:190` calls the same
   factory. One primitive, two names, two call styles.

So the correct statement is the asymmetry, not the gap: **web gets an
imperative toast entry point (`Sonner`); native ships the declarative
`Snackbar` only.** Both cover the same M3 need, neither is missing a feature,
and shipping native `Sonner` would duplicate one surface under a forbidden
name.

**Native-only concepts** (18), in two groups:

*Platform primitives and brand kit* (6) — `aspect-ratio` (RN layout
primitive), `shape` / `shape-art` (brand-kit art), `milestone-trio` and
`success-transform` (feedback brand kit), `arc-rotations` (a
`CircularProgress` helper). These have no web counterpart by design.

*Composition that exists only on native* (12) — `bottom-sheet`, `snap-sheet`,
`dock-sheet`, `entity-sheet`, `bottom-sheet-picker`, `apps-sheet`,
`top-app-bar`, `top-app-bar-action`, `pane`, `supporting-pane`,
`filter-chip-row`, `secondary-tabs`.

That second group is the mirror of `@xoroh/kern/start`: native ships its
composition tier inside `@xoroh/kern-native` rather than in a separate
package. Web `TopAppBar` and native `TopAppBar` are the same concept
implemented in each renderer family — the intended shape, not a divergence.

Note what is **not** in this list, because it is already counted above as a
shared concept: `create-sheet` (row `create`), `menu-screen` / `menu-sheet` /
`menu-group-list` (row `menu`), and `navigation-bar` / `navigation-drawer`
(row `navigation`). Those export on both platforms; listing them as
native-only would double-count them against the coverage table.

The native sheets are **not** a `@gorhom/bottom-sheet` wrapper.
`@xoroh/kern-native` still imports only `react`, `react-native`, and
`@xoroh/kern-tokens`; `BottomSheet`/`SnapSheet`/`DockSheet` are built on RN
primitives directly. That keeps the plan's split question open — if the
gesture handling proves inadequate, the plan is `@xoroh/kern-expo`.

**Prop-level differences:**

| Concept | Web | Native | Status |
| --- | --- | --- | --- |
| `Loader` size | `sm`, `default`, `lg` | `small`, `large` | intentional — RN `ActivityIndicator` accepts only two sizes |
| `Button` variant | `primary`, `tonal`, `ghost`, `destructive` | `primary`, `tonal`, `ghost` | **gap** — native omits `destructive` |
| `Dialog` | Base UI primitives | RN `Modal` | intentional — different primitive, same M3 structure and two-action law |
| `SegmentedButton` | compound `Root`/`Item` | single `SegmentedButton`, `options` prop | intentional — API shape, not coverage (ruled, see below) |
| `CountrySelect` | 7 multipart exports | 1 flat `CountrySelect` | intentional — API shape, not coverage. **Corrected 2026-10-01:** this row previously said "no native equivalent"; native has shipped it since (`web-parity.tsx:346`) |
| `Command` | 9 multipart exports | 1 flat `Command` | intentional — API shape, not coverage. Same correction: native ships it at `web-parity.tsx:50` |

## Ruled differences (design authority, not workarounds)

### `SegmentedButton` — selection behaviour is the meaning (ruled 2026-10-01)

Ruled by `kern-lead` (`.team/reports/S1-rulings.md` §S1.2). Recorded because
the plan that briefed this doc was **wrong about the component**.

**What was claimed:** web shipped *intent*, native shipped *selection
behaviour*, and the web `variants` axis needed renaming to match.

**What is actually true:** both sides already implement M3 selection
behaviour, and **there is no `variants` axis on web to rename.** The web
component is 55 lines of thin wrapper over Base UI `ToggleGroup`/`Toggle`;
`grep -n variants packages/kern/src/components/segmented-button.tsx` → 0
hits. Its only axis is Base UI's own `multiple?: boolean`.

Proof that web already does selection behaviour, not intent:

- Web is exclusive **by construction** — Base UI `ToggleGroup` defaults to
  `multiple: false`.
- The web test asserts it directly: `web-extras.test.tsx:47`, *"keeps exactly
  one segment pressed"*; `:63-66` click Grid → `aria-pressed` flips and
  `onValueChange(["grid"])`.
- Native infers the same thing from which value prop you pass
  (`web-parity.tsx:240-241`: `multiple = controlledValues !== undefined ||
  defaultValues !== undefined`), with `accessibilityRole` `radio` vs
  `checkbox` (`:293`).

What actually differs is **API shape**:

| Axis | Web (`@xoroh/kern`) | Native (`@xoroh/kern-native`) |
|---|---|---|
| Shape | compound `Root`/`Item`, children authored by hand | flat, `options: SegmentedButtonOption[]` |
| Value | array `value?: readonly Value[]` (Base UI shape) | scalar `value?: string` + `values?: string[]` |
| Multi | `multiple?: boolean` prop | inferred from which value prop you pass |
| Callback | `onValueChange(values[])` — **always an array** | `onValueChange(string)` / `onValuesChange(string[])` |
| ARIA | `aria-pressed` on each item | `radiogroup` + `radio`/`checkbox` |

**Consumer sharp edge:** web's `onValueChange` hands you an array even in
single-selection mode. That is a Base UI passthrough, not a Kern decision, and
Kern deliberately does **not** paper over it in 0.1.0. Wrapping it into a
scalar for the exclusive case would be a breaking API change and needs its own
brief — it is not a docs fix.

## Behavioral parity rules

1. **Sizes, touch targets, and state opacities come from `kern-tokens`.**
   48dp minimum target, 24dp icons, M3 state-layer opacities — resolved
   from the same token set on both sides.
2. **Color resolves through one scheme.** Web projects it as
   `--md-sys-*` custom properties plus a `.dark` class; native resolves it
   to objects via `useKernScheme()`. `applyKernTheme()` and
   `KernThemeProvider` take the same `(mode, contrast, variant)` triple, so
   the same selection renders identically on both.
3. **Never resolve a role at module scope.** Native components call
   `useKernScheme()`; web components read the CSS variable. A component that
   captures a value once will not follow a theme switch.
4. **Fonts.** Web loads Inter through `@fontsource-variable/inter` (a
   `kern-tokens` dependency). Native leaves loading to the host: it exports
   `kernFontFaces` and a `useKernFonts(loader)` hook that accepts any
   `loadAsync`-shaped loader, so `kern-native` takes no `expo-font` peer.
   Components only ever set a weight.
5. **Icons** arrive as nodes (slots) on both platforms;
   `@xoroh/kern-icons` resolves the same names to the same glyphs through a
   `react-native` export condition.

## Keeping this page honest

The counts above come from `docs/components.md`, which is **generated** —
never hand-edit either file. Regenerate with `bun run generate:components`
after any component change, then update the tables and the gap list here in
the same change. A new web concept with no native counterpart, or a native
concept with no web counterpart, is a gap to record — not a name to invent
on the other side.