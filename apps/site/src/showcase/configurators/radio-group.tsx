import { RadioGroup, RadioGroupItem } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * RadioGroup configurator — the eighteenth Part-4 configurator (move #18),
 * first exclusive-choice group. Knobs are the Root axes the component doc
 * leaves open: uncontrolled `defaultValue` (which option starts checked;
 * `value` is controlled so NOT a knob — same rule as `checked`/`open`
 * everywhere) and group `disabled` (the whole group inert, not just styled —
 * pinned by the guard test in radio-group.test.tsx). No `orientation` (the
 * group stacks vertically by design; a row is the consumer's layout), no
 * per-item knobs (the pickup option stays disabled in every position to teach
 * item-disabled alongside group-disabled). The stage remounts by key on every
 * knob so it cannot drift from the fence.
 */
function defaultOf(v: ConfigValues): string | undefined {
  const d = v.preselected;
  return d === "standard" || d === "express" ? d : undefined;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out = [`aria-label="Shipping"`];
  const d = defaultOf(v);
  if (d !== undefined) out.push(`defaultValue="${d}"`);
  if (disabledOf(v)) out.push("disabled");
  return ` ${out.join(" ")}`;
}

export const RADIO_GROUP_CONFIGURATOR: ConfiguratorSpec = {
  id: "radio-group-knobs",
  title: "Configure the radio group",
  description:
    "One choice out of several, preselected or not, live group or disabled. The knobs describe the next mount (the stage remounts by key): changing the live selection does not flip them back, so a changed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "preselected",
      label: "Preselected",
      options: ["none", "standard", "express"],
      default: "standard",
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
  ],
  render: (v) => (
    <RadioGroup
      key={`${defaultOf(v) ?? "none"}-${disabledOf(v) ? "off" : "on"}`}
      aria-label="Shipping"
      defaultValue={defaultOf(v)}
      disabled={disabledOf(v)}
    >
      <RadioGroupItem value="standard">Standard — 5 days</RadioGroupItem>
      <RadioGroupItem value="express">Express — 2 days</RadioGroupItem>
      <RadioGroupItem value="pickup" disabled>
        Pickup — unavailable
      </RadioGroupItem>
    </RadioGroup>
  ),
  code: (v) =>
    `<RadioGroup${rootPropsOf(v)}>\n  <RadioGroupItem value="standard">Standard — 5 days</RadioGroupItem>\n  <RadioGroupItem value="express">Express — 2 days</RadioGroupItem>\n  <RadioGroupItem value="pickup" disabled>\n    Pickup — unavailable\n  </RadioGroupItem>\n</RadioGroup>`,
};
