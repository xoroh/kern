/**
 * Components-domain sidebar — the catalog tree.
 *
 * Generated from `FAMILY_GROUPS` (the same taxonomy `ComponentGallery`
 * groups by), not hand-listed: a family regrouped in the taxonomy moves here
 * with it. Group links point at the gallery anchors (`/components#family-*`)
 * the gallery itself emits, so the sidebar and the gallery cannot disagree
 * about where a family lives. Per-component leaves are deliberately absent —
 * 192 leaves is an index, not a sidebar; `/reference` is the index.
 */
import { useLocation } from "@tanstack/react-router";
import { cn } from "@xoroh/kern";
import { FAMILY_GROUPS } from "../../content/families";
import {
  T_BODY_MD,
  T_LABEL,
  T_LABEL_LG,
} from "../../domains/shared/systems/type-scale";

const CATALOG: { label: string; href: string }[] = [
  { label: "All components", href: "/components" },
  { label: "Web", href: "/components/web" },
  { label: "Native", href: "/components/mobile" },
  { label: "Reference index", href: "/reference" },
];

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
      <div className="flex flex-col gap-1">
        <p
          className={`m-0 px-3 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
        >
          Families
        </p>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {FAMILY_GROUPS.map((group) => (
            <li key={group.id} className="m-0 p-0">
              <a
                href={`/components#family-${group.id}`}
                className={cn(
                  "block rounded-(--md-sys-shape-corner-small) px-3 py-1.5 no-underline",
                  `${T_BODY_MD} text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) hover:text-(--md-sys-color-on-surface)`,
                )}
              >
                {group.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
