import type { ComponentDoc } from "../types";

export const dialog: ComponentDoc = {
  slug: "dialog",
  name: "Dialog",
  oneLiner:
    "Dialogs interrupt for one decision — a title, some content, and up to a few actions.",
  features:
    "Reach for a dialog when the answer has to happen before anything else can: confirming something irreversible, asking for one value, telling someone something that blocks. It is modal and it is brief. Keep the content to a sentence or two and the actions to two — Material 3's dialog caps the action row at two, and a third means the decision is bigger than a dialog. Visibility is `open` with `onOpenChange` reporting state, like the web peer; `onDismiss` is the dismissal action (what happens when it goes away), not the state.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Dialog",
    variants: [],
    elevation: 3,
  },
  parts: ["Dialog"],
  keyboard: [
    {
      key: "Android back button",
      action:
        "Dismisses via `onRequestClose` — fires `onDismiss` and reports `onOpenChange(false)`, the same path as tapping an action.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        'The `title` announces when the dialog appears (`role="dialog"`, announced as an alert); actions read as buttons in order and double-tap activates.',
    },
  ],
  usage: {
    do: [
      "Name the decision in `title` — it is the accessible label, so it announces what interrupted.",
      "Keep to two actions with `primary` on the confirming one; a third means the decision is bigger than a dialog.",
      "Drive `open` from state and mirror it in `onOpenChange` so dismiss and state never disagree.",
    ],
    dont: [
      "Don't put the decision's context only in `children` styling — the title is what assistive tech hears first.",
      "Don't use a dialog for non-blocking information — that is a snackbar.",
    ],
  },
  tokens: [
    {
      element: "Surface",
      state: "resting",
      token: "theme.color.surface",
      value: "surface, 24px padding",
    },
    {
      element: "Surface shape",
      state: "resting",
      token: "theme.shape.medium",
      value: "medium corners",
    },
    {
      element: "Primary action",
      state: "resting",
      token: "theme.color.primary",
      value: "primary fill, pill, minHeight 48",
    },
    {
      element: "Primary action label",
      state: "resting",
      token: "theme.color.onPrimary",
      value: "onPrimary",
    },
    {
      element: "Secondary action",
      state: "resting",
      token: "transparent",
      value: "no fill — emphasis comes from position, not paint",
    },
  ],
  faq: [
    {
      q: "`open` or `onDismiss` — which owns the state?",
      a: "`open`/`onOpenChange` own the state, exactly like the web peer. `onDismiss` is the dismissal action (what happens when it goes away), fired alongside the `false` report — including the Android back button.",
    },
    {
      q: "How does this differ from the web dialog?",
      a: "The contract is the same (`open`, two-action cap, modal). The surface is a native `Modal` with `fade`, the scrim is host-drawn, and actions are data rather than composed parts — no `DialogTrigger`/`DialogContent` tree.",
    },
  ],
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
      name: "open",
      type: "boolean",
      default: "false",
      note: "Controlled visibility, like `Drawer`, `Popover` and `Tooltip` — and like the web peer.",
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
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "State report — fired with `false` alongside `onDismiss`, like the web peer.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Dismissal action — what happens when the dialog goes away. State itself is `open`/`onOpenChange`.",
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
