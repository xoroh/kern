/**
 * The NATIVE Example registry — export name → the examples for it.
 *
 * The web half of the showcase lives in `registry.ts`. This module holds
 * the native examples, which import `@xoroh/kern-native`; keeping them
 * apart is what stops a web page's chunk from pulling the native bundle.
 */
import type { ExampleSpec } from "./example";
import { APP_SHELL_EXAMPLES } from "./examples/app-shell";
import { ASPECT_RATIO_EXAMPLES } from "./examples/aspect-ratio";
import { CONTRAST_TOGGLE_EXAMPLES } from "./examples/contrast-toggle";
import { ICON_BUTTON_TARGET_EXAMPLES } from "./examples/icon-button-target";
import { KERN_PRESSABLE_EXAMPLES } from "./examples/kern-pressable";
import { LIST_DETAIL_EXAMPLES } from "./examples/list-detail";
import { MENU_GROUP_LIST_EXAMPLES } from "./examples/menu-group-list";
import { NAVIGATION_BAR_ITEM_EXAMPLES } from "./examples/navigation-bar-item";
import { NAVIGATION_RAIL_EXAMPLES } from "./examples/navigation-rail";
import { SETTINGS_ROW_EXAMPLES } from "./examples/settings-row";
import { SHAPE_EXAMPLES } from "./examples/shape";
import { SHAPE_ART_EXAMPLES } from "./examples/shape-art";
import { SHEET_HANDLE_EXAMPLES } from "./examples/sheet-handle";
import { SNACKBAR_PROVIDER_EXAMPLES } from "./examples/snackbar-provider";
import { STATUS_BAR_EXAMPLES } from "./examples/status-bar";
import { SUCCESS_TRANSFORM_EXAMPLES } from "./examples/success-transform";

export const EXAMPLES: Record<string, ExampleSpec[]> = {
  AppShell: APP_SHELL_EXAMPLES,
  AspectRatio: ASPECT_RATIO_EXAMPLES,
  ContrastToggle: CONTRAST_TOGGLE_EXAMPLES,
  IconButtonTarget: ICON_BUTTON_TARGET_EXAMPLES,
  KernPressable: KERN_PRESSABLE_EXAMPLES,
  ListDetail: LIST_DETAIL_EXAMPLES,
  MenuGroupList: MENU_GROUP_LIST_EXAMPLES,
  NavigationBarItem: NAVIGATION_BAR_ITEM_EXAMPLES,
  NavigationRail: NAVIGATION_RAIL_EXAMPLES,
  SettingsRow: SETTINGS_ROW_EXAMPLES,
  ShapeArt: SHAPE_ART_EXAMPLES,
  Shape: SHAPE_EXAMPLES,
  SheetHandle: SHEET_HANDLE_EXAMPLES,
  SnackbarProvider: SNACKBAR_PROVIDER_EXAMPLES,
  StatusBar: STATUS_BAR_EXAMPLES,
  SuccessTransform: SUCCESS_TRANSFORM_EXAMPLES,
};

/** Every export that has at least one registered example. */
export function examplesFor(exportName: string): ExampleSpec[] {
  return EXAMPLES[exportName] ?? [];
}
