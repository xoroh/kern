import type { ComponentDoc } from "../types";

export const select: ComponentDoc = {
  slug: "select",
  name: "Select",
  oneLiner:
    "Selects let someone choose one value from a set too long to show on the page.",
  features:
    "Reach for a select when the answer is one of a known set and the set is too long to lay out — countries, timezones, a parent record. It shows the current choice on the trigger and the rest only on demand, which is what makes it compact. If the set is short enough to read at a glance, a radio group is better: a select hides the alternatives, and someone cannot choose what they have not seen. If the answer is several values, that is a checkbox group or a multi-select, not this.",
  meta: {
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
  deviations: [
    {
      id: "K6",
      spec: 'M3\'s component elevation table does not name a select. It tabulates "menu" at resting level 2, and kern maps that row to `navigation-menu`, so there is no spec row a select could conform to.',
      kern: "The select popup rests at elevation level 2, matching the menu row's level.",
      why: "The open list behaves as an overlay above the page, so it needs the same lift a menu has — but claiming the menu row would assert something M3 never said about selects. The level is registered as K6 in m3-elevation.ts so the choice is a recorded decision rather than an incidental value in a stylesheet.",
    },
  ],
  anatomy: [
    {
      name: "SelectRoot",
      role: "Owns the open state and the selected value. Generic over the value type, so a select of numbers stays numbers.",
    },
    {
      name: "SelectTrigger",
      role: "The closed control showing the current choice. Opens the list.",
    },
    {
      name: "SelectValue",
      role: "Renders the selected value inside the trigger.",
    },
    {
      name: "SelectContent",
      role: "The list surface. Portals to the end of the document and positions itself against the trigger.",
    },
    { name: "SelectItem", role: "One option." },
    { name: "SelectItemText", role: "The option's label text." },
    {
      name: "SelectItemIndicator",
      role: "The selected mark inside an option. Renders only while its option is selected.",
    },
    {
      name: "SelectGroupLabel",
      role: "A heading for a run of related options.",
    },
    { name: "SelectSeparator", role: "A divider between runs of options." },
    { name: "Select", role: "The namespace object: all of the parts above." },
  ],
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
      key: "Escape",
      action: "Closes the menu and returns focus to the trigger.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the select. Disabled selects are skipped.",
    },
  ],
  usage: {
    do: [
      "Use for choosing one value from a fixed list — 6+ options or tight space where radios won't fit.",
      "Mirror the text-field treatment: filled on lower surfaces, outlined everywhere else.",
      "Mark mandatory selects `required`.",
    ],
    dont: [
      "Don't use for 2–5 always-visible choices — that is a radio group or segmented button.",
      "Don't use for free text — that is an input or combobox.",
    ],
  },
  tokens: [
    {
      element: "Filled container",
      state: "resting",
      token: "comp.filled-select.text-field-container-color",
      value: "--sys-color-surface-container-highest, 4px top",
    },
    {
      element: "Outlined container",
      state: "resting",
      token: "comp.outlined-select.text-field-container-shape",
      value: "corner-extra-small 4px, 1px outline",
    },
    {
      element: "Menu surface",
      state: "resting",
      token: "comp.menu.container-color",
      value: "surface, level2 shadow",
    },
  ],
  faq: [
    {
      q: "Select, combobox, or autocomplete?",
      a: "Select for a fixed closed list. Combobox when the list filters as you type. Autocomplete when suggestions complete free text.",
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
      type: "SelectValueType<Value, Multiple> | null",
      note: "Controlled selection on `SelectRoot`, generic over the value type and nullable — an empty select is `null`, not `undefined`. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      type: "SelectValueType<Value, Multiple> | null",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value, eventDetails: SelectRootChangeEventDetails) => void",
      note: "Fires when the selection changes. `eventDetails` carries the reason — `itemPress`, `escapeKey`, `outsidePress` and so on — so a handler can tell a deliberate choice from a dismiss.",
    },
    {
      name: "items",
      type: "Record<string, ReactNode> | ReadonlyArray<{ label, value }> | ReadonlyArray<Group>",
      note: "The options, on `SelectRoot`. Accepts a label map, a list of `{ label, value }` pairs, or grouped items.",
    },
    {
      name: "itemToStringLabel",
      type: "(itemValue: Value) => string",
      note: "Converts an object value to the text shown in the trigger. Needed only when values are objects that are not `{ value, label }` — that shape is read automatically.",
    },
    {
      name: "itemToStringValue",
      type: "(itemValue: Value) => string",
      note: "Converts an object value to a string for form submission. Separate from `itemToStringLabel` because what a person reads and what a form posts are not the same thing.",
    },
    {
      name: "isItemEqualToValue",
      type: "(itemValue: Value, value: Value) => boolean",
      note: "Custom match between an option and the current selection. Defaults to `Object.is`, which fails for object values created fresh on each render.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
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
