import { Banner } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Banner configurator — the forty-fifth Part-4 configurator. One genuine
 * knob: `variant` (info / success / warning / error — the painted-verify
 * axis; four visibly different status-container treatments, not asserted
 * prose). Icon, assertive, dismiss, and open are caller choices, not knob
 * options: the knob is the intent, not the wiring. Children are the
 * caller's message. The stage remounts by key on the knob so it cannot
 * drift from the fence.
 */
const VARIANTS = ["info", "success", "warning", "error"] as const;
type BannerVariant = (typeof VARIANTS)[number];

function variantOf(v: ConfigValues): BannerVariant {
  // ConfigValues is string|boolean (toggle knobs share the type); the select
  // writes strings only — fall through to the default on anything else.
  return typeof v.variant === "string" &&
    (VARIANTS as readonly string[]).includes(v.variant)
    ? (v.variant as BannerVariant)
    : "info";
}

export const BANNER_CONFIGURATOR: ConfiguratorSpec = {
  id: "banner-knobs",
  title: "Configure the banner",
  description:
    "Four intents, four status containers. Info states, success confirms, warning cautions, error blocks. The knob describes the next mount (the stage remounts by key): restyling the live banner does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: [...VARIANTS],
      default: "info",
    },
  ],
  render: (v) => (
    <Banner key={variantOf(v)} variant={variantOf(v)}>
      Your export finished — download it from the library.
    </Banner>
  ),
  code: (v) =>
    variantOf(v) === "info"
      ? `<Banner>\n  Your export finished — download it from the library.\n</Banner>\n\n// icon, assertive, dismiss and open are caller choices; className merges, not varies.`
      : `<Banner variant="${variantOf(v)}">\n  Your export finished — download it from the library.\n</Banner>\n\n// icon, assertive, dismiss and open are caller choices; className merges, not varies.`,
};

// Gate edge hook (check-configurators.mjs): foreign values land on the
// default, never throw, never emit an invalid prop.
export function __edge_bannerVariantOf(v: ConfigValues): BannerVariant {
  return variantOf(v);
}
