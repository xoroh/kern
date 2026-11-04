# List / Table / Search family reference (WP1a, D951)

The complete WP1a surface: `List` (10-way), `DataTable` (one table),
`SearchView` + `FilterBar` (CL-012), the `ListWithSearchAndFilters` and
`EmptySearch` blocks, and the `CsvExportButton` helper — web
(`@xoroh/kern`) + native (`@xoroh/kern-native`) twins under one contract.

M3 links: lists (https://m3.material.io/components/lists/overview),
search (https://m3.material.io/components/search), chips/filter
(https://m3.material.io/components/chips/overview), empty-states pattern,
progress (loading). Expressive deltas: none adopted (utility motion only,
per Kern).

Source attributions (OSI only, per-component): material-web list anatomy
(Apache-2.0, https://github.com/material-components/material-web/blob/main/LICENSE);
Paper List/DataTable/Searchbar/Chip behavior (MIT,
https://github.com/callstack/react-native-paper/blob/main/LICENSE.md);
shadcn dashboard/table block composition, re-skinned (MIT,
https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).

## 1. Variant model

**List `variant` (10-way)** — presets over one `ListRow`, unifying the
per-app list copies (dispatch queues, booking lists, contact/activity/
ticket rows):

| Variant | Row | M3 basis |
|---|---|---|
| `one-line` | headline only | one-line list |
| `two-line` (default) | headline + supporting | two-line list |
| `avatar` / `icon` / `thumbnail` | leading media, sized container | leading avatar/icon/image |
| `navigational` | link row + trailing chevron | navigational list |
| `selectable` | named checkbox, single/multi | single/multi-select (one control per item) |
| `expandable` | disclosure trigger + sibling panel | expand/collapse |
| `control` | static row, trailing interactive control | trailing-slot rows |
| `grouped` | sections with headers + dividers | sectioned lists |

`density`: compact (48dp) / medium (56dp, default) / expanded (88dp).
Presentational only — filtering (`filterListRows`/`useListQuery`),
pagination (`paginateListRows`/`usePagination`), sectioning
(`sectionListRows`) and virtualization math (`virtualWindow`) are pure
adapters shared by both renderers.

**DataTable `variant` (4 presets)** — one grid over `Table` (U5 density +
sticky header), unifying CMP-0041/0903/2456/0056/0939/0941/1416/3189:

| Variant | Density | Sticky | Selection | Row actions |
|---|---|---|---|---|
| `admin-grid` | comfortable | yes | yes | yes |
| `bookings` | comfortable | yes | yes (status-chip cells) | yes |
| `ledger` | compact | no | no | no (right numerics, negative = error role) |
| `csv-preview` | compact | no | no | no |

Every preset is overridable per table (`density`, `stickyHeader`,
`selectable`). Cell kinds: `text` | `numeric` | `status` (Chip) |
`actions` (overflow Menu) + custom `render`.

**SearchView**: web = cmd-K/Ctrl-K `Dialog` over `Search` + results list;
native = inline or bottom-`Sheet` (`presentation`). Shared:
`query/value`, `suggestions`, `onSelect`, `filterSuggestions`.

**FilterBar**: `FilterDef[]` (`key/label/options/multi/value`) ->
chips + saved views + host-owned modal/sheet trigger + Clear all.
Adapters: `toFilterQuery`/`fromFilterQuery` (`?status=live,done`),
`applyFilterDefs(rows, defs, getValue)`.

## 2. Props tables

### List

| Prop | Type | Default | Notes |
|---|---|---|---|
| `rows` | `ListRow[]` | `[]` | `{id, headline, supporting?, leading?, trailing?, href?, disabled?, panel?}` |
| `sections` | `ListSection[]` | — | grouped data wins over `rows` |
| `variant` | 10-way | `two-line` | §1 |
| `density` | compact/medium/expanded | `medium` | 48/56/88dp |
| `label` | string | — | list landmark name |
| `selectedIds` / `defaultSelectedIds` / `onSelectedChange` | string[] | — | controlled/uncontrolled |
| `selectionMode` | single/multiple | `multiple` | |
| `expandedIds` / `defaultExpandedIds` / `onExpandedChange` | string[] | — | expandable |
| `onRowPress` | (id) => void | — | navigational rows use `href` instead |
| `loading` / `loadingRows` | boolean/number | false/3 | skeletons + polite status |
| `emptyState` | ReactNode | `EmptyState` | |
| `renderRow` | (row, index) => node | — | escape hatch |

Native `List`: same fields, rows string-typed (`title`/`supporting`;
native Text has no DOM inheritance for slotted nodes), plus
`onHaptic("select"|"expand"|"press")` injection (host wires
expo-haptics; Kern takes no native-module dependency).

### DataTable

| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `DataTableColumn[]` | — | `{key, title, sortable?, sortValue?, render?, kind?}` |
| `rows` | `DataTableRow[]` | — | `Record<string, string\|number\|boolean\|null>` |
| `variant` | 4 presets | `admin-grid` | §1 |
| `caption` | string | — | real `<caption>` (web) / labelled summary (native) |
| `query` | string | `""` | owned by the Search above |
| `getRowId` | (row, index) => string | `row.id` → index | |
| `sortKey` / `defaultSortKey`, `sortDirection` / `defaultSortDirection`, `onSortChange` | — | — | `aria-sort` on headers |
| `page` / `defaultPage`, `pageSize`, `onPageChange` | — | 1 / 10 | footer range label |
| `selectedIds` / `defaultSelectedIds` / `onSelectedChange` | string[] | — | header select-all w/ indeterminate |
| `rowActions` | `{label, onSelect, destructive?}[]` | `[]` | overflow Menu (web) / inline buttons (native) |
| `density` / `stickyHeader` / `selectable` | — | preset | overrides |
| `emptyState` | ReactNode | query-aware `EmptyState` | |

Native `DataTable`: identical contract, list-cards UI (Card per row,
label:value lines, sort header row, Pagination). No web table on native —
by design, recorded here.

### SearchView / FilterBar / blocks / CsvExportButton

| Component | Key props | Notes |
|---|---|---|
| `SearchView` | `suggestions`, `open/defaultOpen/onOpenChange`, `query/defaultQuery/onQueryChange`, `onSelect`, `onSearch`, `hotkey` (default true, W) | empty results → `EmptySearch` |
| `FilterBar` | `filters: FilterDef[]`, `savedViews`, `onSavedViewSelect`, `onFiltersChange`, `onOpenFilters`, `openFiltersLabel` | modal/sheet host-owned |
| `ListWithSearchAndFilters` | `rows`, `filterDefs`, `savedViews`, `filterable` (default: row fields), `searchable`, query trio, `variant/density`, `loading`, `onRowPress`, `onFiltersChange`, `onOpenFilters`, `emptyState` | block owns query+filters; host owns rows+adapters |
| `EmptySearch` | `query`, `onClear`, `title?` (string — see §4), `description?`, `clearLabel?`, `suggestions?` | hardens CLI `empty-search` seed |
| `CsvExportButton` | `columns`, `rows`, `filename`, `label`, `onExport?` | web downloads; native `onExport` REQUIRED (no silent download) |

## 3. Do / don't

- DO use `variant` presets before reaching for `renderRow`/custom cells.
- DO lift `query` + `onFiltersChange` to the block or page — the bar and
  the search are controlled views, never owners.
- DON'T put interactive controls in `ListItem` leading (web: aria-hidden
  by contract) — use the `selectable`/`control` variants.
- DON'T nest `<li>` (expandable panels are sibling rows — enforced by axe).
- DON'T re-implement overlays in FilterBar — pass `onOpenFilters`.
- DON'T add a second table, list, or CSV builder (D925) — extend these.

## 4. Known limitations (outside WP1a scope)

- `EmptyState.title` intersects the div `title` attribute (`string &
  ReactNode`), so only strings satisfy it today — `EmptySearch.title`
  is typed `string` to match. Widening (Omit<"title">) belongs to WP1b,
  which owns `EmptyState`. (Found 2026-11-04, routed, not fixed here.)
- Status-chip tones await the WP1b tone-registry merge — status cells
  render neutral assist chips until then.
- Native voice input (SearchBar voice(N)) is future work — no voice
  affordance exists in native `Search` yet.
- FilterBar sheet physics come from the host `Sheet` (system values);
  grouped settings metrics from the twins' 48dp targets.

## 5. Parity decisions (P0, recorded)

- `preview-card` (web-only hover preview): stays a web-only utility —
  hover-preview has no touch equivalent; no WP1a action. (Readiness P0.)
  D977 C3 CONFIRMED: web-only (hover-driven desktop popup has no RN hover
  idiom; native Tooltip / RichTooltip / Popover already cover it). Controlled
  `open`/`onOpenChange` pinned by test; no native twin planned.
- `aspect-ratio` (N-only): layout primitive, not list/table/search; no
  WP1a action. (Readiness P0.)
  D977 C4 CONFIRMED: N-only (RN `aspectRatio` style primitive; web uses CSS
  `aspect-ratio` directly). Rationale recorded on the component; existing
  `library.rntest.tsx` coverage verified.
- Native table = list-cards fallback under the shared contract (plan
  mandate) — implemented in `kern-native` `DataTable`.
- Web `command` stays the palette primitive; `SearchView` composes
  `Dialog` + `Search` + `ListItem` directly (no nested portals).
- Contracts registry / MCP manifest / llms.txt regen: coordinator-owned
  central regen at the end (untouched here, per instructions).
- CLI `empty-search` block file (`apps/site/src/blocks/empty-search.tsx`)
  left untouched — WP7/docs pass repoints installables after regen.

## 6. KernContact trio + ContactDirectory block (CL-006, WP2b)

`ContactRow` / `ContactCard` / `ContactGroupList` / `ContactDirectory`
(`packages/kern/src/components/kern-contact.tsx`; native twin
`packages/kern-native/src/components/kern-contact.tsx`) replace the
raw-hex / light-dark-forked copies (CMP-2524/2525 avatar + line,
CMP-2537 web ContactPicker, CMP-2499 CountryPickerScreen, CMP-2526
ContactGroupPicker, desk-mobile directory rows): the web headless span
vs native HSL disc fork is gone — both renderers disc through the
KernStatus tone registry (CL-010).

Adapter: `ContactAdapter` (`id`, `name`, `detail?`, `photoUrl?`,
`tone?`, `group?`) maps user / driver / group records to one row shape.
`contactToneFor(key)` picks the disc tone deterministically (FNV-1a over
`STATUS_TONES` minus neutral — a NAME-level pick, so both renderers
agree with no scheme object; stable within Kern, explicitly NOT
`avatarToneFor`'s ramp pick, which needs a resolved RoleTable the web
never holds). `contactInitials(name)` takes the first two words.
`filterContacts` (name + detail, case-insensitive) and `groupContacts`
(order-preserving, ungrouped under "Contacts") are shared pure helpers.

| Target | Contract |
| --- | --- |
| `ContactRow` | avatar (photo or initials disc) + name + meta + `trailing` (default chevron); `onSelect` (action) makes it one button, otherwise a `div` — never nested controls |
| `ContactCard` | large disc + identity + `status` (`StatusPill`) + `actions` slot |
| `ContactGroupList` | `groups[]` + `value` / `defaultValue` / `onValueChange` (selected id, canonical) + `onSelect` (fires beside selection) |
| `ContactDirectory` | `contacts` + `query` / `defaultQuery` / `onQueryChange` + `onSelect`; composes `Search` (docked W / inline N — never cmd-K) + grouped rows + `EmptyState` recovery |

Usage:

```tsx
import { ContactCard, ContactDirectory, StatusPill } from "@xoroh/kern";

<ContactDirectory contacts={contacts} onSelect={setActive} />;
<ContactCard contact={ada} status={<StatusPill tone="success">Online</StatusPill>} />;
```

P0 parity decisions (WP2b, rationale recorded):

- The trio owns row markup: `KernList` is NOT composed under it (contact
  rows carry avatar+action affordances the generic row does not model —
  CL-006 names the trio the target, D925).
- Default English strings follow the WP1a precedent (overridable props:
  `searchLabel`/`searchPlaceholder`/`emptyTitle`/`emptyDescription`).
- Base UI `Avatar.Image` renders nothing until load (jsdom never loads):
  rows stay complete on the initials fallback — asserted in test.
