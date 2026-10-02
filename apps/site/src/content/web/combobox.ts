import type { ComponentDoc } from "../types";

export const combobox: ComponentDoc = {
  slug: "combobox",
  name: "Combobox",
  oneLiner:
    "Comboboxes pick one value from a set, either from the list or by typing to narrow it.",
  features:
    "Reach for a combobox when the answer is one of many known values and typing is quicker than scrolling: an assignee, a tag, a country, a template. It shows the current choice and offers the rest on demand, and the input filters as you type — so it is a select you can search and an autocomplete you can also browse. It is the wrong tool when the answer is free text, which is an input, or when the set is short enough to read, which is a radio group. Clear is its own control, because getting out of a wrong choice matters as much as getting in.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `Combobox`. Its typeahead selection surface is
    // `Autocomplete`, which is not the same component. Recorded in
    // docs/parity-contract.md as a real coverage asymmetry.
    nativePeer: "none",
    // No variant axis. One treatment; the state is open, closed or cleared.
    variants: [],
    // kern's own decision. M3's component elevation table names no combobox.
    // The popup ships `--md-sys-elevation-level2` and the choice is registered
    // as K6. See Deviations.
    elevation: 2,
  },
  parts: [
    "Combobox",
    "ComboboxRoot",
    "ComboboxLabel",
    "ComboboxInput",
    "ComboboxTrigger",
    "ComboboxClear",
    "ComboboxContent",
    "ComboboxItem",
    "ComboboxEmpty",
  ],
  deviations: [
    {
      id: "K6",
      m3: 'M3\'s component elevation table names no combobox. It tabulates "menu" at level 2 and search at level 3; neither describes a typeahead selection field.',
      kern: "The combobox popup rests at elevation level 2.",
      why: "The open list behaves as an overlay above the page and needs the lift the other anchored overlays have. Borrowing the menu row would assert M3 described this surface, which it does not. Registered as K6 in the elevation inventory so the level is a recorded decision.",
    },
  ],
  anatomy: [
    {
      name: "ComboboxRoot",
      role: "Owns the query and the chosen value. Generic over the value type.",
    },
    { name: "ComboboxLabel", role: "Names the field." },
    { name: "ComboboxInput", role: "Shows the choice and takes the query." },
    {
      name: "ComboboxTrigger",
      role: "Opens the list without typing, for anyone who would rather browse.",
    },
    {
      name: "ComboboxClear",
      role: "Empties the field. Its own control, because undoing a wrong choice should not require selecting a right one.",
    },
    {
      name: "ComboboxContent",
      role: "The list surface. Portals to the end of the document and positions itself against the input.",
    },
    { name: "ComboboxItem", role: "One option." },
    {
      name: "ComboboxEmpty",
      role: "What to show when the query matches nothing.",
    },
    { name: "Combobox", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The input and the list use the same tokens as `Select` and `Input`, so a combobox sits level with the other fields in a form.",
      "Option states are exposed as `data-highlighted` and `data-disabled`.",
    ],
    notSupported: [
      "There is no `filter` prop on this component. Matching is the primitive's; a searchable list with its own keyword matching is `Command`.",
      "There is no `multiple` prop. A combobox chooses one value; a multi-select is a different component.",
      "There is no `creatable` prop — the list is fixed. Allowing someone to add a value that is not in the set is not this component's job.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "value",
      type: "T | null",
      note: "Controlled choice on `ComboboxRoot`, generic over the value type and nullable — nothing chosen is `null`, not an empty string.",
    },
    {
      name: "defaultValue",
      type: "T | null",
      note: "Initial choice when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: T | null, eventDetails: object) => void",
      note: "Fires when the choice changes, including when it is cleared back to `null`.",
    },
    {
      name: "items",
      type: "Item[]",
      note: "The options. The list is data-driven rather than assembled by hand.",
    },
    {
      name: "itemToString",
      type: "(item) => string",
      note: "How an option becomes the text in the input. Needed when values are objects rather than strings.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an option, or on the whole field.",
    },
  ],
  aria: [
    "The input is a combobox with `aria-expanded` and `aria-controls`, and the list is a listbox of options.",
    "Up/Down move through options, Enter chooses, Escape closes without changing the choice.",
    "`ComboboxClear` is a real button with its own name, so undoing a choice is reachable by keyboard.",
    "The chosen value is exposed on the input, so the current choice is announced when focus lands on it.",
  ],
};
