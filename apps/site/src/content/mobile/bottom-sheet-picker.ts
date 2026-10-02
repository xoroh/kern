import type { ComponentDoc } from "../types";

export const bottomSheetPicker: ComponentDoc = {
  slug: "bottom-sheet-picker",
  name: "Bottom sheet picker",
  oneLiner:
    "Bottom sheet pickers choose one value from a list, using the platform's own bottom-sheet interaction.",
  features:
    "Reach for a bottom sheet picker when the answer is one value from a known set and the platform's own sheet is the fastest way to choose it: a country, a category, a sort order. It is the native counterpart of the web `Select`, and it is worth being clear that they are different components on different platforms rather than one component styled twice. Material 3 marks the selected row with a check rather than tinting the row, so selection is legible without relying on colour.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart is `Select` on `@xoroh/kern`, which is a different
    // component with a different shape (trigger + popup) rather than this
    // sheet. Named as a counterpart relationship rather than a shared export.
    nativePeer: "Select",
    variants: [],
    elevation: "surface",
  },
  parts: ["BottomSheetPicker"],
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
