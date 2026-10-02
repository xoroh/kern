import type { ComponentDoc } from "../types";

export const bottomSheetPicker: ComponentDoc = {
  slug: "bottom-sheet-picker",
  name: "Bottom sheet picker",
  oneLiner:
    "The bottom sheet picker is a selector in a sheet — a titled list of options where the selection is announced, not just tinted.",
  features:
    "Reach for a picker sheet when choosing is the whole task and the options need more room than a select: a list with supporting lines, a set that wants the bottom of the screen. The options are data — value, label, an optional supporting line and a disabled flag — and the list is a real listbox: each option reports its selected state, and the check mark carries that state alongside the tint so the selection never depends on colour alone. `multiple` exposes multi-select semantics on the list; the selection itself is the host's, reported through `onSelect`. It hosts through `SheetSurface`, so scrim, Escape and focus return come with it.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "BottomSheetPicker",
    variants: [],
    // Ships `--md-sys-elevation-level1` (modal sheet; M3's "bottom sheet
    // (modal)" rests at level 1). No registry row is keyed under this slug, so
    // the claim is reported as unasserted — a registry gap, not a page gap.
    elevation: 1,
  },
  parts: ["BottomSheetPicker"],
  customization: {
    supported: [
      "`options` is data: `{ value, label, supporting?, disabled? }` per row.",
      "`value` marks the current selection; `onSelect` reports the pick — the sheet does not store the selection.",
      "`multiple` switches the list to multi-select semantics. `className` is merged after the sheet's surface classes.",
    ],
    notSupported: [
      "There is no search or typeahead. A filterable picker is a composed list — this one is a short set, scanned whole.",
      "No multi-select STATE: `multiple` announces multi-select semantics, but the toggling and the set are the host's — `onSelect` reports one value at a time.",
      "Options are label-value rows, not slots: an option with custom layout is a `BottomSheet` with your own body.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "The picker's heading — rendered as the dialog's title element AND used as the listbox's accessible name.",
    },
    {
      name: "options",
      type: "readonly PickerOption[]",
      required: true,
      note: "The set: `{ value, label, supporting?, disabled? }`. Disabled options stay visible and inert.",
    },
    {
      name: "value",
      type: "string",
      note: "The current selection's value. Marked with a check AND `aria-selected` — never the tint alone.",
    },
    {
      name: "multiple",
      type: "boolean",
      default: "false",
      note: "Exposes `aria-multiselectable` on the list. Selection bookkeeping stays the host's — `onSelect` reports one value per press.",
    },
    {
      name: "onSelect",
      type: "(value: string) => void",
      required: true,
      note: "Reports the picked option's value. Closing the sheet after a pick is the host's call via `onOpenChange`.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "Required by the shell's type, then OVERRIDDEN at render: the sheet labels the surface from `title`. Pass the same string.",
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
    "The list is a real `listbox` with `option` rows reporting `aria-selected` — the selection is structural, and `aria-multiselectable` appears only when `multiple` is set.",
    "The check mark carries selection alongside the tint: a reader who cannot distinguish the selected row's fill still gets the state from the role and the check.",
    "Everything else inherits `SheetSurface`'s contract: `role=\"dialog\"`, `aria-modal` set by hand over the primitive, scrim and Escape to dismiss, focus returned to the trigger.",
  ],
};
