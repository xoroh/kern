import type { ComponentDoc } from "../types";

export const extendedFab: ComponentDoc = {
  slug: "extended-fab",
  name: "Extended FAB",
  oneLiner:
    "Extended FABs are the labelled floating action button — the one primary action, with its name beside its icon.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/extended-fab",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ExtendedFab",
    // No variant axis. Collapsed or expanded is state, not treatment.
    variants: [],
    // Material 3 places the "extended fab" at resting level 3, and the
    // component ships `--sys-elevation-level3`.
    elevation: 3,
  },
  parts: ["ExtendedFab"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Runs the action. The fab is a real button, and the label is its accessible name in both states — so collapsing it to the icon never leaves it unnamed.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the fab. A disabled fab is skipped in the tab order.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the FAB's own classes.",
      "`collapsed` is controlled or uncontrolled, so the collapse can follow anything the host considers — scroll position, focus, a route change.",
      "The label doubles as the accessible name when collapsed, so the icon-only form still announces what it does.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One treatment — the emphasis is the point of a FAB at all.",
      "There is no `onScroll` or `collapseOnScroll` prop. The component cannot see the host's scroll position, so it will not pretend to; you drive `collapsed` and it follows.",
      "There is no `position` prop. Where a floating action button sits is the shell's, not the button's.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "The visible name beside the icon. Required, and it doubles as the accessible name once collapsed — so the icon-only form never becomes anonymous.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "The glyph. Always rendered; the label is what comes and goes.",
    },
    {
      name: "ref",
      type: "React.Ref<ExtendedFabHandle>",
      note: "An imperative handle — `collapse()`, `expand()`, `toggle()` — not a DOM ref. This is how Material 3's scroll-driven collapse is driven: the component cannot see the host's scroll, so the trigger is explicit rather than a gesture kern would have to invent.",
    },
    {
      name: "value",
      type: "boolean",
      note: "Controlled collapse state. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      type: "boolean",
      note: "Initial state when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(collapsed: boolean) => void",
      note: "Fires when it collapses or expands.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the FAB's own classes.",
    },
    {
      name: "size",
      type: "ExtendedFabSize | undefined",
      note: "M3 extended size. `small` is the current rendering, kept default; `medium` and `large` swap the expressive geometry.",
    },
  ],
  aria: [
    "The FAB is a real button, so it is reachable and activatable by keyboard.",
    "The label is the accessible name in both states, so collapsing to an icon does not remove its name — which is the failure mode of every hand-rolled icon-only button.",
    "Collapse is a visual change only; nothing about the action's identity changes, so no announcement is needed when it happens.",
  ],
};
