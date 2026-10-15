# Xoroh migration to OSS Kern

> [!IMPORTANT]
> **Planning blueprint only. Actual Xoroh migration requires explicit owner authorization.**
>
> This document specifies the planned architecture, symbol mappings, canary sequence, and rollback strategy for a future migration of the Xoroh monorepo.
> No migration has been authorized, and no product code is modified by this document. All Phase P7 execution tasks remain in a BLOCKED state until explicit owner authorization is granted.


Status: Planning blueprint only. Actual Xoroh migration requires explicit owner authorization. Inspected migration design, not executed. All parent-relative paths below are rooted at `../xoroh-platform` from Kern. The sibling `../xoroh` is not the private application source used here.

## Immediate migration boundary

Start P7A immediately after the approved DTCG/theme foundation, preserved **Xoroh-used** web/native component slice, compiled CSS and verified dogfood artifacts are ready. Do **not** wait for the full CLI/MCP/docs completion or public npm publication. P7A uses owner-controlled local tarballs/prerelease feed and reversible Xoroh-owned adapters. P7B finishes broad rollout/acceptance before Preview. No Xoroh code is changed by this planning assignment.

Private aliases in `tsconfig.base.json:49,65–66`: `@xoroh/kern-expo → libs/kern/expo/src/index.ts`, `kern-start → libs/kern/start/src/index.ts`, `kern-react → libs/kern/react/src/index.ts`. Parent root Bun workspace contains `libs/*/*`; private packages are separately aliased and cannot be replaced by casually adding the nested Kern repo as another workspace. The root pins TypeScript 6.0.3, React 19.2.3 and Vite 7 whereas OSS pins TS5.9.3 and site Vite8. Test consumer declarations with **parent TypeScript**, not force the parent's build tools to match the library.

## Actual consumers and scope

AST scan of static import declarations across parent JS/TS files, excluding `libs/kern`, node_modules, git/build/dist/.nx/.expo/.next: private start imports in **683 files**, expo **455**, react **138**. Sets overlap; counts include type/test imports and are not runtime bundle counts. No private deep subpath import was found in that import-declaration scan. This does not cover generated dynamic strings, CSS references or import-free legacy KERN globals; `KERN-004`/064 rerun broader binding-aware scans before migration.

| Consumer under parent root | Unique files with Kern static imports |
|---|---:|
| mobile balance/cloud/driver/desk/console/passenger (`apps/mobile/xoroh-*-mobile`) | 42 / 24 / 129 / 104 / 23 / 52 |
| web base/embed/marketplace/booking/balance/cloud/backoffice | 22 / 1 / 15 / 22 / 26 / 67 / 55 |
| web auth/drivers/app/desk/console/accounts/workspace | 5 / 5 / 34 / 189 / 61 / 56 / 54 |
| web business/providers/studio | 2 / 1 / 16 |
| `libs/booking/expo`, `libs/booking/start`, `libs/booking/react` | 39 / 8 / 4 |
| `libs/auth/expo-ui`, `libs/auth/start` | 7 / 32 |
| `libs/messaging/expo`, `libs/messaging/start` | 9 / 1 |
| `libs/maps/core`, `libs/explore/expo`, `libs/explore/start`, `libs/explore/ts` | 7 / 6 / 7 / 1 |
| `libs/support/expo`, `libs/wallets/expo`, `libs/credits/expo`, `libs/billing/expo` | 10 / 3 / 4 / 5 |
| `libs/notifications/expo`, `libs/contacts/expo`, `libs/trip/expo` | 2 / 1 / 1 |
| `libs/flows/start`, `libs/status/start`, `libs/groups/start` | 6 / 5 / 2 |
| `libs/domains/start`, `libs/teams/start`, `libs/shared/start`, `libs/mocks/ts`, `libs/accounts/react` | 1 each |

Specific evidence: accounts settings/security/auth forms and sidebar (`apps/web/xoroh-web-accounts/src/features`, `components/layout`); workspace dispatch/fleet dialogs/tables/split panes (`apps/web/xoroh-web-workspace/src/apps`); flows team/organization/workspace/vehicle creation (`libs/flows/start/src/lib`); native messaging ThreadView/CannedResponses/ConversationFooter; notifications screen/pickers; booking/explore native map/detail sheets. Web style entries such as accounts/workspace/desk `src/styles.css` directly import `../../../../libs/kern/start/src/styles.css` and scan that source. Native desk `metro.config.js` uses Nx/Expo + SVG transformer/extensions, with a NativeWind import; parent/app manifests include Paper, Gorhom, gestures/reanimated/safe-area and SVG. OSS native has neither a Paper nor Gorhom renderer dependency. Those product integrations require measured adaptation, not blanket dependency deletion.

## Exhaustive observed imported symbols

These are actual static import names, including types/aliases, not claims of direct OSS equivalents. Preserve as migration inputs; bind-aware regeneration and callsite fixtures are deliverables. Each symbol must be classified **direct rename / behavioral adapter / new generic OSS capability / Xoroh domain helper / obsolete with proof**, never silently dropped.

### `@xoroh/kern-react`

`KernIconNameInput`, `Scheme`, `ThemeMode`, `baseColors`, `functional`, `resolveFunctionalTone`, `resolveTheme`, `statusTone`.

### `@xoroh/kern-start`

```text
AppRailButton AppsMenu AvatarFallback AvatarImage CollapsibleContent CollapsibleTrigger
Command CommandDialog CommandEmpty CommandGroup CommandInput CommandItem CommandList CommandSeparator
ContextMenu ContextMenuContent ContextMenuItem ContextMenuSeparator ContextMenuSub ContextMenuSubContent ContextMenuSubTrigger ContextMenuTrigger
ContrastToggle DialogContent DialogDescription DialogFooter DialogHeader DialogTitle
Document DropdownMenuContent DropdownMenuItem DropdownMenuSeparator DropdownMenuTrigger
FlatAppNavItem FlatAppShell HelpMenu InfoPane
KernAlert KernAlertDescription KernAlertDialog KernAlertDialogAction KernAlertDialogCancel KernAlertDialogContent KernAlertDialogDescription KernAlertDialogFooter KernAlertDialogHeader KernAlertDialogTitle KernAlertDialogTrigger KernAlertTitle
KernAvatar KernAvatarFallback KernAvatarImage KernBadge KernButton KernButtonSpinner
KernCard KernCardContent KernCardDescription KernCardFooter KernCardHeader KernCardTitle KernCheckbox KernChip KernCollapsible KernCommandGroup KernCommandItem KernCountrySelect
KernDialog KernDialogClose KernDialogContent KernDialogDescription KernDialogFooter KernDialogHeader KernDialogTitle KernDialogTrigger
KernDropdownMenu KernDropdownMenuCheckboxItem KernDropdownMenuContent KernDropdownMenuItem KernDropdownMenuLabel KernDropdownMenuSeparator KernDropdownMenuTrigger
KernEmptyState KernErrorBoundary KernFieldMessage KernIcon KernInput KernInputOTP KernInputOTPGroup KernInputOTPSlot KernLabel KernLoader KernNativeSelect KernNativeSelectOption KernPageLoader KernProgressBar KernRadioGroup
KernRowBadge KernRowChevron KernRowRadio KernScrollArea KernSearchBar KernSelect KernSelectContent KernSelectItem KernSelectTrigger KernSelectValue KernSeparator
KernSettingsPageHeader KernSettingsRow KernSettingsSection
KernSheet KernSheetBody KernSheetContent KernSheetDescription KernSheetFooter KernSheetHeader KernSheetTitle
KernSidebar KernSidebarBackButton KernSidebarContent KernSidebarGroup KernSidebarGroupContent KernSidebarGroupLabel KernSidebarInset KernSidebarMenu KernSidebarMenuButton KernSidebarMenuItem KernSidebarProvider KernSidebarSeparator
KernSkeleton KernSlider KernSonner KernSwitch KernTable KernTableBody KernTableCell KernTableHead KernTableHeader KernTableRow
KernTabs KernTabsList KernTabsPanel KernTabsTab KernText KernTextarea KernTitle KernTooltip KernTooltipContent KernTooltipProvider KernTooltipTrigger
NotificationsMenu PagePane Pane Popover PopoverContent PopoverTrigger ScrollArea SearchView SectionDrawer SectionDrawerItem
SelectContent SelectItem SelectTrigger SelectValue ShellContext ShellContextProvider
SidebarContent SidebarFooter SidebarGroup SidebarGroupContent SidebarGroupLabel SidebarHeader SidebarMenu SidebarMenuBadge SidebarMenuButton SidebarMenuItem
SplitPane StatusBar SuperappShell TabsContent TabsList TabsTrigger ThemeToggle TooltipProvider
TopAppBar TopAppBarToggle UserMenu cn kernButtonVariants useAppReady useShell
```

### `@xoroh/kern-expo`

```text
AppCatalogItem BottomSheetScrollView BottomSheetTextInput BottomSheetView CHANNEL_META
ContextOption ContextSelector ConversationRow ConversationRowItem DOMAIN_GLYPHS DeskAppHeader DeskAppHeaderProps
Document DomainGlyph DomainGlyphName EmptyState FilterChipItem FilterChipRow
KernAlert KernAlertDescription KernAppHeader KernAppHeaderProps KernAuthBackdrop KernAvatar KernBadge KernBootLoader
KernBottomSheet KernBottomSheetPicker KernBottomSheetPickerOption KernButton KernCard KernConfirmDialog KernCountrySelect KernDivider
KernDockSheet KernDockSheetItem KernDrawerActionId KernDrawerCheckboxRow KernDrawerFooter KernDrawerItem KernDrawerSectionTitle KernDropdown
KernEmptyState KernEntitySheet KernErrorBoundary KernFAB KernFab KernFlatList KernIcon KernIdenticon KernInput KernList KernListItem KernListSidebar KernLoader
KernMenuActionPill KernMenuList KernMenuListItem KernMenuProfileHeader KernMenuScreen KernMenuSection KernMenuSectionHeader KernMilestoneTrio KernNavTab KernNavigationDrawerHandle
KernOutlinedIconButton KernPageLoader KernProgressBar KernRootIndex KernSection KernSectionHeader KernSectionLabel KernSectionList
KernShapeAvatar KernShapeComposition KernShapeLegend KernSheetHandle KernSkeleton KernSlidersIcon KernSnapSheet KernSnapSheetHandle KernSnapSheetMetrics
KernSpinner KernSplash KernSuccessState KernSuccessTransform KernSwitch KernText KernThemeContextValue KernToolbarButton KernTypingIndicator
LOADER_SHAPE_CATALOG LOADER_VARIANTS PagePane PageShell SecondaryTabs SmallTopAppBar SourceChannel SpectrumHue StatusVariant SuperappShell TrailingAction
createMobileAppConfig createPillPressableStyle elevation formatRelativeTime getAvatarColor getInitials getRowRadii
kernHiddenTabBarTabsProps kernStackScreenOptions layout motion pillItemStyle radius registerLoaderVariant
resolveIconTone spacing spectrumTone status statusTone typography useAppsSheet useKernListDrawer useKernTheme usePagePaneLayout usePublicAuthRedirect userToneFor
```

## Concrete import/API mapping

| Private need | OSS target/default migration | Necessary validation / gap |
|---|---|---|
| Plain prefixed components e.g. KernButton/Input/Switch/Checkbox/Card/Text | unprefixed exports from `@xoroh/kern` (web), `@xoroh/kern-native` (native) | Props/ref/value callbacks, variants/defaults/classes/styles differ; AST rename alone insufficient |
| KernIcon / KernIconNameInput | Icon / IconNameInput from `@xoroh/kern-icons` | Private filled default versus OSS outline default; pin explicit fill in adapter; aliases/material paths and palette color mapping |
| resolveTheme({mode,contrast,variantId}) | tokens `resolveTheme(mode,contrast,selection)` / `resolveThemeDetails` | Object→positional signature; tenant variants validated and preserved; extra private roles need mapping |
| Scheme/ThemeMode/baseColors/functional/statusTone | tokens `RoleTable`/`Mode`/`tokens.palettes`/functional-tone APIs | Not blindly equivalent: private palette names/steps, `surfaceVariant/surfaceTint/background/onBackground` and status triples differ |
| cn / kernButtonVariants | `@xoroh/kern/utils`; inspect public `buttonVariants` export | Assert style composition/disabled/link output, not old import assumption |
| KernProgressBar/ButtonSpinner/Loader/PageLoader | LinearProgress/CircularProgress or LoadingButton/Loader/PageLoader | determinate scaling/footprint/a11y, private boot app-readiness hooks absent |
| DropdownMenu/ContextMenu Sub/checkbox rows | Menu/ContextMenu public composition plus generic missing capabilities | Native menu/sheet props and web submenu API not all represented by generated UI rows; implement before used callsites migrate |
| Dialog/Header/Footer, Card/Title/Description/Footer, Sheet/Body/Header/Footer | named content slots/local semantic wrappers over actual OSS parts | Preserve structure and focus/error semantics; don't map Footer to Actions without verifying |
| InputOTPGroup/Slot | web InputOTPRoot/InputOTPInput; native InputOTP | paste/autofill/index labels and controlled string; slot layout adapter |
| NativeSelectOption | HTML option inside NativeSelect on web | form/defaultValue/disabled semantics; mobile Select separate |
| PagePane/InfoPane/SplitPane/AppRail | `/start` Page/Pane/Inspector/ListDetail/SplitGrid/NavigationRail; native layouts equivalents | compare resize, detail selection, width, routing/RTL/keyboard; preserve private behaviors via generic APIs or adapter |
| FlatAppShell/SuperappShell/Document/useShell/useAppReady | `/start` AppShell/Document plus Xoroh shell/readiness/router/catalog adapters | Private shell context/back-drill/deep links/auth are not OSS equivalents by name |
| SettingsSection/PageHeader/row trailing presets | SettingsRow + Card/Text/Divider components and source block | preserve label/error/trailing controls and accessible groups |
| BottomSheetView/TextInput/ScrollView, handles/metrics | native sheets plus compatible host scroll/input/gesture integration | Native OSS uses RN primitives; Gorhom behavior cannot be assumed equivalent; keyboard/snap/back/device tests block migration |
| Native AppHeader/DeskAppHeader/SmallTopAppBar/ToolbarButton | TopAppBar/Action plus Xoroh app data/config wrapper | safe areas, collapse, gestures, navigation and menu actions |
| ConversationRow/CHANNEL_META/DomainGlyph/AuthBackdrop/public auth redirect | app/domain packages in Xoroh; generic visual primitives underneath | business types/auth routes stay private/app-owned; don't leak them into tokens or contracts |
| Native typography/radius/spacing/elevation/layout/motion utilities | public token projections plus Xoroh legacy alias adapter | native numeric dp/fontWeight styles, extra `xl` radius/micro typography, fixed layout heights reviewed |
| StatusVariant/userToneFor/getAvatarColor/getInitials/getRowRadii/formatRelativeTime | tokens status/spectrum helpers where exact; generic local utility or public documented API if broadly reusable | user hashing/theme awareness/time locale/row corners stable; no heuristic deletion |
| Paper theme/mobileAppConfig/router stack helpers | retain host Paper/navigation setup during staged migration | OSS no Expo/Paper package requirement; remove only after live dependency audit proves no usage |

## Tokens, theme and icons used

Inspected private `libs/kern/react/src/theme/{schemes,resolve}.ts` and native `libs/kern/expo/src/theme/{index,useThemeNative}.tsx`. Private default is neutral primary (black/white) and blue secondary; current OSS default is purple primary/muted secondary. Build an explicit Xoroh compatibility preset from private source, compare **all** role/context outputs, migrate obsolete role aliases with an app bridge, and keep branding approval separate from architectural changes. Private theme provider includes `followSystem`, `setFollowSystem`, async `ThemeStorage`, `variantId`, manual-mode persistence; OSS current native provider has different controlled/defaultMode fields. Retain storage/OS semantics in adapter or add generic host adapter API with tests.

Observed token member usage includes spacing xs/sm/md/lg/xl/xxl/xxxl; radius full/small/medium/large/extraLarge/xl; typography body/bodyBold/bodyLarge/bodyMedium/bodyMediumEmphasis/bodySmall/caption/captionBold/badge/displayMedium/h3/headlineSmall/label/labelLarge/labelMedium/labelSmall/micro/titleLarge/titleMedium; elevation level1/level3; layout iconButtonSize; motion duration/easing; baseColors neutral/secondary/error/success/warning/info; functional priority; status success/warning/error/info/neutral. This property-name scan is **not binding-aware** (especially generic `status` variables); `KERN-066` records resolved binding/callsite evidence before treating every member as a token. Numeric private spacing = 4/8/12/16/20/24/32; private radius `xl=20` has no automatic equal-valued public token assumption. Typography aliases are native style objects, not strings.

Observed JSX literal names on Icon-tagged elements (dynamic icon data requires `KERN-067` binding-aware closure scan):

```text
account account_balance account_balance_wallet account_circle account_tree add add_circle alternate_email apartment apps archive
arrow-back arrow_back arrow_downward arrow_drop_down arrow_drop_up arrow_forward arrow_upward assignment attach_file attach_money autorenew
badge bar_chart bed bolt bookmark brush bug_report build business_center cake calendar_month call camera campaign cancel chat chat_bubble check check-circle check_box check_box_outline_blank check_circle chevron_left chevron_right circle close close_fullscreen
cloud cloud_off code computer confirmation_number content_copy create_new_folder credit_card dark_mode dashboard database date_range delete description devices directions_car dns dock_to_left dock_to_right domain done_all download drafts drag_handle drag_indicator drive_file_move eco edit edit_note error euro event event_available event_busy exit-to-app extension favorite filter_list fingerprint flag flight folder folder_open
format_align_left format_bold format_italic format_list_numbered format_strikethrough forward group help history image inbox info keep key layers light_mode link link_off list location_on lock logout luggage mail manage_accounts manage_search map mark_email_read memory menu menu_book menu_open merge minimize monitor monitoring more_horiz more_vert movie my_location navigation north_east north_west note_alt notifications
open-in-new open_in_full open_in_new package palette pan_tool pause payments percent person person_add person_off person_remove photo_camera photo_library play_arrow power print public qr_code receipt redo refresh remove repeat reply reply-all report restart_alt rocket route save schedule science search sell send sentiment_satisfied settings share shield shopping_bag signpost smart_toy sort sos speed star storage subdirectory_arrow_right support swap_vert sync table_chart tablet tag task text_fields thumb_down thumb_up timer title translate trending-up trending_up tune upload verified videocam view_kanban view_list visibility visibility_off warning webhook work
```

The actual OSS `resolveIconName` was run on **all 213 unique literals above**: 212 resolved; **`account_balance` returned null**, used by `apps/mobile/xoroh-balance-mobile/src/domains/wallets/screens/withdraw/WithdrawDestinationScreen.tsx`. This is a concrete migration gap, not an assumption that underscore names all work. Other legacy literals such as `exit-to-app`, `package`, `database` resolved in the current catalog. Resolution proves name membership, not rendered visual meaning, accessibility or dynamic data closure. Custom domain glyphs/data-driven inputs still need binding-aware validation; compare glyph/fill/tone meaning across web/native and preserve upstream licenses for vendored paths.

## Ordered rollout and rollback

1. Freeze parent usage/callsite/icon/theme/style baseline (`KERN-064`), record each app's existing failures and representative screenshots/interaction scripts. No secrets/product data in OSS fixtures.
2. Build Xoroh-owned compatibility layer importing **only verified OSS public exports**, with direct-rename codemod and explicit unmapped blockers (`KERN-065`/066/067). Copy generic sanitized repros upstream for missing capabilities; domain implementations stay parent-side.
3. Pin foundation/provider/icon tarballs by hash, update selected app dependencies without source aliases, switch CSS to public artifacts and theme boot/storage logic (`KERN-068`/069). Keep a separate previous lockfile/dependency/config manifest and app adapter switch so rollback is a reviewed change, not reset.
4. Canary web accounts + a bounded shared flow, then native desk messaging/settings/sheet slice (`KERN-070`/071); native physical/simulator keyboard/back/gesture/accessibility validation required. Feedback begins immediately at this point, not after all apps compile.
5. Expand grouped web and native apps/domain libs with owner-approved windows (`KERN-072`/073). Avoid changing backend/session/business behavior in the same step. CI uses artifact imports and detects private path leaks (`KERN-074`).
6. End adapter migration only after every used symbol is mapped and behavior accepted; retain deliberate Xoroh domain wrappers. Rehearse rollback and record usage-feedback tickets with source repro/test/owner (`KERN-075`).

Rollback: revert **only the authorized migration commits/config/lockfile/artifact pins** through normal reviewed changes; previous private packages/aliases remain available until rollout completes. Maintain both adapters behind per-app build configuration, not simultaneous global theme contexts. Receipt-backed customized blocks retain baseline/current snapshots. Never restore by destructive checkout/reset in a dirty parent tree. Stop rollout on auth/booking/dispatch loss, missing actions/labels, theme/persistence flicker, runtime duplicated React/context/native modules or modal gesture/focus regressions; restore previous canary config and investigate upstream.

## Verification and acceptance

Inspected existing commands, not executed: accounts `bun run --cwd apps/web/xoroh-web-accounts build` and `test` (Vitest **--passWithNoTests**, so exit 0 alone proves nothing); Nx project has build/test/lint but no genuine typecheck target. Parent desk mobile has android/ios and Nx dev/lint, **no bundle/test target**. Its Metro config is real. Add non-empty migration test suites and explicit parent typecheck/native export smoke rather than invent `nx test` for nonexistent mobile targets.

Acceptance checklist for each rollout group:

- [ ] Every imported symbol and used API axis/callback/ref/theme/icon/config has a classified target and evidence fixture.
- [ ] Public artifacts resolve under parent TS6/React19.2/RN0.86.3 and current Nx/Metro, with no private Kern source/style alias leak.
- [ ] Style and theme fixtures match approved legacy light/dark/contrast/tenant behavior, including first paint/storage/OS change and semantic aliases.
- [ ] Auth/error/submission/focus/disabled/loading/navigation/table/OTP scenarios pass on web; native modal keyboard/back/snap/scroll/safe-area/font/icon/accessibility scenarios pass on device/simulator.
- [ ] Product owners accept accounts/flows, workspace dispatch/fleet, messaging/notifications/booking canaries and scoped rollout scenarios; screenshots and interaction evidence recorded.
- [ ] Blocks/source-installed custom files have full dependency closure and safe upgrade evidence where used; unused workflows are not mislabeled product requirements.
- [ ] CI has non-empty tests and artifact builds; baseline failures are separated from migration regressions.
- [ ] Rollback is rehearsed with preserved product data and prior artifact pins; feedback results in upstream tasks, not permanent private forks of generic OSS behavior.

Compilation is necessary, not sufficient. Broad product correctness, all dynamic imports/icons, private usage readiness and current parent test status remain unverified in this planning assignment.
