import type { ComponentDoc } from "../types";

export const select: ComponentDoc = {
  slug: "select",
  name: "Select",
  oneLiner:
    "Selects let someone choose one value from a set too long to show on the page.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Select",
    // No variant axis. The select is one treatment; the state (open, disabled,
    // placeholder) is what varies.
    variants: [],
    // kern's own decision. M3's component elevation table does not name a
    // select — it names "menu" at level 2, which kern maps to
    // `navigation-menu`. The popup ships `--sys-elevation-level2`, and the
    // choice is registered as K6. See Deviations.
    elevation: 2,
  },
  parts: [
    "Select",
    "SelectRoot",
    "SelectTrigger",
    "SelectValue",
    "SelectContent",
    "SelectItem",
    "SelectItemText",
    "SelectItemIndicator",
    "SelectGroupLabel",
    "SelectSeparator",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Enter / Space / ArrowDown",
      action: "Opens the menu when the trigger is focused.",
    },
    {
      key: "Arrow keys",
      action: "Moves through options once open. Typeahead jumps by typed text.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first or the last option in the open list.",
    },
    {
      key: "Escape",
      action: "Closes the menu and returns focus to the trigger.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the select. Disabled selects are skipped.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The trigger is the input's height and shape — `--sys-shape-corner-small` and the outline roles — so a select sits level beside a text field in a form.",
      "Option states are exposed as `data-highlighted` and `data-disabled`, so a stylesheet can restyle hover and unavailable options.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. The trigger is one height, matching the input.",
      "There is no `placeholder` prop on the select — the placeholder is what `SelectValue` renders when nothing is chosen.",
      "There is no `placement` or `side` prop. The list is positioned for you; the offset from the trigger is fixed.",
      "There is no `elevation` prop. The popup's resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "value",
      for: ["SelectRoot", "SelectItem"],
      type: "SelectValueType<Value, Multiple> | null",
      note: "Controlled selection on `SelectRoot`, generic over the value type and nullable — an empty select is `null`, not `undefined`. Omit for uncontrolled. On an item it is the unique value identifying the option. On an item it is the unique value identifying the option.",
    },
    {
      name: "defaultValue",
      for: ["SelectRoot"],
      type: "SelectValueType<Value, Multiple> | null",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["SelectRoot"],
      type: "(value, eventDetails: SelectRootChangeEventDetails) => void",
      note: "Fires when the selection changes. `eventDetails` carries the reason — `itemPress`, `escapeKey`, `outsidePress` and so on — so a handler can tell a deliberate choice from a dismiss.",
    },
    {
      name: "items",
      for: ["SelectRoot"],
      type: "Record<string, ReactNode> | ReadonlyArray<{ label, value }> | ReadonlyArray<Group>",
      note: "The options, on `SelectRoot`. Accepts a label map, a list of `{ label, value }` pairs, or grouped items.",
    },
    {
      name: "itemToStringLabel",
      for: ["SelectRoot"],
      type: "(itemValue: Value) => string",
      note: "Converts an object value to the text shown in the trigger. Needed only when values are objects that are not `{ value, label }` — that shape is read automatically.",
    },
    {
      name: "itemToStringValue",
      for: ["SelectRoot"],
      type: "(itemValue: Value) => string",
      note: "Converts an object value to a string for form submission. Separate from `itemToStringLabel` because what a person reads and what a form posts are not the same thing.",
    },
    {
      name: "isItemEqualToValue",
      for: ["SelectRoot"],
      type: "(itemValue: Value, value: Value) => boolean",
      note: "Custom match between an option and the current selection. Defaults to `Object.is`, which fails for object values created fresh on each render.",
    },
    {
      name: "className",
      for: [
        "SelectTrigger",
        "SelectContent",
        "SelectItem",
        "SelectGroupLabel",
        "SelectSeparator",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["SelectRoot", "SelectTrigger", "SelectItem"],
      type: "boolean",
      note: "Disables the control. The trigger dims and will not open.",
    },
    {
      name: "children",
      for: ["SelectRoot", "SelectTrigger", "SelectContent", "SelectItem"],
      type: "ReactNode",
      note: "What the part renders. On the root it is the parts; on the trigger it is the current choice; on the popup it is the options; on an item it is the option's label.",
    },
    {
      name: "inputRef",
      for: ["SelectRoot"],
      type: "Ref<HTMLInputElement> | undefined",
      note: "Ref to the hidden input element that carries the submission value.",
    },
    {
      name: "name",
      for: ["SelectRoot"],
      type: "string | undefined",
      note: "Field name submitted with the form. What the server receives under.",
    },
    {
      name: "form",
      for: ["SelectRoot"],
      type: "string | undefined",
      note: "Id of the form that owns the hidden input, so the field can live outside the `<form>` and still submit with it.",
    },
    {
      name: "autoComplete",
      for: ["SelectRoot"],
      type: "string | undefined",
      note: "Hint to the browser for autofill of the field.",
    },
    {
      name: "id",
      for: ["SelectRoot"],
      type: "string | undefined",
      note: "Id of the field, wiring label, input and popup together for assistive tech. Generated when omitted.",
    },
    {
      name: "required",
      for: ["SelectRoot"],
      type: "boolean | undefined",
      note: "Whether a choice is required before form submission.",
    },
    {
      name: "readOnly",
      for: ["SelectRoot"],
      type: "boolean | undefined",
      note: "Whether the choice is fixed: the popup still opens but no other option can be picked.",
    },
    {
      name: "multiple",
      for: ["SelectRoot"],
      type: "Multiple | undefined",
      note: "Whether several options can be chosen. The `Multiple` generic on the root moves the value between one and many.",
    },
    {
      name: "highlightItemOnHover",
      for: ["SelectRoot"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "defaultOpen",
      for: ["SelectRoot"],
      type: "boolean | undefined",
      note: "Whether the popup starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChange",
      for: ["SelectRoot"],
      type: "((open: boolean, eventDetails: SelectRootOpenChangeEventDetails) => void) | undefined",
      note: "Fires when the popup opens or closes. The controlled `open` state lives here; ignoring it leaves the popup uncontrolled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["SelectRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "open",
      for: ["SelectRoot"],
      type: "boolean | undefined",
      note: "Whether the popup is open, when controlled. Leave unset for uncontrolled.",
    },
    {
      name: "modal",
      for: ["SelectRoot"],
      type: "boolean | undefined",
      note: "Whether the open popup is modal: interaction stays inside, page scroll locks and outside pointer input is disabled. Non-modal leaves the rest of the document usable.",
    },
    {
      name: "actionsRef",
      for: ["SelectRoot"],
      type: "RefObject<SelectRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the popup; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "variant",
      for: ["SelectTrigger"],
      type: '"outlined" | "filled" | undefined',
      note: "M3 treatment: `outlined` (default) draws the outline; `filled` fills `surface-container-highest` with a bottom active indicator. Functionally identical — pick by surface.",
    },
    {
      name: "nativeButton",
      for: ["SelectTrigger", "SelectItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "finalFocus",
      for: ["SelectContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the popup closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "label",
      for: ["SelectItem"],
      type: "string | undefined",
      note: "Text label used when the option is matched during keyboard text navigation. Defaults to the rendered content.",
    },
    {
      name: "orientation",
      for: ["SelectSeparator"],
      type: "Orientation | undefined",
      note: "Direction of the divider between option groups.",
    },
    {
      name: "style",
      for: [
        "SelectTrigger",
        "SelectContent",
        "SelectItem",
        "SelectGroupLabel",
        "SelectSeparator",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `SelectTriggerState` on the trigger, `SelectPopupState` on the popup, `SelectItemState` on an option, `SelectGroupLabelState` on a group heading, `SelectSeparatorState` on a divider.",
    },
    {
      name: "render",
      for: [
        "SelectTrigger",
        "SelectContent",
        "SelectItem",
        "SelectGroupLabel",
        "SelectSeparator",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or an option when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The trigger is a combobox: it exposes `aria-expanded` and `aria-controls`, so a screen reader says whether the list is open before it is opened.",
    "The list is a listbox and the options are options, so the roles are the WAI-ARIA select pattern rather than a styled menu.",
    "Typing within an open list jumps to matching options, and Up/Down move through them.",
    "The selected value is exposed on the trigger, so the current choice is announced when focus lands on it.",
  ],
};
