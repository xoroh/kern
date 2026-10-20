import { Autocomplete } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Autocomplete examples — the field that completes rather than restricts.
 *
 * The text stays editable throughout, so the value may be something no
 * suggestion matched. That is the line between an autocomplete and a
 * combobox, and it is why `filter` is a prop here: a host that wants a
 * fixed set wants `Combobox` instead.
 */
export const AUTOCOMPLETE_EXAMPLES: ExampleSpec[] = [
  {
    id: "autocomplete-suggestions",
    title: "A field that completes rather than restricts",
    description:
      "Label, field and suggestion list as one compound. `filter={null}` switches the matching off, so the declared suggestions are the whole list — and the field still accepts text that is in none of them.",
    render: () => (
      <div className="w-full max-w-xs">
        <Autocomplete.Root
          items={["Kern", "Kern UI", "Kern Native"]}
          filter={null}
        >
          <Autocomplete.Label>Package</Autocomplete.Label>
          <Autocomplete.Input placeholder="Start typing" />
          <Autocomplete.Content>
            <Autocomplete.Item value="Kern">Kern</Autocomplete.Item>
            <Autocomplete.Item value="Kern UI">Kern UI</Autocomplete.Item>
            <Autocomplete.Item value="Kern Native">
              Kern Native
            </Autocomplete.Item>
          </Autocomplete.Content>
        </Autocomplete.Root>
      </div>
    ),
    code: `<Autocomplete.Root items={["Kern", "Kern UI", "Kern Native"]} filter={null}>
  <Autocomplete.Label>Package</Autocomplete.Label>
  <Autocomplete.Input placeholder="Start typing" />
  <Autocomplete.Content>
    <Autocomplete.Item value="Kern">Kern</Autocomplete.Item>
    <Autocomplete.Item value="Kern UI">Kern UI</Autocomplete.Item>
    <Autocomplete.Item value="Kern Native">Kern Native</Autocomplete.Item>
  </Autocomplete.Content>
</Autocomplete.Root>`,
  },
];
