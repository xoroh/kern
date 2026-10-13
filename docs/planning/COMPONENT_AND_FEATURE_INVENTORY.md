# Capability-preservation inventory

Status: source-inspected 2026-10-13 working-tree inventory; **not** a claim of exhaustive behavior testing. Inventory units are public exports, source modules, and capabilities—not approximate component totals.

## Inventory authority and evidence

The complete **417 named UI export rows** (300 web, 117 native), including every multipart name/status, are already generated in [../components.md](../components.md); source location for each is `packages/mcp/src/manifest.ts`. This plan incorporates that exact inventory by reference instead of hand-editing or duplicating generated names. Inspected it in full and grouped every row by actual source path with TypeScript AST inspection. There are no stub rows in this snapshot. Helpers/types/theme/font APIs not classified as UI rows are in `kern/src/index.ts`, `components/index.ts`, `start/index.ts` and `kern-native/src/index.ts`; freezing those barrels is also required.

Evidence hierarchy: public export maps/barrels → source props/CVA/style maps → actual behavior tests → content/example metadata. Generated `apps/site/src/generated/props*.ts` and `src/content/{web,mobile}/*.ts` are reference aids, not proof an axis is implemented. `docs/platform-parity.md` gap prose conflicts with current exports and must be reconciled. Native flat APIs versus web Root/Content parts are not a functionality gap by themselves.

Table path notation: W=`packages/kern/src/components/`, N=`packages/kern-native/src/components/`; a stem means `<stem>.tsx`. S=`packages/kern/src/start/`. All named exports in a listed module are preserved as recorded in the generated inventory. Tests: colocated `*.test.*` and/or aggregate family tests on web; native `*.test.*` plus `*.rntest.tsx`/`src/parity/`. Docs: matching site content/demo registry where present; unknown coverage must be recorded by `KERN-003`, not assumed from a page title.

## Every UI module/concept

Family obligations: **P** press/name/state/48dp; **F** field/value/label/error; **O** named surface/modality/dismissal/focus return; **V** navigation/selection/keyboard; **C** static semantic content; **L** progress/busy/announcement; **S** responsive composition/slots. These obligations apply to every row and multipart child. All visual components depend on Material role/shape/type/state foundations; native uses live scheme/style maps, web CSS vars. Icon-bearing controls use icon slots/internal SVG as implemented; audit actual mapping rather than assume a direct icons package dependency.

| Concept/modules (all generated UI exports included) | Web source | Native source | Preservation behavior / migration note |
|---|---|---|---|
| Accordion (web 6 parts) | W accordion | N accordion | O/V; expansion, multiple values, trigger/panel association |
| AlertDialog (web 7 parts) | W alert-dialog | N alert-dialog | O; destructive confirmation, two-action policy; private Action/Cancel wrappers need mapping |
| Autocomplete (web 7 parts) | W autocomplete | N autocomplete | F/V; input filter, empty state, option selection; native is **present** |
| Avatar (web Root/Image/Fallback) | W avatar | N avatar | C; image failure/fallback and size names differ |
| Badge | W badge | N badge | C; dot/count, count overflow/announcement |
| Banner/BannerAction | W banner | N web-parity | O/C; four intents, action/dismissal |
| BootIndicator / BootSplash / ErrorBoundary | W boot-indicator, error-boundary | N shell | L/C; boot milestones/fallback, reset/recovery; boot API differs |
| Button | W button | N button | P; all axes below, href/press callbacks; real native size gap |
| ButtonGroup | W button-group | N button-group | P; standard/connected, orientation, child variants/ref continuity |
| Calendar | W calendar | N calendar | F/V; date, grid navigation/disabled dates; range not silently promised |
| Card + Header/Content/Actions | W card | N card | C; treatment/semantics; private Title/Description/Footer wrappers not automatic renames |
| Carousel | W carousel | N carousel | V; index/options, prev/next, keyboard/swipe, named images |
| Checkbox | W checkbox | N checkbox | F/P; binary/indeterminate and groups, disabled state |
| CheckboxGroup + Item/Root | W checkbox-group | N checkbox-group | F/V; group label, controlled array membership |
| Chip | W chip | N chip | P/F; assist/filter/input/suggestion, removal/selection/elevated states |
| CircularProgress | W circular-progress | N circular-progress | L; determinate/indeterminate, four-color/shapes, reduced motion |
| Collapsible (web 4 parts) | W collapsible | N collapsible | O; expansion callback and panel visibility |
| Combobox (web 9 parts) | W combobox | N combobox | F/V/O; filter/clear/empty/loading/selected; native modal tap/focus behavior |
| Command (web 9 parts) | W command | N web-parity | F/V; filtered groups/results/actions; private CommandDialog/Group wrappers |
| ContextMenu (web 6 parts) | W context-menu | N context-menu | V/O; context/long press, menu semantics; submenus require private mapping |
| ContrastToggle | S blocks | N contrast-toggle | P; cycle contrast and reflect state |
| CountrySelect (web 7 parts) | W country-select | N web-parity | F/V; country values and accessible names; present native |
| Dialog (web 7 parts) | W dialog | N dialog | O; focus/back/escape and action slots |
| Drawer (web 7 parts) | W drawer | N overlay-surfaces | O; open/naming/dismissal; native **present** |
| EmptyState | W empty-state | N empty-state | C/P; title/support/actions and loading/error alternatives |
| ExtendedFab | W extended-fab | N extended-fab | P; collapse/expand handles, size/selected; elevation drift |
| Fab | W fab | N fab | P; color/size/lowered variants, disabled visibility, icon/name |
| FabMenu | W fab-menu | N fab-menu | P/O; open action menu, focus/dismiss/child actions |
| FieldMessage | W field-message | N field-message | F; error replaces description, live association |
| Field + Label/Description/Error/Root | W field | N field | F; label/id/helper/error linkage; native FieldRoot alias |
| Fieldset + Legend/Root/Item | W fieldset | N fieldset | F/C; grouped label, disabled propagation; native present |
| FocusRing | W focus-ring | platform-owned | P; visible focus, reduced motion; no duplicate native ring required |
| Form | W form | host form state | F; submit/validation; declare platform-specific contract |
| IconButton / native Target | W icon-button | N icon-button | P; toggles/name/loading/shape/width gaps below |
| InputOTP (web Root/Input parts) | W input-otp | N input-otp | F/V; digit slots/paste/backspace/name/autofill; private Group/Slot API migration |
| Input | W input | N input | F; filled/outlined, helper/error, text input/ref/keyboard |
| Kbd | W kbd | N kbd | C; visual shortcut semantics; present native despite old asymmetry prose |
| Label | W label | N label | F; name association, required marking |
| LinearProgress | W linear-progress | N linear-progress | L; determinate/indeterminate/four-color/stop/reduced-motion |
| LinkButton | W link-button | N link-button | P/V; href vs injected navigation, disabled link, icon placement |
| ListItem | W list-item | N list-item | P/C; one/two/three-line content, selection/trailing controls |
| Loader | W loader | N loader | L; native ActivityIndicator sizes intentionally differ |
| LoadingButton | W loading-button | N loading-button | P/L; progress with stable footprint; loading blocks actions |
| LoadingIndicator / web LoadingRegion | W loading-indicator | N loading-indicator | L; shape sequence/size, busy/label/reduced motion |
| MenuScreen/MenuSheet/FilterChipRow | W menu-family | N menus/layouts | O/V/P; declarative groups/sheets/filter membership |
| Menu (web 7 parts) | W menu | N menu | O/V; keyboard/typeahead, selection, disabled/action items |
| Menubar (web 6 parts) | W menubar | N menubar | V/O; root/menu API-part counts differ |
| Meter (web 4 parts) | W meter | N meter | L/C; min/max/value and descriptive value text |
| NativeSelect | W native-select | host/native Select | F; HTML option/form integration; explicit platform alternative |
| NavigationBar + Item | W navigation-bar | N navigation-bar | V/P; selected value, disabled items, labels/badges |
| NavigationDrawer | W navigation-drawer | N navigation-drawer | V/O; destinations/groups/back/narrow presentation |
| NavigationMenu (web 7 parts) | W navigation-menu | N navigation-menu | V/O; landmark/link versus native navigation callbacks |
| NavigationRail / web Button | S navigation | N navigation-rail | V/P; collapse/selection/labels; private AppRail mapping |
| NumberField (web Root/Input) | W number-field | N number-field | F/P; numeric parse/step/clamp/min/max/disabled |
| PageLoader | W page-loader | boot/loading composition | L; generic native replacement must preserve product usage |
| Pagination | W pagination | N pagination | V/P; current page/count and disabled boundaries |
| Popover (web 7 parts) | W popover | N overlay-surfaces | O; named surface, anchors/native dismissal |
| PreviewCard (web 4 parts) | W preview-card | intentional touch alternative | O; hover/focus preview; declare native alternative |
| Progress (web 4 parts) | W progress | N progress | L; numeric progress semantics vs visual indicator |
| RadioGroup + Item | W radio-group | N radio-group | F/V; one selection/label/roving and disabled propagation |
| ScrollArea (web 4 parts) | W scroll-area | N overlay-surfaces | C/V; scroll/ref/keyboard; native ScrollView not missing |
| Search | W search | N search | F/O; query/expanded controls and keyboard focus |
| SecondaryTabs | W secondary-tabs | N layouts | V; value, disabled options, semantic relationships |
| SegmentedButton (web Root/Item) | W segmented-button | N web-parity | F/P; web array values, native scalar/values; size gaps |
| Select (web 10 parts) | W select | N select | F/V/O; filled/outlined, empty/group/disabled/native modal |
| Separator | W separator | N separator | C; orientation/decorative semantics |
| SheetSurface/Bottom/Dock/Snap/Entity/Picker/Action | W sheet-family | N sheet-surface/sheets/menus | O/F; snap/size/value/open, keyboard/back/gestures and action maps |
| Sheet (web 7 parts), native SheetHandle | W sheet | N sheet/sheets | O; named modal mechanics and handle refs |
| Skeleton | W skeleton | N skeleton | L; decorative/placeholder, reduced motion |
| Slider (web Root/Thumb/Label/Value) | W slider | N slider | F/V; sizes/ranges/keyboard and value announcements |
| Snackbar (web Provider/Viewport/Root/etc.) | W snackbar | N snackbar | L/O/P; message/action/timing/live region; elevation mismatch |
| Sonner (web 9 parts) | W sonner | Snackbar alternative | L/P; imperative manager API; do not delete web feature |
| Split | W split | N split | S/V; panes/resizing/orientation; private SplitPane maps by behavior |
| SplitButton | W split-button | N split-button | P/O; separate primary/overflow targets and disabled/dismissal |
| Switch | W switch | N switch | F/P; controlled checked/value and name/state |
| Table (web 8 parts) | W table | N table | C/V; caption/head/cell semantics; sort/pagination host composition |
| Tabs (web 5 parts) | W tabs | N tabs | V; relationship/value/keyboard/content retention |
| Text | W text | N text | C; four typographic roles and host semantics |
| Textarea | W textarea | N textarea | F; filled/outlined behavior vs native multiline wrapper |
| ThemeToggle | S blocks | N theme-toggle | P; current mode/control; persistence in host |
| TimePicker | W time-picker | N time-picker | F/V; hour/minute/period, dial/keyboard, numeric values |
| Toggle | W toggle | N toggle | P; controlled pressed/legacy value alias |
| ToggleGroup (web Root/Item) | W toggle-group | N toggle-group | F/P; single/multiple rules and size inheritance |
| Toolbar (web 5 parts) | W toolbar | N toolbar | V/P; standard/vibrant/orientation/group actions; elevation drift |
| Tooltip + rich content/title/actions | W tooltip | N tooltip | O; simple versus interactive rich, naming/dismissal; web has no `RichTooltip` root export |
| Shape/ShapeArt/ExpressiveShape | not public UI rows | N shape/shape-art | C; brand art shape/tone/layout/rotation; preserve native scope |
| MilestoneTrio/SuccessTransform | not public UI rows | N milestone-trio/success-transform | L/C; staged feedback, host lifecycle; do not drop |
| AspectRatio/KernPressable | platform CSS/HTML + models | N aspect-ratio/pressable | C/P; layout/press host obligations |

## Every web composition module and native equivalents

| Source | Exact generated UI exports | Native equivalents / preservation |
|---|---|---|
| `S blocks.tsx` | SearchBar, SettingsRow, StatusBar, ThemeToggle, ContrastToggle | Search + SettingsRow/status/toggle modules; no native SearchBar symbol—query behavior mapping required |
| `S link.tsx` | LinkProvider, Link | LinkButton/onPress host; web router injection remains public |
| `S navigation.tsx` | SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarItem, NavigationRail, NavigationRailButton, SectionDrawer | navigation-drawer/rail/bar; private hierarchical/drill sidebar capabilities need real mapping, not assume OSS Sidebar has them |
| `S panes.tsx` | Pane, Page, SplitGrid, SplitPanel, ListDetail, Inspector | layouts: Pane/ListDetail/SupportingPane; slots/layout sizing/selection |
| `S scaffolds.tsx` | AppShell, Document | AppShell/BootSplash/ErrorBoundary; auth/app readiness remains host-specific where absent |
| `S top-app-bar.tsx` | TopAppBar, TopAppBarToggle, AppTopBar, TopBarMenu, AppsMenu, HelpMenu, NotificationsMenu, UserMenu | native TopAppBar/TopAppBarAction/Toggle; catalogs and callbacks stay app data |

Non-UI composition helper/type exports also preserved from these barrels (including layout sizes, context hooks, slot/route adapters). Bindings in both `components/presentation.tsx` are intentionally **not public components**; fix coverage classification, not export them. Blocks: `settings-screen.tsx`, `auth-form.tsx`, `empty-search.tsx` under site `src/blocks`; manifests and package/source closure are part of their functionality.

## Verified variant and size axes

Extracted actual CVA keys and TS aliases; source, not stale family prose, wins. Aliases/inherited Base UI props beyond this table stay in the generated props/type inventory. Any API breaking change needs a migration fixture and changeset.

| Component | Current web axes | Current native axes/gap |
|---|---|---|
| Button | variants elevated/primary/tonal/outlined/ghost, aliases filled/text; color primary/danger; sizes xs/sm/default/md/xl/lg/icon; shape pill/rounded/square; block/toggle/selected/loading/pressed | same variants/color/shape; sizes **xs/default/sm/xl/icon only**—md/lg missing; selected controlled behavior and hitSlop |
| IconButton | standard/filled/tonal/outlined; xs/sm/default/md/lg/xl/2xl; pill/square; width narrow/default/wide; selected/toggle/loading/selectedLabel | variant same; xs/default/md/lg/xl; no matching sm/2xl typed sizes or full web width/shape/loading contract demonstrated |
| Fab | color surface/primary/secondary/tertiary and primary-fill/secondary-fill/tertiary-fill; default/md/medium/large/sm/icon | color same; default/small/medium/large/icon; sm versus small/md mapping required |
| ExtendedFab | small/medium/large; collapsed/value/ref handles | same size; extra legacy primary/tonal axis still native; visual/elevation ruling required |
| ButtonGroup | standard/connected; horizontal/vertical | same |
| Chip | assist/filter/input/suggestion; elevated; filter selected/value, input removable | native union includes input though narrowed prop branches differ; test each kind rather than infer from union |
| Card | filled/outlined/elevated | same |
| Avatar | sm/default/lg | small/default/large |
| Badge | dot/count | same |
| Banner | info/success/warning/error | same |
| FieldMessage | description/error | same |
| Input/Textarea | outlined/filled; error/helper | Input same; Textarea inherited wrapper contract needs fixture |
| Text | body/label/title/headline | same role names; individual text sizes/emphasis from typescale |
| Loader | sm/default/lg | small/large (ActivityIndicator mapping) |
| LoadingIndicator | sm/default/lg/xl; shapes/algorithm/variant infrastructure | same size aliases; standalone component behavior test needed |
| Slider | default/xs/sm/md/lg/xl | same |
| SegmentedButton | xs/sm/md/lg/xl; Base UI array/multiple values | native flat options/scalar or values API; explicit capability size evidence |
| Toolbar | standard/vibrant; horizontal/vertical | `color` standard/vibrant; orientation; axis naming differs |
| TopAppBar | size declared in S top-app-bar source | small/center/medium; collapsing/scroll and content slot differences |
| Sheets | Bottom/Dock/Snap/Entity/Picker surfaces with controlled open/value | BottomSheet medium/large, placement bottom/center, refs/metrics; gesture equivalence unverified |
| Native ShapeArt | no web public component | scatter/stack/arch, soft/mid/accent, size/opacity/shape/color/rotation |

## States, dependencies, tests and gap assignment

For **each inventory module and every exported part**, preservation fixture must record: defaults and all axes above; enabled/disabled/soft-disabled, hover/focus/pressed, selected/checked/indeterminate, loading/busy, invalid/error, empty/open/closed states where applicable; callbacks, ref/imperative methods, controlled/uncontrolled transitions; custom class/style/slot/render composition; keyboard/back/swipe behavior; light/dark/three contrasts/preset/RTL/reduced motion; visible and accessible name/error relationships.

Source references for details: `docs/{button,form,navigation,feedback}-family-reference.md`, `display-overlays-reference.md`, `parity/contract.ts`, renderer `src/parity/`, `kern/src/callback-lexicon.test.ts`, `composition.test.ts`, family-complete/M3 suites, native RNTL files. These docs contain contradictory old notes (e.g. button sizes and motion); quote source-derived values in the generated capability fixtures instead of resolving contradictions by removing behavior.

Task mapping: `KERN-025` freezes inventory/exports/variants; `KERN-026` elevations/shape rulings; `KERN-027` field/selection/overlays; `KERN-028` navigation/start; `KERN-029` native behavior/theme/gestures; `KERN-030` icons; `KERN-032` exact parity reclassification; `KERN-058` docs/examples and `KERN-070`–073 Xoroh acceptance. Unknown tests/docs/ref/keyboard behavior are **needs measurement**, not invented support. Metadata improvements (`KERN-049`) must link every capability to actual test evidence or documented unsupported reason.

Actual private Xoroh used exports, icon literals, token members, consumers and mapping are exhaustively listed/scoped in [XOROH_MIGRATION.md](XOROH_MIGRATION.md). Presence there escalates a real behavioral gap to migration blocker. Generic shell/row/ref capabilities not yet in OSS need tested public API additions or local adapters; business-specific helpers remain Xoroh-owned. No item is removed because it complicates inventory.

## Non-component capability inventory

| Capability | Actual source | Required preservation / plan |
|---|---|---|
| Tokens/themes/contrast/DTCG | tokens `src/{tokens,resolve,pipeline,contrast,presets}.ts`, JSON/themes/generators | existing outputs/custom presets; DTCG import/export now |
| Motion/seed/feedback/focus/sizes/tones/variants | token modules named above | algorithm/registry/customization remains public; no module-scope native capture |
| Behavior kernel | primitives `src/index.ts`, `adoption.json` | 81 exports; 70 used/11 deliberate unadopted, retained with evidence |
| Icons | icons core/sets/render/config/tools/THIRD_PARTY | all 1340 names/42 meanings, web/native assets/a11y/licensing |
| Theme hosts/fonts | web `web-theme.ts`, native `theme.tsx`, `fonts.tsx` | OS/controlled modes, storage adapter compatibility, first paint, font gate |
| Registry/blocks/install | CLI add/closure/blocks/init/manifest, site block manifest | full dependency/assets closure, safe receipts/upgrades/native support |
| MCP/AI metadata | MCP tools/manifest/maturity, site llms/page-md/index generation | correct source/export/platform, standalone payloads/truthful verification |
| Docs/demos/playground/gallery | site content/demos/routes/generated/blocks, mobile App/src | real previews for every advertised native concept, queryable docs, no expectation-as-measurement |
| Quality/release | scripts/parity/e2e/CI/changesets | current gates fixed, artifact consumer matrix added; founder HOLD respected |
