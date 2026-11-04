# Tabs / Status / Empty / Loading family reference (WP1b, D951)

The complete WP1b surface: the `KernStatus` tone registry (`StatusTone` +
`TONE_ROLES` + `StatusPill`, with `tone` merged into `Avatar` / `Badge` /
`Chip`), `KernTabs` (one tabs, web + native twins under one contract),
`EmptyState` (one empty), and `KernLoading` (one loading composition) — web
(`@xoroh/kern`) + native (`@xoroh/kern-native`) twins under one contract.

M3 links: tabs (https://m3.material.io/components/tabs), badges
(https://m3.material.io/components/badges), chips
(https://m3.material.io/components/chips/overview), progress indicators
(https://m3.material.io/components/progress-indicators/overview),
empty-states pattern (no M3 component — Kern pattern). Expressive deltas:
none adopted (utility motion only, per Kern).

Source attributions (OSI only, per-component): material-web tab anatomy +
indicator/state-layer roles (Apache-2.0,
https://github.com/material-components/material-web/blob/main/LICENSE);
Paper Badge/Chip/Avatar behavior (MIT,
https://github.com/callstack/react-native-paper/blob/main/LICENSE.md).

## 1. Tone registry (CL-010)

ONE tone system for `Badge`, `Chip`, `Avatar` and `StatusPill`, killing the
parallel scales (tailwind amber/emerald utilities, per-app HSL copies).

- Source of truth: `TONE_ROLES` in `@xoroh/kern-tokens` (`tones.ts`) —
  seven tones (`STATUS_TONES`): `primary` · `secondary` · `success` ·
  `warning` · `error` · `info` · `neutral`. Each tone is an M3
  container/on-container role pair, so light/dark/contrast modes follow the
  scheme with no conditionals.
- Web projection: `statusToneClassNames(tone, emphasis?)` (`soft` =
  container roles, `solid` = filled tone roles) + `statusToneDotClassName`
  in `status-pill.tsx`. Every entry is a FULL literal class string — never
  `bg-(${role})` interpolation, which the consumer Tailwind scan would
  silently drop. `--sys-*` ONLY, no raw hex/rgba.
- Native projection: `statusToneSolid` fills (dp borders, no CSS rings).
- Adopters: `Avatar tone` (initial-disc fill), `Badge tone`, `Chip tone`,
  `StatusPill tone`, `ContactRow`/`ContactCard` discs via `contactToneFor`
  (deterministic FNV-1a pick over the registry minus neutral), `MapMarker`
  tones, stat deltas as host `StatusPill`s.

A status that was `bg-amber-100` is now `tone="warning"`; an HSL disc is
now an avatar `tone`.

## 2. Variant models

**KernTabs** — one data contract (`items, active, onChange, density`),
merging the web + mobile twins (`Tabs` + `SecondaryTabs` both renderers,
CMP-3114/3176). `variant`: `primary` (under the app bar — 3px primary
indicator, primary active text) / `secondary` (inside content — 2px
indicator, on-surface active text; never mix levels in one bar).
`orientation`: `horizontal` (underline) / `vertical` (active tab filled as
a secondary-container pill — the settings pattern). `density`: compact
(40) / medium (48, default) / expanded (56). Item slots: `leadingIcon`
(KernIcon-registry node) + `badge` (usually a `Badge` count/dot).
Segmented is NOT a variant here: fewer than three choices is a
`SegmentedButton` (M3 lists it as its own component), tabs own tabbed
content with panels.

**StatusPill** — dot (or `icon`) + label + container roles. `emphasis`:
`soft` (container roles, default) / `solid` (filled tone roles, for counts
that must read at a glance). `density`: `medium` (32px, default) /
`compact` (24px, for table status-chip cells). Dot hides when `icon` is
given (or `dot={false}`).

**EmptyState** — visual + title + description + primary/secondary actions.
`variant` is placement only (metrics change, not components): `page` /
`section` / `list-row` / `chat`. `title` accepts nodes but only strings
satisfy the div-`title` intersection today — pass strings (widening via
`Omit<"title">` is tracked, not shipped).

**KernLoading** — four kinds on `kind` + `label`: `skeleton-list`
(`Skeleton` rows, `count`), `spinner` (`LoadingIndicator`), `progress`
(`LinearProgress`, `value` 0–1 or `null` indeterminate loop),
`shimmer-card` (card-shaped `Skeleton` composition for dashboard grids).
`label` names the wait and is announced; skeleton rows stay decorative
inside one `status` region. What it does NOT merge: `Loader`,
`CircularProgress` (determinate arc), `Progress`, `Meter` (static scalar —
not a task), `PageLoader` (app-chrome overlay) each own a separate M3
meaning — collapsing them would mislabel waits to screen-reader users.

## 3. Props tables

### KernTabs

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `KernTabItem[]` | — | `{value, label, content?, disabled?, leadingIcon?, badge?}` |
| `value` / `defaultValue` / `onValueChange` | string | first enabled | controlled/uncontrolled; empty or all-disabled renders no tablist |
| `variant` | primary/secondary | `primary` | never mix levels in one bar |
| `orientation` | horizontal/vertical | `horizontal` | vertical fills active as pill |
| `density` | compact/medium/expanded | `medium` | 40/48/56 |
| `label` | string | `"Sections"` | tablist accessible name |
| `children` | ReactNode | — | caller-composed panel; ignores per-item `content` |

Native `KernTabs`: same fields; labels/badges string-typed; press +
screen-reader tab roles (roving tabindex is W-only).

### StatusPill / tone helpers

| Component | Key props | Notes |
|---|---|---|
| `StatusPill` | `tone` (7), `emphasis` soft/solid, `icon`, `dot`, `density` compact/medium, `children` (label) | default neutral/soft/medium |
| `statusToneClassNames(tone, emphasis?)` | helper | shared by Badge/Chip/Avatar |
| `statusToneDotClassName(tone)` | helper | dot/indicator class |
| `Avatar` / `Badge` / `Chip` | `tone?: StatusTone` | merged in WP1b; Chip tone clears the outline border |

### EmptyState

| Prop | Type | Default | Notes |
|---|---|---|---|
| `visual` | ReactNode | — | KernIcon-registry node, aria-hidden |
| `title` | ReactNode (strings today) | required | §2 limitation |
| `description` | ReactNode | — | supporting line |
| `primaryAction` (`action` alias) / `secondaryAction` | ReactNode | — | caller buttons |

### KernLoading

| Prop | Type | Default | Notes |
|---|---|---|---|
| `kind` | skeleton-list/spinner/progress/shimmer-card | `spinner` | §2 |
| `label` | string | `"Loading"` | announced name |
| `count` | number | `3` | skeleton-list rows (min 1) |
| `value` | number 0–1 / null | `null` | progress only; null = indeterminate loop |

## 4. Do / don't

- DO reach for `tone="…"` before any color utility — if the status has no
  registry tone, that is a WP6 addendum, not a local hex.
- DO keep tab counts ≥ 3 per bar — fewer is a `SegmentedButton`.
- DO mount only the active tab panel (the component does this; keep it).
- DO name every loading surface with `label` — "Loading" beats silence.
- DON'T add a second tabs, pill, empty, or loader (D925) — extend these.
- DON'T put a static number in `KernLoading` — that is a `Meter`.
- DON'T nest panels beside the tab strip — bodies ride `content`.

## 5. Parity decisions (P0, recorded)

- `SecondaryTabs` (web + native `layouts.tsx`) MERGED: now `KernTabs` at
  `variant="secondary"` — same 2px indicator, same on-surface active
  label, same keyboard model. Old exports stay as thin wrappers
  (retirement in transfer, never in design).
- Segmented NOT merged (§2 rationale); `Banner` native twin KEEP + test
  (4 intents on the tone registry, no build).
- `Tabs.List aria-label` in overlay tab strips names the surface
  (`${surfaceLabel} sections`) — tabbed-dialog scaffold stays named.
- EmptyState `title` string limitation recorded in §2 (WP1a §4 cross-ref).
- Status-chip cells still render neutral assist `Chip`s (`data-table.tsx`
  `column.kind === "status"` branch) — the WP1a neutral placeholder was NOT
  resolved by the merge; converging status cells onto registry tones (or
  `StatusPill compact`) is tracked as a component-side follow-up, reported
  in `docs/visual-review-wp7.md`, not fixed here.
- Showcase: web examples under `apps/site/src/showcase/examples/`
  (`kern-tabs`, `status-pill`, `kern-loading`) + `registry.ts` entries.
  Native twins share export names and are covered by `*.rntest` suites.
  Central regen (`apps/site/src/generated/`, contracts, MCP manifest,
  llms.txt) is coordinator-owned.
