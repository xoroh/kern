import type { ComponentDoc } from "../types";

export const actionSheet: ComponentDoc = {
  slug: "action-sheet",
  name: "Action sheet",
  oneLiner:
    'The action sheet is a titled list of actions in a bottom sheet — the one surface for "what do you want to do with this?"',
  features:
    "Reach for an action sheet when the next step is a choice among a short list of actions on one subject: share, duplicate, archive, delete. The actions are data — id, label, the callback and a disabled flag — so the list renders identically wherever the sheet opens, and a disabled action stays visible and inert rather than vanishing. `children` is there for the case where the list is not the whole body, and the sheet hosts through `SheetSurface` like the rest of the family: scrim, Escape and focus return are inherited, not re-implemented.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ActionSheet",
    variants: [],
    // Ships `--md-sys-elevation-level1` (modal sheet; M3's "bottom sheet
    // (modal)" rests at level 1). No registry row is keyed under this slug, so
    // the claim is reported as unasserted — a registry gap, not a page gap.
    // Claimed level 1, but `kern-elevation.ts` has no row for this component,
    // so nothing asserts it. `elevationBacked: false` makes the strip render
    // the claim as a warning rather than a measurement.
    elevationBacked: false,
    elevation: 1,
  },
  parts: ["ActionSheet"],
  customization: {
    supported: [
      "`actions` is data: `{ id, label, onSelect, disabled? }` per row.",
      "`children` renders after the action list — the escape hatch for a summary or a footnote.",
      "`className` is passed through and merged after the sheet's surface classes.",
    ],
    notSupported: [
      'There is no destructive axis. A dangerous action is a LABEL problem — say "Delete" — and belongs to an alert dialog when it needs confirming.',
      "No icons or supporting lines on actions. An action row is one label; richer rows are the `MenuSheet`'s groups.",
      "The sheet does not close on pick — `onSelect` is the action and closing is the host's call via `onOpenChange`.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "The question the sheet answers — rendered as the dialog's title element and used to label the surface.",
    },
    {
      name: "actions",
      type: "readonly ActionSheetAction[]",
      required: true,
      note: "The list: `{ id, label, onSelect, disabled? }`. Disabled actions render inert, not hidden.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "Required by the shell's type, then OVERRIDDEN at render: the sheet labels the surface from `title`. Pass the same string.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Rendered after the action list — a summary, a footnote, anything the choice needs beside it.",
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
      note: "Fires on every dismissal path — scrim and Escape both end here.",
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
    "The list is a plain list of buttons: each action is named by its label and reports its own disabled state — the list adds no selection semantics, because there is no selection.",
    "The title is the dialog's title element, so the question is what gets announced on open.",
    'Everything else inherits `SheetSurface`\'s contract: `role="dialog"`, `aria-modal` set by hand over the primitive, scrim and Escape to dismiss, focus returned to the trigger.',
  ],
};
