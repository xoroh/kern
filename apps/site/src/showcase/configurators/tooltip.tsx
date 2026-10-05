import { Button, Tooltip } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Tooltip configurator — the twenty-second Part-4 configurator (move #25),
 * first hover surface. Knobs are the timing axes the component doc leaves
 * open: `defaultOpen` (open at first paint — the painted-verify role),
 * `disabled` (state), `disableHoverablePopup` (the popup stops being
 * hoverable — moving off the trigger dismisses it; the edge composition,
 * carried from the move-5 Group lesson), `trackCursorAxis` (the popup
 * follows the cursor on none/x/y/both — a genuine four-way axis). No
 * `placement`/`side`, no `variant`/`tone`/`size`, no `arrow` — all ruled
 * out, so none is a knob. The stage shows the documented anatomy whole —
 * provider, trigger, content — so the fence teaches it too.
 *
 * `render`, not nesting: the trigger already renders a native button, so a
 * Button child would be button-in-button (the Dialog/Sheet/Popover/Drawer
 * lesson). The stage remounts by key on every knob so it cannot drift from
 * the fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function unhoverableOf(v: ConfigValues): boolean {
  return v.disableHoverablePopup === true;
}

function axisOf(v: ConfigValues): "none" | "x" | "y" | "both" {
  return v.trackCursorAxis === "x" ||
    v.trackCursorAxis === "y" ||
    v.trackCursorAxis === "both"
    ? v.trackCursorAxis
    : "none";
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (openOf(v)) out.push("defaultOpen");
  if (disabledOf(v)) out.push("disabled");
  if (unhoverableOf(v)) out.push("disableHoverablePopup");
  if (axisOf(v) !== "none") out.push(`trackCursorAxis="${axisOf(v)}"`);
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const TOOLTIP_CONFIGURATOR: ConfiguratorSpec = {
  id: "tooltip-knobs",
  title: "Configure the tooltip",
  description:
    "Open at first paint or not, disabled or not, hoverable popup or not, cursor tracking on none, one axis, or both. With the hoverable popup off, moving off the trigger dismisses the tip — that is the edge, not a bug. The knobs describe the next mount (the stage remounts by key): hovering the live trigger does not flip them back, so a tipped stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "defaultOpen",
      label: "Open (initial state)",
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
      name: "disableHoverablePopup",
      label: "Non-hoverable popup",
      default: false,
    },
    {
      kind: "select",
      name: "trackCursorAxis",
      label: "Track cursor",
      options: ["none", "x", "y", "both"],
      default: "none",
    },
  ],
  render: (v) => (
    <Tooltip.Provider>
      <Tooltip.Root
        key={`${openOf(v) ? "open" : "shut"}-${disabledOf(v) ? "off" : "on"}-${unhoverableOf(v) ? "bare" : "hover"}-${axisOf(v)}`}
        defaultOpen={openOf(v)}
        disabled={disabledOf(v)}
        disableHoverablePopup={unhoverableOf(v)}
        trackCursorAxis={axisOf(v)}
      >
        {/* `render`, not nesting: the trigger already renders a native button,
            so a Button child would be button-in-button (React refuses to
            hydrate that). The render element carries the trigger behaviour. */}
        <Tooltip.Trigger render={<Button variant="tonal">Deploy</Button>} />
        <Tooltip.Content>Deploy the current build</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
  code: (v) =>
    `<Tooltip.Provider>\n  <Tooltip.Root${rootPropsOf(v)}>\n    <Tooltip.Trigger render={<Button variant="tonal">Deploy</Button>} />\n    <Tooltip.Content>Deploy the current build</Tooltip.Content>\n  </Tooltip.Root>\n</Tooltip.Provider>`,
};
