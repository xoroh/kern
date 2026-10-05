import { Chip } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Chip configurator — the twenty-seventh Part-4 configurator (move #30),
 * first variant-driven toggle. Knobs are the axes the component doc leaves
 * open: `variant` (filter toggles `aria-pressed`; assist and suggestion are
 * plain actions with no pressed state), `defaultSelected` (filter only —
 * the stage starts pressed), `disabled` (the whole chip goes dead — the
 * edge composition, carried from the move-5 Group lesson). `selected` is
 * controlled so NOT a knob — same rule as `checked`/`open` everywhere;
 * `onSelectedChange` is app wiring, not a knob. The stage shows one live
 * chip so the pressed state is unmistakable; the fence teaches the variant
 * line too. The stage remounts by key on every knob so it cannot drift
 * from the fence.
 */
function variantOf(v: ConfigValues): "filter" | "assist" | "suggestion" {
  if (v.variant === "assist" || v.variant === "suggestion") return v.variant;
  return "filter";
}

function selectedOf(v: ConfigValues): boolean {
  return variantOf(v) === "filter" && v.defaultSelected === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const variant = variantOf(v);
  const out =
    variant === "filter" ? ['variant="filter"'] : [`variant="${variant}"`];
  if (selectedOf(v)) out.push("defaultSelected");
  if (disabledOf(v)) out.push("disabled");
  return ` ${out.join(" ")}`;
}

export const CHIP_CONFIGURATOR: ConfiguratorSpec = {
  id: "chip-knobs",
  title: "Configure the chip",
  description:
    "Variant behaviour and starting state. A filter chip toggles its pressed state when clicked — assist and suggestion never press, they just fire. The knobs describe the next mount (the stage remounts by key): clicking the live chip does not flip them back, so a toggled stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: ["filter", "assist", "suggestion"],
      default: "filter",
    },
    {
      kind: "boolean",
      name: "defaultSelected",
      label: "Selected (initial state, filter only)",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
  ],
  render: (v) => {
    const variant = variantOf(v);
    const disabled = disabledOf(v);
    const label = "Deployments";
    if (variant === "filter") {
      return (
        <Chip
          key={`filter-${selectedOf(v) ? "on" : "off"}-${disabled ? "off" : "on"}`}
          variant="filter"
          defaultSelected={selectedOf(v)}
          disabled={disabled}
        >
          {label}
        </Chip>
      );
    }
    return (
      <Chip
        key={`${variant}-off-${disabled ? "off" : "on"}`}
        variant={variant}
        disabled={disabled}
      >
        {label}
      </Chip>
    );
  },
  code: (v) => `<Chip${rootPropsOf(v)}>\n  Deployments\n</Chip>`,
};
