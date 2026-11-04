import type { ComponentDoc } from "../types";

export const mapMarker: ComponentDoc = {
  slug: "map-marker",
  name: "Map marker",
  oneLiner:
    "Map marker paints the positioned marker visual for the host engine.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "MapMarker",
    variants: [
      "kind: pin · vehicle · person · guest · stop",
      "tone: primary · secondary · success · warning · error · info · neutral",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["MapMarker"],
  // M2: this export renders no focusable element of its own — it takes
  // no focus and answers no key — so an empty accessibility section
  // is a fact, not a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`kind` picks the treatment: the default pin disc, host-icon vehicle and person, the consent guest, or the label-chip stop.",
      "`tone` resolves through the one tone registry, so markers agree with pills, discs and deltas everywhere.",
      "`selected` rings the marker in primary; `live` adds the static halo — no decorative motion, ever.",
      "The guest kind paints the consented live position: dashed consent ring while sharing, neutral tone with a paused dot on expiry.",
    ],
    notSupported: [
      "There is no engine inside. Coordinates, tiles, camera, clustering and gestures stay in the platform map system — the marker is positioned by the host's style, never by itself.",
      "There is no interaction. A marker that activates is the host engine's hit-target, not this visual.",
      "Consent state, expiry logic and streaming stay host-owned; the visual only paints the props it is given.",
    ],
  },
  api: [
    {
      name: "kind",
      type: "MapMarkerKind",
    },
    {
      name: "tone",
      type: "StatusTone",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Glyph slot: a KernIcon-registry icon or avatar. Default: tone dot.",
    },
    {
      name: "label",
      type: "string",
    },
    {
      name: "selected",
      type: "boolean",
    },
    {
      name: "live",
      type: "boolean",
      note: "Live-position halo (static ring — Kern ships utility motion only).",
    },
    {
      name: "consentLabel",
      type: "string",
      note: 'A-003 / MS-023 guest consent line (only painted for `kind="guest"`).',
    },
    {
      name: "consentExpired",
      type: "boolean",
      note: "A-003 expired consent: neutral tone + paused treatment.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
};
