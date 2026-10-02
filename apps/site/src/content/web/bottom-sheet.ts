import type { ComponentDoc } from "../types";

export const bottomSheet: ComponentDoc = {
  slug: "bottom-sheet",
  name: "Bottom sheet",
  oneLiner:
    "The bottom sheet is a modal surface anchored to the bottom edge: content, an optional heading and a visible way out.",
  features:
    "Reach for a bottom sheet when a task wants the bottom of the screen and the rest of the page should wait: a confirmation, a short form, a piece of detail that owns the moment. It hosts through `SheetSurface`, so scrim press, Escape and focus return come with it — the sheet does not re-implement dismissal, it inherits the one place that owns it. The heading is optional (the surface is labelled either way) and the close control is opt-in through `onClose`, which is M3's dismissal affordance for the sheet. Its height is capped so a sheet never swallows the screen, and it rests at the modal elevation — it sits above content, and says so.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "BottomSheet",
    variants: [],
    // Ships `--md-sys-elevation-level1`, and M3's "bottom sheet (modal)" row
    // rests at level 1 (the `sheet` row in m3-elevation.ts permits 0/1). No
    // row is keyed under this slug, so check:docs reports the claim as
    // unasserted — a registry gap, not a page gap.
    // Claimed level 1, unasserted by the elevation table — see the gap report.
    elevationBacked: false,
    elevation: 1,
  },
  parts: ["BottomSheet"],
  customization: {
    supported: [
      "`label` names the surface for assistive technology even when `title` is omitted.",
      "`onClose` renders the visible close control; omit it and dismissal is scrim and Escape only.",
      "`className` is passed through and merged after the sheet's own surface classes.",
    ],
    notSupported: [
      "There are no detents. A sheet that resizes to a snap point is the `SnapSheet`; this one is one height with a cap.",
      "No drag behaviour — this is a web sheet, and its dismissal is press, Escape and the close control.",
      "There is no action-bar slot contract beyond `children`: what sits at the bottom of the sheet is your composition.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      required: true,
      note: "The surface's accessible name — required even when `title` is absent, so the dialog is never anonymous.",
    },
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state, handed to the `SheetSurface` shell.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      note: "Initial state when uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires on every dismissal path — scrim, Escape and the close control all end here.",
    },
    {
      name: "title",
      type: "string",
      note: "Optional heading, rendered as the dialog's title element. The surface is labelled by `label` regardless.",
    },
    {
      name: "onClose",
      type: "() => void",
      note: 'Renders the visible close control (its accessible name is "Close") when present. The control is the affordance; the shell\'s dismissal is what closes.',
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The sheet's body, between the heading and the close control's layer.",
    },
    {
      name: "className",
      type: "string",
      note: "Passed through and merged after the sheet's surface classes.",
    },
    {
      name: "testID",
      type: "string",
      note: "Test hook, forwarded to the shell — which defaults it to `kern-sheet-surface` when omitted.",
    },
  ],
  aria: [
    'Inherits `SheetSurface`\'s contract whole: `role="dialog"`, `aria-modal` set by hand over the primitive, scrim press and Escape to dismiss, focus returned to the trigger.',
    "The title is a real dialog title element when present, so the sheet is announced by its heading rather than by its label alone.",
    "The close control is a labelled button — a glyph that names itself — and it exists only when `onClose` is passed, so a sheet can never render a dead close affordance.",
  ],
};
