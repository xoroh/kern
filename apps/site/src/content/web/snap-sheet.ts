import type { ComponentDoc } from "../types";

export const snapSheet: ComponentDoc = {
  slug: "snap-sheet",
  name: "Snap sheet",
  oneLiner:
    "The snap sheet is a bottom sheet with detents — a modal surface that occupies one of a declared set of heights.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SnapSheet",
    variants: [],
    // Ships `--sys-elevation-level1` (modal sheet, M3 "bottom sheet (modal)"
    // at level 1). No registry row is keyed under this slug, so the claim is
    // reported as unasserted — a registry gap, not a page gap.
    // Claimed level 1, unasserted by the elevation table — see the gap report.
    elevationBacked: false,
    elevation: 1,
  },
  parts: ["SnapSheet"],
  // The keyboard contract, read off the detent control: it is a slider, so
  // the height is announced as the value it is.
  keyboard: [
    {
      key: "ArrowRight / ArrowUp",
      action:
        "Moves the detent control to the next stop. The control is a slider with a real value, so the height it settled at is announced.",
    },
    {
      key: "ArrowLeft / ArrowDown",
      action: "Moves the detent control to the previous stop.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first or the last detent.",
    },
    {
      key: "Enter / Space",
      action:
        "Advances one detent — the same step as the right arrow. A slider that moved on arrows but ignored the activation keys would not be keyboard-operable.",
    },
    {
      key: "Escape",
      action:
        "Closes the sheet and returns the focus to the trigger — the dismissal path every kern sheet inherits from the shared shell.",
    },
  ],
  customization: {
    supported: [
      "`snapPoints` declares the detents as viewport fractions; `value` / `onValueChange` are the controlled-uncontrolled pair for which one is active.",
      "`label` names both the surface and the detent control, which is labelled from it.",
      "`className` is passed through and merged after the sheet's surface classes.",
    ],
    notSupported: [
      "There is no drag-to-resize. The detent control cycles the set; a gesture-driven engine can plug into `onValueChange` later without an API change.",
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
      name: "value",
      type: "number",
      default: "0",
      note: "Controlled detent index. Clamped into range — an out-of-range index can never blank the sheet.",
    },
    {
      name: "onValueChange",
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
    {
      name: "defaultValue",
      type: "number | undefined",
      note: "Index into `snapPoints` for the initial detent. Defaults to the first.",
    },
  ],
  aria: [
    "The detent control is a button carrying `aria-valuenow`, `aria-valuemin` and `aria-valuemax` — the web equivalent of the native adjustable role: the height is a VALUE the user changes, and it is announced as one.",
    'The control\'s label is "<label>, snap position" — the sheet\'s name travels with the control, so it is never "button, 2 of 3" with no context.',
    'Everything else inherits `SheetSurface`\'s contract: `role="dialog"`, `aria-modal` set by hand over the primitive, scrim and Escape to dismiss, focus returned to the trigger.',
  ],
};
