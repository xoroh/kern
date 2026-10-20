import { NumberField } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Number field examples — a number with steppers either side of it.
 *
 * The steppers are the component's own: they carry their own accessible names
 * ("Decrease" and "Increase") and they refuse to step past `min` and `max`.
 * The bounds are what make the field a field rather than a free-text box.
 *
 * WEB composition. The native field is one component over the Axis compound;
 * the mobile page carries its own live demo.
 */
export const NUMBER_FIELD_EXAMPLES: ExampleSpec[] = [
  {
    id: "number-field-steppers",
    title: "A number, with the steps named",
    description:
      "The two steppers are real buttons with their own names, so a reader hears which end moves the value. The value is nullable — an empty field is not a zero — and the bounds are enforced rather than left to the caller.",
    render: () => (
      <NumberField.Root defaultValue={2} min={0} max={10} aria-label="Quantity">
        <NumberField.Input />
      </NumberField.Root>
    ),
    code: `<NumberField.Root defaultValue={2} min={0} max={10} aria-label="Quantity">
  <NumberField.Input />
</NumberField.Root>`,
  },
];
