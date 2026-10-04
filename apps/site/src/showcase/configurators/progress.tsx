import { Progress } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Progress configurator — the twelfth Part-4 configurator (move #12), first
 * status indicator. Knobs are the state axes the component doc leaves open:
 * `indeterminate` (value set vs unset — the doc's own design, "leaving the
 * value unset is how the indeterminate state is expressed"), `value` (where
 * the bar sits), `max` (what it sits against). No `variant`/`tone`, no
 * separate `indeterminate` boolean, no `size`/`thickness` — all ruled out, so
 * none is a knob. The stage shows the documented anatomy whole — label,
 * value, bar — so the fence teaches it too. The stage remounts by key on
 * every knob so it cannot drift from the fence.
 *
 * When indeterminate is on, the stage passes `value={null}` — Base UI's
 * required prop (`value: number | null`) and its documented indeterminate
 * signal, not an omission. The fence shows the same line, so the two cannot
 * drift.
 * The value knob offers 25/60/100 and max offers 100/200 so every
 * combination is a value at or under its max; an over-max pairing is covered
 * where it belongs — nowhere, because clamping a progress bar is the
 * caller's arithmetic, not this component's.
 */
function indeterminateOf(v: ConfigValues): boolean {
  return v.indeterminate === true;
}

function progressValueOf(v: ConfigValues): number {
  return v.value === "25" ? 25 : v.value === "100" ? 100 : 60;
}

function maxOf(v: ConfigValues): number {
  return v.max === "200" ? 200 : 100;
}

function rootPropsOf(v: ConfigValues): string {
  if (indeterminateOf(v))
    return ` value={null} max={${maxOf(v)}} aria-label="Upload"`;
  const out = [`value={${progressValueOf(v)}}`, `max={${maxOf(v)}}`];
  return ` ${out.join(" ")} aria-label="Upload"`;
}

export const PROGRESS_CONFIGURATOR: ConfiguratorSpec = {
  id: "progress-knobs",
  title: "Configure the progress bar",
  description:
    "Known position or honest motion: set a value against its max, or leave the value unset and the bar says so (no aria-valuenow, indeterminate motion). The knobs describe the next mount (the stage remounts by key): the live bar never moves on its own, so a mid-bar stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "indeterminate",
      label: "Indeterminate (no value)",
      default: false,
    },
    {
      kind: "select",
      name: "value",
      label: "Value",
      options: ["25", "60", "100"],
      default: "60",
    },
    {
      kind: "select",
      name: "max",
      label: "Max",
      options: ["100", "200"],
      default: "100",
    },
  ],
  render: (v) => (
    <Progress.Root
      key={`${indeterminateOf(v) ? "motion" : progressValueOf(v)}-${maxOf(v)}`}
      {...(indeterminateOf(v)
        ? { value: null, max: maxOf(v) }
        : { value: progressValueOf(v), max: maxOf(v) })}
      aria-label="Upload"
    >
      <Progress.Label>Uploading</Progress.Label>
      {!indeterminateOf(v) && <Progress.Value />}
    </Progress.Root>
  ),
  code: (v) =>
    `<Progress.Root${rootPropsOf(v)}>\n  <Progress.Label>Uploading</Progress.Label>\n${indeterminateOf(v) ? "" : "  <Progress.Value />\n"}</Progress.Root>`,
};
