import type { ComponentDoc } from "../types";

export const bootIndicator: ComponentDoc = {
  slug: "boot-indicator",
  name: "Boot indicator",
  oneLiner:
    "Boot indicators are the branded loading surface shown while the app itself starts.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    // Native has no `BootIndicator` export; its boot surface is the inverse
    // tone rendered by the host. Recorded in docs/parity-contract.md.
    nativePeer: "none",
    variants: ["tone: surface · inverse · size · shapes"],
    elevation: "surface",
  },
  parts: ["BootIndicator"],
  customization: {
    supported: [
      '`tone="surface"` matches the pre-script critical loader and is the web default; `tone="inverse"` matches the native boot look.',
      '`signature` renders a wordmark under the shape trio, for the boot screen\'s "from …" line.',
      "`shapes` and `loaderStyle` pick the heritage shape set and the indicator, so the brand is data rather than a hard-coded illustration.",
      "`tenantId` overrides the brand variant, and an unknown id fails loudly.",
    ],
    notSupported: [
      "There is no `progress` prop. Boot is indeterminate by nature — the app is either ready or it is not.",
      "There is no `duration` or `minDuration` prop. How long it shows is how long booting takes; a fake minimum is a delay pretending to be a promise.",
      "There is no `fullscreen` prop. It is the boot surface by definition; a region still coming is `PageLoader`.",
    ],
  },
  api: [
    {
      name: "tone",
      type: "FeedbackTone",
      note: '`"surface"` matches the pre-script critical loader and is the web default; `"inverse"` matches the native boot look. Picking the matching tone is what keeps the handoff from jumping.',
    },
    {
      name: "signature",
      type: "string",
      note: 'The wordmark under the shape trio — the boot screen\'s "from …" line. Boot screens only.',
    },
    {
      name: "label",
      type: "string",
      note: "The accessible name of the loading surface.",
    },
    {
      name: "shapes",
      type: "readonly FeedbackShapeKind[]",
      note: "The heritage shape set. The same trio the critical loader draws, which is what makes the handoff continuous.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle",
      note: "Which indicator sits within the surface.",
    },
    {
      name: "tenantId",
      type: "string",
      note: "Brand variant override. An unknown id FAILS LOUDLY rather than falling back quietly.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the indicator's own classes.",
    },
    {
      name: "size",
      type: '"sm" | "lg" | "md" | undefined',
      note: "Density size. Defaults to the large boot treatment.",
    },
  ],
  aria: [
    "The surface announces that the application is starting; the shape trio is decoration beside that.",
    "The root should carry `aria-busy` until the app is ready, so the state is what a screen reader reports.",
    "It takes no focus and does not announce itself — a boot screen is a state, not an event.",
    "Material 3 publishes no splash-screen spec, so this is a branded kern surface. The page states that rather than implying conformance with something that does not exist.",
  ],
};
