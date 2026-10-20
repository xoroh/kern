/**
 * The web demo registry: export name -> a live React demo.
 *
 * `webExports` is checked against `docs/components.md` at build time by
 * `registry-audit.ts`, so a component that ships without a demo fails the
 * typecheck instead of rendering a blank page. Compound families (Dialog,
 * Tabs, Field, …) expose a namespace object *and* its parts; the namespace
 * and every part resolve to the same family demo, because the part has no
 * meaning outside its parent.
 */
import {
  Button,
  FocusRing,
  RichTooltip,
  Select,
  SelectGroup,
  SelectGroupLabel,
  Tooltip,
} from "@xoroh/kern";
import { Preview } from "../../components/preview/preview";
import { T_BODY_MD, T_BODY_SM } from "../../domains/shared/systems/type-scale";
import { componentsOn } from "../../generated/manifest";
import {
  AvatarDemo,
  BadgeDemo,
  BannerDemo,
  BootIndicatorDemo,
  ButtonDemo,
  ButtonGroupDemo,
  CardDemo,
  ChipDemo,
  CircularProgressDemo,
  EmptyStateDemo,
  ExtendedFabDemo,
  FabDemo,
  FabMenuDemo,
  FilterChipRowDemo,
  IconButtonDemo,
  KbdDemo,
  KernErrorBoundaryDemo,
  LabelDemo,
  LinearProgressDemo,
  LinkDemo,
  ListItemDemo,
  LoaderDemo,
  LoadingButtonDemo,
  LoadingIndicatorDemo,
  LoadingRegionDemo,
  PageLoaderDemo,
  SeparatorDemo,
  SkeletonDemo,
  TextDemo,
  ThemeToggleDemo,
} from "./display";
import {
  CheckboxDemo,
  CheckboxGroupDemo,
  FieldDemo,
  FieldMessageDemo,
  FieldsetDemo,
  FormDemo,
  InputDemo,
  InputOTPDemo,
  NumberFieldDemo,
  RadioGroupDemo,
  SearchDemo,
  SliderDemo,
  SwitchDemo,
  TextareaDemo,
  ToggleDemo,
  ToggleGroupDemo,
} from "./forms";
import {
  ActionSheetDemo,
  AppShellDemo,
  BottomSheetDemo,
  BottomSheetPickerDemo,
  CarouselDemo,
  CollapsibleDemo,
  CommandDemo,
  ContextMenuDemo,
  DialogDemo,
  DockSheetDemo,
  DrawerDemo,
  EntitySheetDemo,
  MenuDemo,
  MenuScreenDemo,
  MenuSheetDemo,
  MeterDemo,
  NavigationBarDemo,
  NavigationDrawerDemo,
  NavigationMenuDemo,
  PaginationDemo,
  PaneDemo,
  PopoverDemo,
  PreviewCardDemo,
  ProgressDemo,
  ScrollAreaDemo,
  SearchBarDemo,
  SecondaryTabsDemo,
  SegmentedButtonDemo,
  SelectDemo,
  SheetDemo,
  SheetSurfaceDemo,
  SidebarDemo,
  SnapSheetDemo,
  SplitButtonDemo,
  SplitDemo,
  TableDemo,
  TabsDemo,
  TimePickerDemo,
  ToolbarDemo,
  TooltipDemo,
  TopAppBarDemo,
  AccordionDemo as WebAccordionDemo,
} from "./layout";
import { HeroDemo, SiteFooterDemo, TopBarDemo } from "./marketing";
import {
  AlertDialogDemo,
  AutocompleteDemo,
  CalendarDemo,
  ComboboxDemo,
  CountrySelectDemo,
  MenubarDemo,
  NativeSelectDemo,
  SnackbarDemo,
} from "./pickers";

export type WebDemo = () => React.ReactElement;

/**
 * SelectGroup — the group container inside an open select.
 *
 * The group means nothing outside the select: it is a `role="group"`
 * container that names a set of options, so the demo mounts the real select
 * around it and shows the label the options are announced under.
 */
export function SelectGroupDemo() {
  return (
    <Preview label="SelectGroup — options under one label" span={3}>
      <div className="w-full max-w-xs">
        <Select.Root
          items={[
            { value: "ada", label: "Ada Lovelace" },
            { value: "grace", label: "Grace Hopper" },
            { value: "alan", label: "Alan Turing" },
          ]}
        >
          <Select.Trigger aria-label="Reviewer">
            <Select.Value placeholder="Assign a reviewer" />
          </Select.Trigger>
          <Select.Content>
            <SelectGroup>
              <SelectGroupLabel>Design</SelectGroupLabel>
              <Select.Item value="ada">
                <Select.ItemText>Ada Lovelace</Select.ItemText>
              </Select.Item>
              <Select.Item value="grace">
                <Select.ItemText>Grace Hopper</Select.ItemText>
              </Select.Item>
            </SelectGroup>
            <Select.Separator />
            <SelectGroup>
              <SelectGroupLabel>Engineering</SelectGroupLabel>
              <Select.Item value="alan">
                <Select.ItemText>Alan Turing</Select.ItemText>
              </Select.Item>
            </SelectGroup>
          </Select.Content>
        </Select.Root>
      </div>
    </Preview>
  );
}

/**
 * RichTooltip — the M3 rich surface: a subhead, supporting text, and
 * plain-text actions, carried by the tooltip primitive it is built on.
 *
 * The surface opens on hover AND on focus, so the explanation reaches a
 * keyboard user with no pointer at all.
 */
export function RichTooltipDemo() {
  return (
    <Preview label="RichTooltip — hover or focus the trigger" span={3}>
      <div className="w-full max-w-xs">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger render={<Button variant="tonal">Deploy</Button>} />
            <RichTooltip.Content>
              <RichTooltip.Title>Deploy build 4821</RichTooltip.Title>
              <p className={`m-0 ${T_BODY_MD}`}>
                Ships the current tokens to the production edge.
              </p>
              <RichTooltip.Actions>
                <Button variant="text">Deploy</Button>
                <Button variant="text">Cancel</Button>
              </RichTooltip.Actions>
            </RichTooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </Preview>
  );
}

/**
 * FocusRing — the centralized keyboard-focus treatment for host content.
 *
 * The wrapper owns the treatment, never the tab stop: the host gives the
 * focus (here, a `tabIndex`), so the ring paints for keyboard focus only and
 * the wrapper cannot steal keyboard order.
 */
export function FocusRingDemo() {
  return (
    <Preview label="FocusRing — press Tab to focus the host" span={3}>
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <FocusRing
          tabIndex={0}
          className="inline-block rounded-(--sys-shape-corner-small) border border-(--sys-color-outline) px-4 py-3 text-(--sys-color-on-surface)"
        >
          <span className={`${T_BODY_MD}`}>Tab onto this host element</span>
        </FocusRing>
        <p
          className={`m-0 text-center ${T_BODY_SM} text-(--sys-color-on-surface-variant)`}
        >
          The ring is the 3px secondary outline. Kern components paint it
          themselves; this wrapper is for host content that is not a Kern
          component.
        </p>
      </div>
    </Preview>
  );
}

/**
 * Every exported symbol, mapped to the demo that renders it. A family
 * namespace and its parts share one demo; the page states that the part is
 * exercised inside its parent.
 */
const byExport: Record<string, WebDemo> = {
  Accordion: WebAccordionDemo,
  AlertDialog: AlertDialogDemo,
  AlertDialogClose: AlertDialogDemo,
  AlertDialogContent: AlertDialogDemo,
  AlertDialogDescription: AlertDialogDemo,
  AlertDialogRoot: AlertDialogDemo,
  AlertDialogTitle: AlertDialogDemo,
  AlertDialogTrigger: AlertDialogDemo,
  Autocomplete: AutocompleteDemo,
  AutocompleteContent: AutocompleteDemo,
  AutocompleteEmpty: AutocompleteDemo,
  AutocompleteInput: AutocompleteDemo,
  AutocompleteItem: AutocompleteDemo,
  AutocompleteLabel: AutocompleteDemo,
  AutocompleteRoot: AutocompleteDemo,
  Calendar: CalendarDemo,
  Combobox: ComboboxDemo,
  ComboboxClear: ComboboxDemo,
  ComboboxContent: ComboboxDemo,
  ComboboxEmpty: ComboboxDemo,
  ComboboxInput: ComboboxDemo,
  ComboboxItem: ComboboxDemo,
  ComboboxLabel: ComboboxDemo,
  ComboboxRoot: ComboboxDemo,
  ComboboxTrigger: ComboboxDemo,
  CountrySelect: CountrySelectDemo,
  CountrySelectContent: CountrySelectDemo,
  CountrySelectItem: CountrySelectDemo,
  CountrySelectLabel: CountrySelectDemo,
  CountrySelectRoot: CountrySelectDemo,
  CountrySelectTrigger: CountrySelectDemo,
  CountrySelectValue: CountrySelectDemo,
  Menubar: MenubarDemo,
  MenubarContent: MenubarDemo,
  MenubarItem: MenubarDemo,
  MenubarMenu: MenubarDemo,
  MenubarRoot: MenubarDemo,
  MenubarTrigger: MenubarDemo,
  NativeSelect: NativeSelectDemo,
  Snackbar: SnackbarDemo,
  SnackbarAction: SnackbarDemo,
  SnackbarClose: SnackbarDemo,
  SnackbarDescription: SnackbarDemo,
  SnackbarList: SnackbarDemo,
  SnackbarProvider: SnackbarDemo,
  SnackbarRoot: SnackbarDemo,
  SnackbarTitle: SnackbarDemo,
  SnackbarViewport: SnackbarDemo,
  AccordionHeader: WebAccordionDemo,
  AccordionItem: WebAccordionDemo,
  AccordionPanel: WebAccordionDemo,
  AccordionRoot: WebAccordionDemo,
  AccordionTrigger: WebAccordionDemo,
  ActionSheet: ActionSheetDemo,
  AppShell: AppShellDemo,
  Avatar: AvatarDemo,
  AvatarFallback: AvatarDemo,
  AvatarImage: AvatarDemo,
  AvatarRoot: AvatarDemo,
  Badge: BadgeDemo,
  Banner: BannerDemo,
  BannerAction: BannerDemo,
  BootIndicator: BootIndicatorDemo,
  BottomSheet: BottomSheetDemo,
  BottomSheetPicker: BottomSheetPickerDemo,
  Button: ButtonDemo,
  ButtonGroup: ButtonGroupDemo,
  Card: CardDemo,
  Carousel: CarouselDemo,
  Checkbox: CheckboxDemo,
  CheckboxGroup: CheckboxGroupDemo,
  CheckboxGroupItem: CheckboxGroupDemo,
  CheckboxGroupRoot: CheckboxGroupDemo,
  Chip: ChipDemo,
  CircularProgress: CircularProgressDemo,
  Collapsible: CollapsibleDemo,
  CollapsiblePanel: CollapsibleDemo,
  CollapsibleRoot: CollapsibleDemo,
  CollapsibleTrigger: CollapsibleDemo,
  Command: CommandDemo,
  CommandContent: CommandDemo,
  CommandEmpty: CommandDemo,
  CommandGroupLabel: CommandDemo,
  CommandInput: CommandDemo,
  CommandItem: CommandDemo,
  CommandList: CommandDemo,
  CommandRoot: CommandDemo,
  CommandSeparator: CommandDemo,
  ContextMenu: ContextMenuDemo,
  ContextMenuContent: ContextMenuDemo,
  ContextMenuItem: ContextMenuDemo,
  ContextMenuRoot: ContextMenuDemo,
  ContextMenuSeparator: ContextMenuDemo,
  ContextMenuTrigger: ContextMenuDemo,
  Dialog: DialogDemo,
  DialogClose: DialogDemo,
  DialogContent: DialogDemo,
  DialogDescription: DialogDemo,
  DialogRoot: DialogDemo,
  DialogTitle: DialogDemo,
  DialogTrigger: DialogDemo,
  DockSheet: DockSheetDemo,
  Drawer: DrawerDemo,
  DrawerClose: DrawerDemo,
  DrawerContent: DrawerDemo,
  DrawerDescription: DrawerDemo,
  DrawerRoot: DrawerDemo,
  DrawerTitle: DrawerDemo,
  DrawerTrigger: DrawerDemo,
  EmptyState: EmptyStateDemo,
  EntitySheet: EntitySheetDemo,
  ExtendedFab: ExtendedFabDemo,
  Fab: FabDemo,
  FabMenu: FabMenuDemo,
  Field: FieldDemo,
  FieldDescription: FieldDemo,
  FieldError: FieldDemo,
  FieldLabel: FieldDemo,
  FieldMessage: FieldMessageDemo,
  FieldRoot: FieldDemo,
  Fieldset: FieldsetDemo,
  FieldsetLegend: FieldsetDemo,
  FieldsetRoot: FieldsetDemo,
  FilterChipRow: FilterChipRowDemo,
  FocusRing: FocusRingDemo,
  Form: FormDemo,
  Hero: HeroDemo,
  IconButton: IconButtonDemo,
  Input: InputDemo,
  InputOTP: InputOTPDemo,
  InputOTPInput: InputOTPDemo,
  InputOTPRoot: InputOTPDemo,
  Kbd: KbdDemo,
  KernErrorBoundary: KernErrorBoundaryDemo,
  Label: LabelDemo,
  LinearProgress: LinearProgressDemo,
  Link: LinkDemo,
  LinkButton: LinkDemo,
  LinkProvider: LinkDemo,
  ListItem: ListItemDemo,
  Loader: LoaderDemo,
  PageLoader: PageLoaderDemo,
  LoadingButton: LoadingButtonDemo,
  LoadingIndicator: LoadingIndicatorDemo,
  LoadingRegion: LoadingRegionDemo,
  Menu: MenuDemo,
  MenuContent: MenuDemo,
  MenuGroupLabel: MenuDemo,
  MenuItem: MenuDemo,
  MenuRoot: MenuDemo,
  MenuSeparator: MenuDemo,
  MenuTrigger: MenuDemo,
  MenuScreen: MenuScreenDemo,
  MenuSheet: MenuSheetDemo,
  Meter: MeterDemo,
  MeterLabel: MeterDemo,
  MeterRoot: MeterDemo,
  MeterValue: MeterDemo,
  NavigationMenu: NavigationMenuDemo,
  NavigationMenuContent: NavigationMenuDemo,
  NavigationMenuItem: NavigationMenuDemo,
  NavigationMenuLink: NavigationMenuDemo,
  NavigationMenuList: NavigationMenuDemo,
  NavigationMenuRoot: NavigationMenuDemo,
  NavigationBar: NavigationBarDemo,
  NavigationBarItem: NavigationBarDemo,
  NavigationDrawer: NavigationDrawerDemo,
  NavigationMenuTrigger: NavigationMenuDemo,
  NumberField: NumberFieldDemo,
  NumberFieldInput: NumberFieldDemo,
  NumberFieldRoot: NumberFieldDemo,
  Pagination: PaginationDemo,
  Pane: PaneDemo,
  Popover: PopoverDemo,
  PopoverClose: PopoverDemo,
  PopoverContent: PopoverDemo,
  PopoverDescription: PopoverDemo,
  PopoverRoot: PopoverDemo,
  PopoverTitle: PopoverDemo,
  PopoverTrigger: PopoverDemo,
  PreviewCard: PreviewCardDemo,
  PreviewCardContent: PreviewCardDemo,
  PreviewCardRoot: PreviewCardDemo,
  PreviewCardTrigger: PreviewCardDemo,
  Progress: ProgressDemo,
  ProgressLabel: ProgressDemo,
  ProgressRoot: ProgressDemo,
  ProgressValue: ProgressDemo,
  RadioGroup: RadioGroupDemo,
  RadioGroupItem: RadioGroupDemo,
  RichTooltip: RichTooltipDemo,
  RichTooltipActions: RichTooltipDemo,
  RichTooltipContent: RichTooltipDemo,
  RichTooltipTitle: RichTooltipDemo,
  ScrollArea: ScrollAreaDemo,
  ScrollAreaRoot: ScrollAreaDemo,
  ScrollAreaScrollbar: ScrollAreaDemo,
  ScrollAreaViewport: ScrollAreaDemo,
  Search: SearchDemo,
  SearchBar: SearchBarDemo,
  SiteFooter: SiteFooterDemo,
  SecondaryTabs: SecondaryTabsDemo,
  SegmentedButton: SegmentedButtonDemo,
  SegmentedButtonItem: SegmentedButtonDemo,
  SegmentedButtonRoot: SegmentedButtonDemo,
  Select: SelectDemo,
  SelectContent: SelectDemo,
  SelectGroup: SelectGroupDemo,
  SelectGroupLabel: SelectDemo,
  SelectItem: SelectDemo,
  SelectItemText: SelectDemo,
  SelectRoot: SelectDemo,
  SelectSeparator: SelectDemo,
  SelectTrigger: SelectDemo,
  SelectValue: SelectDemo,
  Separator: SeparatorDemo,
  Sheet: SheetDemo,
  SheetClose: SheetDemo,
  SheetContent: SheetDemo,
  SheetDescription: SheetDemo,
  SheetRoot: SheetDemo,
  SheetTitle: SheetDemo,
  SheetTrigger: SheetDemo,
  SheetSurface: SheetSurfaceDemo,
  Sidebar: SidebarDemo,
  SidebarContent: SidebarDemo,
  SidebarFooter: SidebarDemo,
  SidebarHeader: SidebarDemo,
  SidebarItem: SidebarDemo,
  SidebarProvider: SidebarDemo,
  Skeleton: SkeletonDemo,
  Slider: SliderDemo,
  SliderLabel: SliderDemo,
  SliderRoot: SliderDemo,
  SliderThumb: SliderDemo,
  SliderValue: SliderDemo,
  SnapSheet: SnapSheetDemo,
  Split: SplitDemo,
  SplitButton: SplitButtonDemo,
  SplitGrid: SplitDemo,
  SplitPanel: SplitDemo,
  Switch: SwitchDemo,
  Table: TableDemo,
  TableBody: TableDemo,
  TableCaption: TableDemo,
  TableCell: TableDemo,
  TableHead: TableDemo,
  TableHeader: TableDemo,
  TableRoot: TableDemo,
  TableRow: TableDemo,
  Tabs: TabsDemo,
  TabsList: TabsDemo,
  TabsPanel: TabsDemo,
  TabsRoot: TabsDemo,
  TabsTab: TabsDemo,
  TimePicker: TimePickerDemo,
  Text: TextDemo,
  Textarea: TextareaDemo,
  ThemeToggle: ThemeToggleDemo,
  Toggle: ToggleDemo,
  ToggleGroup: ToggleGroupDemo,
  ToggleGroupItem: ToggleGroupDemo,
  ToggleGroupRoot: ToggleGroupDemo,
  Toolbar: ToolbarDemo,
  ToolbarButton: ToolbarDemo,
  ToolbarGroup: ToolbarDemo,
  ToolbarRoot: ToolbarDemo,
  ToolbarSeparator: ToolbarDemo,
  Tooltip: TooltipDemo,
  TooltipContent: TooltipDemo,
  TooltipProvider: TooltipDemo,
  TooltipRoot: TooltipDemo,
  TooltipTrigger: TooltipDemo,
  TopAppBar: TopAppBarDemo,
  TopAppBarToggle: TopAppBarDemo,
  TopBar: TopBarDemo,
};

/** The demo for a manifest row, or undefined when the row has no live demo. */
export function demoFor(exportName: string): WebDemo | undefined {
  return byExport[exportName];
}

export const WEB_DEMOS = byExport;

/**
 * Web per-part no-preview reasons, keyed like the mobile map below — EMPTY
 * on purpose. Thirteen web families currently render mobile-frame reasons
 * on their gallery cards (measured: bottom-sheet*, dock/entity-sheet,
 * filter-chip-row, menu-screen/sheet, navigation-bar/drawer, pane,
 * secondary-tabs, snap-sheet, top-app-bar) because previewReason looked
 * everything up in the mobile map. Showing phone-frame text ("in a browser
 * frame", "RNW renderer") on a web card is a false claim about the web
 * component, so web lookups stop at this map: demo-less web families
 * honestly render "Demo coming" until a real web reason is authored here.
 */
export const WEB_PREVIEW_REASONS: Record<string, string> = {};

export const WEB_EXPORT_COUNT = componentsOn("web").length;

export const WEB_DEMO_COUNT = componentsOn("web").filter(
  (component) => byExport[component.export] !== undefined,
).length;

/** Manifest rows with no live demo, with the reason. Never silently empty. */
export function undemoedWebExports(): { export: string; slug: string }[] {
  return componentsOn("web")
    .filter((component) => byExport[component.export] === undefined)
    .map((component) => ({ export: component.export, slug: component.slug }));
}
