/**
 * The Example registry — export name → the examples for it.
 *
 * Keyed by the package EXPORT NAME, matching the demo registries, so a page
 * looks up its examples the same way it looks up its live demo.
 *
 * PLATFORM-SPLIT (one-standard migration): this module holds the WEB
 * examples and the configurators. The NATIVE examples live in
 * `registry.native.ts`, because a native example imports
 * `@xoroh/kern-native` — and a single registry would pull the native
 * bundle, and through it the icon registry, into every web page's chunk.
 * The page asks for the registry its platform owns (see `demos/lazy.ts`).
 */

import type { ConfiguratorSpec } from "./configurator";
import { ACCORDION_CONFIGURATOR } from "./configurators/accordion";
import { ALERT_DIALOG_CONFIGURATOR } from "./configurators/alert-dialog";
import { AUTOCOMPLETE_CONFIGURATOR } from "./configurators/autocomplete";
import { AVATAR_CONFIGURATOR } from "./configurators/avatar";
import { BADGE_CONFIGURATOR } from "./configurators/badge";
import { BANNER_CONFIGURATOR } from "./configurators/banner";
import { BUTTON_CONFIGURATOR } from "./configurators/button";
import { CALENDAR_CONFIGURATOR } from "./configurators/calendar";
import { CARD_CONFIGURATOR } from "./configurators/card";
import { CAROUSEL_CONFIGURATOR } from "./configurators/carousel";
import { CHECKBOX_CONFIGURATOR } from "./configurators/checkbox";
import { CHECKBOX_GROUP_CONFIGURATOR } from "./configurators/checkbox-group";
import { CHIP_CONFIGURATOR } from "./configurators/chip";
import { COLLAPSIBLE_CONFIGURATOR } from "./configurators/collapsible";
import { CONTEXT_MENU_CONFIGURATOR } from "./configurators/context-menu";
import { COUNTRY_SELECT_CONFIGURATOR } from "./configurators/country-select";
import { DIALOG_CONFIGURATOR } from "./configurators/dialog";
import { DRAWER_CONFIGURATOR } from "./configurators/drawer";
import { FAB_CONFIGURATOR } from "./configurators/fab";
import { FIELD_CONFIGURATOR } from "./configurators/field";
import { FORM_CONFIGURATOR } from "./configurators/form";
import { ICON_BUTTON_CONFIGURATOR } from "./configurators/icon-button";
import { INPUT_OTP_CONFIGURATOR } from "./configurators/input-otp";
import { LOADER_CONFIGURATOR } from "./configurators/loader";
import { MENU_CONFIGURATOR } from "./configurators/menu";
import { MENUBAR_CONFIGURATOR } from "./configurators/menubar";
import { METER_CONFIGURATOR } from "./configurators/meter";
import { NAVIGATION_MENU_CONFIGURATOR } from "./configurators/navigation-menu";
import { NUMBER_FIELD_CONFIGURATOR } from "./configurators/number-field";
import { PAGINATION_CONFIGURATOR } from "./configurators/pagination";
import { POPOVER_CONFIGURATOR } from "./configurators/popover";
import { PREVIEW_CARD_CONFIGURATOR } from "./configurators/preview-card";
import { PROGRESS_CONFIGURATOR } from "./configurators/progress";
import { RADIO_GROUP_CONFIGURATOR } from "./configurators/radio-group";
import { SEARCH_CONFIGURATOR } from "./configurators/search";
import { SEGMENTED_BUTTON_CONFIGURATOR } from "./configurators/segmented-button";
import { SELECT_CONFIGURATOR } from "./configurators/select";
import { SEPARATOR_CONFIGURATOR } from "./configurators/separator";
import { SHEET_CONFIGURATOR } from "./configurators/sheet";
import { SLIDER_CONFIGURATOR } from "./configurators/slider";
import { SNACKBAR_CONFIGURATOR } from "./configurators/snackbar";
import { SWITCH_CONFIGURATOR } from "./configurators/switch";
import { TABS_CONFIGURATOR } from "./configurators/tabs";
import { TOGGLE_CONFIGURATOR } from "./configurators/toggle";
import { TOGGLE_GROUP_CONFIGURATOR } from "./configurators/toggle-group";
import { TOOLTIP_CONFIGURATOR } from "./configurators/tooltip";
import type { ExampleSpec } from "./example";
import { ACCORDION_EXAMPLES } from "./examples/accordion";
import { ACTION_SHEET_EXAMPLES } from "./examples/action-sheet";
import { ALERT_DIALOG_EXAMPLES } from "./examples/alert-dialog";
import { AUTOCOMPLETE_EXAMPLES } from "./examples/autocomplete";
import { AVATAR_EXAMPLES } from "./examples/avatar";
import { BADGE_EXAMPLES } from "./examples/badge";
import { BANNER_EXAMPLES } from "./examples/banner";
import { BOTTOM_SHEET_EXAMPLES } from "./examples/bottom-sheet";
import { BOTTOM_SHEET_PICKER_EXAMPLES } from "./examples/bottom-sheet-picker";
import { BUTTON_EXAMPLES } from "./examples/button";
import { BUTTON_GROUP_EXAMPLES } from "./examples/button-group";
import { CALENDAR_EXAMPLES } from "./examples/calendar";
import { CARD_EXAMPLES } from "./examples/card";
import { CAROUSEL_EXAMPLES } from "./examples/carousel";
import { CHECKBOX_GROUP_EXAMPLES } from "./examples/checkbox-group";
import { CHIP_EXAMPLES } from "./examples/chip";
import { CIRCULAR_PROGRESS_EXAMPLES } from "./examples/circular-progress";
import { COLLAPSIBLE_EXAMPLES } from "./examples/collapsible";
import { COMBOBOX_EXAMPLES } from "./examples/combobox";
import { COMMAND_EXAMPLES } from "./examples/command";
import { CONTEXT_MENU_EXAMPLES } from "./examples/context-menu";
import { COUNTRY_SELECT_EXAMPLES } from "./examples/country-select";
import { DIALOG_EXAMPLES } from "./examples/dialog";
import { DOCK_SHEET_EXAMPLES } from "./examples/dock-sheet";
import { DRAWER_EXAMPLES } from "./examples/drawer";
import { EMPTY_STATE_EXAMPLES } from "./examples/empty-state";
import { ENTITY_SHEET_EXAMPLES } from "./examples/entity-sheet";
import { EXTENDED_FAB_EXAMPLES } from "./examples/extended-fab";
import { FAB_EXAMPLES } from "./examples/fab";
import { FAB_MENU_EXAMPLES } from "./examples/fab-menu";
import { FIELD_EXAMPLES } from "./examples/field";
import { FIELDSET_EXAMPLES } from "./examples/fieldset";
import { FILTER_CHIP_ROW_EXAMPLES } from "./examples/filter-chip-row";
import { FORM_EXAMPLES } from "./examples/form";
import { ICON_BUTTON_EXAMPLES } from "./examples/icon-button";
import { CHECKBOX_EXAMPLES, INPUT_EXAMPLES } from "./examples/input";
import { INPUT_OTP_EXAMPLES } from "./examples/input-otp";
import { KBD_EXAMPLES } from "./examples/kbd";
import { LABEL_EXAMPLES } from "./examples/label";
import { LINEAR_PROGRESS_EXAMPLES } from "./examples/linear-progress";
import { LINK_BUTTON_EXAMPLES } from "./examples/link-button";
import { LIST_ITEM_EXAMPLES } from "./examples/list-item";
import { LOADER_EXAMPLES } from "./examples/loader";
import { LOADING_BUTTON_EXAMPLES } from "./examples/loading-button";
import { LOADING_INDICATOR_EXAMPLES } from "./examples/loading-indicator";
import { LOADING_REGION_EXAMPLES } from "./examples/loading-region";
import { MENU_EXAMPLES, MENUBAR_EXAMPLES } from "./examples/menu";
import { MENU_SCREEN_EXAMPLES } from "./examples/menu-screen";
import { MENU_SHEET_EXAMPLES } from "./examples/menu-sheet";
import { METER_EXAMPLES } from "./examples/meter";
import { NATIVE_SELECT_EXAMPLES } from "./examples/native-select";
import { NAVIGATION_BAR_EXAMPLES } from "./examples/navigation-bar";
import { NAVIGATION_DRAWER_EXAMPLES } from "./examples/navigation-drawer";
import { NAVIGATION_MENU_EXAMPLES } from "./examples/navigation-menu";
import { NUMBER_FIELD_EXAMPLES } from "./examples/number-field";
import { PAGINATION_EXAMPLES } from "./examples/pagination";
import { PANE_EXAMPLES } from "./examples/pane";
import { POPOVER_EXAMPLES } from "./examples/popover";
import { PROGRESS_EXAMPLES } from "./examples/progress";
import { RADIO_GROUP_EXAMPLES } from "./examples/radio-group";
import { RICH_TOOLTIP_EXAMPLES } from "./examples/rich-tooltip";
import { SCROLL_AREA_EXAMPLES } from "./examples/scroll-area";
import { SEARCH_EXAMPLES } from "./examples/search";
import { SECONDARY_TABS_EXAMPLES } from "./examples/secondary-tabs";
import { SEGMENTED_BUTTON_EXAMPLES } from "./examples/segmented-button";
import { SELECT_EXAMPLES } from "./examples/select";
import { SELECT_GROUP_EXAMPLES } from "./examples/select-group";
import { SEPARATOR_EXAMPLES } from "./examples/separator";
import { SHEET_EXAMPLES } from "./examples/sheet";
import { SHEET_SURFACE_EXAMPLES } from "./examples/sheet-surface";
import { SIDEBAR_EXAMPLES } from "./examples/sidebar";
import { SKELETON_EXAMPLES } from "./examples/skeleton";
import { SLIDER_EXAMPLES } from "./examples/slider";
import { SNACKBAR_EXAMPLES } from "./examples/snackbar";
import { SNAP_SHEET_EXAMPLES } from "./examples/snap-sheet";
import { SPLIT_EXAMPLES } from "./examples/split";
import { SPLIT_BUTTON_EXAMPLES } from "./examples/split-button";
import { SWITCH_EXAMPLES } from "./examples/switch";
import { TABLE_EXAMPLES } from "./examples/table";
import { TABS_EXAMPLES } from "./examples/tabs";
import { TEXT_EXAMPLES } from "./examples/text";
import { TEXTAREA_EXAMPLES } from "./examples/textarea";
import { THEME_TOGGLE_EXAMPLES } from "./examples/theme-toggle";
import { TIME_PICKER_EXAMPLES } from "./examples/time-picker";
import { TOGGLE_EXAMPLES } from "./examples/toggle";
import { TOGGLE_GROUP_EXAMPLES } from "./examples/toggle-group";
import { TOOLBAR_EXAMPLES } from "./examples/toolbar";
import { TOOLTIP_EXAMPLES } from "./examples/tooltip";
import { TOP_APP_BAR_EXAMPLES } from "./examples/top-app-bar";

export const EXAMPLES: Record<string, ExampleSpec[]> = {
  Accordion: ACCORDION_EXAMPLES,
  ActionSheet: ACTION_SHEET_EXAMPLES,
  AlertDialog: ALERT_DIALOG_EXAMPLES,
  Autocomplete: AUTOCOMPLETE_EXAMPLES,
  Avatar: AVATAR_EXAMPLES,
  Badge: BADGE_EXAMPLES,
  Banner: BANNER_EXAMPLES,
  BottomSheetPicker: BOTTOM_SHEET_PICKER_EXAMPLES,
  BottomSheet: BOTTOM_SHEET_EXAMPLES,
  ButtonGroup: BUTTON_GROUP_EXAMPLES,
  Button: BUTTON_EXAMPLES,
  Calendar: CALENDAR_EXAMPLES,
  Card: CARD_EXAMPLES,
  Carousel: CAROUSEL_EXAMPLES,
  CheckboxGroup: CHECKBOX_GROUP_EXAMPLES,
  Chip: CHIP_EXAMPLES,
  CircularProgress: CIRCULAR_PROGRESS_EXAMPLES,
  Collapsible: COLLAPSIBLE_EXAMPLES,
  Combobox: COMBOBOX_EXAMPLES,
  Command: COMMAND_EXAMPLES,
  ContextMenu: CONTEXT_MENU_EXAMPLES,
  CountrySelect: COUNTRY_SELECT_EXAMPLES,
  Dialog: DIALOG_EXAMPLES,
  DockSheet: DOCK_SHEET_EXAMPLES,
  Drawer: DRAWER_EXAMPLES,
  EmptyState: EMPTY_STATE_EXAMPLES,
  EntitySheet: ENTITY_SHEET_EXAMPLES,
  ExtendedFab: EXTENDED_FAB_EXAMPLES,
  FabMenu: FAB_MENU_EXAMPLES,
  Fab: FAB_EXAMPLES,
  Field: FIELD_EXAMPLES,
  Fieldset: FIELDSET_EXAMPLES,
  FilterChipRow: FILTER_CHIP_ROW_EXAMPLES,
  Form: FORM_EXAMPLES,
  IconButton: ICON_BUTTON_EXAMPLES,
  InputOTP: INPUT_OTP_EXAMPLES,
  Input: INPUT_EXAMPLES,
  Checkbox: CHECKBOX_EXAMPLES,
  Kbd: KBD_EXAMPLES,
  Label: LABEL_EXAMPLES,
  LinearProgress: LINEAR_PROGRESS_EXAMPLES,
  LinkButton: LINK_BUTTON_EXAMPLES,
  ListItem: LIST_ITEM_EXAMPLES,
  Loader: LOADER_EXAMPLES,
  LoadingButton: LOADING_BUTTON_EXAMPLES,
  LoadingIndicator: LOADING_INDICATOR_EXAMPLES,
  LoadingRegion: LOADING_REGION_EXAMPLES,
  MenuScreen: MENU_SCREEN_EXAMPLES,
  MenuSheet: MENU_SHEET_EXAMPLES,
  Menu: MENU_EXAMPLES,
  Menubar: MENUBAR_EXAMPLES,
  Meter: METER_EXAMPLES,
  NativeSelect: NATIVE_SELECT_EXAMPLES,
  NavigationBar: NAVIGATION_BAR_EXAMPLES,
  NavigationDrawer: NAVIGATION_DRAWER_EXAMPLES,
  NavigationMenu: NAVIGATION_MENU_EXAMPLES,
  NumberField: NUMBER_FIELD_EXAMPLES,
  Pagination: PAGINATION_EXAMPLES,
  Pane: PANE_EXAMPLES,
  Popover: POPOVER_EXAMPLES,
  Progress: PROGRESS_EXAMPLES,
  RadioGroup: RADIO_GROUP_EXAMPLES,
  RichTooltip: RICH_TOOLTIP_EXAMPLES,
  ScrollArea: SCROLL_AREA_EXAMPLES,
  Search: SEARCH_EXAMPLES,
  SecondaryTabs: SECONDARY_TABS_EXAMPLES,
  SegmentedButton: SEGMENTED_BUTTON_EXAMPLES,
  SelectGroup: SELECT_GROUP_EXAMPLES,
  Select: SELECT_EXAMPLES,
  Separator: SEPARATOR_EXAMPLES,
  SheetSurface: SHEET_SURFACE_EXAMPLES,
  Sheet: SHEET_EXAMPLES,
  Sidebar: SIDEBAR_EXAMPLES,
  Skeleton: SKELETON_EXAMPLES,
  Slider: SLIDER_EXAMPLES,
  Snackbar: SNACKBAR_EXAMPLES,
  SnapSheet: SNAP_SHEET_EXAMPLES,
  SplitButton: SPLIT_BUTTON_EXAMPLES,
  Split: SPLIT_EXAMPLES,
  Switch: SWITCH_EXAMPLES,
  Table: TABLE_EXAMPLES,
  Tabs: TABS_EXAMPLES,
  Text: TEXT_EXAMPLES,
  Textarea: TEXTAREA_EXAMPLES,
  ThemeToggle: THEME_TOGGLE_EXAMPLES,
  TimePicker: TIME_PICKER_EXAMPLES,
  ToggleGroup: TOGGLE_GROUP_EXAMPLES,
  Toggle: TOGGLE_EXAMPLES,
  Toolbar: TOOLBAR_EXAMPLES,
  Tooltip: TOOLTIP_EXAMPLES,
  TopAppBar: TOP_APP_BAR_EXAMPLES,
};

export const CONFIGURATORS: Record<string, ConfiguratorSpec> = {
  Accordion: ACCORDION_CONFIGURATOR,
  AlertDialog: ALERT_DIALOG_CONFIGURATOR,
  Autocomplete: AUTOCOMPLETE_CONFIGURATOR,
  Avatar: AVATAR_CONFIGURATOR,
  Badge: BADGE_CONFIGURATOR,
  Banner: BANNER_CONFIGURATOR,
  Button: BUTTON_CONFIGURATOR,
  Calendar: CALENDAR_CONFIGURATOR,
  Card: CARD_CONFIGURATOR,
  Carousel: CAROUSEL_CONFIGURATOR,
  Checkbox: CHECKBOX_CONFIGURATOR,
  CheckboxGroup: CHECKBOX_GROUP_CONFIGURATOR,
  Chip: CHIP_CONFIGURATOR,
  Collapsible: COLLAPSIBLE_CONFIGURATOR,
  CountrySelect: COUNTRY_SELECT_CONFIGURATOR,
  ContextMenu: CONTEXT_MENU_CONFIGURATOR,
  NumberField: NUMBER_FIELD_CONFIGURATOR,
  NavigationMenu: NAVIGATION_MENU_CONFIGURATOR,
  Meter: METER_CONFIGURATOR,
  Loader: LOADER_CONFIGURATOR,
  Switch: SWITCH_CONFIGURATOR,
  Tabs: TABS_CONFIGURATOR,
  Toggle: TOGGLE_CONFIGURATOR,
  ToggleGroup: TOGGLE_GROUP_CONFIGURATOR,
  Tooltip: TOOLTIP_CONFIGURATOR,
  Dialog: DIALOG_CONFIGURATOR,
  Drawer: DRAWER_CONFIGURATOR,
  Field: FIELD_CONFIGURATOR,
  Fab: FAB_CONFIGURATOR,
  Form: FORM_CONFIGURATOR,
  IconButton: ICON_BUTTON_CONFIGURATOR,
  InputOTP: INPUT_OTP_CONFIGURATOR,
  Menu: MENU_CONFIGURATOR,
  Menubar: MENUBAR_CONFIGURATOR,
  Sheet: SHEET_CONFIGURATOR,
  Select: SELECT_CONFIGURATOR,
  Popover: POPOVER_CONFIGURATOR,
  PreviewCard: PREVIEW_CARD_CONFIGURATOR,
  Pagination: PAGINATION_CONFIGURATOR,
  Progress: PROGRESS_CONFIGURATOR,
  RadioGroup: RADIO_GROUP_CONFIGURATOR,
  Search: SEARCH_CONFIGURATOR,
  Separator: SEPARATOR_CONFIGURATOR,
  Slider: SLIDER_CONFIGURATOR,
  Snackbar: SNACKBAR_CONFIGURATOR,
  SegmentedButton: SEGMENTED_BUTTON_CONFIGURATOR,
};

/** The configurator for an export, if one is registered. */
export function configuratorFor(
  exportName: string,
): ConfiguratorSpec | undefined {
  return CONFIGURATORS[exportName];
}
/** Every export that has at least one registered example. */
export function examplesFor(exportName: string): ExampleSpec[] {
  return EXAMPLES[exportName] ?? [];
}
