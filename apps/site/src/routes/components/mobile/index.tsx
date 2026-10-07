/**
 * /components/mobile — the native platform view of the gallery.
 *
 * The same cards as /components, filtered to `@xoroh/kern-native`, keeping the
 * export-level honesty audit this page started with: every export is either
 * previewed live or carries a stated reason, and anything unaccounted for is
 * named in the open, not absorbed into a tile. Previews render the real
 * components through react-native-web, so they cannot drift from the shipped
 * code the way a committed screenshot can (Q4.1).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../../components/chrome/site-layout";
import {
  ComponentGallery,
  demoCoverage,
} from "../../../components/docs/component-gallery";
import { MOBILE_DEMOS, PREVIEW_REASONS } from "../../../demos/mobile/registry";
import { componentsOn } from "../../../generated/manifest";
import {
  T_BODY_SM,
  T_LABEL,
  T_LABEL_LG,
  T_PAGE,
  T_SECTION,
} from "../../../systems/type-scale";
import { routeHead } from "../../../systems/seo";

export const Route = createFileRoute("/components/mobile/")({
  head: () =>
    routeHead("Mobile components", "Native components from @xoroh/kern-native, previewed live."),
  component: MobileComponents,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CHIP = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border px-3 py-1 ${T_LABEL_LG}`;
const STAT = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline) px-3 py-1 ${T_LABEL} ${INK_SOFT}`;

function MobileComponents() {
  const rows = componentsOn("mobile");
  const previewed = rows.filter((c) => MOBILE_DEMOS[c.export]);
  const reasoned = rows.filter(
    (c) => !MOBILE_DEMOS[c.export] && PREVIEW_REASONS[c.export],
  );
  const unaccounted = rows.filter(
    (c) => !MOBILE_DEMOS[c.export] && !PREVIEW_REASONS[c.export],
  );
  const coverage = demoCoverage("mobile");

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[72rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Mobile components</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
              React Native on StyleSheet, exported from{" "}
              <code>@xoroh/kern-native</code>. Live previews for{" "}
              {coverage.withDemo} of {coverage.total} families; every preview
              renders the real component through react-native-web.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={STAT}>{rows.length} exports</span>
              <span className={STAT}>{previewed.length} live previews</span>
              <span className={STAT}>
                {reasoned.length} with a stated reason
              </span>
              {unaccounted.length > 0 ? (
                <span className={STAT}>{unaccounted.length} unaccounted</span>
              ) : null}
            </div>
            <nav
              className="flex flex-wrap items-center gap-2"
              aria-label="Platform"
            >
              <Link
                to="/components"
                className={`${CHIP} border-(--md-sys-color-outline) ${INK_SOFT} no-underline`}
              >
                All
              </Link>
              <Link
                to="/components/web"
                className={`${CHIP} border-(--md-sys-color-outline) ${INK_SOFT} no-underline`}
              >
                Web
              </Link>
              <span
                className={`${CHIP} border-(--md-sys-color-primary) bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container) no-underline`}
              >
                Native
              </span>
            </nav>
          </header>

          {unaccounted.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-error) bg-(--md-sys-color-error-container) p-4 text-(--md-sys-color-on-error-container)">
              <h2
                id="neither-previewed-nor-explained"
                className={`m-0 ${T_SECTION}`}
              >
                Neither previewed nor explained
              </h2>
              <p className={`m-0 ${T_BODY_SM}`}>
                {unaccounted.map((c) => c.export).join(", ")}
              </p>
            </div>
          ) : null}

          <ComponentGallery platform="mobile" />
        </div>
      </section>
    </SiteLayout>
  );
}
