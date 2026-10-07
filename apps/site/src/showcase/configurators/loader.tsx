import { Loader } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Loader configurator — the forty-seventh Part-4 configurator. One
 * genuine knob: `size` (sm / default / lg — the painted-verify axis;
 * 16px / 24px / 40px spinners are visibly different geometries, not
 * asserted prose). `label` is a caller choice, not a knob option: the
 * announced text depends on what is loading, which only the caller knows.
 * The stage shows the spinner whole so the fence teaches it too. The
 * stage remounts by key on the knob so it cannot drift from the fence.
 */
const SIZES = ["sm", "default", "lg"] as const;
type LoaderSize = (typeof SIZES)[number];

function sizeOf(v: ConfigValues): LoaderSize {
  // ConfigValues is string|boolean (toggle knobs share the type); the select
  // writes strings only — fall through to the default on anything else.
  return typeof v.size === "string" &&
    (SIZES as readonly string[]).includes(v.size)
    ? (v.size as LoaderSize)
    : "default";
}

export const LOADER_CONFIGURATOR: ConfiguratorSpec = {
  id: "loader-knobs",
  title: "Configure the loader",
  description:
    "Three spinner geometries. Small fits inline text, default marks a region, large holds a full view. The knob describes the next mount (the stage remounts by key): restyling the live loader does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: [...SIZES],
      default: "default",
    },
  ],
  render: (v) => (
    <Loader key={sizeOf(v)} size={sizeOf(v)} label="Loading results" />
  ),
  code: (v) =>
    sizeOf(v) === "default"
      ? `<Loader label="Loading results" />\n\n// label names what is loading — the caller always knows, the knob never can.`
      : `<Loader size="${sizeOf(v)}" label="Loading results" />\n\n// label names what is loading — the caller always knows, the knob never can.`,
};

// Gate edge hook (check-configurators.mjs): foreign values land on the
// default, never throw, never emit an invalid prop.
export function __edge_loaderSizeOf(v: ConfigValues): LoaderSize {
  return sizeOf(v);
}
