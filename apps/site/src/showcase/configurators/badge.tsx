import { Badge } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Badge configurator — the fortieth Part-4 configurator. One genuine
 * knob: `variant` (dot / count — the painted-verify axis; a round marker
 * versus a numbered pill are visibly different geometries, not asserted
 * prose). Everything else is fixed anatomy or caller wiring by design:
 * children are the caller's label or number (count carries `3`; dot is
 * childless — a 6px marker whose geometry alone signals presence), and
 * `className` merges rather than varies. The stage shows the documented
 * anatomy whole so the fence teaches it too. The stage remounts by key
 * on the knob so it cannot drift from the fence.
 */
function variantOf(v: ConfigValues): "dot" | "count" {
  return v.variant === "dot" ? "dot" : "count";
}

export const BADGE_CONFIGURATOR: ConfiguratorSpec = {
  id: "badge-knobs",
  title: "Configure the badge",
  description:
    "Round marker or numbered pill. Dot marks presence with geometry alone, count carries a number in a pill. The knob describes the next mount (the stage remounts by key): restyling the live badge does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: ["count", "dot"],
      default: "count",
    },
  ],
  render: (v) =>
    variantOf(v) === "dot" ? (
      <Badge key="dot" variant="dot" />
    ) : (
      <Badge key="count">3</Badge>
    ),
  code: (v) =>
    variantOf(v) === "dot"
      ? `<Badge variant="dot" />\n\n// dot marks presence with geometry alone — childless by design.`
      : `<Badge>\n  3\n</Badge>\n\n// children are the caller's label or number; className merges, not varies.`,
};
