import type { ComponentDoc } from "../types";

export const menu: ComponentDoc = {
  slug: "menu",
  name: "Menu",
  oneLiner:
    "Menus list the actions available on something, opened from the control that owns them.",
  features:
    "Reach for a menu when a set of actions belongs to one thing and showing them all would crowd it: a row's overflow, a file's options, an editor's insert menu. The menu is about doing — every entry acts and closes. If an entry goes somewhere instead, that is a navigation menu; if it picks a value, that is a select. Group related entries and label the groups, because a flat list of twelve verbs is a memory test. Destructive entries belong at the bottom, away from the ones people mean to press.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Menu",
    // No variant axis. A menu is one treatment; the state is open or closed.
    variants: [],
    // kern's `M3_ELEVATION_COMPONENTS` maps M3's "menu" row (level 2) to
    // `navigation-menu`, so the plain `Menu` popup has no asserted row — and
    // it ships no elevation token either. See Customization.
    elevation: "surface",
  },
  parts: [
    "Menu",
    "MenuRoot",
    "MenuTrigger",
    "MenuContent",
    "MenuItem",
    "MenuSeparator",
    "MenuGroupLabel",
  ],
  anatomy: [
    { name: "MenuRoot", role: "Owns the open state for one menu." },
    {
      name: "MenuTrigger",
      role: "The control the menu belongs to. Carries the expanded state.",
    },
    {
      name: "MenuContent",
      role: "The list surface. Portals to the end of the document and positions itself against its trigger.",
    },
    {
      name: "MenuItem",
      role: "One action. Activating it runs it and closes the menu.",
    },
    {
      name: "MenuSeparator",
      role: "A divider between runs of related actions.",
    },
    {
      name: "MenuGroupLabel",
      role: "Names a run of related actions, so the list reads as sections rather than a flat column.",
    },
    { name: "Menu", role: "The namespace object: all of the parts above." },
  ],
  keyboard: [
    {
      key: "Arrow keys",
      action:
        "Moves between items with wrapping; typeahead jumps by typed text.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused item and closes the menu (unless keep-open).",
    },
    {
      key: "Escape",
      action: "Closes without activating; focus returns to the trigger.",
    },
    {
      key: "Tab",
      action: "Closes the menu and moves focus out.",
    },
  ],
  usage: {
    do: [
      "Anchor to the trigger with a relative parent; the menu positions to it.",
      "Keep items to one line with an optional supporting line — dense rows use the menu-item height role.",
      "Separate groups with dividers (separator role, never focusable).",
    ],
    dont: [
      "Don't nest deeper than one submenu — flatten instead.",
      "Don't hide disabled items — show them inert so the set reads complete.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "comp.menu.container",
      value: "surface-container, 4px, level2",
    },
    {
      element: "Selected item",
      state: "resting",
      token: "comp.menu.selected",
      value: "secondary-container + on-secondary-container",
    },
    {
      element: "Item",
      state: "hover",
      token: "comp.menu.item-hover",
      value: "on-surface 8% layer",
    },
    {
      element: "Item label",
      state: "disabled",
      token: "comp.list.disabled-label",
      value: "on-surface 30%",
    },
  ],
  faq: [
    {
      q: "Menu, select, or combobox?",
      a: "Menu for command lists from a trigger; select for fixed-value form fields; combobox for filter-as-you-type.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Item states are exposed as `data-highlighted` and `data-disabled`, so hover and unavailable actions are restylable without new props.",
      "The surface and outline come from the system roles, so a theme moves every menu at once.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One treatment; the state is open or closed.",
      "There is no `placement` or `side` prop. The list is positioned against its trigger and the offset is fixed.",
      "There is no `elevation` prop, and the popup currently ships no elevation token at all. M3 places a menu at resting level 2; kern's assertion row for that level is attached to `navigation-menu`, so nothing here is asserted and the popup renders flat. That is a gap against the spec rather than a conformant state, and it is reported to the token owners rather than claimed here.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `MenuRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and outside clicks.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an item, or on the trigger. A disabled item is skipped rather than left as a dead entry.",
    },
    {
      name: "defaultOpen",
      for: ["MenuRoot"],
      type: "boolean | undefined",
      note: "Whether the menu starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "loopFocus",
      for: ["MenuRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last item back to the first. Disabled stops at the ends.",
    },
    {
      name: "highlightItemOnHover",
      for: ["MenuRoot"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "modal",
      for: ["MenuRoot"],
      type: "boolean | undefined",
      note: "Whether the open menu is modal: interaction stays inside, page scroll locks and outside pointer input is disabled. Non-modal leaves the rest of the document usable.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["MenuRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "onItemHighlighted",
      for: ["MenuRoot"],
      type: "((highlightedItem: HTMLElement | undefined, eventDetails: MenuRootHighlightEventDetails) => void) | undefined",
      note: "Fires when the highlighted item changes, with the element and a `reason` (`keyboard`, `pointer`, `none`). Where hover side-effects observe without owning state.",
    },
    {
      name: "orientation",
      for: ["MenuRoot", "MenuSeparator"],
      type: "MenuRootOrientation | Orientation | undefined",
      note: "Two roles, one name. On the root it is the menu's orientation; on a separator it is the divider's direction between groups.",
    },
    {
      name: "closeParentOnEsc",
      for: ["MenuRoot"],
      type: "boolean | undefined",
      note: "In a submenu, whether Escape closes the whole menu or only the child.",
    },
    {
      name: "actionsRef",
      for: ["MenuRoot"],
      type: "RefObject<MenuRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the menu; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "triggerId",
      for: ["MenuRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the menu answers to. For controlled menus (`open` set); uncontrolled menus need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["MenuRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the menu answers to, for an initially open menu (`defaultOpen` set).",
    },
    {
      name: "handle",
      for: ["MenuRoot", "MenuTrigger"],
      type: "MenuHandle<unknown> | undefined",
      note: "Associates the menu with a trigger: set on an external trigger to drive the menu's open state, read on the menu to accept it.",
    },
    {
      name: "children",
      for: ["MenuRoot", "MenuTrigger", "MenuContent"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "What the part renders. On the root it is the menu's items — or a render function receiving the active trigger's payload; on the trigger it is the visible label; on the popup it is the menu's content.",
    },
    {
      name: "payload",
      for: ["MenuTrigger"],
      type: "unknown",
      note: "Data handed to the menu when this trigger opens it, read by a payload render function in the menu's children.",
    },
    {
      name: "delay",
      for: ["MenuTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before a hovered trigger opens its menu. Needs `openOnHover`.",
    },
    {
      name: "closeDelay",
      for: ["MenuTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before closing a hover-opened menu. Needs `openOnHover`.",
    },
    {
      name: "openOnHover",
      for: ["MenuTrigger"],
      type: "boolean | undefined",
      note: "Whether hovering the trigger opens the menu as well as pressing it.",
    },
    {
      name: "nativeButton",
      for: ["MenuTrigger", "MenuItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "id",
      for: ["MenuContent", "MenuItem"],
      type: "string | undefined",
      note: "Explicit id for the part. Label association and popup anchoring fall back to generated ids.",
    },
    {
      name: "finalFocus",
      for: ["MenuContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the menu closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "label",
      for: ["MenuItem"],
      type: "string | undefined",
      note: "Override text for keyboard text-navigation and filtering. Falls back to the rendered text.",
    },
    {
      name: "onClick",
      for: ["MenuItem"],
      type: "((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) | undefined",
      note: "The item's click handler — what the choice does. Whether the menu closes with it is `closeOnClick`.",
    },
    {
      name: "closeOnClick",
      for: ["MenuItem"],
      type: "boolean | undefined",
      note: "Whether choosing the item closes the menu.",
    },
    {
      name: "style",
      for: [
        "MenuTrigger",
        "MenuContent",
        "MenuItem",
        "MenuSeparator",
        "MenuGroupLabel",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `MenuTriggerState` on the trigger, `MenuPopupState` on the popup, `MenuItemState` (highlighted, disabled) on an item, `SeparatorState` on a divider, `MenuGroupLabelState` on a group heading.",
    },
    {
      name: "render",
      for: [
        "MenuTrigger",
        "MenuContent",
        "MenuItem",
        "MenuSeparator",
        "MenuGroupLabel",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or an item when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The trigger carries `aria-expanded`, so whether the menu is open is announced before it is opened.",
    "The list is a menu and its entries are menuitems, so the structure is announced rather than inferred from a column of text.",
    "Up/Down move through entries and Enter or Space activates; Escape closes and returns focus to the trigger.",
    "The menu is not modal — the page behind it stays operable, which is why a menu is the wrong place for a decision that must be made before continuing.",
  ],
};
