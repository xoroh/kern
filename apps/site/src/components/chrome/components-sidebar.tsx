/**
 * Components-domain sidebar — the catalog tree.
 *
 * Generated from `FAMILY_GROUPS` (the same taxonomy `ComponentGallery`
 * groups by), not hand-listed: a family regrouped in the taxonomy moves here
 * with it. Group links point at the gallery anchors (`/components#family-*`)
 * the gallery itself emits, so the sidebar and the gallery cannot disagree
 * about where a family lives. Per-component leaves are deliberately absent —
 * 192 leaves is an index, not a sidebar; `/reference` is the index.
 *
 * v2: rows are 48dp pills with M3 state layers; catalog rows carry the
 * selected pair when active. Family anchors are same-page jumps (no route
 * state), so they render as rest pills — the gallery scrolls them into view.
 */
import { useLocation } from "@tanstack/react-router";
import { cn } from "@xoroh/kern";
import { FAMILY_GROUPS } from "../../content/families";
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

const CATALOG: { label: string; href: string }[] = [
  { label: "All components", href: "/components" },
  { label: "Web", href: "/components/web" },
  { label: "React Native", href: "/components/mobile" },
  { label: "Reference index", href: "/reference" },
];

const rowClass = (active: boolean) =>
  cn(
    `min-h-12 rounded-(--md-sys-shape-corner-full) px-4 no-underline ${FOCUS_RING}`,
    active
      ? `${PILL_ACTIVE} flex items-center ${T_LABEL_LG}`
      : `${PILL_REST} flex items-center ${T_BODY_MD}`,
  );

export function ComponentsSidebar() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Component catalog" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p
          className={`m-0 px-3 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
        >
          Catalog
        </p>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {CATALOG.map((leaf) => {
            const active = pathname === leaf.href;
            return (
              <li key={leaf.href} className="m-0 p-0">
                <a
                  href={leaf.href}
                  aria-current={active ? "page" : undefined}
                  className={rowClass(active)}
                >
                  {leaf.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-1">
        <p
          className={`m-0 px-3 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
        >
          Families
        </p>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {FAMILY_GROUPS.map((g) => (
            <li key={g.id} className="m-0 p-0">
              {/* Same-page family anchors as the gallery's own family nav
                  (`#family-${g.id}` ↔ `id={`family-${g.id}`}`): this sidebar
                  renders only on /components pages, which is where the
                  gallery emits those ids. */}
              <a href={`#family-${g.id}`} className={rowClass(false)}>
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
