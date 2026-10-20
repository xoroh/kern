import type { ComponentDoc } from "../types";

export const navigationMenu: ComponentDoc = {
  slug: "navigation-menu",
  name: "Navigation menu",
  oneLiner:
    "Navigation menus open a panel of links from a trigger in a site's main navigation.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native ships `NavigationMenu` too, so the counterpart is direct.
    nativePeer: "NavigationMenu",
    // No variant axis. The menu is one treatment; the state is open or closed.
    variants: [],
    // M3's row "menu" rests at level 2, and the popup ships
    // `--sys-elevation-level2` to match.
    elevation: 2,
  },
  parts: [
    "NavigationMenu",
    "NavigationMenuRoot",
    "NavigationMenuList",
    "NavigationMenuItem",
    "NavigationMenuTrigger",
    "NavigationMenuContent",
    "NavigationMenuLink",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Arrow keys",
      action: "Moves between triggers; Enter and Space open the menu.",
    },
    {
      key: "Escape",
      action: "Closes the menu and returns focus to the trigger.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The panel's surface, outline and lift come from the system roles and `--sys-elevation-level2`, so a theme moves the menu with everything else.",
      "Panel width is a minimum rather than a fixed width, so it grows with its content.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One treatment; the state is open or closed.",
      "There is no `placement` or `side` prop. The panel is positioned for you against its trigger.",
      "There is no `elevation` prop. The panel's resting level matches M3's menu row.",
    ],
  },
  api: [
    {
      name: "value",
      for: ["NavigationMenuRoot", "NavigationMenuItem"],
      type: "string",
      note: "Controlled open item on `NavigationMenuRoot`. Omit for uncontrolled. On an item it is the unique value identifying it. On an item it is the unique value identifying it — use it to control the menu programmatically.",
    },
    {
      name: "onValueChange",
      for: ["NavigationMenuRoot"],
      type: "(value: string) => void",
      note: "Fires when the open item changes, including when it closes.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["NavigationMenuTrigger"],
      type: "boolean",
      note: "On a trigger: the item cannot be opened and is announced as unavailable.",
    },
    {
      name: "href",
      for: ["NavigationMenuLink"],
      type: "string",
      note: "On `NavigationMenuLink`. It is a link, so it navigates rather than acting.",
    },
    {
      name: "actionsRef",
      for: ["NavigationMenuRoot"],
      type: "RefObject<NavigationMenuRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the popup; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onValueChange` first).",
    },
    {
      name: "onOpenChangeComplete",
      for: ["NavigationMenuRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onValueChange`.",
    },
    {
      name: "defaultValue",
      for: ["NavigationMenuRoot"],
      type: "unknown",
      note: "Initially open item, when uncontrolled. Use `value` for controlled.",
    },
    {
      name: "delay",
      for: ["NavigationMenuRoot"],
      type: "number | undefined",
      note: "Milliseconds to wait before a hovered trigger opens its popup.",
    },
    {
      name: "closeDelay",
      for: ["NavigationMenuRoot"],
      type: "number | undefined",
      note: "Milliseconds to wait before closing a hover-opened popup.",
    },
    {
      name: "orientation",
      for: ["NavigationMenuRoot"],
      type: '"horizontal" | "vertical" | undefined',
      note: "Direction the bar lays its triggers out in — horizontal across the top, or vertical down a side.",
    },
    {
      name: "nativeButton",
      for: ["NavigationMenuTrigger"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "closeOnClick",
      for: ["NavigationMenuLink"],
      type: "boolean | undefined",
      note: "Whether following the link closes the popup.",
    },
    {
      name: "active",
      for: ["NavigationMenuLink"],
      type: "boolean | undefined",
      note: "Whether the link marks the current page. Style the active state off it rather than tracking the route twice.",
    },
    {
      name: "style",
      for: [
        "NavigationMenuRoot",
        "NavigationMenuList",
        "NavigationMenuItem",
        "NavigationMenuTrigger",
        "NavigationMenuContent",
        "NavigationMenuLink",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `NavigationMenuRootState` on the bar, `NavigationMenuListState` on the row, `NavigationMenuItemState` on an item, `NavigationMenuTriggerState` on a trigger, `NavigationMenuPopupState` on the popup, `NavigationMenuLinkState` on a link.",
    },
    {
      name: "render",
      for: [
        "NavigationMenuRoot",
        "NavigationMenuList",
        "NavigationMenuItem",
        "NavigationMenuTrigger",
        "NavigationMenuContent",
        "NavigationMenuLink",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on a trigger when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The list is a menubar and the triggers are menuitems with `aria-expanded`, so the structure is announced rather than inferred from layout.",
    "The panel is a menu, and its links are links — so a destination is announced as something you go to, not something you press.",
    "Up/Down and Left/Right move between entries, Escape closes the open panel and returns focus to its trigger.",
    "The trigger keeps focus while its panel is open, so exploring the panel never loses your place in the bar.",
  ],
};
