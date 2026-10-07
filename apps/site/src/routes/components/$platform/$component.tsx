/**
 * The component page: one route for every manifest row.
 *
 * The path is `/components/$platform/$component` because both platforms export
 * `Button` (and dozens of other names), so the platform has to be part of the
 * URL rather than a query parameter.
 *
 * A slug that is not in the manifest is a real 404. `CatchNotFound` is what
 * makes that a 404 *response* — throwing from the component body alone renders
 * the document shell with a 200, which is the bug this file avoids.
 */
import {
  CatchNotFound,
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { Kicker } from "../../../components/chrome/kicker";
import { SiteLayout } from "../../../components/chrome/site-layout";
import { ComponentPage as ComponentDocPage } from "../../../components/docs/component-page";
import { docForExport } from "../../../content";
import { getComponent } from "../../../generated/manifest";
import { routeHead } from "../../../systems/seo";
import { siblingNav } from "../../../systems/component-nav";
import {
  T_BODY,
  T_BODY_MD,
  T_CODE,
  T_PAGE,
  T_SECTION,
} from "../../../systems/type-scale";

export const Route = createFileRoute("/components/$platform/$component")({
  head: ({ params }) =>
    routeHead(
      `${params.component} (${params.platform === "mobile" ? "native" : params.platform})`,
      "One component, one page — metadata, live preview, usage, props, theming and accessibility.",
    ),
  // The manifest is checked here, before rendering starts. Throwing from the
  // component body happens after SSR streaming has begun, so the response
  // status is already 200 and a 404 can never be sent.
  beforeLoad: ({ params }) => {
    const entry = getComponent(`${params.platform}/${params.component}`);
    if (!entry) {
      throw notFound();
    }

    // kern-lead's rule: the family slug is canonical. A compound part is never
    // its own page — `dialog-content` is a second URL for the Dialog page, and
    // one page under two URLs is a duplicate-content defect rather than a
    // convenience. So the part URL answers with a real 301 from the server,
    // not a client-side re-render: crawlers, caches and link equity all see a
    // single canonical URL, and a shared link keeps working.
    const doc = docForExport(entry.platform, entry.export);
    if (doc && params.component !== doc.slug) {
      throw redirect({
        to: "/components/$platform/$component",
        params: { platform: params.platform, component: doc.slug },
        statusCode: 301,
      });
    }
  },
  component: ComponentPage,
  // The route owns its not-found surface: a root-level notFoundComponent is
  // not consulted for a throw from this route's beforeLoad, and the default
  // renders an empty document shell.
  notFoundComponent: () => <UnknownComponent slug="unknown slug" />,
});

function UnknownComponent({ slug }: { slug: string }) {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[48rem] flex-col gap-4 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <Kicker>404</Kicker>
          <h1
            className={`m-0 ${T_PAGE} text-(--md-sys-color-on-surface)`}
          >
            No such component
          </h1>
          <p className={`m-0 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}>
            <code>{slug}</code> is not in the generated manifest. The route set
            comes from <code>docs/components.md</code>, so if this export exists
            in a package the manifest is stale — not this page.
          </p>
          <p
            className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
          >
            <Link to="/components/web">Browse web components</Link> ·{" "}
            <Link to="/components/mobile">Browse mobile components</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function ComponentPage() {
  const { platform, component } = Route.useParams();
  const unknownSlug = `${platform}/${component}`;
  return (
    <CatchNotFound fallback={() => <UnknownComponent slug={unknownSlug} />}>
      <ComponentBody />
    </CatchNotFound>
  );
}

function ComponentBody() {
  const { platform, component } = Route.useParams();
  // beforeLoad has already proven this exists; the fallback keeps the type.
  const entry = getComponent(`${platform}/${component}`);
  if (!entry) {
    throw notFound();
  }

  const isWeb = entry.platform === "web";
  const pkg = isWeb ? "@xoroh/kern" : "@xoroh/kern-native";
  const platformHref = isWeb ? "/components/web" : "/components/mobile";

  // Consistency rule 1: one component, one page. A compound part has no page
  // of its own — `dialog-content` resolves to the page that documents `Dialog`
  // as a whole, and every part of the family is documented there.
  const doc = docForExport(entry.platform, entry.export);

  // m4 — prev/next come from the manifest's sibling order for this platform
  // (see src/systems/component-nav.ts, which pins the platform-preserving
  // hrefs with a regression test), and each carries the target page's TITLE
  // alongside its href. They travel together so the link can name the page
  // it goes to; a bare href renders "Previous"/"Next" and the reader has no
  // idea what they are walking into.
  const { prev, next } = siblingNav(
    entry,
    (e) => docForExport(e.platform, e.export)?.name ?? e.export,
  );

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <nav
            className={`flex flex-wrap items-center gap-2 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
          >
            <Link to="/components">Components</Link>
            <span aria-hidden="true">/</span>
            <Link to={platformHref}>{isWeb ? "Web" : "Mobile"}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-(--md-sys-color-on-surface)">
              {doc ? doc.name : entry.name}
            </span>
          </nav>

          {doc ? (
            <ComponentDocPage
              doc={doc}
              platform={entry.platform}
              prev={prev}
              next={next}
            />
          ) : (
            <Undocumented entry={entry} pkg={pkg} />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

/**
 * A manifest row with no content page.
 *
 * This is a gap in the site, not in the package, and it is stated rather than
 * papered over. `scripts/check-docs.mjs` counts these and fails when a family
 * that claims a page is missing one of its parts, so the list shrinks under
 * the gate instead of growing quietly.
 */
function Undocumented({
  entry,
  pkg,
}: {
  entry: { name: string; export: string; status: string };
  pkg: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1
          className={`m-0 ${T_PAGE} text-(--md-sys-color-on-surface)`}
        >
          <code>{entry.export}</code>
        </h1>
        <p className={`m-0 ${T_CODE} text-(--md-sys-color-secondary)`}>
          {pkg}
        </p>
        <p
          className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
        >
          {entry.status === "real"
            ? "Implemented and exported from the platform entry point."
            : "Planned placeholder — not exported yet."}
        </p>
      </header>
      <div className="flex flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface-container) p-6">
        <h2
          id="no-documentation-page-yet"
          className={`m-0 ${T_SECTION}`}
        >
          No documentation page yet
        </h2>
        <p
          className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}
        >
          This export is in the generated inventory but has no content folder
          under <code>src/content/</code>. That is a gap in the site, not in the
          package — it is tracked by <code>check:docs</code> rather than hidden
          here.
        </p>
      </div>
    </div>
  );
}
