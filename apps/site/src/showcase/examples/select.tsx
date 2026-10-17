import { Select } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Select examples — the trigger that opens a grouped list.
 *
 * Groups carry their own labels; the value placeholder is what the closed
 * trigger reads. Props mirror the registry demo.
 */
export const SELECT_EXAMPLES: ExampleSpec[] = [
  {
    id: "select-region",
    title: "A grouped list behind a trigger",
    description:
      "One group per region, one label each. The trigger names the field for assistive tech; the placeholder is the closed state's only text.",
    render: () => (
      <div className="w-full max-w-xs">
        <Select.Root>
          <Select.Trigger aria-label="Region">
            <Select.Value placeholder="Choose a region" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.GroupLabel>Europe</Select.GroupLabel>
              <Select.Item value="eu-west">
                <Select.ItemText>eu-west-1</Select.ItemText>
              </Select.Item>
              <Select.Item value="eu-central">
                <Select.ItemText>eu-central-1</Select.ItemText>
              </Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.GroupLabel>Americas</Select.GroupLabel>
              <Select.Item value="us-east">
                <Select.ItemText>us-east-1</Select.ItemText>
              </Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    ),
    code: `<Select.Root>
  <Select.Trigger aria-label="Region">
    <Select.Value placeholder="Choose a region" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupLabel>Europe</Select.GroupLabel>
      <Select.Item value="eu-west">
        <Select.ItemText>eu-west-1</Select.ItemText>
      </Select.Item>
      <Select.Item value="eu-central">
        <Select.ItemText>eu-central-1</Select.ItemText>
      </Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.GroupLabel>Americas</Select.GroupLabel>
      <Select.Item value="us-east">
        <Select.ItemText>us-east-1</Select.ItemText>
      </Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>`,
  },
];
