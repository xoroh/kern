import type { ComponentDoc } from "../types";

export const sheet: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  oneLiner:
    "Sheets slide in from the side to hold a focused task beside the content behind them.",
  features:
    "Reach for a sheet when someone needs to work on one thing without losing the place they came from: editing a record's details beside its list, filtering results while keeping them in view. It is modal — the scrim and the focus trap mean the rest of the page waits — so keep the task short and give it a title that says what is being changed. It enters from the right by default; the left is for a document outline or a tree, where the edge matters. If the task belongs to a compact screen or should replace the view rather than accompany it, that is a dialog or a route.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Sheet",
    // No variant axis. The `side` a sheet enters from is placement, not
    // treatment.
    variants: [],
    // M3 tabulates sheets three ways — "bottom sheet (modal)" and "side sheet
    // (modal)" at level 1, "side sheet (docked)" at level 0 — so `variants`
    // permits [0, 1]. kern's sheet ships `--md-sys-elevation-level1`, the
    // modal level, which is what this page claims.
    elevation: 1,
  },
  parts: [
    "Sheet",
    "SheetRoot",
    "SheetTrigger",
    "SheetContent",
    "SheetTitle",
    "SheetDescription",
    "SheetClose",
  ],
  anatomy: [
    {
      name: "SheetRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    { name: "SheetTrigger", role: "The element that opens the sheet." },
    {
      name: "SheetContent",
      role: "The panel. Portals to the end of the document, renders the scrim and traps focus. Slides in from `side`.",
    },
    { name: "SheetTitle", role: "Names the sheet — what is being worked on." },
    {
      name: "SheetDescription",
      role: "Supporting line under the title, wired to `aria-describedby`.",
    },
    { name: "SheetClose", role: "Closes the sheet from inside it." },
    { name: "Sheet", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "`side` on `SheetContent` chooses which edge the panel enters from — `left` or `right`.",
      "The panel is full height and scrolls its own content, so a long form inside a sheet keeps working rather than growing past the viewport.",
    ],
    notSupported: [
      "There is no `size` or `width` prop. The panel width is capped so a sheet never covers the whole screen — override it with `className` if a wider one is genuinely needed.",
      "There is no `dismissible` prop. Scrim and Escape behaviour come from the primitive and are not tunable per sheet.",
      'There is no `side="top"` or `"bottom"`. A bottom-anchored panel is a different surface with a different M3 row.',
    ],
  },
  api: [
    {
      name: "side",
      type: '"left" | "right"',
      default: '"right"',
      note: "On `SheetContent`: which edge the panel enters from. Placement, not a variant.",
    },
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `SheetRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and scrim clicks.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
  ],
  aria: [
    'The panel sets `role="dialog"` and `aria-modal`, because a sheet inerts the page behind it and must say so.',
    "`SheetTitle` becomes the accessible name and `SheetDescription` the description.",
    "Focus is trapped inside the sheet while it is open and returns to the trigger when it closes.",
    "Escape dismisses it, and the scrim is clickable to dismiss — both reach `onOpenChange`, so a host keeps one state variable.",
  ],
};
