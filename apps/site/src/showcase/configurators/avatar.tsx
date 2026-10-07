import { Avatar } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Avatar configurator — the forty-first Part-4 configurator. One genuine
 * knob: `size` (sm / default / lg — the painted-verify axis; three fixed
 * frame dimensions, visibly different diameters, not asserted prose).
 * Everything else is fixed anatomy or caller wiring by design: the shape is
 * round with no `shape` prop, there is no `color` or `status` prop, and the
 * fallback's content is the caller's initials. The stage shows the
 * documented anatomy whole — frame plus fallback, no photograph so the
 * paint is deterministic — so the fence teaches it too. The stage remounts
 * by key on the knob so it cannot drift from the fence.
 */
function sizeOf(v: ConfigValues): "sm" | "default" | "lg" {
  return v.size === "sm" || v.size === "lg" ? v.size : "default";
}

function rootPropsOf(v: ConfigValues): string {
  return sizeOf(v) !== "default" ? ` size="${sizeOf(v)}"` : "";
}

export const AVATAR_CONFIGURATOR: ConfiguratorSpec = {
  id: "avatar-knobs",
  title: "Configure the avatar",
  description:
    "Three fixed frame diameters. Size it to the density of what it sits in — a 56-pixel face in a dense table row pushes the data aside. The knob describes the next mount (the stage remounts by key): restyling the live avatar does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["default", "sm", "lg"],
      default: "default",
    },
  ],
  render: (v) => (
    <Avatar.Root key={sizeOf(v)} size={sizeOf(v)}>
      <Avatar.Fallback>XO</Avatar.Fallback>
    </Avatar.Root>
  ),
  code: (v) =>
    `<Avatar.Root${rootPropsOf(v)}>\n  <Avatar.Fallback>XO</Avatar.Fallback>\n</Avatar.Root>\n\n// fallback content is the caller's initials; shape is round by design, status dots are caller elements.`,
};
