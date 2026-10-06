import { Card } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Card configurator — the thirty-ninth Part-4 configurator (move #39).
 * One genuine knob: `variant` (filled / outlined / elevated — the
 * painted-verify axis; elevation differences are visible, not asserted
 * prose). Everything else is fixed anatomy or caller wiring by design:
 * children are the caller's content, `as` is polymorphism not variation,
 * and `className` merges rather than varies. The stage shows the
 * documented anatomy whole — title plus body text — so the fence teaches
 * it too. The stage remounts by key on the knob so it cannot drift from
 * the fence.
 */
function variantOf(v: ConfigValues): "filled" | "outlined" | "elevated" {
  return v.variant === "outlined" || v.variant === "elevated"
    ? v.variant
    : "filled";
}

function rootPropsOf(v: ConfigValues): string {
  return variantOf(v) !== "filled" ? ` variant="${variantOf(v)}"` : "";
}

export const CARD_CONFIGURATOR: ConfiguratorSpec = {
  id: "card-knobs",
  title: "Configure the card",
  description:
    "Flat, bordered, or lifted. Filled rests on the surface, outlined draws its boundary, elevated casts the level-1 shadow. The knob describes the next mount (the stage remounts by key): restyling the live card does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: ["filled", "outlined", "elevated"],
      default: "filled",
    },
  ],
  render: (v) => (
    <Card key={variantOf(v)} variant={variantOf(v)}>
      <p>Cards group related content and actions.</p>
    </Card>
  ),
  code: (v) =>
    `<Card${rootPropsOf(v)}>\n  <p>Cards group related content and actions.</p>\n</Card>\n\n// children are the caller's content; as/className are polymorphism, not variation.`,
};
