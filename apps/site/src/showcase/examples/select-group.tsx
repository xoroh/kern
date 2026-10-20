import { Select, SelectGroup } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Select group examples — related options under one label inside the list.
 *
 * The group is presentation, not selection: it owns no value of its own, and
 * the select still owns the one value. What the group adds is the LABEL that
 * names the run of options below it.
 *
 * WEB composition — a group is a part of the select's popup, so it can only
 * be shown inside one. The native select renders a flat option list and has
 * no counterpart.
 */
export const SELECT_GROUP_EXAMPLES: ExampleSpec[] = [
  {
    id: "select-group-labelled-options",
    title: "Options that share a label",
    description:
      'The group is a `role="group"` labelled by `SelectGroupLabel`; it never takes focus, so the keyboard walks the options and skips the group entirely.',
    render: () => (
      <div className="w-full max-w-xs">
        <Select.Root>
          <Select.Trigger aria-label="Region">
            <Select.Value placeholder="Choose a region" />
          </Select.Trigger>
          <Select.Content>
            <SelectGroup>
              <Select.GroupLabel>Europe</Select.GroupLabel>
              <Select.Item value="eu-west">
                <Select.ItemText>eu-west-1</Select.ItemText>
              </Select.Item>
              <Select.Item value="eu-central">
                <Select.ItemText>eu-central-1</Select.ItemText>
              </Select.Item>
            </SelectGroup>
            <Select.Separator />
            <SelectGroup>
              <Select.GroupLabel>Americas</Select.GroupLabel>
              <Select.Item value="us-east">
                <Select.ItemText>us-east-1</Select.ItemText>
              </Select.Item>
            </SelectGroup>
          </Select.Content>
        </Select.Root>
      </div>
    ),
    code: `<Select.Root>
  <Select.Trigger aria-label="Region">
    <Select.Value placeholder="Choose a region" />
  </Select.Trigger>
  <Select.Content>
    <SelectGroup>
      <Select.GroupLabel>Europe</Select.GroupLabel>
      <Select.Item value="eu-west">
        <Select.ItemText>eu-west-1</Select.ItemText>
      </Select.Item>
    </SelectGroup>
    <Select.Separator />
    <SelectGroup>
      <Select.GroupLabel>Americas</Select.GroupLabel>
      <Select.Item value="us-east">
        <Select.ItemText>us-east-1</Select.ItemText>
      </Select.Item>
    </SelectGroup>
  </Select.Content>
</Select.Root>`,
  },
];
