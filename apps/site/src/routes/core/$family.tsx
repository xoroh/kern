/**
 * The core family page: one route per M3 primitive family (D1003/D1004).
 *
 * The path is `/core/<slug>`: the same shared `FamilyPage` body as the
 * components route, with the Core door, `/core`-based tab links, and
 * prev/next scoped to pure-core families. Canonical-tier enforcement is
 * symmetric with the components route:
 *
 *   - a composite family slug 301s to `/components/m3/<slug>`;
 *   - a compound part (e.g. `dialog-title`) 301s to its family's canonical
 *     tier home (core parts resolve straight here, no double hop);
 *   - anything else is a real 404 (`CatchNotFound` makes it a 404 response).
 */
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { docForExport, getDoc, type Platform } from "../../content";
import { FamilyPage } from "../../domains/components/family-page";
import { routeHead } from "../../domains/shared/systems/seo";
import { COMPONENTS, FAMILIES } from "../../generated/manifest";
import { systemById } from "../../systems/design-systems";
import { coreFamilySlugs, isCoreFamily } from "../../systems/tier-nav";

export const Route = createFileRoute("/core/$family")({
  validateSearch: (search: Record<string, unknown>): { tab?: Platform } => ({
    tab:
      search.tab === "web" || search.tab === "mobile"
        ? (search.tab as Platform)
        : undefined,
  }),
  beforeLoad: ({ params }): undefined => {
    const slug = params.family;
    if (getDoc("web", slug) ?? getDoc("mobile", slug)) {
      // Canonical tier home (D1003): composite families live at /components.
      if (!isCoreFamily(slug)) {
        throw redirect({
          to: "/components/$system/$component",
          params: { system: "m3", component: slug },
          statusCode: 301,
        });
      }
      return undefined;
    }
    // No content family: resolve parts and bare exports through the export
    // index to their canonical tier home; unknown slugs 404.
    for (const platform of ["web", "mobile"] as const) {
      for (const row of COMPONENTS.filter(
        (c) => c.platform === platform && c.name === slug,
      )) {
        const doc = docForExport(platform, row.export);
        if (doc && doc.slug !== slug) {
          if (isCoreFamily(doc.slug)) {
            throw redirect({
              to: "/core/$family",
              params: { family: doc.slug },
              statusCode: 301,
            });
          }
          throw redirect({
            to: "/components/$system/$component",
            params: { system: "m3", component: doc.slug },
            statusCode: 301,
          });
        }
      }
    }
    if (isCoreFamily(slug)) {
      // Bare core export with rows but no family page: renders Undocumented
      // at its canonical home rather than 404ing.
      return undefined;
    }
    throw notFound();
  },
  head: ({ params }) => {
    const doc = getDoc("web", params.family) ?? getDoc("mobile", params.family);
    return routeHead(
      doc ? `${doc.name} (Core)` : `${params.family} (Core)`,
      doc?.oneLiner ??
        "One primitive, one page — metadata, live preview, usage, props, theming and accessibility.",
    );
  },
  component: CoreFamilyPage,
});

function CoreFamilyPage() {
  const { family } = Route.useParams();
  const { tab } = Route.useSearch();
  const label = systemById("m3")?.short ?? "M3";
  return (
    <FamilyPage
      slug={family}
      requestedTab={tab}
      door={{ label: "Core", href: "/core" }}
      familyBase="core"
      siblingBase="/core"
      siblingSlugs={coreFamilySlugs(FAMILIES)}
      systemLabel={label}
    />
  );
}
