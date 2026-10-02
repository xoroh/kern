import {
  Button,
  MenubarMenu,
  MenubarRoot,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Menu examples — the menus cluster.
 *
 * The web menu is a COMPOUND (Root / Trigger / Content / Item / Separator),
 * not a data-driven list like the native one. The examples show the two things
 * the doc pages call out: the trigger is yours to name, and a destructive item
 * is expressed with the error roles rather than a variant.
 */
export const MENU_EXAMPLES: ExampleSpec[] = [
  {
    id: "compound",
    title: "The compound: your trigger, their popup",
    description:
      "`MenuTrigger` is a slot, so the control that opens the menu is entirely yours. The popup content is the library's. Name the trigger — it opens a menu nobody can hear otherwise.",
    render: () => (
      <MenuRoot>
        <MenuTrigger render={<Button variant="outlined">Options</Button>} />
        <MenuContent>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem disabled>Archive</MenuItem>
          <MenuSeparator />
          <MenuItem>Move to…</MenuItem>
        </MenuContent>
      </MenuRoot>
    ),
    code: `<MenuRoot>
  <MenuTrigger render={<Button variant="outlined">Options</Button>} />
  <MenuContent>
    <MenuItem>Rename</MenuItem>
    <MenuItem>Duplicate</MenuItem>
    <MenuItem disabled>Archive</MenuItem>
    <MenuSeparator />
    <MenuItem>Move to…</MenuItem>
  </MenuContent>
</MenuRoot>`,
  },
  {
    id: "destructive-item",
    title: "A destructive item, without a destructive variant",
    description:
      '`MenuItem` has no `variant="destructive"` — the library rejects it. An irreversible action is an item painted with the error roles, which is why this is a class and not a variant.',
    render: () => (
      <MenuRoot>
        <MenuTrigger render={<Button variant="outlined">Project</Button>} />
        <MenuContent>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuSeparator />
          <MenuItem className="text-(--md-sys-color-error) focus:text-(--md-sys-color-error)">
            Delete project
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    ),
    code: `<MenuContent>
  <MenuItem>Settings</MenuItem>
  <MenuSeparator />
  <MenuItem className="text-(--md-sys-color-error) focus:text-(--md-sys-color-error)">
    Delete project
  </MenuItem>
</MenuContent>`,
  },
];

/**
 * Menubar examples — kept separate from `Menu`, which is a different export
 * with a different composition even though the parts look alike.
 */
export const MENUBAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "named-menus",
    title: "A bar of named menus",
    description:
      "Each menu in the bar carries its own label, which is what makes the row read as named destinations rather than as one row of unlabelled buttons.",
    render: () => (
      <MenubarRoot>
        <MenubarMenu>
          <MenuTrigger render={<Button variant="ghost">File</Button>} />
          <MenuContent>
            <MenuItem>New</MenuItem>
            <MenuItem>Open…</MenuItem>
            <MenuSeparator />
            <MenuItem>Save</MenuItem>
          </MenuContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenuTrigger render={<Button variant="ghost">Edit</Button>} />
          <MenuContent>
            <MenuItem>Undo</MenuItem>
            <MenuItem>Redo</MenuItem>
          </MenuContent>
        </MenubarMenu>
      </MenubarRoot>
    ),
    code: `<MenubarRoot>
  <MenubarMenu>
    <MenuTrigger render={<Button variant="ghost">File</Button>} />
    <MenuContent>
      <MenuItem>New</MenuItem>
    </MenuContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenuTrigger render={<Button variant="ghost">Edit</Button>} />
    <MenuContent>
      <MenuItem>Undo</MenuItem>
    </MenuContent>
  </MenubarMenu>
</MenubarRoot>`,
  },
];
