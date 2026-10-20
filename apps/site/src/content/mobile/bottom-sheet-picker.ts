import type { ComponentDoc } from "../types";

export const bottomSheetPicker: ComponentDoc = {
  slug: "bottom-sheet-picker",
  name: "Bottom sheet picker",
  oneLiner:
    "Bottom sheet pickers choose one value from a list, using the platform's own bottom-sheet interaction.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart is `Select` on `@xoroh/kern`, which is a different
    // component with a different shape (trigger + popup) rather than this
    // sheet. Named as a counterpart relationship rather than a shared export.
    nativePeer: "Select",
    variants: [],
    // Level 0: the native modal sheets carry no elevation token (flat;
    // web rests at level 1). Whether flat-native is deliberate or missing
    // elevation is an open owner question — this claims the shipped value.
    elevation: 0,
  },
  parts: ["BottomSheetPicker"],
  // The touch contract: the sheet is a modal surface, so the reader lands
  // inside it and the two ways out are the back button and the pick itself.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Picks the focused option. The press reports that option's value and closes the picker through `onOpenChange(false)`.",
    },
    {
      key: "Android back button",
      action:
        "Dismisses the sheet without a choice — the surface's request-close path calls `onDismiss` and reports `onOpenChange(false)`.",
    },
  ],
  customization: {
    supported: [
      "`className`-free like the rest of the native surface: `style` is a React Native `ViewStyle`.",
      "Options are data — `value`, `label`, optional `supporting`, optional `disabled` — so the list is a declaration rather than markup.",
      "`supporting` adds a second line under an option's label.",
    ],
    notSupported: [
      "There is no `multiple` prop. It picks one value; a multi-select is a different surface.",
      "There is no `searchable` prop. The list is what it is — a list long enough to need searching wants a different control.",
      "There is no `renderOption` prop. Rows look the same, and the selected one is marked with a check rather than a colour.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required.",
    },
    {
      name: "title",
      type: "string",
      note: "Names the sheet, so the choice announces what it is a choice of.",
    },
    {
      name: "options",
      type: "PickerOption[]",
      note: "The list, as data: `value`, `label`, optional `supporting`, optional `disabled`.",
    },
    {
      name: "onSelect",
      type: "(value: string) => void",
      note: "REQUIRED, and it takes the chosen value rather than an event. The picker has one job and this is it.",
    },
    {
      name: "value",
      type: "string",
      note: "The currently chosen value. It is marked on its row with a check — Material 3 marks the selected row rather than tinting it.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the sheet goes away without a choice.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The sheet is named by `title`, so the list announces what is being chosen.",
    "Each row is a real option with its own label and optional supporting line, so the choice is legible without seeing the check.",
    "Selection is marked with a check rather than a row colour, so it does not depend on colour vision to be readable.",
  ],
};
