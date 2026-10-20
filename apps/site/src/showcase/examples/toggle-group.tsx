import { ToggleGroup } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * ToggleGroup examples — related toggles held together as one control.
 *
 * The root owns the selection (one option, or several in multi-select mode)
 * and each item contributes its own value. Every item is a real button
 * carrying `aria-pressed`, so the state is announced rather than implied by
 * a colour.
 */
export const TOGGLE_GROUP_EXAMPLES: ExampleSpec[] = [
  {
    id: "toggle-group-exclusive",
    title: "One of several, as one control",
    description:
      "Pressing one option releases the others, because the group's value is the selection rather than a list of booleans. The group has no label slot — the question belongs to a `Fieldset` and its legend.",
    render: () => (
      <ToggleGroup.Root defaultValue={["left"]} aria-label="Alignment">
        <ToggleGroup.Item value="left" aria-label="Left">
          L
        </ToggleGroup.Item>
        <ToggleGroup.Item value="center" aria-label="Center">
          C
        </ToggleGroup.Item>
        <ToggleGroup.Item value="right" aria-label="Right">
          R
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    ),
    code: `<ToggleGroup.Root defaultValue={["left"]} aria-label="Alignment">
  <ToggleGroup.Item value="left" aria-label="Left">L</ToggleGroup.Item>
  <ToggleGroup.Item value="center" aria-label="Center">C</ToggleGroup.Item>
  <ToggleGroup.Item value="right" aria-label="Right">R</ToggleGroup.Item>
</ToggleGroup.Root>`,
  },
];
