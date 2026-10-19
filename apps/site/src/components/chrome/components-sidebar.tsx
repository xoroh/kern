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
 *
 * Platform filtering is view state on the gallery itself (`?platform=`,
 * 018) — one gallery URL, so the sidebar lists no platform rows.
 */
import { useLocation } from "@tanstack/react-router";
import { cn } from "@xoroh/kern";
import { Icon, type IconNameInput } from "@xoroh/kern-icons";
import { MOBILE_DOCS, WEB_DOCS } from "../../content";
import {
  FAMILY_GROUPS,
  type FamilyGroupId,
  familyFor,
} from "../../content/families";
import {
  T_BODY_MD,
  T_BODY_SM,
  T_LABEL,
  T_LABEL_LG,
} from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  PILL_ACTIVE,
  PILL_REST,
  TRANSITION,
} from "../../domains/shared/systems/ui";

const CATALOG: { label: string; href: string; icon: IconNameInput }[] = [
  { label: "All components", href: "/components", icon: "widgets" },
  { label: "Reference index", href: "/reference", icon: "dns" },
];

const GROUP_ICONS: Record<FamilyGroupId, IconNameInput> = {
  action: "add",
  containment: "layers",
  communication: "info",
  navigation: "menu-book",
  selection: "check-circle",
  "text-input": "edit",
  utilities: "settings",
};

const rowClass = (active: boolean) =>
  cn(
    `flex min-h-12 items-center gap-3 rounded-(--sys-shape-corner-full) px-4 no-underline ${TRANSITION} ${FOCUS_RING}`,
    active ? `${PILL_ACTIVE} ${T_LABEL_LG}` : `${PILL_REST} ${T_BODY_MD}`,
  );

function collectGroupItems() {
  const bySlug = new Map<string, { slug: string; name: string }>();
  for (const doc of WEB_DOCS)
    bySlug.set(doc.slug, { slug: doc.slug, name: doc.name });
  for (const doc of MOBILE_DOCS) {
    if (!bySlug.has(doc.slug)) {
      bySlug.set(doc.slug, { slug: doc.slug, name: doc.name });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const ALL_FAMILIES = collectGroupItems();

export function ComponentsSidebar() {
  const { pathname } = useLocation();
  const activeComponentSlug = pathname.startsWith("/components/m3/")
    ? pathname.replace("/components/m3/", "").split("/")[0]
    : null;
  const activeGroup = activeComponentSlug
    ? familyFor(activeComponentSlug)
    : null;

  return (
    <nav aria-label="Component catalog" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p
          className={`m-0 px-4 py-1 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
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
                  <Icon name={leaf.icon} size={18} filled={active} />
                  <span className="flex-1 truncate">{leaf.label}</span>
                  {leaf.href === "/components" ? (
                    <span
                      className={`rounded-full bg-(--sys-color-surface-container-high) px-2 py-0.5 ${T_LABEL} text-(--sys-color-on-surface-variant)`}
                    >
                      {ALL_FAMILIES.length}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-1 border-t border-(--sys-color-outline-variant)/70 pt-3">
        <p
          className={`m-0 px-4 py-1 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
        >
          Families
        </p>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {FAMILY_GROUPS.map((g) => {
            const groupItems = ALL_FAMILIES.filter(
              (item) => familyFor(item.slug) === g.id,
            );
            const isGroupActive = activeGroup === g.id;
            return (
              <li key={g.id} className="m-0 flex flex-col gap-0.5 p-0">
                {/* Same-page family anchors as the gallery's own family nav
                    (`#family-${g.id}` ↔ `id={`family-${g.id}`}`): this sidebar
                    renders only on /components pages, which is where the
                    gallery emits those ids. */}
                <a href={`#family-${g.id}`} className={rowClass(isGroupActive)}>
                  <Icon
                    name={GROUP_ICONS[g.id]}
                    size={18}
                    filled={isGroupActive}
                  />
                  <span className="flex-1 truncate">{g.title}</span>
                  <span
                    className={cn(
                      `rounded-full px-2 py-0.5 ${T_LABEL}`,
                      isGroupActive
                        ? "bg-(--sys-color-on-secondary-container)/12 text-(--sys-color-on-secondary-container)"
                        : "bg-(--sys-color-surface-container-high) text-(--sys-color-on-surface-variant)",
                    )}
                  >
                    {groupItems.length}
                  </span>
                </a>
                {isGroupActive ? (
                  <ul className="m-0 ml-5 flex list-none flex-col gap-0.5 border-l border-(--sys-color-outline-variant) py-1 pl-2">
                    {groupItems.map((item) => {
                      const isItemActive = item.slug === activeComponentSlug;
                      return (
                        <li key={item.slug} className="m-0 p-0">
                          <a
                            href={`/components/m3/${item.slug}`}
                            aria-current={isItemActive ? "page" : undefined}
                            className={cn(
                              `flex min-h-9 items-center rounded-(--sys-shape-corner-full) px-3 no-underline ${T_BODY_SM} ${TRANSITION} ${FOCUS_RING}`,
                              isItemActive
                                ? "bg-(--sys-color-secondary-container)/70 text-(--sys-color-on-secondary-container)"
                                : "text-(--sys-color-on-surface-variant) hover:bg-(--sys-color-surface-container-high) hover:text-(--sys-color-on-surface)",
                            )}
                          >
                            <span className="truncate">{item.name}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
