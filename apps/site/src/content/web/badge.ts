import type { ComponentDoc } from "../types";

export const badge: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  oneLiner:
    "Badges flag a small, countable change on something that already has a label.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/badges",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Badge",
    variants: ["variant: dot · count"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["Badge"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // M2: a badge MARKS something else. It is a `role="img"` span — it takes
  // no focus and answers no key, so the ARIA contract below is the whole
  // story.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes.",
      "The colours are the error roles, so a theme retints every badge at once.",
      "`variant` switches between the dot and the count forms.",
    ],
    notSupported: [
      "There is no `color` or `tone` prop. A badge is the error roles by construction; a different meaning needs a different component.",
      "There is no `max` or `overflow` prop. If the count can get large, cap it in your own code before rendering.",
      "There is no `placement` prop. A badge is inline content, so where it sits relative to its label is the layout's job.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"dot" | "count"',
      default: '"count"',
      note: "Dot announces that something changed; count says how much.",
    },
    {
      name: "aria-label",
      type: "string",
      note: "The accessible name. A dot with no label is hidden from assistive tech entirely, since it conveys nothing on its own.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant classes.",
    },
    {
      name: "max",
      type: "number | undefined",
      note: "Truncation ceiling for numeric counts. Past `max` the badge shows `{max}+` (M3: 99+) while the accessible name keeps the full count. Non-numeric children render untouched.",
    },
  ],
  aria: [
    'The badge is `role="img"`, so a label on it is announced as a single unit rather than as loose text.',
    "A dot variant with no `aria-label` is marked `aria-hidden` — it is treated as decoration and dropped from the accessibility tree, which is the honest outcome for a shape with no name.",
    "Because of that, a dot badge is never the only carrier of the information. Put the fact in the thing the badge sits on.",
  ],
};
