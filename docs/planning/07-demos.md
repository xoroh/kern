# 07 — Demos (lane R7-A verdict)

**Goal:** every component has a live demo. No "Demo coming" anywhere.

**Research verdict:** web ~40 exports with no demo render the generic fallback (`demos/web/registry.tsx:342-352`,
`WEB_PREVIEW_REASONS` deliberately empty `:352`). Groups: 7 sheet siblings (only base `Sheet` demoed
`:289-295`), 5 navigation surfaces (only `NavigationMenu`), ExtendedFab/FabMenu (only `Fab` `:210`), TimePicker,
TopAppBar pair, SecondaryTabs (matters — B-correctness), SearchBar, Split family, MenuScreen/MenuSheet,
FilterChipRow, Pane/ListDetail, SectionDrawer/Sidebar-6/SettingsRow/StatusBar/ThemeToggle, LoadingIndicator/
LoadingRegion, Link trio, FocusRing/ContrastToggle, KernErrorBoundary, app-chrome rows (arguably omit, but list
the decision). Orphan configurators with NO demo: Carousel, IconButton (`showcase/registry.ts:96,117`).
Mobile ~35 unaccounted (no demo AND no reason — violates the file's own contract `demos/mobile/registry.tsx:
509-513`): 12 everyday M3 controls with zero presence — Meter, Pagination, NumberField, Tooltip, TimePicker,
Popover, ScrollArea, IconButton, InputOTP, Autocomplete, Carousel, CheckboxGroup. Examples registry is 5 only
(Button, Input, Checkbox, Menu, Menubar — `showcase/registry.ts:65-71`); configurator coverage flagship-only is
intent (`registry.ts:78-85) but undocumented on-site.

**Design:** demos render inside the component page Demo section (live + playground links + install/examples +
Do/Don't), configurators one-live-component + per-prop knobs + same-object codegen.

## Work items (ordered)

- [ ] Web undemoed: one demo per export above (sheet siblings, navigation surfaces, Fab siblings, TimePicker,
      TopAppBar, SecondaryTabs, SearchBar, splits, MenuScreen/MenuSheet, FilterChipRow, Pane/ListDetail,
      chrome rows, SettingsRow/StatusBar/ThemeToggle, loading pair, Link trio, FocusRing/ContrastToggle,
      ErrorBoundary); adopt orphan configurators (Carousel, IconButton) with demos.
- [ ] Mobile unaccounted: demo OR honest reason per export (12-list first); fix noisy non-component keys
      (`arcRotations`, `loaderColor` `:563-566`).
- [ ] Document flagship-only configurator policy on-site; grow examples registry beyond 5.
- [ ] App-chrome rows: demo or explicit omit-list (no silent gaps).

**Gates:** `undemoedWebExports`/`unaccountedMobileExports` must be empty-or-reasoned, `check:docs` chain.
**Out of scope:** new components (demo what ships; park list D15 stays parked).
