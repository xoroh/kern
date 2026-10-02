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
    // `navigation-menu`. The popup ships `--md-sys-elevation-level2`, and the
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
      name: "SelectGroupLabel",
      role: "A heading for a run of related options.",
    },
    { name: "SelectSeparator", role: "A divider between runs of options." },
    { name: "Select", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The trigger is the input's height and shape — `--md-sys-shape-corner-small` and the outline roles — so a select sits level beside a text field in a form.",
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
  ],
  aria: [
    "The trigger is a combobox: it exposes `aria-expanded` and `aria-controls`, so a screen reader says whether the list is open before it is opened.",
    "The list is a listbox and the options are options, so the roles are the WAI-ARIA select pattern rather than a styled menu.",
    "Typing within an open list jumps to matching options, and Up/Down move through them.",
    "The selected value is exposed on the trigger, so the current choice is announced when focus lands on it.",
  ],
};
