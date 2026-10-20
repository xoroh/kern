import { NavigationMenu } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Navigation menu examples — site navigation with a panel per top-level item.
 *
 * The trigger is the tab stop and the panel is its content: an
 * `NavigationMenu.Item` holds the trigger and the links that belong under it.
 * The panel is portalled, so the menu is not clipped by the bar it sits in.
 *
 * WEB composition. The native menu is a flat row of destinations with no
 * panels; the mobile page carries its own live demo.
 */
export const NAVIGATION_MENU_EXAMPLES: ExampleSpec[] = [
  {
    id: "navigation-menu-dropdown",
    title: "A top-level item that opens a panel",
    description:
      "The trigger names the section and the panel holds the links under it. The panel is portalled rather than nested, so a long list of links is not cut off by the bar it hangs from.",
    render: () => (
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/components?platform=web">
                Analytics
              </NavigationMenu.Link>
              <NavigationMenu.Link href="/components?platform=mobile">
                Audit
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Pricing</NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    ),
    code: `<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/components?platform=web">
          Analytics
        </NavigationMenu.Link>
        <NavigationMenu.Link href="/components?platform=mobile">
          Audit
        </NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`,
  },
];
