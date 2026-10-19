/**
 * Primary navigation model — the four destinations of the site's IA.
 *
 * v3 — ONE docs door. The five-tab split (Foundations as its own header
 * tab) was a door too many: foundations material is documentation, and
 * splitting it out of Docs made readers choose a door before they knew
 * what was behind it. Now Docs owns the whole reference tree — design
 * decisions AND developer guide — and the tabs cover the rest:
 *
 *   Docs         the reference — foundations, guides, API, primitives
 *   Components   the catalog — web and native families
 *   Blocks       composed work — patterns and blocks built from kern
 *   Studio       the theme studio — repaint the system live
 *
 * The brand mark links home, so there is no Home tab (m3.material.io and
 * MUI both do this). Each tab carries `match`: the path prefixes that light
 * it, because the door covers a section, not one route (Docs covers
 * /docs/*, /foundations/*, /primitives, /changelog, /reference…).
 *
 * The header renders these; the mobile drawer reads the same list, so a tab
 * added here is reachable on every viewport with no second edit. check-nav
 * scans this file's hrefs as a chrome coverage surface. `isActivePath` is
 * the single-href matcher the sidebars and drawer rows keep using.
 */
import type { IconNameInput } from "@xoroh/kern-icons";

export type PrimaryTab = {
  /** Canonical href — a route that exists; the drawer links here. */
  href: string;
  label: string;
  /** Path prefixes that mark this tab active (exact or `prefix/`). */
  match: string[];
};

export const PRIMARY_TABS: PrimaryTab[] = [
  {
    href: "/docs",
    label: "Docs",
    match: [
      "/docs",
      "/foundations",
      "/getting-started",
      "/primitives",
      "/changelog",
      "/reference",
      "/icons",
    ],
  },
  { href: "/components", label: "Components", match: ["/components"] },
  { href: "/showcase", label: "Blocks", match: ["/showcase", "/patterns"] },
  { href: "/playground", label: "Studio", match: ["/playground"] },
];

/**
 * The same destinations with hub icons, retained as navigation metadata.
 * The header and drawer render PRIMARY_TABS.
 */
export const RAIL_ITEMS: {
  href: string;
  label: string;
  icon: IconNameInput;
}[] = [
  { href: "/docs", label: "Docs", icon: "menu-book" },
  { href: "/components", label: "Components", icon: "work" },
  { href: "/showcase", label: "Blocks", icon: "image" },
  { href: "/playground", label: "Studio", icon: "science" },
];

/** Does this tab own the pathname? (Its `match` prefix set.) */
export function isTabActive(pathname: string, tab: PrimaryTab): boolean {
  return tab.match.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Single-href active matching, shared by sidebars and drawer rows. */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
