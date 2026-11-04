/**
 * The component page: one route per composite family, both renderers under
 * one URL.
 *
 * The path is `/components/$system/$component` (018): one page per
 * component at the system address, with Web/Native tabs switching the
 * renderer in place via `?tab=`. Both platforms export `Button` (and
 * dozens of other names), so the family slug — not the platform — is the
 * page, and the tab is view state, not a second page.
 *
 * Pure-core families do NOT render here: they 301 to their canonical home
 * at `/core/<slug>` (D1003 — one family, one URL). A slug that matches no
 * family is a real 404. A slug that matches a manifest row or part export
 * but no family (a compound part like `dialog-content`) 301s to the
 * family's canonical tier home — one component, one page, and a part URL
 * is a second URL for the family page, i.e. a duplicate-content defect
 * rather than a convenience. `CatchNotFound` is what makes a 404 a 404
 * *response*.
 */
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { docForExport, getDoc, type Platform } from "../../../content";
import { FamilyPage } from "../../../domains/components/family-page";
import { routeHead } from "../../../domains/shared/systems/seo";
import { COMPONENTS, FAMILIES } from "../../../generated/manifest";
import { systemById } from "../../../systems/design-systems";
import { isCoreFamily } from "../../../systems/tier-nav";

export const Route = createFileRoute("/components/$system/$component")({
  validateSearch: (search: Record<string, unknown>): { tab?: Platform } => ({
    tab:
      search.tab === "web" || search.tab === "mobile"
        ? (search.tab as Platform)
        : undefined,
  }),
  // The manifest is checked here, before rendering starts. Throwing from the
  // component body happens after SSR streaming has begun, so the response
  // status is already 200 and a 404 can never be sent.
  beforeLoad: ({ params }): undefined => {
    const system = systemById(params.system);
    if (system?.status !== "current") {
      throw notFound();
    }
    const slug = params.component;
    if (getDoc("web", slug) ?? getDoc("mobile", slug)) {
      // Canonical tier home (D1003): pure-core families live at /core.
      if (isCoreFamily(slug)) {
        throw redirect({
          to: "/core/$family",
          params: { family: slug },
          statusCode: 301,
        });
      }
      return undefined;
    }
    // No content family: a bare core export renders Undocumented at its
    // canonical home rather than 404ing here.
    if (isCoreFamily(slug)) {
      throw redirect({
        to: "/core/$family",
        params: { family: slug },
        statusCode: 301,
      });
    }
    // Consistency rule 1: a compound part has no page of its own — resolve
    // the slug through each renderer's export index and 301 to the family's
    // canonical tier home (core parts resolve straight to /core).
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
            params: { system: params.system, component: doc.slug },
            statusCode: 301,
          });
        }
      }
    }
    throw notFound();
  },
  head: ({ params }) => {
    const doc =
      getDoc("web", params.component) ?? getDoc("mobile", params.component);
    return routeHead(
      doc ? `${doc.name} (M3)` : `${params.component} (M3)`,
      doc?.oneLiner ??
        "One component, one page — metadata, live preview, usage, props, theming and accessibility.",
    );
  },
  component: ComponentPage,
});

function ComponentPage() {
  const { system, component } = Route.useParams();
  const { tab } = Route.useSearch();
  const label = systemById(system)?.short ?? system;
  return (
    <FamilyPage
      slug={component}
      requestedTab={tab}
      door={{ label: "Components", href: "/components" }}
      familyBase="components/m3"
      siblingBase={`/components/${system}`}
      siblingSlugs={FAMILIES}
      systemLabel={label}
    />
  );
}
