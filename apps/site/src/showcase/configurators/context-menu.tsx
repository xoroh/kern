import { ContextMenu } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * ContextMenu configurator — the thirty-second Part-4 configurator
 * (move #35). One genuine knob: `open` (whether the menu mounts open —
 * the painted-verify axis; right-click is paint-hostile to headless
 * proof). Everything else is fixed anatomy or app wiring by design: the
 * primitive omits modal/openOnHover/delay props on this root, items are
 * the caller's content, and there is no trigger id to configure. The
 * stage shows the documented anatomy whole — trigger zone plus content
 * with one item and a separator — so the fence teaches it too. The stage
 * remounts by key on the knob so it cannot drift from the fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.open === true;
}

function rootPropsOf(v: ConfigValues): string {
  return openOf(v) ? " defaultOpen" : "";
}

export const CONTEXT_MENU_CONFIGURATOR: ConfiguratorSpec = {
  id: "context-menu-knobs",
  title: "Configure the context menu",
  description:
    "Open at first paint, or shut behind right-click. A context menu appears where its trigger is right-clicked — there is no delay or modal to configure, the timing belongs to the primitive. The knob describes the next mount (the stage remounts by key): right-clicking the live trigger does not flip it back, so a changed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "boolean",
      name: "open",
      label: "Open (initial state)",
      default: false,
    },
  ],
  render: (v) => (
    <ContextMenu.Root key={openOf(v) ? "open" : "shut"} defaultOpen={openOf(v)}>
      <ContextMenu.Trigger>Right-click zone</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Paste</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
  code: (v) =>
    `<ContextMenu.Root${rootPropsOf(v)}>\n  <ContextMenu.Trigger>Right-click zone</ContextMenu.Trigger>\n  <ContextMenu.Content>\n    <ContextMenu.Item>Copy</ContextMenu.Item>\n    <ContextMenu.Separator />\n    <ContextMenu.Item>Paste</ContextMenu.Item>\n  </ContextMenu.Content>\n</ContextMenu.Root>\n\n// No delay/modal props: open timing belongs to the primitive.`,
};
