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
