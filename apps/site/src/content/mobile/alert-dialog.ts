import type { ComponentDoc } from "../types";

export const alertDialog: ComponentDoc = {
  slug: "alert-dialog",
  name: "Alert dialog",
  oneLiner:
    "The alert dialog is a modal confirmation: a title, an optional message and the two decisions, one of them destructive.",
  features:
    "Reach for an alert dialog when the reader is about to cause something they cannot undo — delete, discard, sign out — and the decision deserves a stop. It is DATA, not composition: you pass a title, a message and the two labels, and the dialog owns the modal presentation, the scrim and the button row. The confirm button is painted in the error colour on purpose: the destructive action should look destructive before it happens. The dialog is a React Native `Modal`, so Android back is wired to cancel for free.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "AlertDialog",
    variants: [],
    // M3 "dialogs (modal)" rests at level 3; the web counterpart ships
    // `--md-sys-elevation-level3` to match. Asserted against the row.
    elevation: 3,
  },
  parts: ["AlertDialog"],
  customization: {
    supported: [
      "`title`, `message` and the two labels are plain props — the dialog is a decision, not a layout.",
      "`onConfirm` and `onCancel` both fire `onDismiss` afterwards, so one dismiss hook covers every exit path.",
      "`style` is a React Native `ViewStyle` for the card. `alertDialogStyles` is exported for the treatment without the component.",
    ],
    notSupported: [
      "There is no children slot and no custom button row. A dialog with arbitrary content is the `Dialog`, not this one.",
      'There is no third action and no checkbox ("don\'t ask again"). Two decisions is the whole contract.',
      "The confirm button is ALWAYS the error-coloured one. There is no `destructive` flag to forget — and no way to paint a destructive cancel.",
    ],
  },
  api: [
    {
      name: "visible",
      type: "boolean",
      required: true,
      note: "Drives the React Native `Modal`. The dialog does not own its own open state — the caller does.",
    },
    {
      name: "title",
      type: "string",
      required: true,
      note: "The decision stated as a headline. Rendered as the `title` text variant.",
    },
    {
      name: "message",
      type: "string",
      note: "The consequence, spelled out. Omit when the title says everything.",
    },
    {
      name: "confirmLabel",
      type: "string",
      default: '"Confirm"',
      note: "The destructive action's label, and its accessibility label.",
    },
    {
      name: "cancelLabel",
      type: "string",
      default: '"Cancel"',
      note: "The safe action's label, and its accessibility label.",
    },
    {
      name: "onConfirm",
      type: "() => void",
      note: "The destructive decision. Fires `onDismiss` after it.",
    },
    {
      name: "onCancel",
      type: "() => void",
      note: "The safe decision — including the Android back button, which the modal routes here. Fires `onDismiss` after it.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "One hook for every exit path: confirm, cancel and back all end here.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the card. `alertDialogStyles` is exported for the treatment without the component.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-alert-dialog"',
      note: "Test hook for the card.",
    },
  ],
  aria: [
    "The card reports `alert` role and the modal is `accessibilityViewIsModal`, so assistive technology stays inside the decision.",
    "Both buttons are `button` role pressables labelled by their labels — the confirmation is never announced as a bare icon.",
    "The Android back button is not a silent close: it fires the CANCEL path, so a back gesture can never confirm a destructive action.",
  ],
};
