/**
 * Tier-aware family navigation (D1003/D1004).
 *
 * Canonical home rule: a pure-core family (every manifest row for the slug
 * is tier "core" on every platform) lives at `/core/<slug>`; everything
 * else lives at `/components/m3/<slug>`. Divergent families (e.g. Search:
 * composite on web, self-contained on native) live at the higher tier's
 * URL — one family, one page, never two URLs for the same content.
 *
 * All cross-links to family pages go through `familyHref` so the tier
 * split cannot drift: a hardcoded `/components/m3/<core-slug>` link is a
 * defect this module exists to prevent.
 */
import { COMPONENTS } from "../generated/manifest";

export type FamilyTierName = "core" | "component";

/** Max tier over every manifest row for the slug (both platforms). */
export function familyTierOfSlug(slug: string): FamilyTierName | null {
  const rows = COMPONENTS.filter((c) => c.name === slug);
  if (rows.length === 0) return null;
  return rows.some((r) => r.tier === "component") ? "component" : "core";
}

/** True when the family's canonical home is /core/<slug>. */
export function isCoreFamily(slug: string): boolean {
  return familyTierOfSlug(slug) === "core";
}

/** Canonical URL for a family slug. */
export function familyHref(slug: string): string {
  return isCoreFamily(slug) ? `/core/${slug}` : `/components/m3/${slug}`;
}

/** The pure-core subset of a family order (prev/next stay inside the tier). */
export function coreFamilySlugs(families: string[]): string[] {
  return families.filter((slug) => isCoreFamily(slug));
}
