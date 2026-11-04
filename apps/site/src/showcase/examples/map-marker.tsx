import { MapMarker } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * KernMaps examples — marker/panel VISUALS only (no engine).
 *
 * The host map engine positions these glyphs; Kern owns how they look.
 * Includes the A-003 guest-live-position variant (consent ring + line,
 * paused treatment on expiry).
 */
export const MAP_MARKER_EXAMPLES: ExampleSpec[] = [
  {
    id: "map-marker-kinds",
    title: "Marker kinds and tones",
    description:
      "One glyph, five kinds on the tone registry. The host engine positions each marker; labels are short chips.",
    render: () => (
      <div className="flex flex-wrap items-center gap-4">
        <MapMarker kind="vehicle" tone="info" label="12" />
        <MapMarker kind="person" tone="success" />
        <MapMarker kind="stop" label="3" />
        <MapMarker kind="pin" tone="warning" selected label="Depot" />
      </div>
    ),
    code: `<MapMarker kind="vehicle" tone="info" label="12" />
<MapMarker kind="stop" label="3" />`,
  },
  {
    id: "map-marker-guest",
    title: "Guest live position (A-003)",
    description:
      "Consented guest marker: dashed consent ring plus the sharing line. Expired consent falls back to neutral with the paused dot — the host owns consent state, the visual only paints it.",
    render: () => (
      <div className="flex flex-wrap items-center gap-4">
        <MapMarker kind="guest" live consentLabel="Sharing until 14:30" />
        <MapMarker kind="guest" consentExpired />
      </div>
    ),
    code: `<MapMarker kind="guest" live consentLabel="Sharing until 14:30" />
<MapMarker kind="guest" consentExpired />`,
  },
];
