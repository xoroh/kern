import { Fab } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Fab configurator — size, color, and elevation.
 *
 * M3's FAB variants ARE a size axis (56dp / 80dp / 128dp) crossed with a
 * color axis (surface / primary / secondary / tertiary) plus the `lowered`
 * elevation treatment. `sm` and `icon` are density conveniences, not M3
 * sizes, so they are caller choices, not knob options. Children are the
 * caller's icon; `className` merges rather than varies. The stage remounts
 * by key on the knob so it cannot drift from the fence.
 */
const SIZES = ["sm", "default", "md", "large", "icon"] as const;
type FabSize = (typeof SIZES)[number];
const COLORS = ["surface", "primary", "secondary", "tertiary"] as const;
type FabColor = (typeof COLORS)[number];

function sizeOf(v: ConfigValues): FabSize {
  const s = String(v.size);
  return (SIZES as readonly string[]).includes(s) ? (s as FabSize) : "default";
}

function colorOf(v: ConfigValues): FabColor {
  const s = String(v.color);
  return (COLORS as readonly string[]).includes(s)
    ? (s as FabColor)
    : "surface";
}

function propsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (sizeOf(v) !== "default") out.push(`size="${sizeOf(v)}"`);
  if (colorOf(v) !== "surface") out.push(`color="${colorOf(v)}"`);
  if (v.lowered === true) out.push("lowered");
  out.push(`aria-label="Create"`);
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const FAB_CONFIGURATOR: ConfiguratorSpec = {
  id: "fab-knobs",
  title: "Configure the fab",
  description:
    "Size, color, and elevation. Surface is M3's default; primary/secondary/tertiary are brand accents. Lowered sits quieter at level1.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: [...SIZES],
      default: "default",
    },
    {
      kind: "select",
      name: "color",
      label: "Color",
      options: [...COLORS],
      default: "surface",
    },
    {
      kind: "boolean",
      name: "lowered",
      label: "Lowered elevation",
      default: false,
    },
  ],
  render: (v) => (
    <Fab
      key={`${sizeOf(v)}-${colorOf(v)}-${v.lowered}`}
      size={sizeOf(v)}
      color={colorOf(v)}
      lowered={v.lowered === true}
      aria-label="Create"
    >
      +
    </Fab>
  ),
  code: (v) =>
    `<Fab${propsOf(v)}>\n  +\n</Fab>\n\n// children are the caller's icon; className merges, not varies.`,
};
