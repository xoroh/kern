import { Button, Popover } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Popover configurator — the sixth Part-4 configurator (move #6), second
 * overlay past Dialog/Sheet and first non-modal one. The component doc rules
 * out `size`/`variant`, `placement`/`side`, `modal` and `elevation`, so the
 * honest knobs are the open-state axis only: uncontrolled `defaultOpen` on
 * the root plus `disabled` on the trigger (the doc's own api row — a
 * disabled trigger will not open the panel and is announced as
 * unavailable). `modal` exists on Base UI's root but the doc disowns it
 * ("a popover does not inert the page"), so it is not a knob here.
 *
 * The stage shows the documented anatomy whole — trigger, title,
 * description — so the fence teaches it too. `render`, not nesting: the
 * trigger already renders a native button, so a Button child would be
 * button-in-button (the Dialog/Sheet lesson). The stage remounts by key on
 * every knob so it cannot drift from the fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  return openOf(v) ? " defaultOpen" : "";
}

function triggerPropsOf(v: ConfigValues): string {
  return disabledOf(v) ? " disabled" : "";
}

export const POPOVER_CONFIGURATOR: ConfiguratorSpec = {
  id: "popover-knobs",
  title: "Configure the popover",
  description:
    "Open state is the only axis — open at first paint or not, trigger disabled or not. The trigger, title and description are part of the pattern, not knobs. The panel anchors to its trigger and never inerts the page; Escape or an outside click dismisses it. The knobs describe the next open (the stage remounts by key): dismissing the live popover does not flip them back, so a closed stage with open knobs is by design.",
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
      label: "Disabled trigger",
      default: false,
    },
  ],
  render: (v) => (
    <Popover.Root
      key={`${openOf(v) ? "open" : "shut"}-${disabledOf(v) ? "off" : "on"}`}
      defaultOpen={openOf(v)}
    >
      {/* `render`, not nesting: the trigger already renders a native button,
          so a Button child would be button-in-button (React refuses to
          hydrate that). The render element carries the trigger behaviour. */}
      <Popover.Trigger
        render={<Button variant="tonal">Open popover</Button>}
        disabled={disabledOf(v)}
      />
      <Popover.Content>
        <Popover.Title>Keyboard shortcut</Popover.Title>
        <Popover.Description>
          Press ⌘K anywhere to open the command menu.
        </Popover.Description>
      </Popover.Content>
    </Popover.Root>
  ),
  code: (v) =>
    `<Popover.Root${rootPropsOf(v)}>\n  <Popover.Trigger${triggerPropsOf(v)} render={<Button variant="tonal">Open popover</Button>} />\n  <Popover.Content>\n    <Popover.Title>Keyboard shortcut</Popover.Title>\n    <Popover.Description>\n      Press ⌘K anywhere to open the command menu.\n    </Popover.Description>\n  </Popover.Content>\n</Popover.Root>`,
};
