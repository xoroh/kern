import type { ComponentDoc } from "../types";

export const snapSheet: ComponentDoc = {
  slug: "snap-sheet",
  name: "Snap sheet",
  oneLiner:
    "The snap sheet is a bottom sheet with detents — a modal surface that occupies one of a declared set of heights.",
  features:
    "Reach for a snap sheet when the sheet has natural resting heights: a half-expanded preview and a full detail, a peek and a read. The detents are fractions of the viewport, and the sheet clamps the requested index into range — an out-of-range index cannot blank the sheet, and an empty detent list falls back to one middle height. The detent control itself is a VALUE, not a toggle: it announces its position in the set, so the same control reads correctly to anyone who cannot see the height change. Like every modal sheet here it hosts through `SheetSurface`, so scrim, Escape and focus return come with it.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SnapSheet",
    variants: [],
    // Ships `--md-sys-elevation-level1` (modal sheet, M3 "bottom sheet (modal)"
    // at level 1). No registry row is keyed under this slug, so the claim is
    // reported as unasserted — a registry gap, not a page gap.
    elevation: 1,
  },
  parts: ["SnapSheet"],
  customization: {
    supported: [
      "`snapPoints` declares the detents as viewport fractions; `index` / `onIndexChange` are the controlled-uncontrolled pair for which one is active.",
      "`label` names both the surface and the detent control, which is labelled from it.",
      "`className` is passed through and merged after the sheet's surface classes.",
    ],
    notSupported: [
      "There is no drag-to-resize. The detent control cycles the set; a gesture-driven engine can plug into `onIndexChange` later without an API change.",
      "Detents are heights, not content states — the same children render at every detent. A peek that shows DIFFERENT content is a host decision.",
      "No intermediate or free heights: the sheet is at one detent or another, never between.",
    ],
  },
  api: [
    {
      name: "snapPoints",
      type: "readonly number[]",
      required: true,
      note: "The detents, as fractions of viewport height. An empty list falls back to one middle height rather than a zero-height sheet.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "The surface's accessible name, and the stem of the detent control's label.",
    },
    {
      name: "index",
      type: "number",
      default: "0",
      note: "Controlled detent index. Clamped into range — an out-of-range index can never blank the sheet.",
    },
    {
      name: "onIndexChange",
      type: "(index: number) => void",
      note: "Fires with the next detent index. Pressing the detent control cycles through the set and wraps.",
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
      note: "The sheet's body, height-capped to the active detent. The same content renders at every detent.",
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
    "The detent control is a button carrying `aria-valuenow`, `aria-valuemin` and `aria-valuemax` — the web equivalent of the native adjustable role: the height is a VALUE the user changes, and it is announced as one.",
    "The control's label is \"<label>, snap position\" — the sheet's name travels with the control, so it is never \"button, 2 of 3\" with no context.",
    "Everything else inherits `SheetSurface`'s contract: `role=\"dialog\"`, `aria-modal` set by hand over the primitive, scrim and Escape to dismiss, focus returned to the trigger.",
  ],
};
