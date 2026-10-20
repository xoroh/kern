import type { ComponentDoc } from "../types";

export const select: ComponentDoc = {
  slug: "select",
  name: "Select",
  oneLiner: "Selects choose one value from a list of options you supply.",
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
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "selected", "disabled"],
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
