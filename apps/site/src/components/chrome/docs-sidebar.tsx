/**
 * Docs section sidebar — the tree the docs pages were missing.
 *
 * Every docs content page rendered bare inside SiteLayout: hub, guides, api,
 * reference, contributing, component indexes. A reader three levels deep had no
 * map of the section and no way sideways except back. The rail covers the five
 * top-level destinations; it does not cover the docs *section*.
 *
 * The tree is STATIC and every href is a route that exists (verified against
 * src/routes). It is read from the single nav source (`src/systems/nav.ts`), not
 * generated from routes: routes change by human decision, and that decision
 * is now edited exactly once — the sidebar, search, and llms.txt are readers,
 * never authors. A generated tree would still be the wrong tool; a single
 * hand-edited source is not a generated tree.
 *
 * Active state comes from the host router's pathname, the same seam the rail
 * uses. Collapsed sections are NOT used: the tree is short enough to show
 * whole, and a collapsed nav hides the map it exists to be.
 */
import { useLocation } from "@tanstack/react-router";
import { cn } from "@xoroh/kern";
import { NAV_SECTIONS } from "../../systems/nav";
import { T_BODY_MD, T_LABEL, T_LABEL_LG } from "../../systems/type-scale";

export function DocsSidebar() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Docs sections" className="flex flex-col gap-5">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <p
            className={`m-0 px-3 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
          >
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
                      "block rounded-(--md-sys-shape-corner-small) px-3 py-1.5 no-underline",
                      active
                        ? `bg-(--md-sys-color-secondary-container) ${T_LABEL_LG} text-(--md-sys-color-on-secondary-container)`
                        : `${T_BODY_MD} text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) hover:text-(--md-sys-color-on-surface)`,
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
