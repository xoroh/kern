import type { ComponentDoc } from "../types";

export const sheetSurface: ComponentDoc = {
  slug: "sheet-surface",
  name: "Sheet surface",
  oneLiner:
    "Sheet surface is the shared modal and scrim shell — the one place a kern sheet gets its dismissal path.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SheetSurface",
    variants: [],
    // The shell itself carries no elevation token — the hosts apply their own
    // level-1 shadow. It is not an M3 component and claims no row.
    elevation: "surface",
  },
  parts: ["SheetSurface"],
  keyboard: [
    {
      key: "Escape",
      action:
        "Closes the surface and reports it through `onOpenChange`; focus returns to whatever opened it.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Trapped inside the surface while it is open. The surface is a modal dialog — the page behind it is inert and it says so with `aria-modal`.",
    },
  ],
  customization: {
    supported: [
      "`open` / `defaultOpen` / `onOpenChange` are the controlled-uncontrolled pair for the modal.",
      "`label` is required — a dialog must be nameable, and the surface refuses to be anonymous.",
      "`className` is passed through and merged after the base surface classes.",
    ],
    notSupported: [
      "There is no title slot. Headings are the host's: `BottomSheet` and friends render their own titles, and a shell that owned one would fight them.",
      "There is no placement, size or anchoring knob — the shell is bottom-anchored and the hosts shape the surface inside it.",
      "It is not an M3 component. It is a kern name for the shared shell; no spec row backs it and none is claimed.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state for the modal.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      note: "Initial state when uncontrolled. Omit `open` to let the shell own it.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires on every path out — scrim press and Escape both route through the dialog primitive's change callback.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "The surface's accessible name. Required: a dialog must be nameable, so the prop has no default.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The sheet's body. The shell renders no structure of its own around it.",
    },
    {
      name: "className",
      type: "string",
      note: "Passed through and merged after the base surface classes — the host shapes the surface.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-sheet-surface"',
      note: "Test hook for the popup surface; the backdrop carries its own derived slot.",
    },
    {
      name: "ref",
      type: "Ref<HTMLDivElement> | undefined",
      note: "Ref to the rendered surface popup.",
    },
    {
      name: "dir",
      type: "A11yDir | undefined",
      note: "Text direction for the surface, passed through verbatim. When absent no `dir` renders and the surface inherits the document direction — never a hardcoded fallback.",
    },
  ],
  aria: [
    'The surface is `role="dialog"` with `aria-modal="true"` — and the modal flag is set BY HAND: Base UI\'s dialog popup traps focus and inerts the page but emits no `aria-modal` (measured), which left the visual and accessibility trees disagreeing about whether the user is trapped.',
    "Dismissal is one contract in one place: scrim press and Escape both close, and focus returns to the trigger — every sheet below inherits this rather than re-implementing it.",
    "The scrim is a real backdrop element, not a click handler on the page: a sheet cannot close because a stray click landed under it.",
  ],
};
