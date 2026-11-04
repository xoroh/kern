import { MapPanel, StatusPill } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * MapPanel examples — floating map overlay card, anchored by the host
 * engine (media, meta, actions, footer slots + optional close).
 */
export const MAP_PANEL_EXAMPLES: ExampleSpec[] = [
  {
    id: "map-panel",
    title: "Map overlay panel",
    description:
      "Floating card anchored by the host engine: media, meta row (StatusPill), actions and footer slots, optional close.",
    render: () => (
      <div className="w-full max-w-sm">
        <MapPanel
          title="Trip 12"
          description="Airport pickup · Terminal 2"
          meta={<StatusPill tone="info">En route</StatusPill>}
          footer="ETA 14:32 · Driver called"
        />
      </div>
    ),
    code: `<MapPanel
  title="Trip 12"
  meta={<StatusPill tone="info">En route</StatusPill>}
/>`,
  },
];
