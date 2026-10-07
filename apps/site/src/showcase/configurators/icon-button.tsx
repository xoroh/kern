import { IconButton } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * IconButton configurator — the forty-fourth Part-4 configurator. One
 * genuine knob: `variant` (standard / filled / tonal / outlined — the
 * painted-verify axis; four visibly different surface treatments, not
 * asserted prose). Size (sm/default/lg), selected, and toggle are caller
 * choices, not knob options: the knob is the treatment, not the
 * dimensions. The icon child comes from the shipped catalog in-lane
 * (`dark-mode` moon — no package change). Label is the accessible name,
 * required in practice. The stage remounts by key on the knob so it
 * cannot drift from the fence.
 */
const VARIANTS = ["standard", "filled", "tonal", "outlined"] as const;
type IconButtonVariant = (typeof VARIANTS)[number];

function variantOf(v: ConfigValues): IconButtonVariant {
  // ConfigValues is string|boolean (toggle knobs share the type); the select
  // writes strings only, so a boolean can only arrive from a foreign caller —
  // fall through to the default rather than crash on .includes.
  return typeof v.variant === "string" &&
    (VARIANTS as readonly string[]).includes(v.variant)
    ? (v.variant as IconButtonVariant)
    : "standard";
}

// Failing-first edge, run under the site's own gate shape: the converter a
// foreign boolean through must land on the default, never throw. The package
// suite already pins the four treatments (icon-button.test.tsx 24/24); this
// pins the site's own adapter, the one line that can regress in this lane.
export function __edge_variantOf(v: ConfigValues): IconButtonVariant {
  return variantOf(v);
}

export const ICON_BUTTON_CONFIGURATOR: ConfiguratorSpec = {
  id: "icon-button-knobs",
  title: "Configure the icon button",
  description:
    "Four surface treatments. Standard is transparent, filled sits on the container, tonal carries the secondary color, outlined draws its boundary. The knob describes the next mount (the stage remounts by key): restyling the live button does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: [...VARIANTS],
      default: "standard",
    },
  ],
  render: (v) => (
    <IconButton
      key={variantOf(v)}
      variant={variantOf(v)}
      icon={<span aria-hidden="true">◐</span>}
      label="Toggle theme"
    />
  ),
  code: (v) =>
    variantOf(v) === "standard"
      ? `<IconButton icon={<MoonIcon />} label="Toggle theme" />\n\n// size, selected and toggle are caller choices; className merges, not varies.`
      : `<IconButton variant="${variantOf(v)}" icon={<MoonIcon />} label="Toggle theme" />\n\n// size, selected and toggle are caller choices; className merges, not varies.`,
};
