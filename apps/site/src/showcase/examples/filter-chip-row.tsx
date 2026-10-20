import { FilterChipRow } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Filter chip row examples — a multi-select row of filter chips.
 *
 * Multi-select is the contract, so a second press REMOVES the value rather
 * than being ignored: a filter chip that cannot be switched off is not a
 * toggle. The row is a `role="group"` and each chip carries `aria-pressed`.
 *
 * WEB composition. The native row is the same contract over React Native
 * pressables; the mobile page carries its own live demo.
 */
export const FILTER_CHIP_ROW_EXAMPLES: ExampleSpec[] = [
  {
    id: "filter-chip-row-multi-select",
    title: "A row of filters that switch each other off",
    description:
      "Each chip is a toggle carrying `aria-pressed`, and the selection is a SET: pressing a selected chip again removes it, because a filter that cannot be switched off is not a filter.",
    render: () => (
      <FilterChipRow
        label="Filters"
        defaultValue={["all"]}
        options={[
          { value: "all", label: "All" },
          { value: "unread", label: "Unread" },
          { value: "flagged", label: "Flagged" },
        ]}
      />
    ),
    code: `<FilterChipRow
  label="Filters"
  defaultValue={["all"]}
  options={[
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "flagged", label: "Flagged" },
  ]}
/>`,
  },
];
