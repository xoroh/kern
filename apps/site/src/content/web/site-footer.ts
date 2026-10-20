import type { ComponentDoc } from "../types";

export const siteFooter: ComponentDoc = {
  slug: "site-footer",
  name: "SiteFooter",
  oneLiner:
    "SiteFooter closes a site page with a brand summary, grouped navigation, and optional legal content.",
  meta: {
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern/start",
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["SiteFooter"],
  customization: {
    supported: [
      "`groups` is a readonly list of uniquely named link groups; each link uses `to` for internal routing or `href` for an ordinary anchor.",
      "`brand`, `summary`, `legal`, and `trailing` accept host content without prescribing copy or license details.",
      "A link's optional `detail` adds a second, supporting line under its label.",
      "`className` and the other footer props pass through.",
    ],
    notSupported: [
      "SiteFooter has no built-in destinations, legal text, contact address, or brand identity.",
      "There is no `variant` axis or fixed group count; provide the links the site actually owns.",
    ],
  },
  api: [
    {
      name: "brand",
      type: "ReactNode",
      required: true,
      note: "Host-supplied wordmark or brand lockup.",
    },
    {
      name: "summary",
      type: "ReactNode",
      note: "Optional short description below the brand.",
    },
    {
      name: "groups",
      type: "readonly SiteFooterGroup[]",
      required: true,
      note: "Named navigation groups. A group has an optional stable `id`, a unique `heading`, and readonly `links`; each link uses `to` for router-injected internal navigation or `href` for a plain anchor, with an optional `detail` second line.",
    },
    {
      name: "legal",
      type: "ReactNode",
      note: "Optional content below the navigation, aligned opposite `trailing` when both are present.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "Optional content below the navigation, aligned opposite `legal` when both are present.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the footer's own classes; other footer attributes pass through.",
    },
  ],
  aria: [
    "The root is a footer landmark. Each link group is a navigation landmark labelled by its visible heading.",
    "Internal and external destinations render as links, with native link keyboard behavior; the host must provide descriptive labels. A link's `detail`, when present, is included after its label in the accessible name.",
    "The brand, summary, legal, and trailing slots keep the host's text semantics rather than forcing a heading or license claim.",
  ],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action: "Moves through the footer links in their document order.",
    },
    {
      key: "Enter",
      action: "Follows the focused internal or external link.",
    },
  ],
};
