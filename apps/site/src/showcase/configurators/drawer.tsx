import { Button, Drawer } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Drawer configurator — the seventeenth Part-4 configurator (move #17),
 * second bottom-anchored surface past the sheets. Knobs are the dismissal
 * axes the component doc leaves open: `defaultOpen` (open at first paint),
 * `modal` (inert the page behind or not — the doc's own aria row, a modal
 * drawer "must say so"), `disablePointerDismissal` (outside clicks stop
 * dismissing — the edge composition, carried from the move-5 Group lesson).
 * No `side`/`anchor` (bottom-anchored by construction — a side sheet is
 * `Sheet`), no `size`, no `elevation` (level 1, registered) — all ruled
 * out, so none is a knob. The stage shows the documented anatomy whole —
 * trigger, title, description, close — so the fence teaches it too.
 *
 * `render`, not nesting: the trigger already renders a native button, so a
 * Button child would be button-in-button (the Dialog/Sheet/Popover lesson).
 * The stage remounts by key on every knob so it cannot drift from the
 * fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function modalOf(v: ConfigValues): boolean {
  return v.modal !== false;
}

function guardedOf(v: ConfigValues): boolean {
  return v.disablePointerDismissal === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (openOf(v)) out.push("defaultOpen");
  if (!modalOf(v)) out.push("modal={false}");
  if (guardedOf(v)) out.push("disablePointerDismissal");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const DRAWER_CONFIGURATOR: ConfiguratorSpec = {
  id: "drawer-knobs",
  title: "Configure the drawer",
  description:
    "Open at first paint or not, modal or not, outside clicks dismiss or not. With pointer dismissal disabled the backdrop stops working and only the close control or Escape dismisses — that is the edge, not a bug. The knobs describe the next mount (the stage remounts by key): dismissing the live drawer does not flip them back, so a closed stage with open knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "defaultOpen",
      label: "Open (initial state)",
      default: false,
    },
    {
      kind: "boolean",
      name: "modal",
      label: "Modal",
      default: true,
    },
    {
      kind: "boolean",
      name: "disablePointerDismissal",
      label: "No backdrop dismiss",
      default: false,
    },
  ],
  render: (v) => (
    <Drawer.Root
      key={`${openOf(v) ? "open" : "shut"}-${modalOf(v) ? "modal" : "free"}-${guardedOf(v) ? "guard" : "open"}`}
      defaultOpen={openOf(v)}
      modal={modalOf(v)}
      disablePointerDismissal={guardedOf(v)}
    >
      {/* `render`, not nesting: the trigger already renders a native button,
          so a Button child would be button-in-button (React refuses to
          hydrate that). The render element carries the trigger behaviour. */}
      <Drawer.Trigger render={<Button variant="tonal">Open drawer</Button>} />
      <Drawer.Content>
        <Drawer.Title>Share this project</Drawer.Title>
        <Drawer.Description>
          Anyone with the link can view the read-only build.
        </Drawer.Description>
        <Drawer.Close render={<Button variant="tonal">Done</Button>} />
      </Drawer.Content>
    </Drawer.Root>
  ),
  code: (v) =>
    `<Drawer.Root${rootPropsOf(v)}>\n  <Drawer.Trigger render={<Button variant="tonal">Open drawer</Button>} />\n  <Drawer.Content>\n    <Drawer.Title>Share this project</Drawer.Title>\n    <Drawer.Description>\n      Anyone with the link can view the read-only build.\n    </Drawer.Description>\n    <Drawer.Close render={<Button variant="tonal">Done</Button>} />\n  </Drawer.Content>\n</Drawer.Root>`,
};
