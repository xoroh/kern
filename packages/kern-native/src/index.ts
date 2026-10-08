// "@xoroh/kern-native" entry — React Native implementation.
// StyleSheet + Kern tokens. No styling dependencies.

export type {
  NativeAccordionProps,
  NativeAccordionSection,
} from "./components/accordion";
export { Accordion, accordionStyles } from "./components/accordion";
export type { NativeAlertDialogProps } from "./components/alert-dialog";
export { AlertDialog, alertDialogStyles } from "./components/alert-dialog";
// The application FRAME. Deliberately a separate module from `./components/shell`,
// which holds the launch and error surfaces: a BootSplash is not a shell you
// navigate inside, and grouping them would have hidden the fact that the frame
// did not exist at all.
export type { NativeAppShellProps } from "./components/app-shell";
export {
  APP_SHELL_FOOTER_HEIGHT,
  APP_SHELL_HEADER_HEIGHT,
  AppShell,
} from "./components/app-shell";
export type { NativeAspectRatioProps } from "./components/aspect-ratio";
export { AspectRatio } from "./components/aspect-ratio";
export type {
  AutocompleteSuggestion,
  NativeAutocompleteProps,
} from "./components/autocomplete";
// `Autocomplete` only. `defaultAutocompleteFilter` is a pure matcher, not a
// component: exported from its module for hosts and tests that want it, but
// deliberately NOT re-exported here, because the generated registry treats
// every barrel export as a component and a shared function published as a
// component is a row that owns no behaviour.
export { Autocomplete, autocompleteStyles } from "./components/autocomplete";
export type { NativeAvatarProps, NativeAvatarSize } from "./components/avatar";
export { Avatar, avatarStyles } from "./components/avatar";
export type { NativeBadgeProps } from "./components/badge";
export { Badge } from "./components/badge";
export { bottomSheetSurface } from "./components/bottom-sheet-surface";
export type {
  NativeButtonColor,
  NativeButtonIconPosition,
  NativeButtonM3Variant,
  NativeButtonProps,
  NativeButtonShape,
  NativeButtonSize,
  NativeButtonStyleOptions,
  NativeButtonVariant,
  NativeButtonVariantInput,
} from "./components/button";
export {
  Button,
  NATIVE_BUTTON_SIZE_TO_KERN_SIZE,
  NATIVE_BUTTON_VARIANT_ALIASES,
} from "./components/button";
export type { NativeButtonGroupProps } from "./components/button-group";
export { ButtonGroup } from "./components/button-group";
export type { NativeCalendarProps } from "./components/calendar";
export { Calendar } from "./components/calendar";
export type { NativeCardProps } from "./components/card";
export { Card } from "./components/card";
export type {
  CarouselItem,
  CarouselLayout,
  NativeCarouselProps,
} from "./components/carousel";
export { Carousel, carouselStyles } from "./components/carousel";
export type { NativeCheckboxProps } from "./components/checkbox";
export { Checkbox } from "./components/checkbox";
export type {
  CheckboxGroupItemProps,
  CheckboxGroupProps,
} from "./components/checkbox-group";
export {
  CheckboxGroup,
  CheckboxGroupItem,
  checkboxGroupStyles,
} from "./components/checkbox-group";
export type {
  ActionChipProps,
  ChipProps,
  ChipVariant,
  FilterChipProps,
} from "./components/chip";
export { Chip } from "./components/chip";
export type { CircularProgressProps } from "./components/circular-progress";
export {
  arcRotations,
  barStyles,
  CircularProgress,
  ringStyles,
} from "./components/circular-progress";
export type { NativeCollapsibleProps } from "./components/collapsible";
export { Collapsible } from "./components/collapsible";
export type { NativeContextMenuProps } from "./components/context-menu";
export { ContextMenu } from "./components/context-menu";
export type { NativeContrastToggleProps } from "./components/contrast-toggle";
export { ContrastToggle } from "./components/contrast-toggle";
export type {
  NativeDialogAction,
  NativeDialogProps,
} from "./components/dialog";
export { Dialog, dialogStyles } from "./components/dialog";
export type { NativeEmptyStateProps } from "./components/empty-state";
export { EmptyState } from "./components/empty-state";
export type {
  NativeExtendedFabHandle,
  NativeExtendedFabProps,
} from "./components/extended-fab";
export { ExtendedFab } from "./components/extended-fab";
export type {
  NativeFabProps,
  NativeFabSize,
} from "./components/fab";
export { Fab, fabStyles } from "./components/fab";
export type {
  NativeFabMenuAction,
  NativeFabMenuProps,
} from "./components/fab-menu";
export { FabMenu } from "./components/fab-menu";
export type { NativeFieldRootProps } from "./components/field";
export { Field, FieldRoot } from "./components/field";
export type { NativeFieldMessageProps } from "./components/field-message";
export { FieldMessage } from "./components/field-message";
export type {
  FieldsetItemProps,
  FieldsetLegendProps,
  FieldsetProps,
} from "./components/fieldset";
export {
  Fieldset,
  FieldsetItem,
  FieldsetLegend,
  fieldsetStyles,
  useFieldset,
  useFieldsetDisabled,
} from "./components/fieldset";
export type {
  IconButtonVariant,
  NativeIconButtonProps,
} from "./components/icon-button";
export {
  IconButton,
  IconButtonTarget,
  iconButtonStyles,
  pressIsCancelled,
} from "./components/icon-button";
export type { NativeInputProps } from "./components/input";
export { Input } from "./components/input";
export type { NativeInputOTPProps } from "./components/input-otp";
// `InputOTP` only. `toOTPPositions` (a splitter) and `OTPBox` (a presentational
// box with no state) stay module-level exports — see the note on
// `defaultAutocompleteFilter` above.
export { InputOTP, inputOTPStyles } from "./components/input-otp";
export type { NativeKbdProps } from "./components/kbd";
export { Kbd } from "./components/kbd";
export type { LabelProps } from "./components/label";
export { Label } from "./components/label";
export type {
  FilterChipRowProps,
  ListDetailProps,
  PaneProps,
  PaneWidth,
  SecondaryTab,
  SecondaryTabsProps,
  SupportingPaneProps,
} from "./components/layouts";
export {
  FilterChipRow,
  ListDetail,
  PANE_WIDTHS,
  Pane,
  SecondaryTabs,
  SupportingPane,
  secondaryTabsStyles,
} from "./components/layouts";
export type { LinearProgressProps } from "./components/linear-progress";
export {
  LinearProgress,
  linearProgressStyles,
} from "./components/linear-progress";
export type { NativeListItemProps } from "./components/list-item";
export { ListItem } from "./components/list-item";
export type { NativeLoaderProps, NativeLoaderSize } from "./components/loader";
export { Loader } from "./components/loader";
export type { LoadingButtonProps } from "./components/loading-button";
export { LoadingButton } from "./components/loading-button";
export type {
  LoadingIndicatorProps,
  LoadingIndicatorSize,
} from "./components/loading-indicator";
export {
  LoadingIndicator,
  loadingIndicatorStyles,
} from "./components/loading-indicator";
export type { NativeMenuItem, NativeMenuProps } from "./components/menu";
export { Menu, menuStyles } from "./components/menu";
export type {
  NativeMenubarMenu,
  NativeMenubarProps,
} from "./components/menubar";
export { Menubar, menubarStyles } from "./components/menubar";
export type {
  ActionSheetProps,
  CreateSheetAction,
  MenuAction,
  MenuGroup,
  MenuScreenProps,
  MenuSheetProps,
} from "./components/menus";
export {
  ActionSheet,
  MenuGroupList,
  MenuScreen,
  MenuSheet,
  menuGroupStyles,
} from "./components/menus";
export type { NativeMeterProps } from "./components/meter";
export { Meter, meterStyles } from "./components/meter";
export type { MilestoneTrioProps } from "./components/milestone-trio";
export {
  MilestoneTrio,
  milestoneStepStyles,
} from "./components/milestone-trio";
export type {
  NativeNavigationBarProps,
  NavigationBarItemProps,
  NavigationDestination,
} from "./components/navigation-bar";
export {
  NAVIGATION_BAR_HEIGHT,
  NavigationBar,
  NavigationBarItem,
  navigationBarStyles,
} from "./components/navigation-bar";
export type { NativeNavigationDrawerProps } from "./components/navigation-drawer";
export {
  drawerStyles,
  NavigationDrawer,
  SECTION_DRAWER_WIDTH,
} from "./components/navigation-drawer";
export type {
  NativeNavigationMenuItem,
  NativeNavigationMenuProps,
} from "./components/navigation-menu";
export { NavigationMenu } from "./components/navigation-menu";
// The rail is its OWN module, not part of the bar: it is a different surface
// (vertical and persistent vs horizontal and bottom-anchored), and merging the
// exports would have hidden that.
export type {
  NativeNavigationRailProps,
  NavigationRailMode,
} from "./components/navigation-rail";
export {
  NAVIGATION_RAIL_EXPANDED_WIDTH,
  NAVIGATION_RAIL_WIDTH,
  NavigationRail,
} from "./components/navigation-rail";
export type { NativeNumberFieldProps } from "./components/number-field";
// `NumberField` only; `clampToRange` is a pure clamp, not a component.
export { NumberField, numberFieldStyles } from "./components/number-field";
// Drawer, Popover and ScrollArea were implemented and tested but never
// re-exported from the package index, so no consumer could import them — while
// the registry counted all three as SHARED concepts and the parity rows recorded
// them as component-covered. The registry is derived by scanning source FILES,
// not the public API, which is exactly how an unreachable component looks
// shipped. Exported here so those claims become true.
export type { DrawerProps } from "./components/overlay-surfaces";
export {
  Drawer,
  Popover,
  ScrollArea,
  useAnyModalOpen,
} from "./components/overlay-surfaces";
export type {
  NativePaginationProps,
  PaginationEntry,
} from "./components/pagination";
export {
  Pagination,
  pageWindow,
  paginationStyles,
} from "./components/pagination";
export type {
  KernPressableProps,
  MIN_TOUCH_TARGET,
} from "./components/pressable";
export { KernPressable } from "./components/pressable";
export type { NativeProgressProps } from "./components/progress";
export { Progress, progressStyles } from "./components/progress";
export type {
  RadioGroupItemProps,
  RadioGroupProps,
} from "./components/radio-group";
export { RadioGroup, RadioGroupItem } from "./components/radio-group";
export type { NativeSearchProps } from "./components/search";
export { Search } from "./components/search";
export type {
  NativeSelectOption,
  NativeSelectProps,
} from "./components/select";
export { Select, selectStyles } from "./components/select";
export type { SeparatorProps } from "./components/separator";
export { Separator } from "./components/separator";
export type { NativeSettingsRowProps } from "./components/settings-row";
export { SettingsRow } from "./components/settings-row";
export type { ShapeProps } from "./components/shape";
export { Shape, shapeStyles } from "./components/shape";
export type { ShapeArtLayout, ShapeArtProps } from "./components/shape-art";
export { ShapeArt, shapeArtStyles } from "./components/shape-art";
export type { NativeSheetProps } from "./components/sheet";
export { Sheet, sheetStyles } from "./components/sheet";
export type { SheetSurfaceProps } from "./components/sheet-surface";
export { SheetSurface } from "./components/sheet-surface";
export type {
  BottomSheetSize,
  EntityField,
  NativeBottomSheetPickerProps,
  NativeBottomSheetProps,
  NativeDockSheetProps,
  NativeEntitySheetProps,
  NativeSnapSheetProps,
  PickerOption,
  SnapPoint,
} from "./components/sheets";
export {
  BottomSheet,
  BottomSheetPicker,
  bottomSheetStyles,
  DockSheet,
  EntitySheet,
  SheetHandle,
  SnapSheet,
} from "./components/sheets";
export type {
  BootSplashProps,
  ErrorBoundaryProps,
} from "./components/shell";
export {
  BootSplash,
  bootSplashStyles,
  ErrorBoundary,
} from "./components/shell";
export type { NativeSkeletonProps } from "./components/skeleton";
export { Skeleton } from "./components/skeleton";
export type { NativeSliderProps } from "./components/slider";
export { Slider, sliderStyles } from "./components/slider";
export type { NativeSnackbarProps } from "./components/snackbar";
export { Snackbar, snackbarStyles } from "./components/snackbar";
export type { NativeSplitProps, SPLIT_GAP } from "./components/split";
export { Split } from "./components/split";
export type {
  NativeSplitButtonAction,
  NativeSplitButtonProps,
} from "./components/split-button";
export { SplitButton, splitButtonStyles } from "./components/split-button";
export type { NativeStatusBarProps } from "./components/status-bar";
export { StatusBar } from "./components/status-bar";
export type {
  SuccessState,
  SuccessTransformProps,
} from "./components/success-transform";
export {
  SuccessTransform,
  successTransformStyles,
} from "./components/success-transform";
export type { NativeSwitchProps } from "./components/switch";
export { Switch } from "./components/switch";
export type { NativeTableColumn, NativeTableProps } from "./components/table";
export { Table } from "./components/table";
export type { NativeTab, NativeTabsProps } from "./components/tabs";
export { Tabs, tabsStyles } from "./components/tabs";
export type { NativeTextProps } from "./components/text";
export { Text } from "./components/text";
export type { TextareaProps } from "./components/textarea";
export { Textarea } from "./components/textarea";
export type { NativeThemeToggleProps } from "./components/theme-toggle";
export { ThemeToggle } from "./components/theme-toggle";
export type { NativeTimePickerProps } from "./components/time-picker";
export { TimePicker, timeFieldStyles } from "./components/time-picker";
export type { NativeToggleProps } from "./components/toggle";
export { Toggle, toggleStyles } from "./components/toggle";
export type {
  NativeToggleGroupOption,
  NativeToggleGroupProps,
} from "./components/toggle-group";
export { ToggleGroup, toggleGroupStyles } from "./components/toggle-group";
export type {
  NativeToolbarAction,
  NativeToolbarProps,
} from "./components/toolbar";
export { Toolbar, toolbarStyles } from "./components/toolbar";
export type { NativeTooltipProps } from "./components/tooltip";
export { Tooltip } from "./components/tooltip";
export type {
  NativeTopAppBarProps,
  TopAppBarActionProps,
  TopAppBarSize,
} from "./components/top-app-bar";
export {
  TOP_APP_BAR_HEIGHTS,
  TOP_APP_BAR_SIZE_TO_KERN_SIZE,
  TopAppBar,
  TopAppBarAction,
  topAppBarStyles,
} from "./components/top-app-bar";
export type { NativeTopAppBarToggleProps } from "./components/top-app-bar-toggle";
export { TopAppBarToggle } from "./components/top-app-bar-toggle";
export type {
  BannerVariant,
  CommandAction,
  CountryOption,
  SegmentedButtonOption,
} from "./components/web-parity";
export {
  Banner,
  bannerStyles,
  Command,
  CountrySelect,
  SegmentedButton,
} from "./components/web-parity";
export type {
  KernFontAssets,
  KernFontFace,
  KernFontGateProps,
  KernFontLoader,
  KernFontState,
} from "./fonts";
export { KernFontGate, kernFontFaces, useKernFonts } from "./fonts";
export type {
  Contrast,
  KernThemeProviderProps,
  Mode,
  NativeThemeContextValue,
  ThemeSelection,
} from "./theme";
export { KernThemeProvider, useKernScheme, useKernTheme } from "./theme";
