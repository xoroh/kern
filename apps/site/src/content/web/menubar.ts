import type { ComponentDoc } from "../types";

export const menubar: ComponentDoc = {
  slug: "menubar",
  name: "Menubar",
  oneLiner:
    "A menubar is a horizontal row of menus, the way an application exposes its commands.",
  features:
    "Reach for a menubar when a full application surface needs its command set always reachable and grouped by task: File, Edit, View, Insert. It is the desktop application pattern and it belongs to app shells, not to web pages — a marketing site with a menubar is wearing someone else's clothes. Each menu in the bar is a normal menu, so the entries follow the same rules: actions, grouped, destructive ones last. The bar is for breadth; if you have two menus, you probably have two buttons.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Menubar",
    // No variant axis. The bar is one treatment.
    variants: [],
    // No elevation token on the bar or its popups, and no row in
    // m3-elevation.ts. Nothing asserted either way — see Customization.
    elevation: "surface",
  },
  parts: [
    "Menubar",
    "MenubarRoot",
    "MenubarMenu",
    "MenubarTrigger",
    "MenubarContent",
    "MenubarItem",
  ],
  anatomy: [
    {
      name: "MenubarRoot",
      role: "The bar. Owns which of its menus is open, so opening one closes the others.",
    },
    {
      name: "MenubarMenu",
      role: "One menu's grouping inside the bar.",
    },
    {
      name: "MenubarTrigger",
      role: "The bar entry that opens its menu. Carries the expanded state.",
    },
    {
      name: "MenubarContent",
      role: "The list surface for one menu, positioned against its trigger.",
    },
    { name: "MenubarItem", role: "One action inside a menu." },
    { name: "Menubar", role: "The namespace object: all of the parts above." },
  ],
  keyboard: [
    {
      key: "Arrow keys",
      action: "Moves between top-level menus; Down opens the focused menu.",
    },
    {
      key: "Escape",
      action: "Closes the open menu and returns focus to its trigger.",
    },
  ],
  usage: {
    do: [
      "Use for desktop File/Edit/View command patterns.",
      "Keep top-level labels to one word each.",
    ],
    dont: [
      "Don't use on touch-first surfaces — reach for a menu button instead.",
    ],
  },
  tokens: [
    {
      element: "Bar",
      state: "resting",
      token: "kern.menubar.container",
      value: "full pill, surface-tonal, h-12",
    },
    {
      element: "Open trigger",
      state: "resting",
      token: "kern.menubar.open",
      value: "on-surface 8% layer",
    },
  ],
  faq: [
    {
      q: "Menubar or navigation menu?",
      a: "Menubar for application command strips; NavigationMenu for site wayfinding dropdowns.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The bar and its menus share the menu's item states (`data-highlighted`, `data-disabled`), so one stylesheet covers both.",
      "Colours come from the system roles, so a theme moves the whole bar at once.",
    ],
    notSupported: [
      "There is no `orientation` prop. The bar is horizontal — that is what makes it a menubar rather than a menu stack.",
      "There is no `variant` or `size` prop.",
      "There is no `elevation` prop, and the popups ship no elevation token. Nothing in m3-elevation.ts asserts a level for this component.",
    ],
  },
  api: [
    {
      name: "className",
      for: ["MenubarRoot", "MenubarTrigger", "MenubarContent", "MenubarItem"],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["MenubarRoot", "MenubarMenu", "MenubarTrigger", "MenubarItem"],
      type: "boolean",
      note: "On a trigger or an item. On the bar it disables the whole set. On the bar it disables the whole set.",
    },
    {
      name: "modal",
      for: ["MenubarRoot", "MenubarMenu"],
      type: "boolean | undefined",
      note: "Whether an open menu is modal: interaction stays inside, page scroll locks and outside pointer input is disabled. Set on the bar; each menu inherits it.",
    },
    {
      name: "loopFocus",
      for: ["MenubarRoot", "MenubarMenu"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last item back to the first. Set on the bar; each menu inherits it.",
    },
    {
      name: "orientation",
      for: ["MenubarRoot", "MenubarMenu"],
      type: "MenuRootOrientation | undefined",
      note: "Orientation of the bar and its menus. Set on the bar; each menu inherits it.",
    },
    {
      name: "defaultOpen",
      for: ["MenubarMenu"],
      type: "boolean | undefined",
      note: "Whether the menu starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "highlightItemOnHover",
      for: ["MenubarMenu"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "onOpenChange",
      for: ["MenubarMenu"],
      type: "((open: boolean, eventDetails: MenuRootChangeEventDetails) => void) | undefined",
      note: "Fires when the menu opens or closes. The controlled `open` state lives here; ignoring it leaves the menu uncontrolled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["MenubarMenu"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "onItemHighlighted",
      for: ["MenubarMenu"],
      type: "((highlightedItem: HTMLElement | undefined, eventDetails: MenuRootHighlightEventDetails) => void) | undefined",
      note: "Fires when the highlighted item changes, with the element and a `reason` (`keyboard`, `pointer`, `none`). Where hover side-effects observe without owning state.",
    },
    {
      name: "open",
      for: ["MenubarMenu"],
      type: "boolean | undefined",
      note: "Whether the menu is open, when controlled. Leave unset for uncontrolled.",
    },
    {
      name: "closeParentOnEsc",
      for: ["MenubarMenu"],
      type: "boolean | undefined",
      note: "In a submenu, whether Escape closes the whole menu or only the child.",
    },
    {
      name: "actionsRef",
      for: ["MenubarMenu"],
      type: "RefObject<MenuRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the menu; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "triggerId",
      for: ["MenubarMenu"],
      type: "string | null | undefined",
      note: "Id of the trigger the menu answers to. For controlled menus (`open` set); uncontrolled menus need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["MenubarMenu"],
      type: "string | null | undefined",
      note: "Id of the trigger the menu answers to, for an initially open menu (`defaultOpen` set).",
    },
    {
      name: "handle",
      for: ["MenubarMenu", "MenubarTrigger"],
      type: "MenuHandle<unknown> | undefined",
      note: "Associates the menu with a trigger: set on an external trigger to drive the menu's open state, read on the menu to accept it.",
    },
    {
      name: "children",
      for: ["MenubarMenu", "MenubarTrigger", "MenubarContent"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "What the part renders. On the menu it is the items — or a render function receiving the active trigger's payload; on the trigger it is the visible label; on the popup it is the menu's content.",
    },
    {
      name: "payload",
      for: ["MenubarTrigger"],
      type: "unknown",
      note: "Data handed to the menu when this trigger opens it, read by a payload render function in the menu's children.",
    },
    {
      name: "delay",
      for: ["MenubarTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before a hovered trigger opens its menu. Needs `openOnHover`.",
    },
    {
      name: "closeDelay",
      for: ["MenubarTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before closing a hover-opened menu. Needs `openOnHover`.",
    },
    {
      name: "openOnHover",
      for: ["MenubarTrigger"],
      type: "boolean | undefined",
      note: "Whether hovering the trigger opens the menu as well as pressing it.",
    },
    {
      name: "nativeButton",
      for: ["MenubarTrigger", "MenubarItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "id",
      for: ["MenubarContent", "MenubarItem"],
      type: "string | undefined",
      note: "Explicit id for the part. Label association and popup anchoring fall back to generated ids.",
    },
    {
      name: "finalFocus",
      for: ["MenubarContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the menu closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "label",
      for: ["MenubarItem"],
      type: "string | undefined",
      note: "Override text for keyboard text-navigation and filtering. Falls back to the rendered text.",
    },
    {
      name: "onClick",
      for: ["MenubarItem"],
      type: "((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) | undefined",
      note: "The item's click handler — what the choice does. Whether the menu closes with it is `closeOnClick`.",
    },
    {
      name: "closeOnClick",
      for: ["MenubarItem"],
      type: "boolean | undefined",
      note: "Whether choosing the item closes the menu.",
    },
    {
      name: "style",
      for: ["MenubarRoot", "MenubarTrigger", "MenubarContent", "MenubarItem"],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `MenubarState` on the bar, `MenuTriggerState` on a trigger, `MenuPopupState` on the popup, `MenuItemState` (highlighted, disabled) on an item.",
    },
    {
      name: "render",
      for: ["MenubarRoot", "MenubarTrigger", "MenubarContent", "MenubarItem"],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on a trigger or item when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The bar is a menubar and each entry a menuitem with `aria-expanded`, so the two-level structure is announced rather than looked at.",
    "Left/Right move between the bar's menus and Up/Down move within an open one — the WAI-ARIA menubar pattern.",
    "Opening a menu closes any other open menu, so the bar never shows two panels at once.",
    "Escape closes the open menu and keeps focus in the bar, so someone can move to the next menu without re-entering the bar.",
  ],
};
