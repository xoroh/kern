import { CheckboxGroup } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * CheckboxGroup examples — several independent choices, one value.
 *
 * The root holds the WHOLE selection and each item contributes its own
 * value, so one handler sees the whole answer instead of one box at a time.
 * The items are real checkboxes with their own names — a set of unrelated
 * boxes would not read as one question.
 */
export const CHECKBOX_GROUP_EXAMPLES: ExampleSpec[] = [
  {
    id: "checkbox-group-selection",
    title: "One value for the whole set",
    description:
      "Tick two boxes and the value is both of them. The group has no label of its own — give the question to a `Fieldset` and its legend, which is what gets read out before the options.",
    render: () => (
      <CheckboxGroup.Root defaultValue={["email"]} aria-label="Notifications">
        <CheckboxGroup.Item value="email" label="Email" />
        <CheckboxGroup.Item value="push" label="Push" />
        <CheckboxGroup.Item value="sms" label="SMS" />
      </CheckboxGroup.Root>
    ),
    code: `<CheckboxGroup.Root defaultValue={["email"]} aria-label="Notifications">
  <CheckboxGroup.Item value="email" label="Email" />
  <CheckboxGroup.Item value="push" label="Push" />
  <CheckboxGroup.Item value="sms" label="SMS" />
</CheckboxGroup.Root>`,
  },
];
