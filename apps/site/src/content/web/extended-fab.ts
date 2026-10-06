import type { ComponentDoc } from "../types";

export const extendedFab: ComponentDoc = {
  slug: "extended-fab",
  name: "Extended FAB",
  oneLiner:
    "Extended FABs are the labelled floating action button — the one primary action, with its name beside its icon.",
  features:
    "Reach for an extended FAB when the screen's single most important action is not obvious from its icon alone. The label is the whole reason to choose this over a plain FAB: it says what the action does. It collapses to the icon-only form as the screen scrolls, which is Material 3's behaviour, and since the component cannot see where the host is scrolled to, the trigger is an explicit handle you call rather than a gesture kern would have to invent. Keep it to one per screen — two primary actions are not two primary actions, they are two buttons.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/extended-fab",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ExtendedFab",
    // No variant axis. Collapsed or expanded is state, not treatment.
    variants: [],
    // Material 3 places the "extended fab" at resting level 3, and the
    // component ships `--md-sys-elevation-level3`.
    elevation: 3,
  },
  parts: ["ExtendedFab"],
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
      name: "collapsed",
      type: "boolean",
      note: "Controlled collapse state. Omit for uncontrolled.",
    },
    {
      name: "defaultCollapsed",
      type: "boolean",
      note: "Initial state when uncontrolled.",
    },
    {
      name: "onCollapsedChange",
      type: "(collapsed: boolean) => void",
      note: "Fires when it collapses or expands.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the FAB's own classes.",
    },
  ],
  aria: [
    "The FAB is a real button, so it is reachable and activatable by keyboard.",
    "The label is the accessible name in both states, so collapsing to an icon does not remove its name — which is the failure mode of every hand-rolled icon-only button.",
    "Collapse is a visual change only; nothing about the action's identity changes, so no announcement is needed when it happens.",
  ],
};
