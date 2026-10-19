/**
 * The component page: one route per family, both renderers under one URL.
 *
 * The path is `/components/$system/$component` (018): one page per
 * component at the system address, with Web/Native tabs switching the
 * renderer in place via `?tab=`. Both platforms export `Button` (and
 * dozens of other names), so the family slug — not the platform — is the
 * page, and the tab is view state, not a second page.
 *
 * A slug that matches no family is a real 404. A slug that matches a
 * manifest row or part export but no family (a compound part like
 * `dialog-content`) 301s to the family page — one component, one page,
 * and a part URL is a second URL for the family page, i.e. a
 * duplicate-content defect rather than a convenience. `CatchNotFound` is
 * what makes a 404 a 404 *response*.
 */
import {
  CatchNotFound,
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { Kicker } from "../../../components/chrome/kicker";
import { ComponentPage as ComponentDocPage } from "../../../components/docs/component-page";
import { docForExport, getDoc, type Platform } from "../../../content";
import { PageCard } from "../../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../../domains/shared/chrome/site-layout";
import { routeHead } from "../../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_MD,
  T_CODE,
  T_PAGE,
  T_SECTION,
} from "../../../domains/shared/systems/type-scale";
import { COMPONENTS } from "../../../generated/manifest";
import { siblingNavSystem } from "../../../systems/component-nav";
import { systemById } from "../../../systems/design-systems";

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
      return undefined;
    }
    // Consistency rule 1: a compound part has no page of its own — resolve
    // the slug through each renderer's export index and 301 to the family.
    for (const platform of ["web", "mobile"] as const) {
      for (const row of COMPONENTS.filter(
        (c) => c.platform === platform && c.name === slug,
      )) {
        const doc = docForExport(platform, row.export);
        if (doc && doc.slug !== slug) {
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
  notFoundComponent: () => <UnknownComponent slug="unknown slug" />,
});

function UnknownComponent({ slug }: { slug: string }) {
  return (
    <SiteLayout>
      <PageCard width="narrow">
        <Kicker>404</Kicker>
        <h1 className={`m-0 ${T_PAGE} text-(--sys-color-on-surface)`}>
          No such component
        </h1>
        <p className={`m-0 ${T_BODY} text-(--sys-color-on-surface-variant)`}>
          <code>{slug}</code> is not a documented family. The route set comes
          from <code>src/content/</code>, so if this export exists in a package
          the content page is missing — not this page.
        </p>
        <p className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}>
          <Link to="/components">Browse components</Link>
        </p>
      </PageCard>
    </SiteLayout>
  );
}

function ComponentPage() {
  const { system, component } = Route.useParams();
  const { tab } = Route.useSearch();
  const unknownSlug = `${system}/${component}`;
  return (
    <CatchNotFound fallback={() => <UnknownComponent slug={unknownSlug} />}>
      <ComponentBody system={system} slug={component} requestedTab={tab} />
    </CatchNotFound>
  );
}

function ComponentBody({
  system,
  slug,
  requestedTab,
}: {
  system: string;
  slug: string;
  requestedTab: Platform | undefined;
}) {
  const webDoc = getDoc("web", slug);
  const mobileDoc = getDoc("mobile", slug);

  // Manifest rows with no content on either renderer and no part claim are
  // a gap in the site, not in the package — stated rather than papered over.
  if (!webDoc && !mobileDoc) {
    const entries = COMPONENTS.filter((c) => c.name === slug);
    const pkg =
      entries[0]?.platform === "mobile" ? "@xoroh/kern-native" : "@xoroh/kern";
    return (
      <SiteLayout>
        <PageCard>
          <Undocumented
            entries={entries.map((e) => ({
              name: e.name,
              export: e.export,
              status: e.status,
            }))}
            pkg={pkg}
          />
        </PageCard>
      </SiteLayout>
    );
  }

  const available: Platform[] = [
    ...(webDoc ? (["web"] as const) : []),
    ...(mobileDoc ? (["mobile"] as const) : []),
  ];
  const active: Platform =
    requestedTab && available.includes(requestedTab)
      ? requestedTab
      : available[0];
  const doc = (active === "web" ? webDoc : mobileDoc) ?? webDoc ?? mobileDoc;
  if (!doc) {
    throw notFound();
  }

  // Same component under another name on the other renderer (web `link`
  // vs native `LinkButton`): the tabs cannot reach it, so the page names it
  // instead of stranding the reader.
  const peerPlatform: Platform = active === "web" ? "mobile" : "web";
  const crossPeer = doc.meta.nativePeer
    ? docForExport(peerPlatform, doc.meta.nativePeer)
    : undefined;
  const peerNote =
    crossPeer && crossPeer.slug !== slug
      ? {
          label: `${crossPeer.name} (${peerPlatform === "web" ? "Web" : "React Native"})`,
          href: `/components/${system}/${crossPeer.slug}`,
        }
      : undefined;

  const titleFor = (s: string) =>
    getDoc("web", s)?.name ?? getDoc("mobile", s)?.name ?? s;
  const { prev, next } = siblingNavSystem(system, slug, titleFor);
  const label = systemById(system)?.short ?? system;

  return (
    <SiteLayout>
      <PageCard>
        <ComponentDocPage
          doc={doc}
          platform={active}
          familySlug={slug}
          systemLabel={label}
          tabs={available}
          peerNote={peerNote}
          prev={prev}
          next={next}
        />
      </PageCard>
    </SiteLayout>
  );
}

/**
 * A manifest row with no content page.
 *
 * This is a gap in the site, not in the package, and it is stated rather
 * than papered over. `scripts/check-docs.mjs` counts these and fails when a
 * family that claims a page is missing one of its parts, so the list
 * shrinks under the gate instead of growing quietly.
 */
function Undocumented({
  entries,
  pkg,
}: {
  entries: { name: string; export: string; status: string }[];
  pkg: string;
}) {
  const first = entries[0];
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className={`m-0 ${T_PAGE} text-(--sys-color-on-surface)`}>
          <code>{first?.export ?? "Unknown export"}</code>
        </h1>
        <p className={`m-0 ${T_CODE} text-(--sys-color-secondary)`}>{pkg}</p>
        <p className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}>
          {first?.status === "real"
            ? "Implemented and exported from the platform entry point."
            : "Planned placeholder — not exported yet."}
        </p>
      </header>
      <div className="flex flex-col gap-2 rounded-(--sys-shape-corner-medium) border border-(--sys-color-outline) bg-(--sys-color-surface-container) p-6">
        <h2 id="no-documentation-page-yet" className={`m-0 ${T_SECTION}`}>
          No documentation page yet
        </h2>
        <p className={`m-0 ${T_BODY_MD} text-(--sys-color-on-surface-variant)`}>
          This export is in the generated inventory but no family documents it
          under <code>src/content/</code>. That is a gap in the site, not in the
          package — it is tracked by <code>check:docs</code> rather than hidden
          here.
        </p>
      </div>
    </div>
  );
}
