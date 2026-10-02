import type { ComponentDoc } from "../types";

export const listItem: ComponentDoc = {
  slug: "list-item",
  name: "List item",
  oneLiner:
    "List items are rows in a list — a headline, optional supporting text, and optional leading and trailing slots.",
  features:
    "Reach for a list item when the data is a set of records read one at a time rather than compared across columns: a message list, a set of contacts, a search result set. The headline is the thing you would scan for and the supporting line is what confirms it. The interesting part is that the row is static until you say otherwise — passing `onPress` or `href` turns it into a real control rather than a row that merely looks clickable, which is the difference between a list a keyboard can use and one it cannot.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ListItem",
    // No variant axis. Static, action and navigation are the row's ROLE, chosen
    // by which props it is given, not a style variant.
    variants: [],
    // Material 3 places "list" at resting level 0 and level 0 is `shadow: none`.
    // The row carries no elevation token, which is the conformant state.
    elevation: 0,
  },
  parts: ["ListItem"],
  customization: {
    supported: [
      "`className` is passed through and merged after the row's own classes.",
      "`leading` and `trailing` are slots — an avatar or icon before, metadata or a switch or an action after.",
      "The row's element follows its role: a bare `<li>` when static, a `<button>` or `<a>` wrapped in one when it acts or navigates.",
    ],
    notSupported: [
      "There is no `variant` prop. Whether the row is static, an action or a link is decided by which of `onPress` and `href` you pass — three roles, one component, no style axis.",
      "There is no `size` or `density` prop. Row height is the minimum touch target, and that is not negotiable per row.",
      "There is no `selected` prop. A selected row is the caller's styling against the row's state.",
    ],
  },
  api: [
    {
      name: "headline",
      type: "ReactNode",
      note: "The primary line. Required — a row with no headline is a row with nothing to scan for.",
    },
    {
      name: "supporting",
      type: "ReactNode",
      note: "The secondary line below the headline, for what confirms the choice rather than what makes it.",
    },
    {
      name: "leading",
      type: "ReactNode",
      note: "Slot before the text: an avatar, an icon, a checkbox.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "Slot after the text: metadata, a switch, an action.",
    },
    {
      name: "onPress",
      type: "() => void",
      note: "Makes the row an ACTION. It renders a real `<button>` — so it is keyboard-operable and carries control semantics — instead of a bare `<li>` that merely looks clickable. Matches the native renderer's behaviour.",
    },
    {
      name: "href",
      type: "string",
      note: 'Makes the row NAVIGATION, rendering an `<a href>` (`role="link"`). When both `href` and `onPress` are passed, `href` wins because navigation is the stronger intent — but the handler still runs.',
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Disables the interactive row. A button is natively disabled; a link gets `aria-disabled`, leaves the tab order and does not navigate — because a link cannot be natively disabled and faking it would be a trap.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the row's own classes.",
    },
  ],
  aria: [
    'A static row is an `<li>` with `role="listitem"` STATED rather than left implicit, so the role can be asserted and cannot silently regress.',
    'Passing `onPress` makes it a `<button>` (`role="button"`); passing `href` makes it an `<a>` (`role="link"`). The wrapping `<li>` then becomes `role="none"`, so assistive tech lands on the control instead of announcing "list item, button" — the same sentence twice.',
    "An interactive row is genuinely keyboard-operable. A row with only an `onClick` and no `onPress` would be a `<li>` that responds to the mouse and to nothing else.",
    "A disabled link cannot be natively disabled, so it takes `aria-disabled` and leaves the tab order rather than pretending.",
  ],
};
