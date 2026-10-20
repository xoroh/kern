import type { ComponentDoc } from "../types";

export const entitySheet: ComponentDoc = {
  slug: "entity-sheet",
  name: "Entity sheet",
  oneLiner:
    "The entity sheet is the read-mostly detail surface for one record — a title, its fields, and at most one action.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "EntitySheet",
    variants: [],
    // Ships `--sys-elevation-level1` (modal sheet; M3's "bottom sheet
    // (modal)" rests at level 1). No registry row is keyed under this slug, so
    // the claim is reported as unasserted — a registry gap, not a page gap.
    // Claimed level 1, unasserted by the elevation table — see the gap report.
    elevationBacked: false,
    elevation: 1,
  },
  parts: ["EntitySheet"],
  // The entity sheet is a MODAL sheet: it is hosted in the shared dialog
  // shell, so it traps focus, takes Escape and returns focus to whatever
  // opened it. The fields themselves are text — the one action slot is the
  // only control the sheet contributes.
  keyboard: [
    {
      key: "Escape",
      action: "Closes the sheet; focus returns to the element that opened it.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Trapped inside the sheet while it is open; the page behind it is inert.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused control — the one action slot, and the close control the shell renders.",
    },
  ],
  customization: {
    supported: [
      "`title` and `subtitle` are the record's identity; `fields` is the data, rendered as a description list.",
      "`field.data` switches the value to the monospaced data treatment — for ids, hashes and other machine-shaped values.",
      "`action` is the ONE primary action slot; `className` is merged after the sheet's surface classes.",
    ],
    notSupported: [
      "There is no editing. Field values are text, not inputs — an editable record is a form in a `BottomSheet`, not this.",
      "No actions ROW and no secondary actions. The spec caps the surface at one action; the rest belong in the record's own screen.",
      "Fields are label-value pairs, not a layout. Two-column or grouped arrangements are a host composition.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "The record's name — rendered as the dialog's title element AND used to label the surface.",
    },
    {
      name: "subtitle",
      type: "string",
      note: "A supporting line under the title: a status, a type, a timestamp.",
    },
    {
      name: "fields",
      type: "readonly EntityField[]",
      note: "The data: `{ label, value, data? }` per row. The `data` flag renders the value in the monospaced treatment.",
    },
    {
      name: "action",
      type: "ReactNode",
      note: "At most one primary action, right-aligned. The spec's guidance is one; the slot does not grow a toolbar.",
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
      name: "children",
      type: "ReactNode",
      note: "Extra body content between the fields and the action — the escape hatch when the field list is not the whole story.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "Required by the shell's type, then OVERRIDDEN at render: the sheet labels the surface from `title`. Pass the same string.",
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
    {
      name: "ref",
      type: "Ref<HTMLDivElement> | undefined",
      note: "Ref to the rendered sheet popup.",
    },
    {
      name: "dir",
      type: "A11yDir | undefined",
      note: "Text direction for the sheet, passed through verbatim. When absent no `dir` renders and the sheet inherits the document direction — never a hardcoded fallback.",
    },
  ],
  aria: [
    "The fields are a real description list — `dl`, `dt`, `dd` — so the label-value relationship is structural, not visual.",
    "The title is the dialog's title element, so the record's name is what gets announced on open.",
    'Everything else inherits `SheetSurface`\'s contract: `role="dialog"`, `aria-modal` set by hand over the primitive, scrim and Escape to dismiss, focus returned to the trigger.',
  ],
};
