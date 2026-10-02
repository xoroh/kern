import type { ComponentDoc } from "../types";

export const link: ComponentDoc = {
  slug: "link",
  name: "Link",
  oneLiner:
    "Links are anchors that can be pointed at your host router, so kern never hardcodes one.",
  features:
    "Reach for `Link` instead of a bare `<a>` anywhere kern renders navigation. The design here is dependency injection and it is worth understanding: kern ships no router, so `LinkProvider` lets the host supply its own link component — TanStack's, React Router's, any `(props) => ReactNode` — and every `Link` inside renders through it. Without a provider, `Link` falls back to a plain `<a>`. That means the same kern components work in any host, and navigation is decided once at the root rather than per call site. Pass `to` when the host router uses a location, or `href` for a plain URL.",
  meta: {
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier — web routing seam, no native counterpart expected.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["LinkProvider", "Link"],
  customization: {
    supported: [
      "`LinkProvider` injects the host router's link component, so kern renders YOUR navigation.",
      "`Link` takes `to` (router location) or `href` (plain URL) plus the usual anchor attributes.",
      "`useLinkComponent()` reads the injected component anywhere below the provider.",
    ],
    notSupported: [
      "kern does not bundle a router and does not choose one. That is the host's decision and this seam is where it is made.",
      "There is no `variant` or `underline` prop. Link styling is the anchor's.",
    ],
  },
  api: [
    {
      name: "LinkProvider",
      type: "(props: { component: LinkComponent; children }) => ReactNode",
      note: "Injects the host's link component. Wrap the app once and every `Link` below uses it.",
    },
    {
      name: "LinkComponent",
      type: "(props: LinkProps) => ReactNode",
      note: "The shape a host must provide — any component taking `LinkProps`. This is the whole contract.",
    },
    {
      name: "useLinkComponent()",
      type: "() => LinkComponent",
      note: "Reads the injected component below the provider.",
    },
    {
      name: "Link",
      type: "(props: LinkProps) => ReactNode",
      note: "Renders through the injected component. `LinkProps` is `AnchorHTMLAttributes<HTMLAnchorElement>` plus `to?: string`. Without a provider it renders a plain `<a>`.",
    },
    {
      name: "to",
      type: "string",
      note: "Router location, for hosts whose router uses one. `href` is still available for a plain URL.",
    },
  ],
  aria: [
    "It renders a real anchor by default, so it is focusable, activatable and announced as a link without any help.",
    "When a host router supplies its component, that component is responsible for the anchor's semantics — the seam does not change what the user gets, only who renders it.",
    "`LinkProps` extends the real anchor attributes, so `aria-*`, `rel` and `target` pass through untouched.",
  ],
};
