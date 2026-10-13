/**
 * Docs section sidebar — the tree the docs pages were missing.
 *
 * Every docs content page rendered bare inside SiteLayout: hub, guides, api,
 * reference, contributing, component indexes. A reader three levels deep had no
 * map of the section and no way sideways except back. The header covers the
 * five top-level destinations; it does not cover the docs *section*.
 *
 * The tree is STATIC and every href is a route that exists (verified against
 * src/routes). It is read from the single nav source (`src/systems/nav.ts`), not
 * generated from routes: routes change by human decision, and that decision
 * is now edited exactly once — the sidebar, search, and llms.txt are readers,
 * never authors. A generated tree would still be the wrong tool; a single
 * hand-edited source is not a generated tree.
 *
 * v3 — ONE DOCS TREE. The v2 split (a separate door tree for
 * /foundations/* vs /docs/*) did not survive the IA merge: foundations
 * material IS documentation, so the sidebar renders the whole reference —
 * FOUNDATIONS_NAV (M3 canon order) then DEVELOP_NAV — wherever it appears.
 * The section labels carry the location; the header tab carries the door.
 *
 * Active state comes from the host router's pathname, through the
 * `isActivePath` seam shared with the header and drawer. v2: every row is a
 * 48dp pill with M3 state layers; the active row carries the selected pair.
 * Collapsed sections are NOT used: the tree is short enough to show
 * whole, and a collapsed nav hides the map it exists to be.
 */
import { useLocation } from "@tanstack/react-router";
import { cn } from "@xoroh/kern";
import {
  T_BODY_MD,
  T_LABEL,
  T_LABEL_LG,
} from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  PILL_ACTIVE,
  PILL_REST,
} from "../../domains/shared/systems/ui";
import { DEVELOP_NAV, FOUNDATIONS_NAV } from "../../systems/nav";

export function DocsSidebar() {
  const { pathname } = useLocation();
  // v3: one tree for the whole docs door — foundations + develop.
  const sections = [...FOUNDATIONS_NAV, ...DEVELOP_NAV];
  // Select the most specific destination, not both a hub and its child.
  const activeHref = sections
    .flatMap((section) => section.leaves)
    .filter(
      (leaf) => pathname === leaf.href || pathname.startsWith(`${leaf.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return (
    <nav aria-label="Docs sections" className="flex flex-col gap-5">
      {sections.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <p
            className={`m-0 px-3 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
          >
            {section.label}
          </p>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {section.leaves.map((leaf) => {
              const active = leaf.href === activeHref;
              return (
                <li key={leaf.href} className="m-0 p-0">
                  <a
                    href={leaf.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      `min-h-12 rounded-(--md-sys-shape-corner-full) px-4 no-underline ${FOCUS_RING}`,
                      active
                        ? `${PILL_ACTIVE} flex items-center ${T_LABEL_LG}`
                        : `${PILL_REST} flex items-center ${T_BODY_MD}`,
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
