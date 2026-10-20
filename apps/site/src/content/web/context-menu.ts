import type { ComponentDoc } from "../types";

export const contextMenu: ComponentDoc = {
  slug: "context-menu",
  name: "Context menu",
  oneLiner:
    "Context menus offer the actions for a thing where the thing is, opened by right-clicking it.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ContextMenu",
    // No variant axis. A context menu is one treatment.
    variants: [],
    // No elevation token on the popup, and no row in m3-elevation.ts.
    // Nothing asserted either way — see Customization.
    elevation: "surface",
  },
  parts: [
    "ContextMenu",
    "ContextMenuRoot",
    "ContextMenuTrigger",
    "ContextMenuContent",
    "ContextMenuItem",
    "ContextMenuSeparator",
  ],
  keyboard: [
    {
      key: "Right-click (or long-press on touch)",
      action:
        "Opens the menu at the pointer. The trigger is a plain region rather than a button, so no key opens the menu.",
    },
    {
      key: "Arrow keys",
      action:
        "Move between the items with wrapping; typeahead jumps to an item by its typed text.",
    },
    {
      key: "Enter / Space",
      action: "Activates the focused item and closes the menu.",
    },
    {
      key: "Escape",
      action:
        "Closes the menu without choosing; focus returns to the element that had it before the menu opened.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The menu opens at the pointer rather than anchored to a control, which is what makes it feel attached to the thing under the cursor.",
      "Item states are the menu's — `data-highlighted` and `data-disabled` — so one stylesheet covers both.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop.",
      "There is no `placement` prop. The menu opens at the pointer; where it appears is where someone clicked.",
      "There is no `elevation` prop, and the popup ships no elevation token. Nothing in m3-elevation.ts asserts a level for this component.",
    ],
  },
  api: [
    {
      name: "open",
      for: ["ContextMenuRoot"],
      type: "boolean",
      note: "Controlled open state on `ContextMenuRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      for: ["ContextMenuRoot"],
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and outside clicks.",
    },
    {
      name: "className",
      for: [
        "ContextMenuTrigger",
        "ContextMenuContent",
        "ContextMenuItem",
        "ContextMenuSeparator",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["ContextMenuRoot", "ContextMenuItem"],
      type: "boolean",
      note: "On an item: skipped rather than left as a dead entry.",
    },
    {
      name: "closeParentOnEsc",
      for: ["ContextMenuRoot"],
      type: "boolean | undefined",
      note: "In a submenu, whether Escape closes the whole menu or only the child.",
    },
    {
      name: "children",
      for: ["ContextMenuRoot", "ContextMenuContent"],
      type: "ReactNode",
      note: "What the part renders. On the root it is the menu's items; on the popup it is the menu's content.",
    },
    {
      name: "actionsRef",
      for: ["ContextMenuRoot"],
      type: "RefObject<MenuRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the menu; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "defaultOpen",
      for: ["ContextMenuRoot"],
      type: "boolean | undefined",
      note: "Whether the menu starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["ContextMenuRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "highlightItemOnHover",
      for: ["ContextMenuRoot"],
      type: "boolean | undefined",
      note: "Whether pointer hover moves the highlight. Disable to keep CSS `:hover` distinct from the `data-highlighted` keyboard state.",
    },
    {
      name: "loopFocus",
      for: ["ContextMenuRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last item back to the first. Disabled stops at the ends.",
    },
    {
      name: "onItemHighlighted",
      for: ["ContextMenuRoot"],
      type: "((highlightedItem: HTMLElement | undefined, eventDetails: MenuRootHighlightEventDetails) => void) | undefined",
      note: "Fires when the highlighted item changes, with the element and a `reason` (`keyboard`, `pointer`, `none`). Where hover side-effects observe without owning state.",
    },
    {
      name: "orientation",
      for: ["ContextMenuRoot", "ContextMenuSeparator"],
      type: "MenuRootOrientation | Orientation | undefined",
      note: "Two roles, one name. On the root it is the menu's orientation; on a separator it is the divider's direction between groups.",
    },
    {
      name: "id",
      for: ["ContextMenuContent", "ContextMenuItem"],
      type: "string | undefined",
      note: "Explicit id for the part. Label association and popup anchoring fall back to generated ids.",
    },
    {
      name: "finalFocus",
      for: ["ContextMenuContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the menu closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "label",
      for: ["ContextMenuItem"],
      type: "string | undefined",
      note: "Override text for keyboard text-navigation and filtering. Falls back to the rendered text.",
    },
    {
      name: "onClick",
      for: ["ContextMenuItem"],
      type: "((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) | undefined",
      note: "The item's click handler — what the choice does. Whether the menu closes with it is `closeOnClick`.",
    },
    {
      name: "nativeButton",
      for: ["ContextMenuItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "closeOnClick",
      for: ["ContextMenuItem"],
      type: "boolean | undefined",
      note: "Whether choosing the item closes the menu.",
    },
    {
      name: "style",
      for: [
        "ContextMenuTrigger",
        "ContextMenuContent",
        "ContextMenuItem",
        "ContextMenuSeparator",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ContextMenuTriggerState` on the trigger, `MenuPopupState` on the popup, `MenuItemState` (highlighted, disabled) on an item, `SeparatorState` on a divider.",
    },
    {
      name: "render",
      for: [
        "ContextMenuTrigger",
        "ContextMenuContent",
        "ContextMenuItem",
        "ContextMenuSeparator",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on an item when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The list is a menu and its entries are menuitems, announced as the menu opens at the pointer.",
    "The menu can be opened from the keyboard as well as the mouse — the context-menu key or Shift+F10 — so it is not pointer-only.",
    "Up/Down move through entries, Escape closes, and focus returns to the trigger.",
    "The trigger is not a button and takes no `aria-expanded`; the menu is announced when it appears rather than promised before it does.",
  ],
};
