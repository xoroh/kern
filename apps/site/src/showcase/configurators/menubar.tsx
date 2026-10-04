import { Button, Menubar } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Menubar configurator — the nineteenth Part-4 configurator (move #21),
 * second menu surface past Menu. Knobs are the bar axes the component doc
 * leaves open: `modal` (open menus inert the page or not), `disabled` (the
 * whole bar dead or alive — the edge composition, carried from the move-5
 * Group lesson), `loopFocus` (arrow keys wrap inside open menus, on by
 * default like Menu). No `orientation` (the bar is horizontal — that is
 * what makes it a menubar), no `variant`/`size`, no `elevation` — all ruled
 * out, so none is a knob. The stage shows the documented anatomy whole —
 * two menus with items — so the fence teaches it too. The stage remounts
 * by key on every knob so it cannot drift from the fence.
 */
function modalOf(v: ConfigValues): boolean {
  return v.modal !== false;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function loopOf(v: ConfigValues): boolean {
  return v.loopFocus !== false;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (!modalOf(v)) out.push("modal={false}");
  if (disabledOf(v)) out.push("disabled");
  if (!loopOf(v)) out.push("loopFocus={false}");
  return `${out.length > 0 ? ` ${out.join(" ")}` : ""} aria-label="App"`;
}

export const MENUBAR_CONFIGURATOR: ConfiguratorSpec = {
  id: "menubar-knobs",
  title: "Configure the menubar",
  description:
    "Modal or not, whole bar disabled or not, arrow keys wrap or stop. A disabled bar opens nothing — the triggers sit dead, which is the edge, not a bug. The knobs describe the next mount (the stage remounts by key): opening the live menus does not flip them back, so a closed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "modal",
      label: "Modal",
      default: true,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
    {
      kind: "boolean",
      name: "loopFocus",
      label: "Loop focus",
      default: true,
    },
  ],
  render: (v) => (
    <Menubar.Root
      key={`${modalOf(v) ? "modal" : "free"}-${disabledOf(v) ? "off" : "on"}-${loopOf(v) ? "loop" : "stop"}`}
      modal={modalOf(v)}
      disabled={disabledOf(v)}
      loopFocus={loopOf(v)}
      aria-label="App"
    >
      <Menubar.Menu>
        <Menubar.Trigger render={<Button variant="tonal">File</Button>} />
        <Menubar.Content>
          <Menubar.Item>New project</Menubar.Item>
          <Menubar.Item>Open…</Menubar.Item>
          <Menubar.Item>Save</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger render={<Button variant="tonal">Edit</Button>} />
        <Menubar.Content>
          <Menubar.Item>Undo</Menubar.Item>
          <Menubar.Item>Redo</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  ),
  code: (v) =>
    `<Menubar.Root${rootPropsOf(v)}>\n  <Menubar.Menu>\n    <Menubar.Trigger render={<Button variant="tonal">File</Button>} />\n    <Menubar.Content>\n      <Menubar.Item>New project</Menubar.Item>\n      <Menubar.Item>Open…</Menubar.Item>\n      <Menubar.Item>Save</Menubar.Item>\n    </Menubar.Content>\n  </Menubar.Menu>\n  <Menubar.Menu>\n    <Menubar.Trigger render={<Button variant="tonal">Edit</Button>} />\n    <Menubar.Content>\n      <Menubar.Item>Undo</Menubar.Item>\n      <Menubar.Item>Redo</Menubar.Item>\n    </Menubar.Content>\n  </Menubar.Menu>\n</Menubar.Root>`,
};
