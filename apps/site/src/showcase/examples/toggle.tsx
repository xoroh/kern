import { Toggle } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Toggle examples — a two-state pressable with three faces.
 *
 * `pressed` is the state prop (Base UI naming, never `active` or `on`):
 * uncontrolled here via `defaultPressed`, disabled where the action is not
 * available. Props mirror the registry demo.
 */
export const TOGGLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "toggle-states",
    title: "Pressed, unpressed, disabled",
    description:
      "Three toggles, three states. The pressed one announces itself; the disabled one explains nothing because there is nothing to do.",
    render: () => (
      <>
        <Toggle defaultPressed aria-label="Bold">
          Bold
        </Toggle>
        <Toggle aria-label="Italic">Italic</Toggle>
        <Toggle disabled aria-label="Disabled">
          Disabled
        </Toggle>
      </>
    ),
    code: `<Toggle defaultPressed aria-label="Bold">Bold</Toggle>
<Toggle aria-label="Italic">Italic</Toggle>
<Toggle disabled aria-label="Disabled">Disabled</Toggle>`,
  },
];
