import { Button, Drawer } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Drawer examples — the bottom-anchored modal panel.
 *
 * The drawer is bottom-anchored BY CONSTRUCTION: there is no `side` or
 * `anchor` prop, because a side panel is `Sheet`. The compound is what the
 * example has to show — trigger, content, title, description, close — because
 * the panel is only a dialog once it is named and there is a way out of it.
 *
 * WEB composition. Native has no `Drawer`: its bottom-anchored surface is
 * `Sheet`, and it has `NavigationDrawer` for the navigation case — neither is
 * this component, which is why the mobile side of this family has no page.
 */
export const DRAWER_EXAMPLES: ExampleSpec[] = [
  {
    id: "drawer-bottom-panel",
    title: "A panel that comes up from the bottom edge",
    description:
      "The title names the panel and the close control gives it a way out. Escape and a backdrop press both dismiss it, and focus returns to the trigger that opened it.",
    render: () => (
      <Drawer.Root>
        <Drawer.Trigger render={<Button variant="tonal">Export</Button>} />
        <Drawer.Content>
          <Drawer.Title>Export report</Drawer.Title>
          <Drawer.Description>
            Pick a format. The export runs in the background.
          </Drawer.Description>
          <Drawer.Close render={<Button variant="text">Cancel</Button>} />
        </Drawer.Content>
      </Drawer.Root>
    ),
    code: `<Drawer.Root>
  <Drawer.Trigger render={<Button variant="tonal">Export</Button>} />
  <Drawer.Content>
    <Drawer.Title>Export report</Drawer.Title>
    <Drawer.Description>Pick a format.</Drawer.Description>
    <Drawer.Close render={<Button variant="text">Cancel</Button>} />
  </Drawer.Content>
</Drawer.Root>`,
  },
];
