import type { ComponentDoc } from "../types";

export const countrySelect: ComponentDoc = {
  slug: "country-select",
  name: "Country select",
  oneLiner:
    "Country selects pick a country from a list, showing its flag and dial code alongside its name.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "CountrySelect",
    // No variant axis. One treatment; the state is open or closed.
    variants: [],
    // kern's own decision. M3's component elevation table names no select of
    // any kind — its "menu" row is taken by `navigation-menu`. The popup ships
    // `--sys-elevation-level2` and the choice is registered as K6.
    elevation: 2,
  },
  parts: [
    "CountrySelect",
    "CountrySelectRoot",
    "CountrySelectTrigger",
    "CountrySelectValue",
    "CountrySelectContent",
    "CountrySelectItem",
    "CountrySelectLabel",
  ],
  // The country select IS a select: it is the same popup primitive with a
  // country-shaped data set, so it inherits the select's keyboard contract
  // rather than inventing one of its own.
  keyboard: [
    {
      key: "Enter / Space / ArrowDown",
      action: "Opens the country list when the trigger is focused.",
    },
    {
      key: "Arrow keys",
      action:
        "Moves the highlight through the countries once the list is open. Home and End jump to the first or the last one, and typing jumps by the typed text.",
    },
    {
      key: "Enter / Space",
      action:
        "Chooses the highlighted country and closes the list; the trigger then announces the country by name.",
    },
    {
      key: "Escape",
      action:
        "Closes the list without choosing; focus returns to the trigger and the current country is unchanged.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves on from the trigger. Inside the open list, a disabled country is skipped as the highlight moves past it.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Countries are data — `code`, `name`, optional `dialCode`, optional `flag`, optional `disabled` — so the list is yours to localise.",
      "The flag slot is any node, so an emoji, an icon component or an image all work.",
    ],
    notSupported: [
      "There is no `locale` prop. Names come from the `options` you pass, which is also how the list gets localised — the component does not translate.",
      "There is no `searchable` prop on this component. A country list you can type to filter is `Autocomplete` or `Command`, not this.",
      "There is no `dialCodePrefix` prop. `dialCode` is deliberately stored WITHOUT the leading `+`, so the caller formats it — see the API row.",
    ],
  },
  api: [
    {
      name: "options",
      for: ["CountrySelectRoot"],
      type: "readonly CountryOption[]",
      note: "The countries, on `CountrySelectRoot`. Each carries `code`, `name`, and optionally `dialCode`, `flag` and `disabled`. The Select's `items` prop is omitted — this replaces it.",
    },
    {
      name: "onCountryChange",
      for: ["CountrySelectRoot"],
      type: "(country: CountryOption | null) => void",
      note: "Fires with the whole chosen country, not just its code — so a dial code and a flag are available without a second lookup. Nullable: nothing chosen is `null`.",
    },
    {
      name: "className",
      for: [
        "CountrySelectTrigger",
        "CountrySelectContent",
        "CountrySelectItem",
        "CountrySelectLabel",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["CountrySelectRoot", "CountrySelectTrigger", "CountrySelectItem"],
      type: "boolean",
      note: "On an option, or on the whole select.",
    },
    {
      name: "defaultValue",
      for: ["CountrySelectRoot"],
      type: "T | null | undefined",
      note: "Initially chosen option, when uncontrolled. Use `value` for controlled.",
    },
    {
      name: "form",
      for: ["CountrySelectRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the field can live outside the `<form>` and still submit with it.",
    },
    {
      name: "id",
      for: ["CountrySelectRoot"],
      type: "string | undefined",
      note: "Id of the field, wiring label, input and popup together for assistive tech. Generated when omitted.",
    },
    {
      name: "children",
      for: [
        "CountrySelectRoot",
        "CountrySelectTrigger",
        "CountrySelectContent",
        "CountrySelectItem",
      ],
      type: "ReactNode",
      note: "What the part renders. On the root it is the parts; on the trigger it is the current choice; on the popup it is the options; on an item it is the option's label.",
    },
    {
      name: "value",
      for: ["CountrySelectRoot", "CountrySelectItem"],
      type: "T | null | undefined",
      note: "Two roles, one name. On the root it is the controlled choice (`null` clears it); on an item it is the unique value identifying the option.",
    },
    {
      name: "onOpenChange",
      for: ["CountrySelectRoot"],
      type: "((open: boolean, eventDetails: SelectRootOpenChangeEventDetails) => void) | undefined",
      note: "Fires when the popup opens or closes. The controlled `open` state lives here; ignoring it leaves the popup uncontrolled.",
    },
    {
      name: "name",
      for: ["CountrySelectRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "modal",
      for: ["CountrySelectRoot"],
      type: "boolean | undefined",
      note: "Whether the open popup is modal: interaction stays inside, page scroll locks and outside pointer input is disabled. Non-modal leaves the rest of the document usable.",
    },
    {
      name: "actionsRef",
      for: ["CountrySelectRoot"],
      type: "RefObject<SelectRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the popup; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "open",
      for: ["CountrySelectRoot"],
      type: "boolean | undefined",
      note: "Whether the popup is open, when controlled. Leave unset for uncontrolled.",
    },
    {
      name: "defaultOpen",
      for: ["CountrySelectRoot"],
      type: "boolean | undefined",
      note: "Whether the popup starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["CountrySelectRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "itemToStringValue",
      for: ["CountrySelectRoot"],
      type: "((itemValue: T) => string) | undefined",
      note: "Converts an option value to its form-submission string. `{ value, label }` shapes need no converter.",
    },
    {
      name: "isItemEqualToValue",
      for: ["CountrySelectRoot"],
      type: "((itemValue: T, value: T) => boolean) | undefined",
      note: "Custom equality between an option value and the selected value (defaults to `Object.is`). Needed when option values are objects that never match referentially.",
    },
    {
      name: "autoComplete",
      for: ["CountrySelectRoot"],
      type: "string | undefined",
      note: "Hint to the browser for autofill of the field.",
    },
    {
      name: "itemToStringLabel",
      for: ["CountrySelectRoot"],
      type: "((itemValue: T) => string) | undefined",
      note: "Converts an option value to the string shown in the trigger. `{ value, label }` shapes use the label automatically.",
    },
    {
      name: "highlightItemOnHover",
      for: ["CountrySelectRoot"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "required",
      for: ["CountrySelectRoot"],
      type: "boolean | undefined",
      note: "Whether a choice is required before form submission.",
    },
    {
      name: "readOnly",
      for: ["CountrySelectRoot"],
      type: "boolean | undefined",
      note: "Whether the choice is fixed: the popup still opens but no other option can be picked.",
    },
    {
      name: "inputRef",
      for: ["CountrySelectRoot"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "onValueChange",
      for: ["CountrySelectRoot"],
      type: "((value: T | null, eventDetails: SelectRootChangeEventDetails) => void) | undefined",
      note: "Fires when the choice changes, with the new value (`null` when cleared).",
    },
    {
      name: "multiple",
      for: ["CountrySelectRoot"],
      type: "false | undefined",
      note: "Always single-select — the prop exists to lock that in, not to enable multi-select.",
    },
    {
      name: "nativeButton",
      for: ["CountrySelectTrigger", "CountrySelectItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "finalFocus",
      for: ["CountrySelectContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the popup closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "label",
      for: ["CountrySelectItem"],
      type: "string | undefined",
      note: "Text label used when the option is matched during keyboard text navigation. Defaults to the rendered content.",
    },
    {
      name: "style",
      for: [
        "CountrySelectTrigger",
        "CountrySelectContent",
        "CountrySelectItem",
        "CountrySelectLabel",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `SelectTriggerState` on the trigger, `SelectPopupState` on the popup, `SelectItemState` on an option, `FieldRootState` on the field label.",
    },
    {
      name: "render",
      for: [
        "CountrySelectTrigger",
        "CountrySelectContent",
        "CountrySelectItem",
        "CountrySelectLabel",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or an option when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The trigger is a combobox with `aria-expanded`, and the list is a listbox of options — the WAI-ARIA select pattern.",
    "Each option reads as its country name; the flag is decoration and the dial code is secondary text, so the name is what is announced.",
    "Up/Down move through the list and Enter chooses; typing jumps to matching countries.",
    "The chosen country is exposed on the trigger, so the current selection is announced when focus lands on it.",
  ],
};
