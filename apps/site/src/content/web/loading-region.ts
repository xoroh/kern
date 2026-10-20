import type { ComponentDoc } from "../types";

export const loadingRegion: ComponentDoc = {
  slug: "loading-region",
  name: "Loading region",
  oneLiner:
    "Loading regions swap between content and a loading state as work starts and finishes.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    // Native has no `LoadingRegion`; its loading swap is composed in the
    // screen. Recorded in docs/parity-contract.md.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["LoadingRegion"],
  // The region is a SLOT for content, not a control: it takes no focus and
  // handles no keys. The busy state is announced through `aria-busy`, and
  // the fallback's own contract is the fallback's.
  nonInteractive: true,
  customization: {
    supported: [
      "`children` is what shows when ready and `fallback` is what shows while loading, so the wait can be a skeleton or anything else rather than one fixed spinner.",
      "`label` names the wait, defaulting to `Loading`.",
      "`className` wraps whichever of the two is showing.",
    ],
    notSupported: [
      "There is no `delay` prop. A region that hides its wait behind a delay is hiding the wait, not removing it.",
      "There is no `transition` prop. Moving between the two states is the caller's CSS.",
      "There is no `error` state. What to show when the work fails is the caller's, and it is usually more than a fallback.",
    ],
  },
  api: [
    {
      name: "loading",
      type: "boolean",
      note: "Which of the two is showing. This one flag is the whole interface.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "What shows when not loading.",
    },
    {
      name: "fallback",
      type: "ReactNode",
      note: "What shows while loading. Defaults to nothing — so a region with no fallback blanks rather than pretending to have content.",
    },
    {
      name: "label",
      type: "string",
      default: '"Loading"',
      note: "Names the wait.",
    },
    {
      name: "className",
      type: "string",
      note: "Wraps whichever state is showing.",
    },
  ],
  aria: [
    "The region should carry `aria-busy` while loading, so the state is what a screen reader reports rather than the swap itself.",
    "`label` names the wait; the fallback content is decoration beside it unless it says something itself.",
    "The swap does not move focus — a region refilling should not throw someone back to the top of the page.",
  ],
};
