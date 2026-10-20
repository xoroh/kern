import type { ComponentDoc } from "../types";

export const statusBar: ComponentDoc = {
  slug: "status-bar",
  name: "Status bar",
  oneLiner:
    "Status bars hold one centered status with leading and trailing slots.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // The web blocks catalog ships the same strip (`StatusBar` in the
    // search-bar block family). Documented there.
    nativePeer: "StatusBar",
    variants: [],
    elevation: "surface",
  },
  parts: ["StatusBar"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // Non-interactive BY NATURE: the strip is a labelled summary landmark —
  // leading slot, centered status, trailing slot. It takes no focus, exposes
  // no state of its own and handles no key; the parity contract records the
  // same row as static content. The slots may hold actions, but those are the
  // caller's controls, not the strip's. So there is no keyboard contract to
  // document, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`children` is the centered status — a string renders as one-line label text, a node renders as-is.",
      "`leading` and `trailing` are indicator/action slots with an `8dp` inner rhythm.",
      '`accessibilityLabel` defaults to `"Status"` — rename it where that would not say which status.',
      "`style` is a React Native `ViewStyle` merged after the strip treatment.",
    ],
    notSupported: [
      "There is no `variant` or color treatment. The strip is chrome — it reads the same on every screen.",
      "The height is fixed at `32dp`. A taller strip is a banner, not a status bar.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "The centered status. A string renders as truncated label text and labels the center for assistive tech.",
    },
    {
      name: "leading",
      type: "ReactNode",
      note: "Indicator slot, left of the status.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "Action slot, right of the status.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      default: '"Status"',
      note: 'Names the summary landmark. Rename where "Status" would not say which status.',
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "Merged after the strip treatment.",
    },
    {
      name: "testID",
      type: "string",
      note: "Test hook for the strip.",
    },
  ],
  aria: [
    'Exposed as a `summary` named `"Status"` by default — a landmark a screen reader can jump to without entering the content.',
    "A string child carries its own label in the center; node children keep whatever semantics they bring.",
  ],
};
