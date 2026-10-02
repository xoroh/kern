import type { ComponentDoc } from "../types";

export const dialog: ComponentDoc = {
  slug: "dialog",
  name: "Dialog",
  oneLiner:
    "Dialogs interrupt for one decision — a title, some content, and up to a few actions.",
  features:
    "Reach for a dialog when the answer has to happen before anything else can: confirming something irreversible, asking for one value, telling someone something that blocks. It is modal and it is brief. Keep the content to a sentence or two and the actions to two — Material 3's dialog caps the action row at two, and a third means the decision is bigger than a dialog. Note the visibility prop is `visible` here and `onDismiss` is how it goes away; several other surfaces in this family take `open`/`onOpenChange` instead, which is a real inconsistency and is stated on every page where it bites.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Dialog",
    variants: [],
    elevation: 3,
  },
  parts: ["Dialog"],
  customization: {
    supported: [
      "`actions` are data — `label`, optional `onPress`, optional `primary` — so the action row is a declaration.",
      "`children` is the body, so what the dialog says is yours.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. A dialog is one shape; a sheet is a different surface.",
      "There is no `icon` or `media` slot. Those belong in `children` if you need them.",
      "`actions` is a list of at most two in practice — Material 3 caps the action row there, and nothing here enforces it, so a third is on you.",
    ],
  },
  api: [
    {
      name: "visible",
      type: "boolean",
      note: "Controlled visibility. Required — and note the name: this is `visible`, where `Drawer`, `Popover` and `Tooltip` take `open`/`defaultOpen`/`onOpenChange`. The inconsistency is in the surface, not in your code.",
    },
    {
      name: "title",
      type: "string",
      note: "Required. Names the dialog, so what has interrupted is announced rather than only that something did.",
    },
    {
      name: "actions",
      type: "NativeDialogAction[]",
      note: "`{ label, onPress?, primary? }`. `primary` marks the emphasised action. Material 3 caps a dialog's action row at TWO — a third means the decision is bigger than a dialog.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the dialog goes away. This is the dismissal handler; there is no `onOpenChange` here.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "It is modal: it interrupts and it traps, which is the point and the cost of using one.",
    "`title` names it, so the announcement says what has come up.",
    "Each action is a real pressable with a `label`, and `primary` marks the emphasised one — so the choice is readable without seeing which button is filled.",
    "Material 3's two-action cap is about the decision being small enough to hold in a dialog; it is not enforced here, so exceeding it is a choice you can see.",
  ],
};
