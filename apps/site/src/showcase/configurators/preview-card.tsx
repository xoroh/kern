import { Button, PreviewCard } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * PreviewCard configurator — the thirtieth Part-4 configurator
 * (move #33), last of the hover family. One genuine knob: `open`
 * (whether the card mounts open — the painted-verify axis; shut by
 * default behind hover, which headless paint cannot perform). Everything
 * else is fixed anatomy or app wiring by design: open timing is the
 * primitive's (no delay prop exists), and `handle`/`triggerId` are
 * imperative or identifiers, not knobs. The stage shows the documented
 * anatomy whole — ghost trigger plus card body as plain text (never the
 * demo's ad-hoc `text-sm`, per the move-27 typescale lesson) — so the
 * fence teaches it too. The stage remounts by key on the knob so it
 * cannot drift from the fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.open === true;
}

function rootPropsOf(v: ConfigValues): string {
  return openOf(v) ? " defaultOpen" : "";
}

export const PREVIEW_CARD_CONFIGURATOR: ConfiguratorSpec = {
  id: "preview-card-knobs",
  title: "Configure the preview card",
  description:
    "Open at first paint, or shut behind hover. A preview card appears when its trigger is hovered — there is no delay to configure, the timing belongs to the primitive. The knob describes the next mount (the stage remounts by key): hovering or leaving the live trigger does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "boolean",
      name: "open",
      label: "Open (initial state)",
      default: false,
    },
  ],
  render: (v) => (
    <PreviewCard.Root key={openOf(v) ? "open" : "shut"} defaultOpen={openOf(v)}>
      <PreviewCard.Trigger render={<Button variant="ghost">@xoroh</Button>} />
      <PreviewCard.Content>
        The open-source design system following Material Design 3.
      </PreviewCard.Content>
    </PreviewCard.Root>
  ),
  code: (v) =>
    `<PreviewCard.Root${rootPropsOf(v)}>\n  <PreviewCard.Trigger render={<Button variant="ghost">@xoroh</Button>} />\n  <PreviewCard.Content>\n    The open-source design system following Material Design 3.\n  </PreviewCard.Content>\n</PreviewCard.Root>\n\n// No delay prop: open timing belongs to the primitive.\n// handle/triggerId are app wiring, not props here.`,
};
