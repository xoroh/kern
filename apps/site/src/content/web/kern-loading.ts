import type { ComponentDoc } from "../types";

export const kernLoading: ComponentDoc = {
  slug: "kern-loading",
  name: "Kern loading",
  oneLiner:
    "Kern loading composes the four loading treatments behind one kind prop.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "KernLoading",
    variants: ["kind: skeleton-list · spinner · progress · shimmer-card"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernLoading"],
  // M2: this export renders no focusable element of its own — it takes
  // no focus and answers no key — so an empty keyboard contract
  // is a fact, not a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`kind` picks the treatment: `skeleton-list` rows with `count`, `spinner`, determinate-or-loop `progress`, or the `shimmer-card` dashboard composition.",
      "`label` names the wait — it defaults to Loading and is always announced.",
      "`count` sizes the skeleton list; rows never drop below one.",
    ],
    notSupported: [
      "There is no static number here. A measured scalar that is not a task is a `Meter`.",
      "`Loader`, `CircularProgress`, `Progress`, `Meter` and `PageLoader` stay separate — each owns a different M3 meaning, and collapsing them would mislabel waits to screen-reader users.",
      "There is no `size` prop. Each kind owns its own metrics.",
    ],
  },
  api: [
    {
      name: "kind",
      type: '"skeleton-list" | "spinner" | "progress" | "shimmer-card"',
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name announced while loading.",
    },
    {
      name: "count",
      type: "number | undefined",
      note: "Skeleton rows for `skeleton-list`.",
    },
    {
      name: "value",
      type: "number | null | undefined",
      note: "Progress 0–1 for `progress`. `null` (default) is the indeterminate loop for unknown durations.",
    },
  ],
  aria: [
    "Every kind renders a `status` region named by `label`, so the wait is announced however it is painted.",
    "Skeleton rows stay decorative inside the one region — a screen reader hears the wait once, not once per row.",
    "`progress` with a 0–1 value reports real progress; `null` renders the indeterminate loop for unknown durations.",
  ],
};
