import type { ComponentDoc } from "../types";

export const link: ComponentDoc = {
  slug: "link",
  name: "Link",
  oneLiner:
    "Links are anchors that can be pointed at your host router, so kern never hardcodes one.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier — web routing seam, no native counterpart expected.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["LinkProvider", "Link"],
  customization: {
    supported: [
      "`LinkProvider` injects the host router's link component, so kern renders YOUR navigation.",
      "`Link` takes `to` (router location) or `href` (plain URL) plus the usual anchor attributes.",
      "`useLinkComponent()` reads the injected component anywhere below the provider.",
    ],
    notSupported: [
      "kern does not bundle a router and does not choose one. That is the host's decision and this seam is where it is made.",
      "There is no `variant` or `underline` prop. Link styling is the anchor's.",
    ],
  },
  api: [
    {
      name: "to",
      type: "string",
      note: "Router location, for hosts whose router uses one. `href` is still available for a plain URL.",
    },
  ],
  aria: [
    "It renders a real anchor by default, so it is focusable, activatable and announced as a link without any help.",
    "When a host router supplies its component, that component is responsible for the anchor's semantics — the seam does not change what the user gets, only who renders it.",
    "`LinkProps` extends the real anchor attributes, so `aria-*`, `rel` and `target` pass through untouched.",
  ],
};
