import type { ComponentDoc } from "../types";

export const command: ComponentDoc = {
  slug: "command",
  name: "Command",
  oneLiner:
    "Commands are searchable lists of actions and destinations, filtered as you type.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Command",
    // No variant axis. The query is the axis.
    variants: [],
    // kern's own decision. M3's component elevation table names no command
    // palette. The surface ships `--sys-elevation-level3` and the choice is
    // registered as K11. See Deviations.
    elevation: 3,
  },
  parts: [
    "Command",
    "CommandRoot",
    "CommandInput",
    "CommandContent",
    "CommandList",
    "CommandItem",
    "CommandGroupLabel",
    "CommandSeparator",
    "CommandEmpty",
  ],
  // The keyboard contract, read off the combobox primitive the palette is
  // built on: the input keeps the focus, the arrows move a HIGHLIGHT through
  // the matching options, and Enter takes the highlighted one.
  keyboard: [
    {
      key: "Type",
      action:
        "Narrows the list as you type. The focus stays in the field — the rows are filtered around it, not walked through it.",
    },
    {
      key: "ArrowDown / ArrowUp",
      action:
        "Moves the highlight through the matching options. The highlight is the preview of the choice; the field keeps the focus.",
    },
    {
      key: "Enter",
      action:
        "Chooses the highlighted option. `onValueChange` fires with its value, then that option's own `onSelect`.",
    },
    {
      key: "Escape",
      action:
        "Closes the popup and returns focus to the trigger, without changing the choice.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Options are data — `value`, `label`, optional `keywords`, `icon`, `shortcut`, `disabled`, `onSelect` — so a command palette is a list you pass in, not markup you write.",
      "The surface is the surface-container roles at dialog height, so it reads as summoned rather than embedded.",
    ],
    notSupported: [
      "There is no `filter` prop. Matching is case-insensitive over the label plus any `keywords`, and that is the only strategy shipped.",
      "There is no `size` or `variant` prop.",
      "There is no `multiple` prop. A command chooses one option; a multi-select list is not this component.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "options",
      for: ["CommandRoot"],
      type: "readonly CommandOption[]",
      note: "The rows, as data on `CommandRoot`. Each carries `value`, `label`, and optionally `keywords`, `icon`, `shortcut`, `disabled` and `onSelect`. Filtering and rendering both come from this.",
    },
    {
      name: "onValueChange",
      for: ["CommandRoot"],
      type: "(value: string | null, eventDetails?) => void",
      note: "Fires when an option is chosen, with its value. Nullable — nothing chosen is `null` rather than an empty string.",
    },
    {
      name: "shortcut",
      for: ["CommandItem"],
      type: "string",
      note: "On an option: the trailing keyboard hint, rendered in a `Kbd`. Text to display, not a binding — the shortcut is wired by the host.",
    },
    {
      name: "onSelect",
      for: [
        "CommandInput",
        "CommandContent",
        "CommandList",
        "CommandItem",
        "CommandGroupLabel",
        "CommandSeparator",
        "CommandEmpty",
      ],
      type: "(value: string) => void",
      note: "On an option: invoked after it is chosen, in addition to `onValueChange` on the root. Use it for per-option behaviour.",
    },
    {
      name: "className",
      for: [
        "CommandInput",
        "CommandContent",
        "CommandList",
        "CommandItem",
        "CommandGroupLabel",
        "CommandSeparator",
        "CommandEmpty",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["CommandRoot", "CommandInput", "CommandItem"],
      type: "boolean",
      note: "On the root it locks the whole palette; on an option it stays visible but cannot be chosen.",
    },
    {
      name: "defaultValue",
      for: ["CommandRoot"],
      type: "string | null | undefined",
      note: "Initially selected option value, when uncontrolled. Pair with `onValueChange` to stay uncontrolled; use `value` for controlled.",
    },
    {
      name: "form",
      for: ["CommandRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the palette can live outside the `<form>` and still submit with it.",
    },
    {
      name: "id",
      for: ["CommandRoot"],
      type: "string | undefined",
      note: "Explicit id for the part. Base UI wires labels, popup anchoring and descriptions off generated ids when omitted.",
    },
    {
      name: "children",
      for: ["CommandRoot", "CommandList", "CommandItem"],
      type: "ReactNode | ((item: any, index: number) => ReactNode)",
      note: "What the part renders. On the root it is the palette's parts; on the list it is the options, or a function rendering each option keyed on its value; on an item it is the option's visible label.",
    },
    {
      name: "value",
      for: ["CommandRoot", "CommandItem"],
      type: "string | null | undefined",
      note: "On the root: the selected option value when controlled (`null` clears it). On an item: the option's stable value — what filtering compares and `onValueChange` receives.",
    },
    {
      name: "onOpenChange",
      for: ["CommandRoot"],
      type: "((open: boolean, eventDetails: OpenChangeEventDetails) => void) | undefined",
      note: "Fires when the popup opens or closes. The controlled `open` state lives here; ignoring it leaves the popup uncontrolled.",
    },
    {
      name: "name",
      for: ["CommandRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "modal",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether the open popup is modal: interaction stays inside, page scroll locks and outside pointer input is disabled. Non-modal leaves the rest of the document usable.",
    },
    {
      name: "actionsRef",
      for: ["CommandRoot"],
      type: "RefObject<Actions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the popup; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "open",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether the popup is open, when controlled. Leave unset for uncontrolled.",
    },
    {
      name: "defaultOpen",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether the popup starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["CommandRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "grid",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Presents options in a grid: arrow keys move across rows and columns inferred from DOM rows.",
    },
    {
      name: "inline",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Renders the list inline without the popup. Bind `open` unconditionally so the list counts as visible.",
    },
    {
      name: "itemToStringValue",
      for: ["CommandRoot"],
      type: "((itemValue: string) => string) | undefined",
      note: "Converts an option value to its form-submission string. `{ value, label }` shapes need no converter.",
    },
    {
      name: "isItemEqualToValue",
      for: ["CommandRoot"],
      type: "((itemValue: string, value: string) => boolean) | undefined",
      note: "Custom equality between an option value and the selected value (defaults to `Object.is`). Needed when option values are objects that never match referentially.",
    },
    {
      name: "inputValue",
      for: ["CommandRoot"],
      type: "string | number | readonly string[] | undefined",
      note: "The query text, when controlled. Leave unset to let typing own it.",
    },
    {
      name: "defaultInputValue",
      for: ["CommandRoot"],
      type: "string | number | readonly string[] | undefined",
      note: "Initial query text in the uncontrolled case.",
    },
    {
      name: "onInputValueChange",
      for: ["CommandRoot"],
      type: "((inputValue: string, eventDetails: ChangeEventDetails) => void) | undefined",
      note: "Fires when the query text changes. The observer counterpart to controlled `inputValue`.",
    },
    {
      name: "autoComplete",
      for: ["CommandRoot"],
      type: "string | undefined",
      note: "Hint to the browser for autofill of the field.",
    },
    {
      name: "itemToStringLabel",
      for: ["CommandRoot"],
      type: "((itemValue: string) => string) | undefined",
      note: "Converts an option value to the string shown in the input. `{ value, label }` shapes use the label automatically.",
    },
    {
      name: "autoHighlight",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Highlights the first matching option automatically while filtering.",
    },
    {
      name: "highlightItemOnHover",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "openOnInputClick",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether clicking the input opens the popup.",
    },
    {
      name: "filteredItems",
      for: ["CommandRoot"],
      type: "readonly CommandOption[] | readonly Group<CommandOption>[] | undefined",
      note: "Externally filtered options, replacing internal filtering. Preserve the flat-or-grouped shape with no nullish entries; pair with `useFilter()` for the matching logic.",
    },
    {
      name: "required",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether a choice is required before form submission.",
    },
    {
      name: "readOnly",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether the choice is fixed: the popup still opens but no other option can be picked.",
    },
    {
      name: "loopFocus",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last option back to the input. Disabled stops at the ends.",
    },
    {
      name: "onItemHighlighted",
      for: ["CommandRoot"],
      type: "((highlightedValue: string | undefined, eventDetails: HighlightEventDetails) => void) | undefined",
      note: "Fires when the highlighted option changes, with a `reason` (`keyboard`, `pointer`, `none`). Where typeahead side-effects observe without owning state.",
    },
    {
      name: "inputRef",
      for: ["CommandRoot"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "virtualized",
      for: ["CommandRoot"],
      type: "boolean | undefined",
      note: "Declares the items externally virtualized, so the list does not measure what is not rendered.",
    },
    {
      name: "limit",
      for: ["CommandRoot"],
      type: "number | undefined",
      note: "Maximum options shown in the list. Long result sets stay scannable instead of scrolling forever.",
    },
    {
      name: "locale",
      for: ["CommandRoot"],
      type: "LocalesArgument",
      note: "Locale for string comparison in filtering. Defaults to the runtime locale.",
    },
    {
      name: "multiple",
      for: ["CommandRoot"],
      type: "false | undefined",
      note: "Always single-select on a command palette — the prop exists to lock that in, not to enable multi-select.",
    },
    {
      name: "style",
      for: [
        "CommandInput",
        "CommandContent",
        "CommandList",
        "CommandItem",
        "CommandGroupLabel",
        "CommandSeparator",
        "CommandEmpty",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ComboboxInputState` on the input, `ComboboxPopupState` on the popup, `ComboboxListState` on the list, `ComboboxItemState` (highlighted, selected, disabled) on an option, `ComboboxGroupLabelState` on a group heading, `ComboboxSeparatorState` on a divider, `ComboboxEmptyState` on the no-results region.",
    },
    {
      name: "render",
      for: [
        "CommandInput",
        "CommandContent",
        "CommandList",
        "CommandItem",
        "CommandGroupLabel",
        "CommandSeparator",
        "CommandEmpty",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag, or composes it with another component — the render function receives the part's props and state. Accepts an element or a function returning one. Set `nativeButton` on an option when the replacement is a native `<button>`.",
    },
    {
      name: "initialFocus",
      for: ["CommandContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the popup opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["CommandContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the popup closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "onClick",
      for: ["CommandItem"],
      type: "((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) | undefined",
      note: "Fires when the option is chosen by pointer click, or by Enter while highlighted with focus in the input or list.",
    },
    {
      name: "nativeButton",
      for: ["CommandItem"],
      type: "boolean | undefined",
      note: "Set when the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "index",
      for: ["CommandItem"],
      type: "number | undefined",
      note: "The option's position in the list. Declaring it skips DOM measurement for a faster highlight path.",
    },
    {
      name: "icon",
      for: ["CommandItem"],
      type: "ReactNode",
      note: "Leading adornment for the option, rendered in its own slot before the label.",
    },
    {
      name: "orientation",
      for: ["CommandSeparator"],
      type: "Orientation | undefined",
      note: "Direction of the separator line between option groups.",
    },
  ],
  aria: [
    "The input is a combobox with `aria-expanded`, and the list is a listbox of options, so the structure is the WAI-ARIA combobox pattern rather than a styled search box.",
    "Up/Down move through the matching options and Enter chooses one; typing narrows the list without moving focus.",
    "`CommandEmpty` is what a screen reader reaches when nothing matches, so an empty result is announced rather than silently blank.",
    "Each option's `shortcut` is display text for sighted readers — it is not a binding and does not announce one.",
  ],
};
