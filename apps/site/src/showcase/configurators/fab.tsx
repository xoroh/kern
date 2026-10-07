import { Fab } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Fab configurator — the forty-third Part-4 configurator. One genuine
 * knob: `size` (default / medium / large — the painted-verify axis; M3's
 * FAB variants ARE a size axis, 56dp / 96dp / 128dp, not an emphasis axis —
 * see the package comment). `sm` and `icon` are density conveniences, not
 * M3 sizes, so they are caller choices, not knob options. Children are the
 * caller's icon; `className` merges rather than varies. The stage remounts
 * by key on the knob so it cannot drift from the fence.
 */
const SIZES = ["default", "medium", "large"] as const;
type FabSize = (typeof SIZES)[number];

function sizeOf(v: ConfigValues): FabSize {
  return v.size === "medium" || v.size === "large" ? v.size : "default";
}

export const FAB_CONFIGURATOR: ConfiguratorSpec = {
  id: "fab-knobs",
  title: "Configure the fab",
  description:
    "One size, three M3 geometries. Small is the 56dp default, medium stretches to 96dp, large to 128dp. The knob describes the next mount (the stage remounts by key): restyling the live fab does not flip it back, so a changed stage with an untouched knob is by design.",
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
    <Fab key={sizeOf(v)} size={sizeOf(v)} aria-label="Create">
      +
    </Fab>
  ),
  code: (v) =>
    sizeOf(v) === "default"
      ? `<Fab aria-label="Create">\n  +\n</Fab>\n\n// children are the caller's icon; className merges, not varies.`
      : `<Fab size="${sizeOf(v)}" aria-label="Create">\n  +\n</Fab>\n\n// children are the caller's icon; className merges, not varies.`,
};
