import type { ComponentDoc } from "../types";

export const topBar: ComponentDoc = {
  slug: "top-bar",
  name: "TopBar",
  oneLiner:
    "TopBar is a responsive site header with a brand link, primary navigation, and an actions slot.",
  features:
    "Reach for TopBar when a site needs its main destinations at the top of every page. You provide the brand, route list, current path, and optional actions; a `LinkProvider` lets the host router render internal links without making routing a package dependency. On narrow screens the links move into an accessible disclosure, and Escape closes it and returns focus to its trigger.",
  meta: {
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern/start",
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["TopBar"],
  customization: {
    supported: [
      "`items` supplies internal route destinations, labels, and optional exact matching; `activePath` is owned by the host.",
      "`brand` and `homeTo` define the brand link; `actions` accepts host controls such as `ThemeToggle`.",
      "`navLabel`, `menuLabel`, and `closeMenuLabel` customize the navigation and disclosure names; `sticky` opts out of top sticking.",
      "`className` and the other header props pass through.",
    ],
    notSupported: [
      "TopBar does not read the current route or depend on a router; pass `activePath` from the host.",
      "There are no nested navigation levels or mega-menu behavior.",
    ],
  },
  api: [
    {
      name: "brand",
      type: "ReactNode",
      required: true,
      note: "Wordmark or brand lockup, linked to `homeTo`.",
    },
    {
      name: "items",
      type: "readonly TopBarItem[]",
      required: true,
      note: "Primary internal destinations: `{ to, label, exact? }`.",
    },
    {
      name: "activePath",
      type: "string",
      note: "Host-supplied current path; an exact or nested match receives `aria-current=page`.",
    },
    {
      name: "homeTo",
      type: "string",
      default: '"/"',
      note: "Internal destination for the brand link.",
    },
    {
      name: "actions",
      type: "ReactNode",
      note: "Optional host-owned controls placed before the mobile menu button.",
    },
    {
      name: "navLabel",
      type: "string",
      default: '"Primary"',
      note: "Accessible name shared by the desktop and mobile navigation landmarks.",
    },
    {
      name: "menuLabel",
      type: "string",
      default: '"Open navigation"',
      note: "Accessible name for the collapsed disclosure control.",
    },
    {
      name: "closeMenuLabel",
      type: "string",
      default: '"Close navigation"',
      note: "Accessible name for the expanded disclosure control.",
    },
    {
      name: "sticky",
      type: "boolean",
      default: "true",
      note: "When false, the header is positioned normally instead of sticking to the viewport top.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the header's own classes; other header attributes pass through.",
    },
  ],
  aria: [
    "The brand is a link to `homeTo`; the primary links are inside labelled navigation landmarks.",
    "The mobile button reports `aria-expanded` and controls the disclosure nav. `Escape` closes it and returns focus to the trigger.",
    "The current destination receives `aria-current=page`; `activePath` comes from the host rather than an implicit router hook.",
  ],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through the brand, visible navigation links, actions, and disclosure button in DOM order.",
    },
    {
      key: "Enter / Space",
      action: "Activates the mobile disclosure button.",
    },
    {
      key: "Escape",
      action:
        "Closes the expanded mobile navigation and returns focus to its trigger.",
    },
  ],
  usage: {
    do: [
      "Pass the current pathname so the active destination and `aria-current` stay synchronized with the host router.",
      "Keep the primary route list short enough to fit the desktop bar; put secondary destinations in a separate surface.",
    ],
    dont: [
      "Don't put action buttons inside `items`; use the `actions` slot for actions and controls.",
      "Don't render two TopBars on one page; each adds a primary navigation landmark and sticky layer.",
    ],
  },
};
