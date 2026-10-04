import { Slider } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Slider configurator — the eighth Part-4 configurator (move #8), third form
 * control past Select. The component doc rules out `size`/`variant`,
 * `orientation` (horizontal-only styling — same stance as Tabs) and
 * `showValue`, so the honest knobs are the value axes Base UI leaves open:
 * `range` (one thumb vs two — the edge composition, carried from the move-5
 * Group lesson), `step` (keyboard granularity), `disabled` (state). The stage
 * shows the documented anatomy whole — label, value, thumb(s) — so the fence
 * teaches it too. The stage remounts by key on every knob so it cannot drift
 * from the fence.
 */
function rangeOf(v: ConfigValues): boolean {
  return v.range === true;
}

function stepOf(v: ConfigValues): number {
  const n = Number(v.step);
  return n === 5 || n === 10 ? n : 1;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  out.push(`defaultValue={${rangeOf(v) ? "[20, 80]" : "40"}}`);
  if (stepOf(v) !== 1) out.push(`step={${stepOf(v)}}`);
  if (disabledOf(v)) out.push("disabled");
  return ` ${out.join(" ")}`;
}

function thumbsOf(range: boolean): string {
  return range
    ? '  <Slider.Thumb aria-label="Minimum volume" />\n  <Slider.Thumb aria-label="Maximum volume" />'
    : '  <Slider.Thumb aria-label="Volume" />';
}

export const SLIDER_CONFIGURATOR: ConfiguratorSpec = {
  id: "slider-knobs",
  title: "Configure the slider",
  description:
    "One thumb or two (range), keyboard step, disabled state. The label names the control and the value part reads the current position — both are part of the pattern, not knobs. The knobs describe the next mount (the stage remounts by key): dragging the live slider does not flip them back, so a moved stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "range",
      label: "Range (two thumbs)",
      default: false,
    },
    {
      kind: "select",
      name: "step",
      label: "Step",
      options: ["1", "5", "10"],
      default: "1",
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
  ],
  render: (v) => (
    <Slider.Root
      key={`${rangeOf(v) ? "range" : "single"}-${stepOf(v)}-${disabledOf(v) ? "off" : "on"}`}
      defaultValue={rangeOf(v) ? [20, 80] : 40}
      step={stepOf(v)}
      disabled={disabledOf(v)}
    >
      <Slider.Label>Volume</Slider.Label>
      <Slider.Value />
      {rangeOf(v) ? (
        <>
          <Slider.Thumb aria-label="Minimum volume" />
          <Slider.Thumb aria-label="Maximum volume" />
        </>
      ) : (
        <Slider.Thumb aria-label="Volume" />
      )}
    </Slider.Root>
  ),
  code: (v) =>
    `<Slider.Root${rootPropsOf(v)}>\n  <Slider.Label>Volume</Slider.Label>\n  <Slider.Value />\n${thumbsOf(rangeOf(v))}\n</Slider.Root>`,
};
