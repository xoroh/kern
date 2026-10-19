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
    // autocomplete. The popup ships `--sys-elevation-level2` and the choice
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
    {
      name: "form",
      for: ["AutocompleteRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the field can live outside the `<form>` and still submit with it.",
    },
    {
      name: "filter",
      for: ["AutocompleteRoot"],
      type: "((item: unknown, query: string, itemToString?: ((item: unknown) => string) | undefined) => boolean) | null | undefined",
      note: "Custom match between a suggestion and the query. Return `null` to disable filtering (the list is then entirely yours).",
    },
    {
      name: "id",
      for: ["AutocompleteRoot"],
      type: "string | undefined",
      note: "Id of the field, wiring the label, input and popup together for assistive tech. Generated when omitted.",
    },
    {
      name: "children",
      for: ["AutocompleteRoot", "AutocompleteItem"],
      type: "ReactNode",
      note: "What the part renders. On the root it is the field's parts; on a suggestion it is the visible content.",
    },
    {
      name: "onOpenChange",
      for: ["AutocompleteRoot"],
      type: "((open: boolean, eventDetails: AutocompleteRootOpenChangeEventDetails) => void) | undefined",
      note: "Fires when the popup opens or closes. The controlled `open` state lives here; ignoring it leaves the popup uncontrolled.",
    },
    {
      name: "name",
      for: ["AutocompleteRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "modal",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether the open popup is modal: interaction stays inside, page scroll locks and outside pointer input is disabled. Non-modal leaves the rest of the document usable.",
    },
    {
      name: "actionsRef",
      for: ["AutocompleteRoot"],
      type: "RefObject<AutocompleteRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the popup; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "open",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether the popup is open, when controlled. Leave unset for uncontrolled.",
    },
    {
      name: "defaultOpen",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether the popup starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["AutocompleteRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "grid",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Presents suggestions in a grid: arrow keys move across rows and columns inferred from DOM rows.",
    },
    {
      name: "inline",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Renders the list inline without the popup. Bind `open` unconditionally so the list counts as visible.",
    },
    {
      name: "itemToStringValue",
      for: ["AutocompleteRoot"],
      type: "((itemValue: unknown) => string) | undefined",
      note: "Converts a suggestion value to its string for both the input and form submission. `{ value, label }` shapes use the label automatically.",
    },
    {
      name: "autoHighlight",
      for: ["AutocompleteRoot"],
      type: 'boolean | "always" | undefined',
      note: 'Highlights the first matching suggestion automatically: `true` after typing while the query changes, `"always"` unconditionally.',
    },
    {
      name: "keepHighlight",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether the highlight survives the pointer leaving the list.",
    },
    {
      name: "highlightItemOnHover",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "openOnInputClick",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether clicking the input opens the popup.",
    },
    {
      name: "filteredItems",
      for: ["AutocompleteRoot"],
      type: "readonly unknown[] | readonly Group<unknown>[] | undefined",
      note: "Externally filtered suggestions, replacing internal filtering. Preserve the flat-or-grouped shape with no nullish entries; pair with `useFilter()` for the matching logic.",
    },
    {
      name: "required",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether a value is required before form submission. The value may be text no suggestion matched — that is the point of an autocomplete.",
    },
    {
      name: "readOnly",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether the value is fixed: the popup still opens but no other suggestion can be picked.",
    },
    {
      name: "loopFocus",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last suggestion back to the input. Disabled stops at the ends.",
    },
    {
      name: "onItemHighlighted",
      for: ["AutocompleteRoot"],
      type: "((highlightedValue: unknown, eventDetails: HighlightEventDetails) => void) | undefined",
      note: "Fires when the highlighted suggestion changes, with a `reason` (`keyboard`, `pointer`, `none`). Where typeahead side-effects observe without owning state.",
    },
    {
      name: "inputRef",
      for: ["AutocompleteRoot"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "virtualized",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Declares the items externally virtualized, so the list does not measure what is not rendered.",
    },
    {
      name: "limit",
      for: ["AutocompleteRoot"],
      type: "number | undefined",
      note: "Maximum suggestions shown in the list. Long result sets stay scannable instead of scrolling forever.",
    },
    {
      name: "locale",
      for: ["AutocompleteRoot"],
      type: "LocalesArgument",
      note: "Locale for string comparison in filtering. Defaults to the runtime locale.",
    },
    {
      name: "submitOnItemClick",
      for: ["AutocompleteRoot"],
      type: "boolean | undefined",
      note: "Whether choosing a suggestion submits the owning form. Off by default — pointer and Enter choices do not submit unless this says so. For single-field search inputs.",
    },
    {
      name: "mode",
      for: ["AutocompleteRoot"],
      type: '"none" | "list" | "inline" | "both" | undefined',
      note: "How the field treats the list: `list` (default) filters suggestions without touching the text; `both` filters and temporarily completes the text from the active suggestion; `inline` keeps suggestions static and completes the text; `none` keeps them static and leaves the text alone.",
    },
    {
      name: "style",
      for: [
        "AutocompleteInput",
        "AutocompleteContent",
        "AutocompleteItem",
        "AutocompleteEmpty",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ComboboxInputState` on the field, `ComboboxPopupState` on the popup, `AutocompleteItemState` (highlighted, selected, disabled) on a suggestion, `ComboboxEmptyState` on the no-suggestions region.",
    },
    {
      name: "render",
      for: [
        "AutocompleteInput",
        "AutocompleteContent",
        "AutocompleteItem",
        "AutocompleteEmpty",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag, or composes it with another component — the render function receives the part's props and state. Accepts an element or a function returning one. Set `nativeButton` on a suggestion when the replacement is a native `<button>`.",
    },
    {
      name: "initialFocus",
      for: ["AutocompleteContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the popup opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["AutocompleteContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the popup closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "onClick",
      for: ["AutocompleteItem"],
      type: "((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) | undefined",
      note: "Fires when the suggestion is chosen by pointer click, or by Enter while highlighted with focus in the input.",
    },
    {
      name: "index",
      for: ["AutocompleteItem"],
      type: "number | undefined",
      note: "The suggestion's position in the list. Declaring it skips DOM measurement for a faster highlight path.",
    },
    {
      name: "nativeButton",
      for: ["AutocompleteItem"],
      type: "boolean | undefined",
      note: "Set when the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
  ],
  aria: [
    "The input is a combobox with `aria-expanded`, and the suggestions are a listbox of options — the WAI-ARIA autocomplete pattern.",
    "The text remains editable throughout, so the field announces as an editable combobox rather than a read-only choice.",
    "`AutocompleteEmpty` is reachable when nothing is suggested, which is a normal state here rather than an error.",
    "Choosing a suggestion fills the field, but the value can also be typed outright — so a screen reader user is never forced through the list.",
  ],
};
