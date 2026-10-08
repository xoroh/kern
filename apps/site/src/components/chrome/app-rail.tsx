/**
 * Shared hub-destination data — formerly the docs-context rail.
 *
 * The rail used to be the site's primary chrome, then the sidebar pages'
 * companion to the sidebar tree. The sticky SiteHeader owns that job now
 * (primary tabs, search, theme, CTA on every page) and the rail duplicated
 * its five hub tabs, so SiteLayout no longer mounts it: header + footer on
 * every page, plus the docs sidebar tree where docs need it. Below lg the
 * header hamburger carries every destination through the mobile drawer —
 * one navigation surface per viewport.
 *
 * This module stays because two things still read it: the header and the
 * drawer share `isActivePath`, and check-nav scans this file's hrefs as a
 * chrome coverage surface. `RAIL_ITEMS` documents the five hub destinations
 * in rail order — the same 5-tab IA the header renders.
 */
import type { IconNameInput } from "@xoroh/kern-icons";

/**
 * The five hub destinations, in rail order — the same 5-tab IA the header
 * renders. Non-hub destinations (docs section pages, getting started,
 * configurator, changelog) stay reachable through the sidebar tree, the
 * drawer, and the footer; check-nav counts those surfaces too.
 */
export const RAIL_ITEMS: {
  href: string;
  label: string;
  icon: IconNameInput;
}[] = [
  { href: "/foundations", label: "Foundations", icon: "favorite" },
  { href: "/components", label: "Components", icon: "work" },
  { href: "/patterns", label: "Patterns", icon: "dashboard" },
  { href: "/playground", label: "Playground", icon: "science" },
  { href: "/showcase", label: "Showcase", icon: "image" },
];

/** Active-path matching, shared with the header and drawer. */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
