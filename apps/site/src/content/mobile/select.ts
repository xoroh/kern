import type { ComponentDoc } from "../types";

export const select: ComponentDoc = {
  slug: "select",
  name: "Select",
  oneLiner: "Selects choose one value from a list of options you supply.",
  features:
    "Reach for a select when the answer is one value from a known set and the alternatives fit a short list: a category, a sort order, a country. Options are data — `value` and `label` — so the list is a declaration. The selection is controlled or uncontrolled and reports the chosen VALUE rather than an event, which is what makes it easy to store. Note `onDismiss`: the surface that opens for the choice reports when it goes away without a selection, so you can tell a pick from a bail-out.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory. The web one is a
    // trigger + popup composition; this is a single component.
    nativePeer: "Select",
    variants: [],
    elevation: 2,
  },
  parts: ["Select"],
  keyboard: [
    {
      key: "Android back button",
      action:
        "Dismisses the open options through `onRequestClose` without choosing — the field keeps its current value.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The field announces its value or placeholder; the open list reads as a menu, each option as a menu item with its selected state; double-tap chooses and dismisses.",
    },
  ],
  usage: {
    do: [
      "Declare options as data and let the selected option read back into the field — the field is the summary, the menu is the choice.",
      "Keep a real placeholder so the unchosen state says what the field is for.",
      "Prefer `Select` over a free text field when the answer must come from a fixed set.",
    ],
    dont: [
      "Don't use a select for two or three options that fit on screen — radio or chips show the set without hiding it.",
      "Don't duplicate the selected value as a separate label elsewhere on the screen.",
    ],
  },
  tokens: [
    {
      element: "Field",
      state: "resting",
      token: "theme.color.surface",
      value: "surface, outline border, minHeight 56",
    },
    {
      element: "Placeholder",
      state: "resting",
      token: "theme.color.onSurfaceVariant",
      value: "onSurfaceVariant until an option is chosen",
    },
    {
      element: "Selected option",
      state: "selected",
      token: "theme.color.surfaceTonal",
      value: "surfaceTonal wash behind the chosen row",
    },
    {
      element: "Disabled field",
      state: "disabled",
      token: "opacity 0.38",
      value: "whole trigger dims to 38%",
    },
  ],
  faq: [
    {
      q: "Select or dropdown menu?",
      a: "Select owns a field that keeps the chosen value visible; a menu hangs its choice off a trigger and reports through callbacks. A value that must stay on screen means select.",
    },
    {
      q: "How does this differ from the web select?",
      a: "The contract is the same (options as data, controlled or uncontrolled). The options render in a native modal with a scrim rather than a positioned listbox, and the selected row carries a tonal wash.",
    },
  ],
  deviations: [
    {
      id: "K6",
      spec: 'M3\'s component elevation table does not name a select. It tabulates "menu" at resting level 2, and kern maps that row to `navigation-menu`, so there is no spec row a select could conform to.',
      kern: "The select popup rests at elevation level 2, matching the menu row's level.",
      why: "The open list behaves as an overlay above the page, so it needs the same lift a menu has — but claiming the menu row would assert something M3 never said about selects. Registered as K6 in the elevation inventory so the level is a recorded decision rather than an incidental value in a stylesheet.",
    },
  ],
  customization: {
    supported: [
      "`options` are data — `value` and `label` — so the list is a declaration.",
      "`placeholder` shows before anything is chosen.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `multiple`. It picks one; a multi-select is `CheckboxGroup`.",
      "There is no `searchable`. A list long enough to need searching wants `Autocomplete` or `Command`.",
      "There is no `renderOption`. Rows are uniform by design.",
    ],
  },
  api: [
    {
      name: "options",
      type: "NativeSelectOption[]",
      note: "`{ value, label }`. Data, so the list is a declaration rather than markup.",
    },
    {
      name: "value / defaultValue",
      type: "string",
      note: "ONE selected value. `onValueChange` reports the chosen value rather than an event, which is what makes it easy to store.",
    },
    {
      name: "placeholder",
      type: "string",
      note: "Shown before anything is chosen.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the choice surface goes away WITHOUT a selection — so you can tell a pick from a bail-out.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the select. Required in practice: the control shows a value, not a name.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`accessibilityLabel` is what names the control — the visible text is the chosen VALUE, which is not the same thing as the question being asked.",
    "One value is selected at a time and it is reported as a value, so the announcement is about the choice rather than the gesture.",
    "`onDismiss` separates closing from choosing, which matters because a dismissed select has NOT changed and should not be treated as if it had.",
  ],
};
