import { Meter } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Meter configurator — the fifteenth Part-4 configurator (move #15), second
 * status indicator past Progress. Knobs are the scale axes the component doc
 * leaves open: `value` (where the fill sits), `max` (what it sits against),
 * `min` (what it rises from). No `variant`/`tone` (a meter carries no
 * judgement — that is Sonner), no `size`/`thickness`, no `showValue` (the
 * Value part is rendered, not toggled) — all ruled out, so none is a knob.
 * The stage shows the documented anatomy whole — label, value, bar — so the
 * fence teaches it too. The stage remounts by key on every knob so it
 * cannot drift from the fence.
 *
 * Every value/max/min combination on the knobs is in-range by construction
 * (25/40/70 against 0/20 and 100/200): an over-max pairing would teach
 * clamping the component does not promise, so the knobs do not offer one.
 */
function meterValueOf(v: ConfigValues): number {
  return v.value === "25" ? 25 : v.value === "70" ? 70 : 40;
}

function maxOf(v: ConfigValues): number {
  return v.max === "200" ? 200 : 100;
}

function minOf(v: ConfigValues): number {
  return v.min === "20" ? 20 : 0;
}

function rootPropsOf(v: ConfigValues): string {
  const out = [`value={${meterValueOf(v)}}`, `max={${maxOf(v)}}`];
  if (minOf(v) !== 0) out.push(`min={${minOf(v)}}`);
  return ` ${out.join(" ")} aria-label="Storage"`;
}

export const METER_CONFIGURATOR: ConfiguratorSpec = {
  id: "meter-knobs",
  title: "Configure the meter",
  description:
    "A static scalar: value against its scale, nothing more. The bar never moves on its own and takes no input — for work in flight, that is Progress; for tone, Sonner. The knobs describe the next mount (the stage remounts by key): the combinations are in-range by construction, so an over-max pairing is not on offer.",
  controls: [
    {
      kind: "select",
      name: "value",
      label: "Value",
      options: ["25", "40", "70"],
      default: "40",
    },
    {
      kind: "select",
      name: "max",
      label: "Max",
      options: ["100", "200"],
      default: "100",
    },
    {
      kind: "select",
      name: "min",
      label: "Min",
      options: ["0", "20"],
      default: "0",
    },
  ],
  render: (v) => (
    <Meter.Root
      key={`${meterValueOf(v)}-${maxOf(v)}-${minOf(v)}`}
      value={meterValueOf(v)}
      max={maxOf(v)}
      min={minOf(v)}
      aria-label="Storage"
    >
      <Meter.Label>Storage used</Meter.Label>
      <Meter.Value />
    </Meter.Root>
  ),
  code: (v) =>
    `<Meter.Root${rootPropsOf(v)}>\n  <Meter.Label>Storage used</Meter.Label>\n  <Meter.Value />\n</Meter.Root>`,
};
