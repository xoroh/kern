import type { ComponentDoc } from "../types";

export const statusPill: ComponentDoc = {
  slug: "status-pill",
  name: "Status pill",
  oneLiner: "Status pill is the one-line status label on the tone registry.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "StatusPill",
    variants: [
      "tone: primary · secondary · success · warning · error · info · neutral",
      "emphasis: soft · solid",
      "density: compact · medium",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["StatusPill"],
  // M2: this export renders no focusable element of its own — it takes
  // no focus and answers no key — so an empty accessibility section
  // is a fact, not a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`tone` picks one of the seven registry tones — container roles by default, so light, dark and contrast modes follow with no conditionals.",
      "`emphasis` solid fills with the tone roles for counts that must read at a glance; soft is the quiet default.",
      "`icon` takes a KernIcon-registry node and hides the dot; `dot` forces the dot off when the icon carries the meaning.",
      "`density` compact fits table status-chip cells; medium is the default row height.",
    ],
    notSupported: [
      "There is no `onClick` or action. A pill marks; it never activates — a status that navigates is a link or a button.",
      "There is no hex or utility colour. A status with no registry tone is a WP6 addendum, not a local override.",
      "There is no `max` or truncation prop. The label is the host's string; keep it to a word or two.",
    ],
  },
  api: [
    {
      name: "tone",
      type: '"primary" | "secondary" | "success" | "warning" | "error" | "info" | "neutral"',
      note: "Registry tone. Default `neutral` (the quiet container).",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Leading slot: a KernIcon-registry icon. Dot shows when no icon.",
    },
    {
      name: "dot",
      type: "boolean | undefined",
      note: "Force-hide the dot (an icon carries the meaning instead).",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
    },
  ],
};
