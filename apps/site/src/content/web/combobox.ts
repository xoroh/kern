import type { ComponentDoc } from "../types";

export const combobox: ComponentDoc = {
  slug: "combobox",
  name: "Combobox",
  oneLiner:
    "Comboboxes pick one value from a set, either from the list or by typing to narrow it.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    // Native `Combobox` is the same component on the other renderer —
    // type-to-filter single choice with the popup list. Documented there.
    nativePeer: "Combobox",
    // No variant axis. One treatment; the state is open, closed or cleared.
    variants: [],
    // kern's own decision. M3's component elevation table names no combobox.
    // The popup ships `--sys-elevation-level2` and the choice is registered
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
  // The keyboard contract, read off the combobox primitive: the input keeps
  // the focus, the arrows move a HIGHLIGHT through the options, and Enter
  // takes the highlighted one.
  keyboard: [
    {
      key: "Type",
      action:
        "Filters the options as you type. The focus stays in the field — the list is filtered around it, not walked through it.",
    },
    {
      key: "ArrowDown / ArrowUp",
      action:
        "Moves the highlight through the options. The highlight is the preview of the choice; the field keeps the focus.",
    },
    {
      key: "Enter",
      action: "Chooses the highlighted option.",
    },
    {
      key: "Escape",
      action:
        "Closes the popup without changing the choice, and returns focus to the input.",
    },
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
      for: ["ComboboxRoot", "ComboboxItem"],
      type: "T | null",
      note: "Controlled choice on `ComboboxRoot`, generic over the value type and nullable — nothing chosen is `null`, not an empty string. On an item it is the unique value identifying the option.",
    },
    {
      name: "defaultValue",
      for: ["ComboboxRoot"],
      type: "T | null",
      note: "Initial choice when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["ComboboxRoot"],
      type: "(value: T | null, eventDetails: object) => void",
      note: "Fires when the choice changes, including when it is cleared back to `null`.",
    },
    {
      name: "items",
      for: ["ComboboxRoot"],
      type: "Item[]",
      note: "The options. The list is data-driven rather than assembled by hand.",
    },
    {
      name: "className",
      for: [
        "ComboboxLabel",
        "ComboboxInput",
        "ComboboxTrigger",
        "ComboboxClear",
        "ComboboxContent",
        "ComboboxItem",
        "ComboboxEmpty",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: [
        "ComboboxRoot",
        "ComboboxInput",
        "ComboboxTrigger",
        "ComboboxClear",
        "ComboboxItem",
      ],
      type: "boolean",
      note: "On an option, or on the whole field.",
    },
    {
      name: "form",
      for: ["ComboboxRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the field can live outside the `<form>` and still submit with it.",
    },
    {
      name: "filter",
      for: ["ComboboxRoot"],
      type: "((item: T, query: string, itemToString?: ((item: T) => string) | undefined) => boolean) | null | undefined",
      note: "Custom match between an option and the query. Receives the source item — the derived value with `createItems()` collections. Return `null` to disable filtering.",
    },
    {
      name: "id",
      for: ["ComboboxRoot"],
      type: "string | undefined",
      note: "Id of the field, wiring the label, input and popup together for assistive tech. Generated when omitted.",
    },
    {
      name: "children",
      for: ["ComboboxRoot", "ComboboxItem"],
      type: "ReactNode",
      note: "What the part renders. On the root it is the field's parts; on an item it is the option's visible content.",
    },
    {
      name: "name",
      for: ["ComboboxRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "modal",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether the open popup is modal: interaction stays inside, page scroll locks and outside pointer input is disabled. Non-modal leaves the rest of the document usable.",
    },
    {
      name: "open",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether the popup is open, when controlled. Leave unset for uncontrolled.",
    },
    {
      name: "defaultOpen",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether the popup starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["ComboboxRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "grid",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Presents options in a grid: arrow keys move across rows and columns inferred from DOM rows.",
    },
    {
      name: "inline",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Renders the list inline without the popup. Bind `open` unconditionally so the list counts as visible.",
    },
    {
      name: "inputValue",
      for: ["ComboboxRoot"],
      type: "string | number | readonly string[] | undefined",
      note: "The query text, when controlled. Leave unset to let typing own it.",
    },
    {
      name: "defaultInputValue",
      for: ["ComboboxRoot"],
      type: "string | number | readonly string[] | undefined",
      note: "Initial query text in the uncontrolled case.",
    },
    {
      name: "openOnInputClick",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether clicking the input opens the popup.",
    },
    {
      name: "filteredItems",
      for: ["ComboboxRoot"],
      type: "readonly T[] | readonly Group<T>[] | undefined",
      note: "Externally filtered options, replacing internal filtering. Preserve the flat-or-grouped shape with no nullish entries; pair with `useFilter()` for the matching logic.",
    },
    {
      name: "required",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether a choice is required before form submission.",
    },
    {
      name: "readOnly",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether the choice is fixed: the popup still opens but no other option can be picked.",
    },
    {
      name: "loopFocus",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last option back to the input. Disabled stops at the ends.",
    },
    {
      name: "inputRef",
      for: ["ComboboxRoot"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "virtualized",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Declares the items externally virtualized, so the list does not measure what is not rendered.",
    },
    {
      name: "limit",
      for: ["ComboboxRoot"],
      type: "number | undefined",
      note: "Maximum options shown in the list. Long result sets stay scannable instead of scrolling forever.",
    },
    {
      name: "locale",
      for: ["ComboboxRoot"],
      type: "LocalesArgument",
      note: "Locale for string comparison in filtering. Defaults to the runtime locale.",
    },
    {
      name: "multiple",
      for: ["ComboboxRoot"],
      type: "false | undefined",
      note: "Always single-select — the prop exists to lock that in, not to enable multi-select. A multi-select is a different component.",
    },
    {
      name: "autoComplete",
      for: ["ComboboxRoot"],
      type: "string | undefined",
      note: "Hint to the browser for autofill of the field.",
    },
    {
      name: "autoHighlight",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Highlights the first matching option automatically while filtering.",
    },
    {
      name: "highlightItemOnHover",
      for: ["ComboboxRoot"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "itemToStringLabel",
      for: ["ComboboxRoot"],
      type: "((itemValue: T) => string) | undefined",
      note: "Converts an option value to the string shown in the input. `{ value, label }` shapes use the label automatically.",
    },
    {
      name: "itemToStringValue",
      for: ["ComboboxRoot"],
      type: "((itemValue: T) => string) | undefined",
      note: "Converts an option value to its form-submission string. `{ value, label }` shapes need no converter.",
    },
    {
      name: "isItemEqualToValue",
      for: ["ComboboxRoot"],
      type: "((itemValue: T, value: T) => boolean) | undefined",
      note: "Custom equality between an option value and the selected value (defaults to `Object.is`). Needed when option values are objects that never match referentially.",
    },
    {
      name: "actionsRef",
      for: ["ComboboxRoot"],
      type: "RefObject<Actions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the popup; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "onOpenChange",
      for: ["ComboboxRoot"],
      type: "((open: boolean, eventDetails: OpenChangeEventDetails) => void) | undefined",
      note: "Fires when the popup opens or closes. The controlled `open` state lives here; ignoring it leaves the popup uncontrolled.",
    },
    {
      name: "onInputValueChange",
      for: ["ComboboxRoot"],
      type: "((inputValue: string, eventDetails: ChangeEventDetails) => void) | undefined",
      note: "Fires when the query text changes. The observer counterpart to controlled `inputValue`.",
    },
    {
      name: "onItemHighlighted",
      for: ["ComboboxRoot"],
      type: "((highlightedValue: T | undefined, eventDetails: HighlightEventDetails) => void) | undefined",
      note: "Fires when the highlighted option changes, with a `reason` (`keyboard`, `pointer`, `none`). Where typeahead side-effects observe without owning state.",
    },
    {
      name: "style",
      for: [
        "ComboboxLabel",
        "ComboboxInput",
        "ComboboxTrigger",
        "ComboboxClear",
        "ComboboxContent",
        "ComboboxItem",
        "ComboboxEmpty",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ComboboxLabelState` on the label, `ComboboxInputState` on the field, `ComboboxTriggerState` on the trigger, `ComboboxClearState` on the clear control, `ComboboxPopupState` on the popup, `ComboboxItemState` (highlighted, selected, disabled) on an option, `ComboboxEmptyState` on the no-results region.",
    },
    {
      name: "render",
      for: [
        "ComboboxLabel",
        "ComboboxInput",
        "ComboboxTrigger",
        "ComboboxClear",
        "ComboboxContent",
        "ComboboxItem",
        "ComboboxEmpty",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag, or composes it with another component — the render function receives the part's props and state. Accepts an element or a function returning one. Set `nativeButton` on the trigger, clear control or an option when the replacement is a native `<button>`.",
    },
    {
      name: "nativeButton",
      for: ["ComboboxTrigger", "ComboboxClear", "ComboboxItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "keepMounted",
      for: ["ComboboxClear"],
      type: "boolean | undefined",
      note: "Whether the clear control stays mounted while the field has no choice.",
    },
    {
      name: "initialFocus",
      for: ["ComboboxContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the popup opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["ComboboxContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the popup closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "onClick",
      for: ["ComboboxItem"],
      type: "((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) | undefined",
      note: "Fires when the option is chosen by pointer click, or by Enter while highlighted with focus in the input.",
    },
    {
      name: "index",
      for: ["ComboboxItem"],
      type: "number | undefined",
      note: "The option's position in the list. Declaring it skips DOM measurement for a faster highlight path.",
    },
  ],
  aria: [
    "The input is a combobox with `aria-expanded` and `aria-controls`, and the list is a listbox of options.",
    "Up/Down move through options, Enter chooses, Escape closes without changing the choice.",
    "`ComboboxClear` is a real button with its own name, so undoing a choice is reachable by keyboard.",
    "The chosen value is exposed on the input, so the current choice is announced when focus lands on it.",
  ],
};
