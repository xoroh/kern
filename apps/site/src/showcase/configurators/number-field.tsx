import { NumberField } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * NumberField configurator — the tenth Part-4 configurator (move #10),
 * fourth form control. Knobs are the value axes the component doc leaves
 * open: `min`/`max` (the clamp range), `step` (stepper and keyboard
 * granularity), `disabled` and `required` (states). No `size`/`variant`, no
 * `stepperPosition`, no `format` — all ruled out, so none is a knob. The
 * stage shows the documented anatomy whole — steppers flanking the input —
 * so the fence teaches it too. The stage remounts by key on every knob so it
 * cannot drift from the fence.
 *
 * The min options stay at or under the fixed default value (2) deliberately:
 * a min above the default would open clamping-on-mount behaviour the fence
 * cannot show honestly. Clamping is covered where it belongs — the edge
 * test pins the steppers at both bounds.
 */
function minOf(v: ConfigValues): number {
  return v.min === "2" ? 2 : 0;
}

function maxOf(v: ConfigValues): number {
  return v.max === "100" ? 100 : 10;
}

function stepOf(v: ConfigValues): number {
  return v.step === "5" ? 5 : 1;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function requiredOf(v: ConfigValues): boolean {
  return v.required === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out = [`defaultValue={2}`, `min={${minOf(v)}}`, `max={${maxOf(v)}}`];
  if (stepOf(v) !== 1) out.push(`step={${stepOf(v)}}`);
  if (disabledOf(v)) out.push("disabled");
  if (requiredOf(v)) out.push("required");
  return ` ${out.join(" ")}`;
}

export const NUMBER_FIELD_CONFIGURATOR: ConfiguratorSpec = {
  id: "number-field-knobs",
  title: "Configure the number field",
  description:
    "Clamp range, step, disabled and required states. The steppers flank the input and move by exactly the step — at the bounds they hold, they never wrap. The knobs describe the next mount (the stage remounts by key): stepping the live field does not flip them back, so a stepped stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "min",
      label: "Min",
      options: ["0", "2"],
      default: "0",
    },
    {
      kind: "select",
      name: "max",
      label: "Max",
      options: ["10", "100"],
      default: "10",
    },
    {
      kind: "select",
      name: "step",
      label: "Step",
      options: ["1", "5"],
      default: "1",
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
    {
      kind: "boolean",
      name: "required",
      label: "Required",
      default: false,
    },
  ],
  render: (v) => (
    <NumberField.Root
      key={`${minOf(v)}-${maxOf(v)}-${stepOf(v)}-${disabledOf(v) ? "off" : "on"}-${requiredOf(v) ? "req" : "opt"}`}
      defaultValue={2}
      min={minOf(v)}
      max={maxOf(v)}
      step={stepOf(v)}
      disabled={disabledOf(v)}
      required={requiredOf(v)}
      aria-label="Quantity"
    >
      <NumberField.Input />
    </NumberField.Root>
  ),
  code: (v) =>
    `<NumberField.Root${rootPropsOf(v)} aria-label="Quantity">\n  <NumberField.Input />\n</NumberField.Root>`,
};
