import { Fieldset, Input } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Fieldset examples — grouped controls under one legend.
 *
 * A fieldset is a GROUPING, not a control: it names a set of answers and can
 * take the whole set out of the tab order with one `disabled` on the root.
 */
export const FIELDSET_EXAMPLES: ExampleSpec[] = [
  {
    id: "fieldset-grouped-controls",
    title: "One legend, one group",
    description:
      "The legend names the set, and the controls inside it are the tab stops — the fieldset itself takes no focus. `disabled` on the root takes the whole group out of the tab order at once.",
    render: () => (
      <Fieldset.Root>
        <Fieldset.Legend>Delivery address</Fieldset.Legend>
        <Input placeholder="Street and number" aria-label="Street" />
      </Fieldset.Root>
    ),
    code: `<Fieldset.Root>
  <Fieldset.Legend>Delivery address</Fieldset.Legend>
  <Input placeholder="Street and number" aria-label="Street" />
</Fieldset.Root>`,
  },
];
