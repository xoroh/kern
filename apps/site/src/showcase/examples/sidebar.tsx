import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
} from "@xoroh/kern/start";
import type { ExampleSpec } from "../example";

/**
 * Sidebar examples — the app's persistent navigation region.
 *
 * The provider owns the open state and publishes it, so a top-bar toggle can
 * reach the sidebar without threading props through the tree. The three
 * regions are separate exports, so a shell omits or replaces any of them.
 *
 * WEB ONLY. The sidebar is a `@xoroh/kern/start` composition with no native
 * counterpart — the narrower forms on native are the navigation rail and the
 * navigation drawer.
 */
export const SIDEBAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "sidebar-regions",
    title: "One region, three slots, one owner",
    description:
      "The provider owns the open state and publishes it, which is how a toggle elsewhere in the shell reaches the sidebar. The three regions are separate exports, so a shell keeps only the ones it needs.",
    render: () => (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Kern</SidebarHeader>
          <SidebarContent>
            <SidebarItem label="Home" active />
            <SidebarItem label="Docs" />
          </SidebarContent>
          <SidebarFooter>v0.1.0</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    ),
    code: `<SidebarProvider>
  <Sidebar>
    <SidebarHeader>Kern</SidebarHeader>
    <SidebarContent>
      <SidebarItem label="Home" active />
      <SidebarItem label="Docs" />
    </SidebarContent>
    <SidebarFooter>v0.1.0</SidebarFooter>
  </Sidebar>
</SidebarProvider>`,
    package: "@xoroh/kern/start",
  },
];
