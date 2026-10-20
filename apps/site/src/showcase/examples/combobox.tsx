import { Combobox } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Combobox examples — one value, picked from a list or typed to narrow it.
 *
 * The options are the same set that gets filtered, so the field and the
 * popup can never disagree about what is on offer.
 */
export const COMBOBOX_EXAMPLES: ExampleSpec[] = [
  {
    id: "combobox-filter",
    title: "One value, narrowed by typing",
    description:
      "The items are data on the root, and the list renders the same set. `Combobox.Clear` empties the field, and the empty state says so rather than leaving a blank popup.",
    render: () => (
      <Combobox.Root
        items={[
          { value: "css", label: "CSS" },
          { value: "tailwind", label: "Tailwind" },
          { value: "tokens", label: "Design tokens" },
        ]}
      >
        <Combobox.Label>Styling</Combobox.Label>
        <Combobox.Input placeholder="Search styling" />
        <Combobox.Content>
          <Combobox.Empty>No match.</Combobox.Empty>
          <Combobox.Item value="css">CSS</Combobox.Item>
          <Combobox.Item value="tailwind">Tailwind</Combobox.Item>
          <Combobox.Item value="tokens">Design tokens</Combobox.Item>
        </Combobox.Content>
      </Combobox.Root>
    ),
    code: `<Combobox.Root
  items={[
    { value: "css", label: "CSS" },
    { value: "tailwind", label: "Tailwind" },
    { value: "tokens", label: "Design tokens" },
  ]}
>
  <Combobox.Label>Styling</Combobox.Label>
  <Combobox.Input placeholder="Search styling" />
  <Combobox.Content>
    <Combobox.Empty>No match.</Combobox.Empty>
    <Combobox.Item value="css">CSS</Combobox.Item>
    <Combobox.Item value="tailwind">Tailwind</Combobox.Item>
    <Combobox.Item value="tokens">Design tokens</Combobox.Item>
  </Combobox.Content>
</Combobox.Root>`,
  },
];
