import type { ComponentDoc } from "../types";

export const alertDialog: ComponentDoc = {
  slug: "alert-dialog",
  name: "Alert dialog",
  oneLiner:
    "Alert dialogs interrupt for a decision that must be made before anything else continues.",
  features:
    'Reach for an alert dialog when the answer changes what happens next and cannot be deferred: confirming a deletion, accepting terms, discarding unsaved work. It is modal on purpose — the rest of the page waits. Name the consequence in the description, not just the action, because "Delete" alone does not say what goes. Offer the safe choice first and give the destructive one its own weight. If the choice can be made later, it is a banner or a snackbar with an undo, not an interruption.',
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "AlertDialog",
    variants: [],
    // Material 3 assigns "dialogs (modal)" resting level 3, and the surface
    // ships `--md-sys-elevation-level3` to match. Asserted against the row.
    elevation: 3,
  },
  parts: [
    "AlertDialog",
    "AlertDialogRoot",
    "AlertDialogTrigger",
    "AlertDialogContent",
    "AlertDialogTitle",
    "AlertDialogDescription",
    "AlertDialogClose",
  ],
  anatomy: [
    {
      name: "AlertDialogRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    {
      name: "AlertDialogTrigger",
      role: "The control that raises the alert. Focus returns here when it closes.",
    },
    {
      name: "AlertDialogContent",
      role: "The dialog surface. Portals to the end of the document, renders the backdrop and traps focus.",
    },
    {
      name: "AlertDialogTitle",
      role: "The question being decided. Becomes the dialog's accessible name.",
    },
    {
      name: "AlertDialogDescription",
      role: "What the decision costs — the part that says what goes if the answer is yes.",
    },
    {
      name: "AlertDialogClose",
      role: "Dismisses the dialog from inside it.",
    },
    {
      name: "AlertDialog",
      role: "The namespace object: all of the parts above.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The surface is capped in width so the description is readable rather than stretched.",
      "Colour of the consequences comes from the roles the actions use, not from a dialog prop.",
    ],
    notSupported: [
      "There is no `severity` or `tone` prop. Whether this is dangerous is the caller's to say in the actions and their roles.",
      "There is no `dismissible` prop. Backdrop and Escape behaviour come from the primitive and are not tunable — an alert that can be waved away is not an alert.",
      "There is no `size` prop. One width, capped so the text stays readable.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `AlertDialogRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and backdrop clicks.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On the trigger or on an action button.",
    },
  ],
  aria: [
    "The surface is a modal dialog with `aria-modal`, so the page behind it is announced as inert rather than merely covered.",
    "`AlertDialogTitle` is the accessible name and `AlertDialogDescription` the description, so the decision is announced with its consequence.",
    "Focus is trapped inside while open and returns to the trigger on close — nobody is dropped back at the top of the page.",
    "It interrupts on purpose. That is the tool's whole job, and the reason not to use it for anything that can wait.",
  ],
};
