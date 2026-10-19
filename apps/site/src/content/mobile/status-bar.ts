import type { ComponentDoc } from "../types";

export const statusBar: ComponentDoc = {
  slug: "status-bar",
  name: "Status bar",
  oneLiner:
    "Status bars hold one centered status with leading and trailing slots.",
  features:
    "Reach for a status bar when a screen needs a persistent status strip outside the content region: sync state, connection, draft count. The centered child is the status text; leading and trailing are slots for indicators or actions. It announces as a summary landmark, so a screen reader can find the status without entering the content. What the web blocks catalog composes from parts, native ships as one strip.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web blocks catalog ships the same strip (`StatusBar` in the
    // search-bar block family). Documented there.
    nativePeer: "StatusBar",
    variants: [],
    elevation: "surface",
  },
  parts: ["StatusBar"],
  usage: {
    do: [
      "Keep the centered child to one short status — the strip is `32dp` tall and truncates to one line.",
      "Put indicators in `leading` and actions in `trailing`; the middle belongs to the status.",
      'Name it with `accessibilityLabel` where "Status" would not say which status.',
    ],
    dont: [
      "Don't load navigation into the strip — leading and trailing are indicators and actions, not destinations.",
      "Don't duplicate the status in the content region — one status, one place.",
    ],
  },
  tokens: [
    {
      element: "Strip",
      state: "resting",
      token: "theme.color.surfaceContainer",
      value: "surfaceContainer, minHeight 32, 1px outlineVariant top rule",
    },
  ],
  faq: [
    {
      q: "Status bar or banner?",
      a: "A persistent strip outside the content means status bar; a report inside the screen means banner. Chrome versus content.",
    },
  ],
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
