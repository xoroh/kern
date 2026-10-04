import { ToggleGroup } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * ToggleGroup configurator — the fourteenth Part-4 configurator (move #14),
 * first toggle set. Knobs are the selection axes the component doc leaves
 * open: `multiple` (one pressed at a time vs many — the edge composition,
 * carried from the move-5 Group lesson), `defaultPressed` (which options, if
 * any, start pressed), `disabled` (state). No `orientation` (the track is a
 * horizontal row by construction), no `size`/`variant`, no group `label`
 * (that belongs to a Fieldset) — all ruled out, so none is a knob. The
 * stage shows the documented anatomy whole — three format options — so the
 * fence teaches it too. The stage remounts by key on every knob so it
 * cannot drift from the fence.
 */
function multipleOf(v: ConfigValues): boolean {
  return v.multiple === true;
}

function pressedOf(v: ConfigValues): readonly string[] | undefined {
  if (v.pressed === "bold-italic") return ["bold", "italic"];
  if (v.pressed === "bold") return ["bold"];
  return undefined;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (multipleOf(v)) out.push("multiple");
  const pressed = pressedOf(v);
  if (pressed !== undefined)
    out.push(
      `defaultValue={${pressed.length > 1 ? '["bold", "italic"]' : '["bold"]'}}`,
    );
  if (disabledOf(v)) out.push("disabled");
  return `${out.length > 0 ? ` ${out.join(" ")}` : ""} aria-label="Format"`;
}

const OPTIONS: Array<[string, string, string]> = [
  ["bold", "Bold", "B"],
  ["italic", "Italic", "I"],
  ["underline", "Underline", "U"],
];

export const TOGGLE_GROUP_CONFIGURATOR: ConfiguratorSpec = {
  id: "toggle-group-knobs",
  title: "Configure the toggle group",
  description:
    "One pressed at a time or many, starting selection, disabled state. Pressing a second option releases the first unless multiple is on — that is the behaviour, not a bug. The knobs describe the next mount (the stage remounts by key): pressing the live options does not flip them back, so a pressed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "multiple",
      label: "Multiple pressed",
      default: false,
    },
    {
      kind: "select",
      name: "pressed",
      label: "Pressed (initial state)",
      options: ["none", "bold", "bold-italic"],
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
    <ToggleGroup.Root
      key={`${multipleOf(v) ? "multi" : "single"}-${v.pressed === "bold-italic" ? "both" : v.pressed === "bold" ? "one" : "none"}-${disabledOf(v) ? "off" : "on"}`}
      multiple={multipleOf(v)}
      defaultValue={pressedOf(v)}
      disabled={disabledOf(v)}
      aria-label="Format"
    >
      {OPTIONS.map(([value, label, glyph]) => (
        <ToggleGroup.Item key={value} value={value} aria-label={label}>
          {glyph}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  ),
  code: (v) =>
    `<ToggleGroup.Root${rootPropsOf(v)}>\n${OPTIONS.map(([value, label, glyph]) => `  <ToggleGroup.Item value="${value}" aria-label="${label}">${glyph}</ToggleGroup.Item>`).join("\n")}\n</ToggleGroup.Root>`,
};
