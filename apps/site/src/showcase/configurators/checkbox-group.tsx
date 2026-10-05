import { CheckboxGroup } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * CheckboxGroup configurator — the twenty-sixth Part-4 configurator
 * (move #29), first shared multi-select value. Knobs are the selection
 * axes the component doc leaves open: `checked` (which options start
 * checked — none, one, or two), `disabled` (the whole set goes dead — the
 * edge composition, carried from the move-5 Group lesson). No
 * `orientation`/`columns` (layout is the root's `className`), no group
 * `label` (the question belongs in a Fieldset with a FieldsetLegend),
 * no per-item sizes or variants — all ruled out, so none is a knob. The
 * stage shows the documented anatomy whole — three notification options —
 * so the fence teaches it too. The stage remounts by key on every knob so
 * it cannot drift from the fence.
 */
function checkedOf(v: ConfigValues): string[] | undefined {
  if (v.checked === "all") return ["email", "push", "sms"];
  if (v.checked === "email") return ["email"];
  return undefined;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  const checked = checkedOf(v);
  if (checked !== undefined)
    out.push(
      `defaultValue={${checked.length > 1 ? '["email", "push", "sms"]' : '["email"]'}}`,
    );
  if (disabledOf(v)) out.push("disabled");
  return `${out.length > 0 ? ` ${out.join(" ")}` : ""} aria-label="Notifications"`;
}

const OPTIONS: Array<[string, string]> = [
  ["email", "Email"],
  ["push", "Push"],
  ["sms", "SMS"],
];

export const CHECKBOX_GROUP_CONFIGURATOR: ConfiguratorSpec = {
  id: "checkbox-group-knobs",
  title: "Configure the checkbox group",
  description:
    "Starting selection and whole-set disabled state. Checking one option never unchecks another — that shared multi-select value is the behaviour, not a bug. The knobs describe the next mount (the stage remounts by key): checking the live options does not flip them back, so a checked stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "checked",
      label: "Checked (initial state)",
      options: ["none", "email", "all"],
      default: "none",
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
  ],
  render: (v) => (
    <CheckboxGroup.Root
      key={`${v.checked === "all" ? "all" : v.checked === "email" ? "one" : "none"}-${disabledOf(v) ? "off" : "on"}`}
      defaultValue={checkedOf(v)}
      disabled={disabledOf(v)}
      aria-label="Notifications"
    >
      {OPTIONS.map(([value, label]) => (
        <CheckboxGroup.Item key={value} value={value} label={label} />
      ))}
    </CheckboxGroup.Root>
  ),
  code: (v) =>
    `<CheckboxGroup.Root${rootPropsOf(v)}>\n${OPTIONS.map(([value, label]) => `  <CheckboxGroup.Item value="${value}" label="${label}" />`).join("\n")}\n</CheckboxGroup.Root>`,
};
