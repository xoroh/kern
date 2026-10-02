import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@xoroh/kern";
import { SiteLayout } from "../../../components/chrome/site-layout";
import { MOBILE_DEMOS, PREVIEW_REASONS } from "../../../demos/mobile/registry";
import { componentsOn } from "../../../generated/manifest";

export const Route = createFileRoute("/components/mobile/")({
  component: MobileComponents,
});

function MobileComponents() {
  const components = componentsOn("mobile");

  // Every row is either previewed live or carries an explicit reason. This
  // split is the S2.3 acceptance bar, shown rather than asserted.
  const previewed = components.filter((c) => MOBILE_DEMOS[c.export]);
  const reasoned = components.filter((c) => !MOBILE_DEMOS[c.export]);
  const unaccounted = reasoned.filter((c) => !PREVIEW_REASONS[c.export]);

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
              Components / Mobile
            </p>
            <h1 className="m-0 text-3xl font-semibold text-(--md-sys-color-on-surface)">
              Mobile components
            </h1>
            <p className="m-0 font-mono text-sm text-(--md-sys-color-secondary)">
              @xoroh/kern-native
            </p>
            <p className="m-0 text-(--md-sys-color-on-surface-variant)">
              React Native on StyleSheet, one composed component per family, and
              a <code>*Styles</code> helper for each. Previews render the real
              components through react-native-web, so a preview cannot drift
              from the shipped code the way a committed screenshot can.
            </p>
          </header>

          <div className="flex flex-wrap gap-3">
            <Badge>{components.length} exports</Badge>
            <Badge>{previewed.length} live previews</Badge>
            <Badge>{reasoned.length} with a stated reason</Badge>
            {unaccounted.length > 0 ? (
              <Badge>{unaccounted.length} unaccounted</Badge>
            ) : null}
          </div>

          {unaccounted.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-error) bg-(--md-sys-color-error-container) p-4 text-(--md-sys-color-on-error-container)">
              <h2
                id="neither-previewed-nor-explained"
                className="m-0 text-sm font-semibold"
              >
                Neither previewed nor explained
              </h2>
              <p className="m-0 font-mono text-xs">
                {unaccounted.map((c) => c.export).join(", ")}
              </p>
            </div>
          ) : null}

          <section className="flex flex-col gap-3">
            <h2 id="live-previews" className="m-0 text-lg font-semibold">
              Live previews ({previewed.length})
            </h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {previewed.map((component) => (
                <li key={component.slug}>
                  <Link
                    to="/components/$platform/$component"
                    params={{
                      platform: component.platform,
                      component: component.name,
                    }}
                    className="block rounded-(--md-sys-shape-corner-small) px-3 py-2 text-sm text-(--md-sys-color-on-surface) no-underline hover:bg-(--md-sys-color-surface-container)"
                  >
                    {component.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 id="no-preview-here" className="m-0 text-lg font-semibold">
              No preview here, and why ({reasoned.length})
            </h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {reasoned.map((component) => (
                <li
                  key={component.slug}
                  className="rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) p-3"
                >
                  <Link
                    to="/components/$platform/$component"
                    params={{
                      platform: component.platform,
                      component: component.name,
                    }}
                    className="font-mono text-sm text-(--md-sys-color-primary) no-underline"
                  >
                    {component.export}
                  </Link>
                  <p className="m-0 mt-1 text-sm text-(--md-sys-color-on-surface-variant)">
                    {PREVIEW_REASONS[component.export] ??
                      "No reason recorded — this is a gap in the site."}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
            <Link to="/components">← All platforms</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
