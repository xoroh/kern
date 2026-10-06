import { Toggle } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Toggle configurator — the thirty-seventh Part-4 configurator (move #37),
 * first single-press surface. Knobs are the two state axes the component doc
 * leaves open: `pressed` (whether it mounts pressed — the painted-verify
 * axis, via uncontrolled `defaultPressed` so the stage needs no wiring) and
 * `disabled` (state). Everything else is ruled out first-hand: `value` is
 * group-only (the doc calls it unnecessary alone), controlled `pressed` +
 * `onPressedChange` are wiring not knobs, and there is no
 * `variant`/`size`/`label`/`color` prop to turn. The stage is the doc's
 * icon-only trap taught whole — glyph content with its own `aria-label` —
 * so the fence teaches it too. The stage remounts by key on every knob so
 * it cannot drift from the fence.
 */
function pressedOf(v: ConfigValues): boolean {
  return v.pressed === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (pressedOf(v)) out.push("defaultPressed");
  if (disabledOf(v)) out.push("disabled");
  return `${out.length > 0 ? ` ${out.join(" ")}` : ""} aria-label="Bold"`;
}

export const TOGGLE_CONFIGURATOR: ConfiguratorSpec = {
  id: "toggle-knobs",
  title: "Configure the toggle",
  description:
    "Pressed at first paint, or unpressed until clicked. A toggle is a button that stays pressed — there is no variant, size, or tone to configure, the pressed look is the primary roles. The knobs describe the next mount (the stage remounts by key): pressing the live toggle does not flip them back, so a pressed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "pressed",
      label: "Pressed (initial state)",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
  ],
  render: (v) => (
    <Toggle
      key={`${pressedOf(v) ? "pressed" : "released"}-${disabledOf(v) ? "off" : "on"}`}
      defaultPressed={pressedOf(v)}
      disabled={disabledOf(v)}
      aria-label="Bold"
    >
      B
    </Toggle>
  ),
  code: (v) =>
    `<Toggle${rootPropsOf(v)}>\n  B\n</Toggle>\n\n// Icon-only content needs its own aria-label; value joins a ToggleGroup.`,
};
