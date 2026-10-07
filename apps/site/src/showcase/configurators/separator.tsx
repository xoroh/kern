import { Separator } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Separator configurator — the forty-sixth Part-4 configurator. One
 * genuine knob: `orientation` (horizontal / vertical — the painted-verify
 * axis; a full-width hairline versus a full-height hairline are visibly
 * different geometries, not asserted prose). `decorative` is a caller
 * choice, not a knob option: whether the line carries meaning depends on
 * the surrounding content, which only the caller can see. The stage shows
 * the line between two labeled blocks so the orientation reads at a
 * glance. The stage remounts by key on the knob so it cannot drift from
 * the fence.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;
type SeparatorOrientation = (typeof ORIENTATIONS)[number];

function orientationOf(v: ConfigValues): SeparatorOrientation {
  // ConfigValues is string|boolean (toggle knobs share the type); the select
  // writes strings only — fall through to the default on anything else.
  return typeof v.orientation === "string" &&
    (ORIENTATIONS as readonly string[]).includes(v.orientation)
    ? (v.orientation as SeparatorOrientation)
    : "horizontal";
}

const vertical = (v: ConfigValues) => orientationOf(v) === "vertical";

export const SEPARATOR_CONFIGURATOR: ConfiguratorSpec = {
  id: "separator-knobs",
  title: "Configure the separator",
  description:
    "A hairline across or down. Horizontal divides stacked content full-width, vertical divides side-by-side content full-height. The knob describes the next mount (the stage remounts by key): restyling the live separator does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "orientation",
      label: "Orientation",
      options: [...ORIENTATIONS],
      default: "horizontal",
    },
  ],
  render: (v) =>
    vertical(v) ? (
      <div key="vertical" style={{ display: "flex", gap: 12, height: 64 }}>
        <span>Above</span>
        <Separator orientation="vertical" />
        <span>Below</span>
      </div>
    ) : (
      <div
        key="horizontal"
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <span>Above</span>
        <Separator />
        <span>Below</span>
      </div>
    ),
  code: (v) =>
    vertical(v)
      ? `<Separator orientation="vertical" />\n\n// decorative is a caller choice — set it when the line only reinforces a division the content already makes.`
      : `<Separator />\n\n// decorative is a caller choice — set it when the line only reinforces a division the content already makes.`,
};

// Gate edge hook (check-configurators.mjs): foreign values land on the
// default, never throw, never emit an invalid prop.
export function __edge_separatorOrientationOf(
  v: ConfigValues,
): SeparatorOrientation {
  return orientationOf(v);
}
