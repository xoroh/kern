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
} from "@tanstack/react-router";
import { SiteLayout } from "../../../components/chrome/site-layout";
import { MOBILE_DEMOS, PREVIEW_REASONS } from "../../../demos/mobile/registry";
import { WEB_DEMOS } from "../../../demos/web/registry";
import { getComponent } from "../../../generated/manifest";

export const Route = createFileRoute("/components/$platform/$component")({
  // The manifest is checked here, before rendering starts. Throwing from the
  // component body happens after SSR streaming has begun, so the response
  // status is already 200 and a 404 can never be sent.
  beforeLoad: ({ params }) => {
    if (!getComponent(`${params.platform}/${params.component}`)) {
      throw notFound();
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
          <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
            404
          </p>
          <h1 className="m-0 text-2xl font-semibold text-(--md-sys-color-on-surface)">
            No such component
          </h1>
          <p className="m-0 text-(--md-sys-color-on-surface-variant)">
            <code>{slug}</code> is not in the generated manifest. The route set
            comes from <code>docs/components.md</code>, so if this export exists
            in a package the manifest is stale — not this page.
          </p>
          <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
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
  const demo = isWeb ? WEB_DEMOS[entry.export] : MOBILE_DEMOS[entry.export];
  const pkg = isWeb ? "@xoroh/kern" : "@xoroh/kern-native";
  const platformHref = isWeb ? "/components/web" : "/components/mobile";

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-(--md-sys-color-on-surface-variant)">
            <Link to="/components">Components</Link>
            <span aria-hidden="true">/</span>
            <Link to={platformHref}>{isWeb ? "Web" : "Mobile"}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-(--md-sys-color-on-surface)">{entry.name}</span>
          </nav>

          <header className="flex flex-col gap-3">
            <h1 className="m-0 text-3xl font-semibold text-(--md-sys-color-on-surface)">
              <code>{entry.export}</code>
            </h1>
            <p className="m-0 font-mono text-sm text-(--md-sys-color-secondary)">
              {pkg}
            </p>
            <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
              {entry.status === "real"
                ? "Implemented and exported from the platform entry point."
                : "Planned placeholder — not exported yet."}
            </p>
          </header>

          {demo ? (
            <div className="flex flex-col gap-4">
              <h2 className="m-0 text-lg font-semibold text-(--md-sys-color-on-surface)">
                Live
              </h2>
              {demo()}
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface-container) p-6">
              <h2 className="m-0 text-lg font-semibold">No preview on this page</h2>
              <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
                {PREVIEW_REASONS[entry.export] ??
                  "This export is in the manifest but has neither a live demo nor a stated reason. That is a gap in the site, not in the package — it is tracked in the Stage 2 report, not hidden here."}
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
