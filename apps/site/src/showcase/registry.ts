import type { ConfiguratorSpec } from "./configurator";
import { ACCORDION_CONFIGURATOR } from "./configurators/accordion";
import { ALERT_DIALOG_CONFIGURATOR } from "./configurators/alert-dialog";
import { AUTOCOMPLETE_CONFIGURATOR } from "./configurators/autocomplete";
import { BUTTON_CONFIGURATOR } from "./configurators/button";
import { CALENDAR_CONFIGURATOR } from "./configurators/calendar";
import { CHECKBOX_CONFIGURATOR } from "./configurators/checkbox";
import { CHECKBOX_GROUP_CONFIGURATOR } from "./configurators/checkbox-group";
import { CHIP_CONFIGURATOR } from "./configurators/chip";
import { COLLAPSIBLE_CONFIGURATOR } from "./configurators/collapsible";
import { COUNTRY_SELECT_CONFIGURATOR } from "./configurators/country-select";
import { DIALOG_CONFIGURATOR } from "./configurators/dialog";
import { DRAWER_CONFIGURATOR } from "./configurators/drawer";
import { FIELD_CONFIGURATOR } from "./configurators/field";
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
import { SELECT_CONFIGURATOR } from "./configurators/select";
import { SHEET_CONFIGURATOR } from "./configurators/sheet";
import { SLIDER_CONFIGURATOR } from "./configurators/slider";
import { SNACKBAR_CONFIGURATOR } from "./configurators/snackbar";
import { SONNER_CONFIGURATOR } from "./configurators/sonner";
import { SWITCH_CONFIGURATOR } from "./configurators/switch";
import { TABS_CONFIGURATOR } from "./configurators/tabs";
import { TOGGLE_GROUP_CONFIGURATOR } from "./configurators/toggle-group";
import { TOOLTIP_CONFIGURATOR } from "./configurators/tooltip";
import type { ExampleSpec } from "./example";
import { BUTTON_EXAMPLES } from "./examples/button";
import { CHECKBOX_EXAMPLES, INPUT_EXAMPLES } from "./examples/input";
import { MENU_EXAMPLES, MENUBAR_EXAMPLES } from "./examples/menu";

/**
 * The Example registry — export name → the examples for it.
 *
 * Keyed by the package EXPORT NAME, matching the demo registries, so a page
 * looks up its examples the same way it looks up its live demo. Add a
 * component by adding a folder under `examples/` and one line here: the
 * showcase is registry-driven for the same reason the rest of the site is.
 *
 * One entry per component, not one per page — a family page shows the
 * examples of every export it owns.
 */
export const EXAMPLES: Record<string, ExampleSpec[]> = {
  Button: BUTTON_EXAMPLES,
  Input: INPUT_EXAMPLES,
  Checkbox: CHECKBOX_EXAMPLES,
  Menu: MENU_EXAMPLES,
  Menubar: MENUBAR_EXAMPLES,
};

/** Every export that has at least one registered example. */
export function examplesFor(exportName: string): ExampleSpec[] {
  return EXAMPLES[exportName] ?? [];
}

/**
 * The Configurator registry — export name → its configurator, if any.
 *
 * Flagships first (Button, Switch, Dialog), then Sheet, Select, Popover, Slider, Sonner, NumberField, Accordion, Progress, Field, ToggleGroup, Meter, Autocomplete, Drawer, Menu, Menubar, Pagination, Snackbar, Tabs, Tooltip, NavigationMenu, Collapsible, CountrySelect, CheckboxGroup, Chip, Search, AlertDialog, PreviewCard: one entry per
 * component, same keying as EXAMPLES, so a family page looks its
 * configurator up the same way. The harness is proven; further components
 * plug in here with zero template edits.
 */
export const CONFIGURATORS: Record<string, ConfiguratorSpec> = {
  Accordion: ACCORDION_CONFIGURATOR,
  AlertDialog: ALERT_DIALOG_CONFIGURATOR,
  Autocomplete: AUTOCOMPLETE_CONFIGURATOR,
  Button: BUTTON_CONFIGURATOR,
  Calendar: CALENDAR_CONFIGURATOR,
  Checkbox: CHECKBOX_CONFIGURATOR,
  CheckboxGroup: CHECKBOX_GROUP_CONFIGURATOR,
  Chip: CHIP_CONFIGURATOR,
  Collapsible: COLLAPSIBLE_CONFIGURATOR,
  CountrySelect: COUNTRY_SELECT_CONFIGURATOR,
  NumberField: NUMBER_FIELD_CONFIGURATOR,
  NavigationMenu: NAVIGATION_MENU_CONFIGURATOR,
  Meter: METER_CONFIGURATOR,
  Switch: SWITCH_CONFIGURATOR,
  Tabs: TABS_CONFIGURATOR,
  ToggleGroup: TOGGLE_GROUP_CONFIGURATOR,
  Tooltip: TOOLTIP_CONFIGURATOR,
  Dialog: DIALOG_CONFIGURATOR,
  Drawer: DRAWER_CONFIGURATOR,
  Field: FIELD_CONFIGURATOR,
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
  Slider: SLIDER_CONFIGURATOR,
  Snackbar: SNACKBAR_CONFIGURATOR,
  Sonner: SONNER_CONFIGURATOR,
};

/** The configurator for an export, if one is registered. */
export function configuratorFor(
  exportName: string,
): ConfiguratorSpec | undefined {
  return CONFIGURATORS[exportName];
}
