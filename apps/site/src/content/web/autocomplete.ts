import type { ComponentDoc } from "../types";

export const autocomplete: ComponentDoc = {
  slug: "autocomplete",
  name: "Autocomplete",
  oneLiner:
    "Autocompletes suggest values as someone types, and fill in the one they mean.",
  features:
    "Reach for an autocomplete when the answer is free text but usually something already known: a city, a username, a tag that exists. It completes rather than restricts — someone can still type a value that is not suggested. That is the line between this and a combobox, which picks from a fixed set, so choose deliberately: if the value must come from the list, that is a combobox. Keep the suggestions short and ordered by likelihood, because a list of forty equally-plausible completions is a list nobody reads.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/text-fields",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Autocomplete",
    // No variant axis. One treatment.
    variants: [],
    // kern's own decision. M3's component elevation table names no
    // autocomplete. The popup ships `--md-sys-elevation-level2` and the choice
    // is registered as K6. See Deviations.
    elevation: 2,
  },
  parts: [
    "Autocomplete",
    "AutocompleteRoot",
    "AutocompleteLabel",
    "AutocompleteInput",
    "AutocompleteContent",
    "AutocompleteItem",
    "AutocompleteEmpty",
  ],
  deviations: [
    {
      id: "K6",
      spec: 'M3\'s component elevation table names no autocomplete. It tabulates "menu" at level 2 and search at level 3; neither describes a completion list attached to a text field.',
      kern: "The suggestion list rests at elevation level 2.",
      why: "The suggestions float above the page beside the field, so they need the same lift as the other anchored overlays. Borrowing a neighbouring row would assert M3 described this surface. Registered as K6 in the elevation inventory so the level is a recorded decision.",
    },
  ],
  anatomy: [
    {
      name: "AutocompleteRoot",
      role: "Owns the text and the suggestion list. Generic over the value type.",
    },
    { name: "AutocompleteLabel", role: "Names the field." },
    {
      name: "AutocompleteInput",
      role: "The text field. Typing narrows the suggestions; the text itself stays editable.",
    },
    {
      name: "AutocompleteContent",
      role: "The suggestion surface. Portals to the end of the document and positions itself against the input.",
    },
    { name: "AutocompleteItem", role: "One suggestion." },
    {
      name: "AutocompleteEmpty",
      role: "What to show when nothing is suggested — which is a normal state here, since the answer may not be in the list at all.",
    },
    {
      name: "Autocomplete",
      role: "The namespace object: all of the parts above.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The field is the input's shape and height, so an autocomplete sits level with the other fields in a form.",
      "Suggestion states are exposed as `data-highlighted` and `data-disabled`.",
    ],
    notSupported: [
      "There is no `filter` prop. Matching is the primitive's; a searchable list with its own keyword matching is `Command`.",
      "There is no `multiple` prop. One value in the field.",
      "There is no `freeSolo` toggle. Completing rather than restricting is what this component IS — a restricted version is `Combobox`.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "value",
      type: "T",
      note: "Controlled value on `AutocompleteRoot`, generic over the value type. The text can be a value no suggestion matched — that is the point of an autocomplete.",
    },
    {
      name: "defaultValue",
      type: "T",
      note: "Initial value when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: T, eventDetails: object) => void",
      note: "Fires as the value changes, whether from typing or from choosing a suggestion.",
    },
    {
      name: "items",
      type: "Item[]",
      note: "The suggestions. Data-driven, and short lists read better than complete ones.",
    },
    {
      name: "itemToString",
      type: "(item) => string",
      note: "How a suggestion becomes the text placed in the field. Needed when values are objects.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes. Note `AutocompleteLabel` is a plain `<label>`, not a primitive wrapper.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On a suggestion, or on the field.",
    },
  ],
  aria: [
    "The input is a combobox with `aria-expanded`, and the suggestions are a listbox of options — the WAI-ARIA autocomplete pattern.",
    "The text remains editable throughout, so the field announces as an editable combobox rather than a read-only choice.",
    "`AutocompleteEmpty` is reachable when nothing is suggested, which is a normal state here rather than an error.",
    "Choosing a suggestion fills the field, but the value can also be typed outright — so a screen reader user is never forced through the list.",
  ],
};
