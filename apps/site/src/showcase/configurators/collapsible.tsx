import { Collapsible } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Collapsible configurator — the twenty-fourth Part-4 configurator
 * (move #27), first single show/hide disclosure. Knobs are the open-state
 * axes: `defaultOpen` (panel open at first paint — the painted-verify
 * role), `open` is deliberately NOT a knob (controlled open state belongs
 * to the app, not the showcase), `disabled` (the trigger goes dead — the
 * edge composition, carried from the move-5 Group lesson). The stage shows
 * the documented anatomy whole — trigger plus panel — so the fence teaches
 * it too. The stage remounts by key on every knob so it cannot drift from
 * the fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (openOf(v)) out.push("defaultOpen");
  if (disabledOf(v)) out.push("disabled");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const COLLAPSIBLE_CONFIGURATOR: ConfiguratorSpec = {
  id: "collapsible-knobs",
  title: "Configure the collapsible",
  description:
    "Open at first paint or not, trigger dead or alive. A disabled trigger opens nothing — the panel stays shut no matter how often it is pressed, which is the edge, not a bug. The knobs describe the next mount (the stage remounts by key): toggling the live panel does not flip them back, so a toggled stage with untouched knobs is by design.",
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
  ],
  render: (v) => (
    <Collapsible.Root
      key={`${openOf(v) ? "open" : "shut"}-${disabledOf(v) ? "off" : "on"}`}
      defaultOpen={openOf(v)}
      disabled={disabledOf(v)}
    >
      <Collapsible.Trigger>What is included?</Collapsible.Trigger>
      <Collapsible.Panel>
        Tokens, components, theme presets and a CLI scaffold.
      </Collapsible.Panel>
    </Collapsible.Root>
  ),
  code: (v) =>
    `<Collapsible.Root${rootPropsOf(v)}>\n  <Collapsible.Trigger>What is included?</Collapsible.Trigger>\n  <Collapsible.Panel>\n    Tokens, components, theme presets and a CLI scaffold.\n  </Collapsible.Panel>\n</Collapsible.Root>`,
};
