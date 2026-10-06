import type { ComponentDoc } from "../types";

export const dialog: ComponentDoc = {
  slug: "dialog",
  name: "Dialog",
  oneLiner:
    "A dialog asks people to complete a focused task before they carry on with the rest of the app.",
  features:
    "Reach for a dialog when the next step needs a decision and the decision is short: confirming a deletion, choosing between two paths, entering one value. It interrupts on purpose, so keep it to a title, enough description to make the decision safe, and one or two actions. If the task has more than a few fields, or people need to see the screen behind it while they work, use a full-height route instead — an interrupted screen is the wrong place for long work. Everything else on the page is inert while it is open.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/dialogs",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Dialog",
    // No variant axis. Dialog is one treatment; its shape comes from width,
    // which is a layout concern rather than a variant.
    variants: [],
    // M3's row "dialogs (modal)" rests at level 3. The full-screen dialog is a
    // different row at level 0, and `Dialog` here is the modal form.
    elevation: 3,
  },
  parts: [
    "Dialog",
    "DialogRoot",
    "DialogTrigger",
    "DialogContent",
    "DialogTitle",
    "DialogDescription",
    "DialogClose",
  ],
  anatomy: [
    {
      name: "DialogRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it from outside.",
    },
    {
      name: "DialogTrigger",
      role: "The element that opens the dialog. Carries the expanded state for assistive tech.",
    },
    {
      name: "DialogContent",
      role: "The surface itself. Portals to the end of the document, renders the backdrop, traps focus and marks the rest of the page inert.",
    },
    { name: "DialogTitle", role: "The accessible name of the dialog." },
    {
      name: "DialogDescription",
      role: "The body text. Wired to `aria-describedby` so it is announced with the title.",
    },
    { name: "DialogClose", role: "Closes the dialog from inside it." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Width is `--md-sys-shape-corner-medium`-shaped and capped so it never spans the viewport; override the width with `className` on `DialogContent`.",
      "The surface, outline and elevation all come from system roles, so a theme moves the dialog with everything else.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. A full-screen dialog is a different surface with a different resting elevation, not a size of this one.",
      "There is no `dismissible` prop. Backdrop and Escape behaviour come from the primitive and are not tunable per dialog.",
      "Focus order inside the dialog is document order. There is no prop to move initial focus off the first control.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `DialogRoot`. Omit it for uncontrolled.",
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
  ],
  aria: [
    'The dialog surface sets `role="dialog"` and `aria-modal="true"`. The modal marker is set by kern rather than left to the primitive, because a modal surface that does not announce itself as modal is a trap to a screen reader.',
    "`DialogTitle` becomes the accessible name; `DialogDescription` becomes the description.",
    "Focus is trapped inside the dialog while it is open and the rest of the page is marked inert.",
    "Escape closes the dialog and focus returns to the element that opened it.",
  ],
};
