import { Label, Switch } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Switch configurator — the second flagship (Part 4c).
 *
 * Switch has no variant or size axis (the component doc confirms both
 * absences), so the knobs are the state axis: `defaultChecked` plus the
 * native `disabled`. Only non-default positions are emitted into the fence;
 * the stage passes everything explicitly, same values object either way.
 *
 * Two deliberate choices: the stage shows the documented label pattern — a
 * visible `Label` wired with `aria-labelledby` (the doc's blessed alternative
 * to `htmlFor`/`id`: Base UI owns the root's `id`, so the fence does not
 * pretend otherwise) — layout wrapper included, so pasted code sits
 * side-by-side exactly like the stage. And `defaultChecked` is uncontrolled initial state,
 * so the stage remounts on that knob (`key`) and cannot drift from the
 * fence: what the fence produces fresh is what the stage shows.
 */
const LABEL_ID = "notifications-label";
const SWITCH_LABEL = "Notifications";

function checkedOf(v: ConfigValues): boolean {
  return v.defaultChecked === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function propsOf(v: ConfigValues): string {
  const out: string[] = [`aria-labelledby="${LABEL_ID}"`];
  if (checkedOf(v)) out.push("defaultChecked");
  if (disabledOf(v)) out.push("disabled");
  return ` ${out.join(" ")}`;
}

export const SWITCH_CONFIGURATOR: ConfiguratorSpec = {
  id: "switch-knobs",
  title: "Configure the switch",
  description:
    "State is the only axis — checked or not, blocked or not. The label is part of the pattern, not a knob: a switch needs a visible label next to it, wired with aria-labelledby.",
  controls: [
    {
      kind: "boolean",
      name: "defaultChecked",
      label: "Checked (initial state)",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled (native prop)",
      default: false,
    },
  ],
  render: (v) => (
    <div className="flex items-center gap-3">
      <Label id={LABEL_ID}>{SWITCH_LABEL}</Label>
      <Switch
        key={checkedOf(v) ? "on" : "off"}
        aria-labelledby={LABEL_ID}
        defaultChecked={checkedOf(v)}
        disabled={disabledOf(v)}
      />
    </div>
  ),
  code: (v) =>
    `<div className="flex items-center gap-3">\n  <Label id="${LABEL_ID}">${SWITCH_LABEL}</Label>\n  <Switch${propsOf(v)} />\n</div>`,
};
