import { Checkbox } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Checkbox configurator — the seventh Part-4 configurator (move #7), first
 * past overlays and form-adjacent controls into pure form state. The
 * component doc rules out `size`/`variant` and `description`, and pointedly
 * makes `label` optional-with-consequences, so the honest knobs are the
 * state axis the doc leaves open: uncontrolled `defaultChecked`, the real
 * third state `indeterminate` (mixed, not a style), `disabled` — plus a
 * label on/off switch that teaches the doc's own a11y point (bare control
 * must carry `aria-label`, or it is unnamed to a screen reader).
 *
 * `checked` is controlled state, so it is not a knob: the configurator
 * drives the uncontrolled `defaultChecked` and the stage remounts by key on
 * every knob so it cannot drift from the fence.
 */
function checkedOf(v: ConfigValues): boolean {
  return v.defaultChecked === true;
}

function indeterminateOf(v: ConfigValues): boolean {
  return v.indeterminate === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function labeledOf(v: ConfigValues): boolean {
  return v.label !== false;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (labeledOf(v)) out.push('label="Email notifications"');
  else out.push('aria-label="Email notifications"');
  if (checkedOf(v)) out.push("defaultChecked");
  if (indeterminateOf(v)) out.push("indeterminate");
  if (disabledOf(v)) out.push("disabled");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const CHECKBOX_CONFIGURATOR: ConfiguratorSpec = {
  id: "checkbox-knobs",
  title: "Configure the checkbox",
  description:
    "Checked, indeterminate and disabled states, labelled or bare. The label wraps the control in a real label element; without it the box is unnamed, so the bare form carries an aria-label instead. The knobs describe the next mount (the stage remounts by key): toggling the live checkbox does not flip them back, so a changed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "defaultChecked",
      label: "Checked (initial state)",
      default: false,
    },
    {
      kind: "boolean",
      name: "indeterminate",
      label: "Indeterminate",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
    {
      kind: "boolean",
      name: "label",
      label: "Label",
      default: true,
    },
  ],
  render: (v) =>
    labeledOf(v) ? (
      <Checkbox
        key={`labeled-${checkedOf(v) ? "on" : "off"}-${indeterminateOf(v) ? "mixed" : "plain"}-${disabledOf(v) ? "off" : "on"}`}
        label="Email notifications"
        defaultChecked={checkedOf(v)}
        indeterminate={indeterminateOf(v)}
        disabled={disabledOf(v)}
      />
    ) : (
      <Checkbox
        key={`bare-${checkedOf(v) ? "on" : "off"}-${indeterminateOf(v) ? "mixed" : "plain"}-${disabledOf(v) ? "off" : "on"}`}
        aria-label="Email notifications"
        defaultChecked={checkedOf(v)}
        indeterminate={indeterminateOf(v)}
        disabled={disabledOf(v)}
      />
    ),
  code: (v) => `<Checkbox${rootPropsOf(v)} />`,
};
