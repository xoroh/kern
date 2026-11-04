import type { ComponentDoc } from "../types";

export const mapPanel: ComponentDoc = {
  slug: "map-panel",
  name: "Map panel",
  oneLiner:
    "Map panel is the anchored card surface for a selected map feature.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "MapPanel",
    variants: ["position: floating · docked-top · docked-bottom"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["MapPanel"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Closes the panel through the × control — a real button, so the press is the browser's own. Slotted actions keep their own keyboard.",
    },
  ],
  customization: {
    supported: [
      "`position` picks the shape — floating card or a docked edge sheet — while the host does the anchoring.",
      "`media`, `meta`, `actions` and `footer` slot the panel's regions around the required title.",
      "`onClose` is the allowlisted close action behind the × control.",
    ],
    notSupported: [
      "There is no map inside. The panel is anchored by the host engine; position only changes the panel's own shape.",
      "There is no feature fetching. Title, description and slots arrive as props; the panel never loads.",
    ],
  },
  api: [
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: "Panel heading. Required: every floating surface must be nameable.",
    },
    {
      name: "description",
      type: "ReactNode",
    },
    {
      name: "media",
      type: "ReactNode",
      note: "Media slot: route preview, photo, mini-map snapshot from the host.",
    },
    {
      name: "meta",
      type: "ReactNode",
      note: "Meta slot: status/tone row — the host composes `StatusPill` here.",
    },
    {
      name: "actions",
      type: "ReactNode",
      note: "Primary actions slot (usually Buttons from the host).",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer slot: secondary lines, ETAs, disclaimers.",
    },
    {
      name: "onClose",
      type: "(() => void) | undefined",
      note: "Close action (R2 lexicon: a DOMAIN action, not state — allowlisted). Renders the × control; omit it and no × renders.",
    },
    {
      name: "position",
      type: '"floating" | "docked-top" | "docked-bottom"',
      note: "Placement preset. The host engine anchors the panel; this only picks the resting treatment (floating card vs docked edge sheet shape).",
    },
  ],
  aria: [
    "`title` is required because every floating surface must be nameable — the panel is labelled by its heading.",
    "`description` carries the supporting line; `media` slots the route preview or photo above the text.",
    "`meta` slots the host `StatusPill`, so feature state reads through the registry.",
  ],
};
