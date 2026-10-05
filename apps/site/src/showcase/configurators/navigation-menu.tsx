import { NavigationMenu } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * NavigationMenu configurator — the twenty-third Part-4 configurator
 * (move #26), first site-navigation surface. Knobs are the open-state axes
 * the component doc leaves open: `openPanel` (which dropdown, if any, is
 * open at first paint — the painted-verify role), `delay` (hover-to-open
 * milliseconds), `closeDelay` (hover-away-to-close milliseconds). No
 * `orientation` (the bar is horizontal; a vertical stack is the root's
 * `className` and its own layout — same caution as Tabs/Slider), no
 * `size`/`variant`, no `elevation` — all ruled out, so none is a knob. The
 * stage shows the documented anatomy whole — two items with values, one
 * dropdown with links — so the fence teaches it too. The stage remounts by
 * key on every knob so it cannot drift from the fence.
 *
 * Items carry explicit values (the demo leaves them auto-generated):
 * without stable values the openPanel knob could not target a panel, so
 * the values are part of the knob contract, not decoration.
 */
function openPanelOf(v: ConfigValues): string | undefined {
  return v.openPanel === "products" || v.openPanel === "company"
    ? v.openPanel
    : undefined;
}

function delayOf(v: ConfigValues): number {
  return v.delay === "0" ? 0 : 50;
}

function closeDelayOf(v: ConfigValues): number {
  return v.closeDelay === "0" ? 0 : 50;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  const panel = openPanelOf(v);
  if (panel !== undefined) out.push(`defaultValue="${panel}"`);
  if (delayOf(v) !== 50) out.push(`delay={${delayOf(v)}}`);
  if (closeDelayOf(v) !== 50) out.push(`closeDelay={${closeDelayOf(v)}}`);
  return `${out.length > 0 ? ` ${out.join(" ")}` : ""} aria-label="Site"`;
}

export const NAVIGATION_MENU_CONFIGURATOR: ConfiguratorSpec = {
  id: "navigation-menu-knobs",
  title: "Configure the navigation menu",
  description:
    "Which dropdown opens at first paint, hover-to-open and hover-away-to-close timing. Zero delay opens and closes instantly — the patient defaults wait 50 milliseconds. The knobs describe the next mount (the stage remounts by key): hovering the live bar does not flip them back, so an opened stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "openPanel",
      label: "Open panel (initial state)",
      options: ["none", "products", "company"],
      default: "none",
    },
    {
      kind: "select",
      name: "delay",
      label: "Open delay (ms)",
      options: ["50", "0"],
      default: "50",
    },
    {
      kind: "select",
      name: "closeDelay",
      label: "Close delay (ms)",
      options: ["50", "0"],
      default: "50",
    },
  ],
  render: (v) => (
    <NavigationMenu.Root
      key={`${openPanelOf(v) ?? "shut"}-${delayOf(v)}-${closeDelayOf(v)}`}
      defaultValue={openPanelOf(v)}
      delay={delayOf(v)}
      closeDelay={closeDelayOf(v)}
      aria-label="Site"
    >
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/components/web">
              Web components
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/components/mobile">
              Mobile components
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="company">
          <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
  code: (v) =>
    `<NavigationMenu.Root${rootPropsOf(v)}>\n  <NavigationMenu.List>\n    <NavigationMenu.Item value="products">\n      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>\n      <NavigationMenu.Content>\n        <NavigationMenu.Link href="/components/web">Web components</NavigationMenu.Link>\n        <NavigationMenu.Link href="/components/mobile">Mobile components</NavigationMenu.Link>\n      </NavigationMenu.Content>\n    </NavigationMenu.Item>\n    <NavigationMenu.Item value="company">\n      <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>\n      <NavigationMenu.Content>\n        <NavigationMenu.Link href="/about">About</NavigationMenu.Link>\n      </NavigationMenu.Content>\n    </NavigationMenu.Item>\n  </NavigationMenu.List>\n</NavigationMenu.Root>`,
};
