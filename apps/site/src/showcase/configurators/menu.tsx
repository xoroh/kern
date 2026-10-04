import { Button, Menu } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Menu configurator — the eighteenth Part-4 configurator (move #20),
 * first menu surface. Knobs are the open-state axes the component doc
 * leaves open: `defaultOpen` (open at first paint), `modal` (inert the
 * page behind or not), `loopFocus` (arrow keys wrap past the last item —
 * the edge composition, carried from the move-5 Group lesson; on by
 * default, so the knob demonstrates the wrap by turning it off and on).
 * No `size`/`variant`, no `placement`/`side`, no `elevation` — all ruled
 * out, so none is a knob. The stage shows the documented anatomy whole —
 * trigger, group label, items, separator — so the fence teaches it too.
 *
 * `render`, not nesting: the trigger already renders a native button, so a
 * Button child would be button-in-button (the Dialog/Sheet/Popover/Drawer
 * lesson). The stage remounts by key on every knob so it cannot drift from
 * the fence.
 */
function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function modalOf(v: ConfigValues): boolean {
  return v.modal !== false;
}

function loopOf(v: ConfigValues): boolean {
  return v.loopFocus !== false;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (openOf(v)) out.push("defaultOpen");
  if (!modalOf(v)) out.push("modal={false}");
  if (!loopOf(v)) out.push("loopFocus={false}");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const MENU_CONFIGURATOR: ConfiguratorSpec = {
  id: "menu-knobs",
  title: "Configure the menu",
  description:
    "Open at first paint or not, modal or not, arrow keys wrap or stop at the ends. Loop focus is on by default — past the last item, ArrowDown lands back on the first; turning it off parks focus at the end instead. The knobs describe the next mount (the stage remounts by key): dismissing the live menu does not flip them back, so a closed stage with open knobs is by design.",
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
      name: "loopFocus",
      label: "Loop focus",
      default: true,
    },
  ],
  render: (v) => (
    <Menu.Root
      key={`${openOf(v) ? "open" : "shut"}-${modalOf(v) ? "modal" : "free"}-${loopOf(v) ? "loop" : "stop"}`}
      defaultOpen={openOf(v)}
      modal={modalOf(v)}
      loopFocus={loopOf(v)}
    >
      {/* `render`, not nesting: the trigger already renders a native button,
          so a Button child would be button-in-button (React refuses to
          hydrate that). The render element carries the trigger behaviour. */}
      <Menu.Trigger render={<Button variant="tonal">Account menu</Button>} />
      <Menu.Content>
        <Menu.GroupLabel>Account</Menu.GroupLabel>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Billing</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Sign out</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
  code: (v) =>
    `<Menu.Root${rootPropsOf(v)}>\n  <Menu.Trigger render={<Button variant="tonal">Account menu</Button>} />\n  <Menu.Content>\n    <Menu.GroupLabel>Account</Menu.GroupLabel>\n    <Menu.Item>Profile</Menu.Item>\n    <Menu.Item>Billing</Menu.Item>\n    <Menu.Separator />\n    <Menu.Item>Sign out</Menu.Item>\n  </Menu.Content>\n</Menu.Root>`,
};
