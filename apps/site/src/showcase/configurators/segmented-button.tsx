import { SegmentedButton } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * SegmentedButton configurator — the forty-second Part-4 configurator.
 * One genuine knob: `chosen` (which segment starts chosen — the
 * painted-verify axis; the chosen segment fills with the secondary
 * container role while the rest stay unfilled, visibly different
 * geometry, not asserted prose). Carried uncontrolled via `defaultValue`
 * so the stage needs no wiring, the move-14 ToggleGroup lesson.
 * Everything else is ruled out first-hand from the component doc: there
 * is no `variant` or `size` prop (every segment looks like every other —
 * the difference between them is which one is chosen), no `multiple`
 * (a segmented button is a single choice), no `orientation` (the bar is
 * horizontal by construction), no `elevation` (level 0, gated absent),
 * children are the segment labels (caller content), `className` merges,
 * controlled `value` + `onValueChange` are wiring not knobs, and the bar
 * has no label slot (that belongs to a Fieldset). The stage shows the
 * documented anatomy whole — three time-range segments — so the fence
 * teaches it too. The stage remounts by key on the knob so it cannot
 * drift from the fence.
 */
function chosenOf(v: ConfigValues): readonly string[] | undefined {
  if (v.chosen === "day") return ["day"];
  if (v.chosen === "week") return ["week"];
  if (v.chosen === "month") return ["month"];
  return undefined;
}

function rootPropsOf(v: ConfigValues): string {
  const chosen = chosenOf(v);
  if (chosen !== undefined) return ` defaultValue={["${chosen[0]}"]}`;
  return "";
}

const OPTIONS: Array<[string, string]> = [
  ["day", "Day"],
  ["week", "Week"],
  ["month", "Month"],
];

export const SEGMENTED_BUTTON_CONFIGURATOR: ConfiguratorSpec = {
  id: "segmented-button-knobs",
  title: "Configure the segmented button",
  description:
    "Which segment starts chosen. The bar is one choice across two to four options — the chosen segment fills, the rest stay quiet. The knob describes the next mount (the stage remounts by key): pressing a live segment does not flip it back, so a chosen stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "chosen",
      label: "Chosen (initial state)",
      options: ["none", "day", "week", "month"],
      default: "none",
    },
  ],
  render: (v) => (
    <SegmentedButton.Root
      key={
        v.chosen === "day" || v.chosen === "week" || v.chosen === "month"
          ? String(v.chosen)
          : "none"
      }
      defaultValue={chosenOf(v)}
      aria-label="Range"
    >
      {OPTIONS.map(([value, label]) => (
        <SegmentedButton.Item key={value} value={value}>
          {label}
        </SegmentedButton.Item>
      ))}
    </SegmentedButton.Root>
  ),
  code: (v) =>
    `<SegmentedButton.Root${rootPropsOf(v)} aria-label="Range">\n${OPTIONS.map(([value, label]) => `  <SegmentedButton.Item value="${value}">${label}</SegmentedButton.Item>`).join("\n")}\n</SegmentedButton.Root>\n\n// single choice only — no multiple, variant, size, or orientation props; the bar's label belongs to a Fieldset.`,
};
