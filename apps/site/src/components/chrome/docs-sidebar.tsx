/**
 * Docs section sidebar — the tree the docs pages were missing.
 *
 * Every docs content page rendered bare inside SiteLayout: hub, guides, api,
 * reference, contributing, component indexes. A reader three levels deep had no
 * map of the section and no way sideways except back. The rail covers the five
 * top-level destinations; it does not cover the docs *section*.
 *
 * The tree is STATIC and every href is a route that exists (verified against
 * src/routes). A generated tree would be the wrong tool: routes change by
 * human decision, not by data, and a stale generated tree is worse than a
 * static one that is obviously edited by hand.
 *
 * Active state comes from the host router's pathname, the same seam the rail
 * uses. Collapsed sections are NOT used: the tree is short enough to show
 * whole, and a collapsed nav hides the map it exists to be.
 */
import { useLocation } from "@tanstack/react-router";
import { cn } from "@xoroh/kern";

type Leaf = { label: string; href: string };
type Section = { label: string; leaves: Leaf[] };

const TREE: Section[] = [
  {
    label: "Docs",
    leaves: [
      { label: "Overview", href: "/docs" },
      { label: "Guides", href: "/docs/guides" },
      { label: "API reference", href: "/docs/api" },
      { label: "Reference", href: "/docs/reference" },
      { label: "Contributing", href: "/docs/contributing" },
    ],
  },
  {
    label: "Components",
    leaves: [
      { label: "All components", href: "/components" },
      { label: "Web", href: "/components/web" },
      { label: "Native", href: "/components/mobile" },
    ],
  },
  {
    label: "Foundations",
    leaves: [
      { label: "Styles & tokens", href: "/styles" },
      { label: "Theme", href: "/theme" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Icons", href: "/icons" },
    ],
  },
  {
    label: "Start",
    leaves: [
      { label: "Getting started", href: "/getting-started" },
      { label: "Changelog", href: "/changelog" },
      { label: "About", href: "/about" },
      { label: "Community", href: "/community" },
    ],
  },
];

export function DocsSidebar() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Docs sections" className="flex flex-col gap-5">
      {TREE.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <p className="m-0 px-3 text-xs font-semibold tracking-[0.14em] text-(--md-sys-color-on-surface-variant) uppercase">
            {section.label}
          </p>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {section.leaves.map((leaf) => {
              const active =
                leaf.href === "/"
                  ? pathname === "/"
                  : pathname === leaf.href ||
                    pathname.startsWith(`${leaf.href}/`);
              return (
                <li key={leaf.href} className="m-0 p-0">
                  <a
                    href={leaf.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-(--md-sys-shape-corner-small) px-3 py-1.5 text-sm no-underline",
                      active
                        ? "bg-(--md-sys-color-secondary-container) font-semibold text-(--md-sys-color-on-secondary-container)"
                        : "text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) hover:text-(--md-sys-color-on-surface)",
                    )}
                  >
                    {leaf.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
